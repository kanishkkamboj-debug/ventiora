/**
 * src/api/auth.api.test.ts
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MockQueryBuilder } from '@/test/supabaseMock';

var _builder: MockQueryBuilder;
var _auth: Record<string, ReturnType<typeof vi.fn>>;

vi.mock('@/lib/supabaseClient', () => {
  const mkFn = () => vi.fn();
  _builder = {
    select: mkFn(), insert: mkFn(), update: mkFn(), upsert: mkFn(), delete: mkFn(),
    single: mkFn(), maybeSingle: mkFn(),
    eq: mkFn(), neq: mkFn(), gt: mkFn(), gte: mkFn(), lt: mkFn(), lte: mkFn(),
    like: mkFn(), ilike: mkFn(), in: mkFn(), is: mkFn(), contains: mkFn(),
    order: mkFn(), limit: mkFn(), range: mkFn(), match: mkFn(), filter: mkFn(),
    or: mkFn(), not: mkFn(), returns: mkFn(),
  };
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _auth = {
    getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
    signOut: vi.fn().mockResolvedValue({ error: null }),
    resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
    updateUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
  };
  return { supabase: { from: vi.fn().mockReturnValue(_builder), auth: _auth } };
});

import { getSession, signIn, signUp, signOut, sendPasswordResetEmail, updatePassword } from './auth.api';

const FAKE_SB_USER = { id: 'uuid-1', email: 'test@uni.edu' };
const FAKE_SESSION = { user: FAKE_SB_USER, access_token: 'tok' };
const FAKE_PROFILE = { id: 'uuid-1', username: 'testuser', email: 'test@uni.edu', role: 'STUDENT', is_banned: false, is_suspended: false, avatar_url: null, bio: null, created_at: '2025-01-01' };
const AUTH_ERR = { message: 'Invalid credentials', code: 'INVALID_LOGIN_CREDENTIALS' };

beforeEach(() => {
  vi.clearAllMocks();
  for (const fn of Object.values(_builder)) (fn as ReturnType<typeof vi.fn>).mockReturnValue(_builder);
  _auth.getSession.mockResolvedValue({ data: { session: null }, error: null });
  _auth.signInWithPassword.mockResolvedValue({ data: { user: null, session: null }, error: null });
  _auth.signUp.mockResolvedValue({ data: { user: null, session: null }, error: null });
  _auth.signOut.mockResolvedValue({ error: null });
  _auth.resetPasswordForEmail.mockResolvedValue({ data: {}, error: null });
  _auth.updateUser.mockResolvedValue({ data: { user: null }, error: null });
});

describe('getSession', () => {
  it('returns ok with null session when not signed in', async () => {
    _auth.getSession.mockResolvedValueOnce({ data: { session: null }, error: null });
    const r = await getSession();
    expect(r.ok).toBe(true);
    if (r.ok) { expect(r.data.session).toBeNull(); expect(r.data.user).toBeNull(); }
  });

  it('returns ok with user when session exists', async () => {
    _auth.getSession.mockResolvedValueOnce({ data: { session: FAKE_SESSION }, error: null });
    _builder.single.mockResolvedValueOnce({ data: FAKE_PROFILE, error: null });
    const r = await getSession();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.user?.username).toBe('testuser');
  });

  it('returns fail when auth errors', async () => {
    _auth.getSession.mockResolvedValueOnce({ data: { session: null }, error: AUTH_ERR });
    const r = await getSession();
    expect(r.ok).toBe(false);
  });
});

describe('signIn', () => {
  it('returns ok with session and user on success', async () => {
    _auth.signInWithPassword.mockResolvedValueOnce({ data: { user: FAKE_SB_USER, session: FAKE_SESSION }, error: null });
    _builder.single.mockResolvedValueOnce({ data: FAKE_PROFILE, error: null });
    const r = await signIn({ email: 'test@uni.edu', password: 'pass' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.user?.username).toBe('testuser');
  });

  it('returns fail on invalid credentials', async () => {
    _auth.signInWithPassword.mockResolvedValueOnce({ data: { user: null, session: null }, error: AUTH_ERR });
    const r = await signIn({ email: 'bad@uni.edu', password: 'wrong' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toBe('Invalid credentials');
  });
});

describe('signUp', () => {
  it('returns ok with null session when email confirmation required', async () => {
    _auth.signUp.mockResolvedValueOnce({ data: { user: FAKE_SB_USER, session: null }, error: null });
    const r = await signUp({ email: 'new@uni.edu', password: 'pass', username: 'newuser' });
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.session).toBeNull();
  });

  it('returns fail on duplicate email (409)', async () => {
    _auth.signUp.mockResolvedValueOnce({ data: { user: null, session: null }, error: { message: 'Email already registered', code: '23505' } });
    const r = await signUp({ email: 'dup@uni.edu', password: 'pass', username: 'dup' });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.status).toBe(409);
  });
});

describe('signOut', () => {
  it('returns ok null on success', async () => {
    _auth.signOut.mockResolvedValueOnce({ error: null });
    const r = await signOut();
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on error', async () => {
    _auth.signOut.mockResolvedValueOnce({ error: { message: 'Sign out failed' } });
    const r = await signOut();
    expect(r.ok).toBe(false);
  });
});

describe('sendPasswordResetEmail', () => {
  it('returns ok null on success', async () => {
    _auth.resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: null });
    const r = await sendPasswordResetEmail('test@uni.edu');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on error', async () => {
    _auth.resetPasswordForEmail.mockResolvedValueOnce({ data: {}, error: { message: 'Rate limit' } });
    const r = await sendPasswordResetEmail('test@uni.edu');
    expect(r.ok).toBe(false);
  });
});

describe('updatePassword', () => {
  it('returns ok null on success', async () => {
    _auth.updateUser.mockResolvedValueOnce({ data: { user: null }, error: null });
    const r = await updatePassword('newpass123');
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data).toBeNull();
  });

  it('returns fail on error', async () => {
    _auth.updateUser.mockResolvedValueOnce({ data: { user: null }, error: { message: 'Weak password' } });
    const r = await updatePassword('123');
    expect(r.ok).toBe(false);
  });
});
