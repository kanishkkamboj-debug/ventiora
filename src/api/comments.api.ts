/**
 * src/api/comments.api.ts
 *
 * Data-access functions for the `comments` resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { Comment, CreateCommentRequest } from '../types/comment.types';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

const COMMENT_SELECT = `
  id,
  post_id,
  content,
  is_anonymous,
  parent_id,
  reply_count,
  created_at,
  updated_at,
  author:profiles(id, username, avatar_url, role)
`.trim();

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/** Fetch all top-level comments for a post (parentId is null). */
export async function getCommentsByPostId(
  postId: string,
): Promise<ApiResult<Comment[]>> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(COMMENT_SELECT)
      .eq('post_id', postId)
      .is('parent_id', null)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) return fail(error);
    return ok((data ?? []) as unknown as Comment[]);
  } catch (err) {
    return fail(err);
  }
}

/** Fetch replies for a specific comment (parent_id = commentId). */
export async function getRepliesByCommentId(
  commentId: string,
): Promise<ApiResult<Comment[]>> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select(COMMENT_SELECT)
      .eq('parent_id', commentId)
      .eq('is_deleted', false)
      .order('created_at', { ascending: true });

    if (error) return fail(error);
    return ok((data ?? []) as unknown as Comment[]);
  } catch (err) {
    return fail(err);
  }
}

/** Create a new comment or reply. Requires an authenticated session. */
export async function createComment(
  input: CreateCommentRequest & { authorId: string },
): Promise<ApiResult<Comment>> {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: input.postId,
        content: input.content,
        is_anonymous: input.isAnonymous,
        parent_id: input.parentId ?? null,
        author_id: input.authorId,
      })
      .select(COMMENT_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Comment);
  } catch (err) {
    return fail(err);
  }
}

/** Soft-delete a comment. Only the author or an admin may do this (RLS enforced). */
export async function deleteComment(id: string): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase
      .from('comments')
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}
