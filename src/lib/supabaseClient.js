import { createClient } from '@supabase/supabase-js';

// User's provided Supabase Project Credentials
export const SUPABASE_URL = import.meta.env?.VITE_SUPABASE_URL || 'https://jvkivqpsoioasyeuleaj.supabase.co';
export const SUPABASE_ANON_KEY = import.meta.env?.VITE_SUPABASE_ANON_KEY || 'sb_publishable_QTbXDtyMa4b2jGvmFoHLWQ__-aKjEXr';

// Initialize Supabase Client
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Helper: Sign in user with Supabase Auth
 */
export async function supabaseSignIn(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (error) throw error;
    
    // Construct local user profile
    const meta = data.user?.user_metadata || {};
    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: meta.full_name || meta.name || email.split('@')[0],
        role: meta.role || 'customer',
        phone: meta.phone || '',
        isSupabase: true
      },
      session: data.session
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Kirishda xatolik yuz berdi'
    };
  }
}

/**
 * Helper: Register new user with Supabase Auth
 */
export async function supabaseSignUp(email, password, { fullName, phone, role = 'customer' }) {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone: phone,
          role: role
        }
      }
    });
    if (error) throw error;

    return {
      success: true,
      user: {
        id: data.user?.id,
        email: data.user?.email || email,
        name: fullName,
        role: role,
        phone: phone,
        isSupabase: true
      },
      session: data.session
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Ro'yxatdan o'tishda xatolik yuz berdi"
    };
  }
}

/**
 * Helper: Sign out
 */
export async function supabaseSignOut() {
  try {
    await supabase.auth.signOut();
  } catch(e) {}
}

/**
 * Helper: Save Room Reservation to Supabase (if table exists)
 */
export async function saveReservationToSupabase(reservation) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert([reservation])
      .select();
    if (error) {
      console.warn("Supabase reservations insert warning:", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch(err) {
    console.warn("Supabase reservation error:", err);
    return { success: false, error: err };
  }
}

/**
 * Helper: Save Order to Supabase (if table exists)
 */
export async function saveOrderToSupabase(orderData) {
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert([orderData])
      .select();
    if (error) {
      console.warn("Supabase orders insert warning:", error.message);
      return { success: false, error };
    }
    return { success: true, data };
  } catch(err) {
    console.warn("Supabase order error:", err);
    return { success: false, error: err };
  }
}
