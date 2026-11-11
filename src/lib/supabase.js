import {
  supabase,
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  supabaseSignIn,
  supabaseSignUp,
  supabaseSignOut,
  saveReservationToSupabase,
  saveOrderToSupabase
} from './supabaseClient';

export { supabase, SUPABASE_URL, SUPABASE_ANON_KEY };

export const SupabaseAuth = {
  signIn: supabaseSignIn,
  signUp: supabaseSignUp,
  signOut: supabaseSignOut
};

export const SupabaseData = {
  saveReservation: saveReservationToSupabase,
  saveOrder: saveOrderToSupabase
};

export default supabase;
