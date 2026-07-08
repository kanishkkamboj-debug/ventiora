/**
 * src/api/reactions.api.ts
 *
 * Data-access functions for the `reactions` resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { ReactRequest, ReactionType } from '../types/reaction.types';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface ReactionSummary {
  targetType: 'POST' | 'COMMENT';
  targetId: string;
  reactionType: ReactionType;
  count: number;
  /** Whether the currently authenticated user has reacted with this type. */
  userReacted: boolean;
}

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/**
 * Add or replace a reaction on a post or comment.
 * If the user already has a reaction of a *different* type, it is replaced
 * (upsert on the unique constraint: user_id + target_type + target_id).
 */
export async function addReaction(
  input: ReactRequest,
): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase.from('reactions').upsert(
      {
        target_type: input.targetType,
        target_id: input.targetId,
        reaction_type: input.reactionType,
      },
      { onConflict: 'user_id,target_type,target_id' },
    );
    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Remove the current user's reaction from a post or comment.
 * If the user hasn't reacted, this is a no-op (no error returned).
 */
export async function removeReaction(
  input: Omit<ReactRequest, 'reactionType'>,
): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase
      .from('reactions')
      .delete()
      .match({ target_type: input.targetType, target_id: input.targetId });

    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Get aggregated reaction counts for a single target (post or comment).
 * Returns an array of { reactionType, count, userReacted } entries.
 *
 * This calls a Supabase RPC function `get_reaction_summary` that performs
 * the GROUP BY server-side to avoid fetching all reaction rows to the client.
 */
export async function getReactionSummary(
  targetType: 'POST' | 'COMMENT',
  targetId: string,
): Promise<ApiResult<ReactionSummary[]>> {
  try {
    const { data, error } = await supabase.rpc('get_reaction_summary', {
      p_target_type: targetType,
      p_target_id: targetId,
    });

    if (error) return fail(error);
    return ok((data ?? []) as ReactionSummary[]);
  } catch (err) {
    return fail(err);
  }
}
