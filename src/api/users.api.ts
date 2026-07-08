/**
 * src/api/users.api.ts
 *
 * Data-access functions for the `profiles` / users resource.
 * All queries run against Supabase — never against mockData.ts.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { User, UpdateProfileRequest } from '../types/user.types';

// ---------------------------------------------------------------------------
// Query helpers
// ---------------------------------------------------------------------------

const PROFILE_SELECT =
  'id, username, email, role, is_banned, is_suspended, avatar_url, bio, created_at';

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/** Fetch a user's public profile by their username. */
export async function getUserByUsername(
  username: string,
): Promise<ApiResult<User>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('username', username)
      .single();

    if (error) return fail(error);
    if (!data) return fail({ message: 'User not found', code: 'PGRST116' });
    return ok(data as unknown as User);
  } catch (err) {
    return fail(err);
  }
}

/** Fetch a user's public profile by their UUID. */
export async function getUserById(id: string): Promise<ApiResult<User>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .eq('id', id)
      .single();

    if (error) return fail(error);
    if (!data) return fail({ message: 'User not found', code: 'PGRST116' });
    return ok(data as unknown as User);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Update the currently authenticated user's profile.
 * RLS ensures users can only update their own profile row.
 */
export async function updateProfile(
  userId: string,
  input: UpdateProfileRequest,
): Promise<ApiResult<User>> {
  try {
    const updates: Record<string, unknown> = {};
    if (input.username !== undefined) updates['username'] = input.username;
    if (input.bio !== undefined) updates['bio'] = input.bio;
    if (input.avatarUrl !== undefined) updates['avatar_url'] = input.avatarUrl;
    if (input.phone !== undefined) updates['phone'] = input.phone;
    if (input.dob !== undefined) updates['dob'] = input.dob;
    if (input.gender !== undefined) updates['gender'] = input.gender;
    if (input.ageRange !== undefined) updates['age_range'] = input.ageRange;
    if (input.interests !== undefined) updates['interests'] = input.interests;

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select(PROFILE_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as User);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Upload a new avatar image and return the public URL.
 * The URL is then saved by calling updateProfile.
 *
 * @param userId   The user's UUID (used as storage path prefix)
 * @param file     The image File from an <input type="file"> element
 */
export async function uploadAvatar(
  userId: string,
  file: File,
): Promise<ApiResult<string>> {
  try {
    const ext = file.name.split('.').pop() ?? 'jpg';
    const path = `avatars/${userId}/avatar.${ext}`;

    const { error: uploadError } = await supabase.storage
      .from('user-uploads')
      .upload(path, file, { upsert: true, contentType: file.type });

    if (uploadError) return fail(uploadError);

    const { data } = supabase.storage
      .from('user-uploads')
      .getPublicUrl(path);

    return ok(data.publicUrl);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Fetch a paginated list of all users (admin only — enforced by RLS).
 * Used by the AdminUsersPage.
 */
export async function getUsers(
  page = 0,
  size = 20,
): Promise<ApiResult<User[]>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select(PROFILE_SELECT)
      .order('created_at', { ascending: false })
      .range(page * size, page * size + size - 1);

    if (error) return fail(error);
    return ok((data ?? []) as unknown as User[]);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Ban a user (admin only — enforced by RLS).
 * Sets is_banned = true on the profile row.
 */
export async function banUser(userId: string): Promise<ApiResult<User>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: true })
      .eq('id', userId)
      .select(PROFILE_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as User);
  } catch (err) {
    return fail(err);
  }
}

/**
 * Unban a user (admin only — enforced by RLS).
 * Sets is_banned = false on the profile row.
 */
export async function unbanUser(userId: string): Promise<ApiResult<User>> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .update({ is_banned: false })
      .eq('id', userId)
      .select(PROFILE_SELECT)
      .single();

    if (error) return fail(error);
    return ok(data as unknown as User);
  } catch (err) {
    return fail(err);
  }
}
