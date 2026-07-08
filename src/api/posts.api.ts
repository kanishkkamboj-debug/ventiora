/**
 * src/api/posts.api.ts
 *
 * Data-access functions for the `posts` resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Every function returns ApiResult<T>:
 *   { ok: true,  data: T }        — success
 *   { ok: false, error: ApiError } — any Supabase / network error
 *
 * ⚠️  Components must NEVER call supabase.from('posts') directly.
 *     Always go through this module so the error-handling contract is uniform.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { Post, CreatePostRequest, UpdatePostRequest, PostFilters } from '../types/post.types';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

/** Column select used for list queries (excludes heavy fields if any). */
const POST_SELECT = `
  id,
  title,
  content,
  is_anonymous,
  is_pinned,
  is_featured,
  is_locked,
  view_count,
  comment_count,
  created_at,
  updated_at,
  author:profiles(id, username, avatar_url, role),
  category:categories(id, name, emoji, slug),
  tags:post_tags(tag:tags(id, name, slug)),
  reactions:post_reactions(reaction_type, count, user_reacted)
`.trim();

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/**
 * Fetch a paginated, filtered list of posts.
 * Supabase table: `posts` (with views `posts_public` once RLS is live — Prompt 42).
 */
export async function getPosts(
  filters: PostFilters = {},
): Promise<ApiResult<Post[]>> {
  try {
    const { categoryId, search, sortMode = 'NEW', page = 0, size = 10 } = filters;

    // Build the base query (order before range so range is the terminal)
    let query = supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('is_deleted', false);

    if (categoryId) {
      query = query.eq('category_id', categoryId);
    }
    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    switch (sortMode) {
      case 'TRENDING':
        query = query.order('view_count', { ascending: false });
        break;
      case 'TOP':
        query = query.order('comment_count', { ascending: false });
        break;
      case 'NEW':
      default:
        query = query.order('created_at', { ascending: false });
    }

    // range is always the terminal awaited call
    query = query.range(page * size, page * size + size - 1);

    const { data, error } = await query;
    if (error) return fail(error);
    return ok((data ?? []) as unknown as Post[]);
  } catch (err) {
    return fail(err);
  }
}

/** Fetch a single post by its UUID. */
export async function getPostById(id: string): Promise<ApiResult<Post>> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(POST_SELECT)
      .eq('id', id)
      .eq('is_deleted', false)
      .single();

    if (error) return fail(error);
    if (!data) return fail({ message: 'Post not found', code: 'PGRST116' });
    return ok(data as unknown as Post);
  } catch (err) {
    return fail(err);
  }
}

/** Create a new post. Requires an authenticated session (RLS enforced server-side). */
export async function createPost(
  input: CreatePostRequest & { authorId: string },
): Promise<ApiResult<Post>> {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title: input.title,
        content: input.content,
        category_id: input.categoryId,
        is_anonymous: input.isAnonymous,
        author_id: input.authorId,
      })
      .select(POST_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Post);
  } catch (err) {
    return fail(err);
  }
}

/** Update an existing post. Only the author or an admin may do this (RLS enforced). */
export async function updatePost(
  id: string,
  input: UpdatePostRequest,
): Promise<ApiResult<Post>> {
  try {
    const updates: Record<string, unknown> = {};
    if (input.title !== undefined) updates['title'] = input.title;
    if (input.content !== undefined) updates['content'] = input.content;
    if (input.categoryId !== undefined) updates['category_id'] = input.categoryId;
    if (input.isAnonymous !== undefined) updates['is_anonymous'] = input.isAnonymous;

    const { data, error } = await supabase
      .from('posts')
      .update(updates)
      .eq('id', id)
      .select(POST_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Post);
  } catch (err) {
    return fail(err);
  }
}

/** Soft-delete a post. Only the author or an admin may do this (RLS enforced). */
export async function deletePost(id: string): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase
      .from('posts')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/** Increment the view count for a post (fire-and-forget; errors are silently ignored). */
export async function incrementViewCount(id: string): Promise<void> {
  await supabase.rpc('increment_post_view_count', { post_id: id }).catch(() => {
    // Non-critical: a failed view-count increment must never break the UI.
  });
}
