window.LABMEDSYS_APP = Object.freeze({
  version: '1.0.1',
  environment: 'Development environment',
  cacheVersion: '1.0.1'
});

window.LABMEDSYS_SUPABASE = window.supabase.createClient(
  'https://qasjgklmivxpisqfhngx.supabase.co',
  'sb_publishable_o6kUCnYclOY9AIlE1qNZAA_EwsFNXCM',
  { auth: { persistSession: true, autoRefreshToken: true } }
);