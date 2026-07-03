/**
 * src/test/supabaseMock.ts
 *
 * Reusable Supabase client mock factory.
 *
 * Usage in any test file:
 *
 *   import { createMockSupabase } from '@/test/supabaseMock';
 *
 *   vi.mock('@/lib/supabaseClient', () => ({
 *     supabase: createMockSupabase(),
 *   }));
 *
 * To override what a specific call resolves with:
 *
 *   const mockSupabase = createMockSupabase();
 *   vi.mock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
 *
 *   // In a test:
 *   mockSupabase.from('posts').select.mockResolvedValueOnce({
 *     data: [{ id: '1', title: 'Test post' }],
 *     error: null,
 *   });
 *
 * All methods default to resolving with { data: null, error: null } unless
 * overridden, so tests that don't care about return values still pass without
 * extra setup.
 */

import { vi } from 'vitest';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The default resolved shape for every Supabase query/mutation. */
export interface MockSupabaseResponse<T = unknown> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

/** The fluent query-builder chain returned by supabase.from(...). */
export interface MockQueryBuilder {
  select: ReturnType<typeof vi.fn>;
  insert: ReturnType<typeof vi.fn>;
  update: ReturnType<typeof vi.fn>;
  upsert: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
  eq: ReturnType<typeof vi.fn>;
  neq: ReturnType<typeof vi.fn>;
  gt: ReturnType<typeof vi.fn>;
  gte: ReturnType<typeof vi.fn>;
  lt: ReturnType<typeof vi.fn>;
  lte: ReturnType<typeof vi.fn>;
  like: ReturnType<typeof vi.fn>;
  ilike: ReturnType<typeof vi.fn>;
  in: ReturnType<typeof vi.fn>;
  is: ReturnType<typeof vi.fn>;
  contains: ReturnType<typeof vi.fn>;
  order: ReturnType<typeof vi.fn>;
  limit: ReturnType<typeof vi.fn>;
  range: ReturnType<typeof vi.fn>;
  single: ReturnType<typeof vi.fn>;
  maybeSingle: ReturnType<typeof vi.fn>;
  match: ReturnType<typeof vi.fn>;
  filter: ReturnType<typeof vi.fn>;
  or: ReturnType<typeof vi.fn>;
  not: ReturnType<typeof vi.fn>;
  returns: ReturnType<typeof vi.fn>;
}

/** The full mock Supabase client shape. */
export interface MockSupabaseClient {
  from: (table: string) => MockQueryBuilder;
  auth: {
    getSession: ReturnType<typeof vi.fn>;
    getUser: ReturnType<typeof vi.fn>;
    signInWithPassword: ReturnType<typeof vi.fn>;
    signUp: ReturnType<typeof vi.fn>;
    signOut: ReturnType<typeof vi.fn>;
    resetPasswordForEmail: ReturnType<typeof vi.fn>;
    updateUser: ReturnType<typeof vi.fn>;
    onAuthStateChange: ReturnType<typeof vi.fn>;
    setSession: ReturnType<typeof vi.fn>;
    refreshSession: ReturnType<typeof vi.fn>;
  };
  storage: {
    from: (bucket: string) => {
      upload: ReturnType<typeof vi.fn>;
      getPublicUrl: ReturnType<typeof vi.fn>;
      remove: ReturnType<typeof vi.fn>;
      list: ReturnType<typeof vi.fn>;
    };
  };
  channel: ReturnType<typeof vi.fn>;
  removeChannel: ReturnType<typeof vi.fn>;
  removeAllChannels: ReturnType<typeof vi.fn>;
}

// ---------------------------------------------------------------------------
// Default resolved value helpers
// ---------------------------------------------------------------------------

const ok = <T = null>(data: T = null as unknown as T): MockSupabaseResponse<T> => ({
  data,
  error: null,
});

// ---------------------------------------------------------------------------
// Query builder factory
// ---------------------------------------------------------------------------

/**
 * Creates a self-referencing fluent query builder mock.
 * Every filter/modifier method returns `this` (the same builder) so chains
 * like `.from('x').select('*').eq('id', 1).order('created_at').limit(10)`
 * resolve correctly.
 *
 * Terminal methods (select, insert, update, upsert, delete, single, maybeSingle)
 * resolve to { data: null, error: null } by default and can be overridden
 * per-test with `.mockResolvedValueOnce(...)`.
 */
function createQueryBuilder(): MockQueryBuilder {
  const builder: MockQueryBuilder = {
    select: vi.fn().mockResolvedValue(ok([])),
    insert: vi.fn().mockResolvedValue(ok(null)),
    update: vi.fn().mockResolvedValue(ok(null)),
    upsert: vi.fn().mockResolvedValue(ok(null)),
    delete: vi.fn().mockResolvedValue(ok(null)),
    single: vi.fn().mockResolvedValue(ok(null)),
    maybeSingle: vi.fn().mockResolvedValue(ok(null)),
    // Filter / modifier methods all return the builder itself for chaining
    eq: vi.fn(),
    neq: vi.fn(),
    gt: vi.fn(),
    gte: vi.fn(),
    lt: vi.fn(),
    lte: vi.fn(),
    like: vi.fn(),
    ilike: vi.fn(),
    in: vi.fn(),
    is: vi.fn(),
    contains: vi.fn(),
    order: vi.fn(),
    limit: vi.fn(),
    range: vi.fn(),
    match: vi.fn(),
    filter: vi.fn(),
    or: vi.fn(),
    not: vi.fn(),
    returns: vi.fn(),
  };

  // Make all chainable filter/modifier methods return the builder itself.
  const chainables: (keyof MockQueryBuilder)[] = [
    'eq', 'neq', 'gt', 'gte', 'lt', 'lte',
    'like', 'ilike', 'in', 'is', 'contains',
    'order', 'limit', 'range', 'match', 'filter',
    'or', 'not', 'returns',
  ];

  for (const method of chainables) {
    (builder[method] as ReturnType<typeof vi.fn>).mockReturnValue(builder);
  }

  // select/insert/update/upsert/delete can also be mid-chain; make them
  // return the builder so `.select().eq().single()` works.
  // Their final resolution is set above — if they're mid-chain they'll be
  // overridden by `.mockReturnValue(builder)` here, but since `.single()` is
  // the usual terminal, tests should call `.single.mockResolvedValueOnce(...)`.
  (builder.select as ReturnType<typeof vi.fn>).mockReturnValue(builder);
  (builder.insert as ReturnType<typeof vi.fn>).mockReturnValue(builder);
  (builder.update as ReturnType<typeof vi.fn>).mockReturnValue(builder);
  (builder.upsert as ReturnType<typeof vi.fn>).mockReturnValue(builder);
  (builder.delete as ReturnType<typeof vi.fn>).mockReturnValue(builder);

  return builder;
}

// ---------------------------------------------------------------------------
// Storage bucket builder factory
// ---------------------------------------------------------------------------

function createStorageBucket() {
  return {
    upload: vi.fn().mockResolvedValue(ok({ path: 'test/path' })),
    getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: 'https://test.supabase.co/storage/test' } }),
    remove: vi.fn().mockResolvedValue(ok(null)),
    list: vi.fn().mockResolvedValue(ok([])),
  };
}

// ---------------------------------------------------------------------------
// Channel (realtime) factory
// ---------------------------------------------------------------------------

function createMockChannel() {
  const channel = {
    on: vi.fn().mockReturnThis(),
    subscribe: vi.fn().mockReturnThis(),
    unsubscribe: vi.fn().mockResolvedValue('ok'),
  };
  return channel;
}

// ---------------------------------------------------------------------------
// Main factory export
// ---------------------------------------------------------------------------

/**
 * Creates a fresh mock Supabase client for use in tests.
 *
 * @example
 * // At the top of a test file:
 * const mockSupabase = createMockSupabase();
 * vi.mock('@/lib/supabaseClient', () => ({ supabase: mockSupabase }));
 *
 * @example
 * // Override a single call inside a test:
 * mockSupabase.from('posts').single.mockResolvedValueOnce({
 *   data: { id: '1', title: 'Hello' },
 *   error: null,
 * });
 */
export function createMockSupabase(): MockSupabaseClient {
  // Keep one query builder instance per table name so callers can inspect
  // the correct mock for assertions like `expect(mockSupabase.from('posts').select).toHaveBeenCalled()`.
  const builders: Record<string, MockQueryBuilder> = {};

  const client: MockSupabaseClient = {
    from: (table: string) => {
      if (!builders[table]) {
        builders[table] = createQueryBuilder();
      }
      return builders[table];
    },

    auth: {
      getSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      getUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      signInWithPassword: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signUp: vi.fn().mockResolvedValue({ data: { user: null, session: null }, error: null }),
      signOut: vi.fn().mockResolvedValue({ error: null }),
      resetPasswordForEmail: vi.fn().mockResolvedValue({ data: {}, error: null }),
      updateUser: vi.fn().mockResolvedValue({ data: { user: null }, error: null }),
      onAuthStateChange: vi.fn().mockReturnValue({
        data: {
          subscription: {
            unsubscribe: vi.fn(),
          },
        },
      }),
      setSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
      refreshSession: vi.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },

    storage: {
      from: (_bucket: string) => createStorageBucket(),
    },

    channel: vi.fn().mockReturnValue(createMockChannel()),
    removeChannel: vi.fn().mockResolvedValue('ok'),
    removeAllChannels: vi.fn().mockResolvedValue([]),
  };

  return client;
}

// ---------------------------------------------------------------------------
// Convenience: a singleton mock for vi.mock() at the module level
// ---------------------------------------------------------------------------

/**
 * A pre-created singleton mock Supabase client.
 * Import this when you need a shared instance across multiple `describe` blocks.
 *
 * @example
 * vi.mock('@/lib/supabaseClient', () => ({ supabase: mockSupabaseSingleton }));
 */
export const mockSupabaseSingleton = createMockSupabase();
