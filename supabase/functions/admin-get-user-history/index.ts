import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );
    
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) throw new Error('Unauthorized');
    
    const { data: userData } = await supabaseClient.from('users').select('role').eq('id', user.id).single();
    if (!userData || (userData.role !== 'ADMIN' && userData.role !== 'MODERATOR')) {
      throw new Error('Forbidden: Admin access required');
    }
    
    const { user_id } = await req.json();
    if (!user_id) throw new Error('user_id is required');
    
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );
    
    // Explicit read logging
    await supabaseAdmin.from('admin_audit_log').insert({
      admin_id: user.id,
      action: 'VIEW_USER_HISTORY',
      target_type: 'USER',
      target_id: user_id,
      note: 'Admin viewed de-anonymized user history'
    });
    
    // Fetch raw user posts and comments (bypassing the public view masks)
    const { data: posts } = await supabaseAdmin.from('posts').select('*').eq('user_id', user_id);
    const { data: comments } = await supabaseAdmin.from('comments').select('*').eq('user_id', user_id);
    
    return new Response(JSON.stringify({ posts, comments }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
  }
});
