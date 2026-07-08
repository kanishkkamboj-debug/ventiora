/**
 * src/api/notifications.api.ts
 *
 * Data-access functions for the `notifications` resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { Notification } from '../types/notification.types';

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/**
 * Fetch all notifications for the currently authenticated user.
 * Ordered newest first. RLS ensures users only see their own notifications.
 */
export async function getNotifications(): Promise<ApiResult<Notification[]>> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .select(
        'id, type, message, is_read, target_type, target_id, actor_username, created_at',
      )
      .order('created_at', { ascending: false });

    if (error) return fail(error);
    return ok((data ?? []) as unknown as Notification[]);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Mark a single notification as read.
 * Returns the updated notification.
 */
export async function markNotificationRead(
  id: string,
): Promise<ApiResult<Notification>> {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', id)
      .select(
        'id, type, message, is_read, target_type, target_id, actor_username, created_at',
      )
      .single();

    if (error) return fail(error);
    return ok(data as unknown as Notification);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Mark all notifications for the current user as read.
 * Uses RLS to scope the UPDATE to the authenticated user's rows only.
 */
export async function markAllNotificationsRead(): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('is_read', false);

    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Delete a single notification.
 * Users may only delete their own notifications (RLS enforced).
 */
export async function deleteNotification(
  id: string,
): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase
      .from('notifications')
      .delete()
      .eq('id', id);

    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}
