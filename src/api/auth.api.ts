/**
 * src/api/auth.api.ts
 *
 * Data-access functions for Supabase Auth.
 * Used by Prompt 16 to wire AuthContext to real session management.
 *
 * Return convention: ApiResult<T> — see src/types/common.types.ts.
 *
 * ⚠️  This module uses only the anon key (via supabaseClient).
 *     Never import a service-role key here — it must never reach the browser.
 */

import { supabase } from '../lib/supabaseClient';
import { ok, fail } from './apiHelpers';
import type { ApiResult } from '../types/common.types';
import type { User } from '../types/user.types';
import type { Session } from '@supabase/supabase-js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface AuthSession {
  session: Session | null;
  user: User | null;
}

export interface SignInCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials extends SignInCredentials {
  username: string;
}

// ---------------------------------------------------------------------------
// Exported API functions
// ---------------------------------------------------------------------------

/**
 * Get the currently active session.
 * Returns `{ session: null, user: null }` if not signed in — never an error
 * for the "no session" case (that's a valid state, not a failure).
 */
export async function getSession(): Promise<ApiResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.getSession();
    if (error) return fail(error);

    // If there is a session, fetch the corresponding profile row
    if (data.session?.user) {
      const profile = await fetchProfile(data.session.user.id);
      if (!profile.ok) return fail(profile.error);
      return ok({ session: data.session, user: profile.data });
    }

    return ok({ session: null, user: null });
  } catch (err) {
    return fail(err);
  }
}

/** Sign in with email + password. */
export async function signIn(
  credentials: SignInCredentials,
): Promise<ApiResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword(credentials);
    if (error) return fail(error);
    if (!data.user) return fail({ message: 'Sign in failed', code: 'AUTH_ERROR' });

    const profile = await fetchProfile(data.user.id);
    if (!profile.ok) return fail(profile.error);
    return ok({ session: data.session, user: profile.data });
  } catch (err) {
    return fail(err);
  }
}

/** Register a new account. */
export async function signUp(
  credentials: SignUpCredentials,
): Promise<ApiResult<AuthSession>> {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: credentials.email,
      password: credentials.password,
      options: {
        data: { username: credentials.username },
      },
    });
    if (error) return fail(error);
    if (!data.user) return fail({ message: 'Sign up failed', code: 'AUTH_ERROR' });

    // Profile row is created via a Supabase trigger on auth.users insert.
    // If we have a session immediately (email confirmation disabled), fetch it.
    if (data.session) {
      const profile = await fetchProfile(data.user.id);
      if (!profile.ok) return fail(profile.error);
      return ok({ session: data.session, user: profile.data });
    }

    // Email confirmation required — session not available yet.
    return ok({ session: null, user: null });
  } catch (err) {
    return fail(err);
  }
}

/** Sign out the current user. */
export async function signOut(): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/** Send a password-reset email. */
export async function sendPasswordResetEmail(
  email: string,
): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

/** Update the current user's password (called from the reset-password page). */
export async function updatePassword(
  newPassword: string,
): Promise<ApiResult<null>> {
  try {
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) return fail(error);
    return ok(null);
  } catch (err) {
    return fail(err);
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Fetch a user's public profile row from the `profiles` table. */
async function fetchProfile(userId: string): Promise<ApiResult<User>> {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, email, role, is_banned, is_suspended, avatar_url, bio, created_at')
    .eq('id', userId)
    .single();

  if (error) return fail(error);
  if (!data) return fail({ message: 'Profile not found', code: 'PGRST116' });
  return ok(data as unknown as User);
}
