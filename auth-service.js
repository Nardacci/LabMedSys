/**
 * LabMedSys Auth Service
 * Same authentication pattern used by KORbuild.
 */
(function (global) {
  'use strict';

  const SUPABASE_URL = 'https://qasjgklmivxpisqfhngx.supabase.co';
  const SUPABASE_ANON_KEY = 'sb_publishable_o6kUCnYclOY9AIlE1qNZAA_EwsFNXCM';
  const APP_BASE_URL = 'https://nardacci.github.io/LabMedSys/';
  let client = null;

  function getClient() {
    if (!global.supabase) throw new Error('Supabase client library is not loaded.');
    if (!client) {
      client = global.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
        auth: { persistSession: true, autoRefreshToken: true }
      });
    }
    return client;
  }

  function getSignupRedirectUrl() {
    return new URL('signup-complete.html', APP_BASE_URL).toString();
  }

  async function signUp({ email, password, fullName, companyName }) {
    const { data, error } = await getClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: getSignupRedirectUrl(),
        data: {
          full_name: fullName,
          company_name: companyName
        }
      }
    });
    if (error) throw error;
    return data;
  }

  async function resendSignupConfirmation(email) {
    const { data, error } = await getClient().auth.resend({
      type: 'signup',
      email,
      options: { emailRedirectTo: getSignupRedirectUrl() }
    });
    if (error) throw error;
    return data;
  }

  async function signIn({ email, password }) {
    const { data, error } = await getClient().auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  }

  async function signOut() {
    const { error } = await getClient().auth.signOut();
    if (error) throw error;
  }

  async function getSession() {
    const { data, error } = await getClient().auth.getSession();
    if (error) throw error;
    return data.session;
  }

  function getSupabaseClient() {
    return getClient();
  }

  global.LabMedSysAuth = Object.freeze({
    signUp, resendSignupConfirmation, signIn, signOut, getSession, getSupabaseClient
  });
})(window);