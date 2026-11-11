// Lightweight Native Supabase Client (Zero npm dependencies required)
// Connects directly to Supabase REST and Auth endpoints using standard browser fetch.

export const SUPABASE_URL = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) 
  || 'https://jvkivqpsoioasyeuleaj.supabase.co';

export const SUPABASE_ANON_KEY = (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) 
  || 'sb_publishable_QTbXDtyMa4b2jGvmFoHLWQ__-aKjEXr';

// Storage keys
const SESSION_KEY = 'sb_fishhouse_auth_token';

// Headers helper
function getHeaders(token = null) {
  const headers = {
    'apikey': SUPABASE_ANON_KEY,
    'Content-Type': 'application/json'
  };
  const activeToken = token || getStoredToken();
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
}

function getStoredToken() {
  try {
    const s = localStorage.getItem(SESSION_KEY);
    if (s) {
      const parsed = JSON.parse(s);
      return parsed.access_token || null;
    }
  } catch(e) {}
  return null;
}

function saveStoredSession(session) {
  try {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  } catch(e) {}
}

/**
 * Native Supabase Auth: Sign In with Email & Password
 */
export async function supabaseSignIn(email, password) {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error_description || data.msg || data.message || 'Kirishda xatolik yuz berdi');
    }

    saveStoredSession(data);
    const meta = data.user?.user_metadata || {};

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        name: meta.full_name || meta.name || email.split('@')[0],
        role: meta.role || (email.includes('admin') ? 'admin' : 'customer'),
        phone: meta.phone || '',
        isSupabase: true
      },
      session: data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || 'Kirishda xatolik yuz berdi'
    };
  }
}

/**
 * Native Supabase Auth: Sign Up new user
 */
export async function supabaseSignUp(email, password, { fullName, phone, role = 'customer' }) {
  try {
    const res = await fetch(`${SUPABASE_URL}/auth/v1/signup`, {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        email,
        password,
        data: {
          full_name: fullName,
          name: fullName,
          phone: phone,
          role: role
        }
      })
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error_description || data.msg || data.message || "Ro'yxatdan o'tishda xatolik");
    }

    if (data.access_token) {
      saveStoredSession(data);
    }

    return {
      success: true,
      user: {
        id: data.user?.id || data.id,
        email: data.user?.email || data.email || email,
        name: fullName,
        role: role,
        phone: phone,
        isSupabase: true
      },
      session: data
    };
  } catch (err) {
    return {
      success: false,
      error: err.message || "Ro'yxatdan o'tishda xatolik"
    };
  }
}

/**
 * Native Supabase Auth: Sign Out
 */
export async function supabaseSignOut() {
  try {
    const token = getStoredToken();
    if (token) {
      await fetch(`${SUPABASE_URL}/auth/v1/logout`, {
        method: 'POST',
        headers: getHeaders(token)
      });
    }
  } catch(e) {}
  saveStoredSession(null);
}

/**
 * Save Reservation to Supabase DB via REST API
 */
export async function saveReservationToSupabase(reservation) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/reservations`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(reservation)
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }
    const data = await res.json();
    return { success: true, data };
  } catch(err) {
    return { success: false, error: err.message };
  }
}

/**
 * Save Order to Supabase DB via REST API
 */
export async function saveOrderToSupabase(orderData) {
  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/orders`, {
      method: 'POST',
      headers: {
        ...getHeaders(),
        'Prefer': 'return=representation'
      },
      body: JSON.stringify(orderData)
    });
    if (!res.ok) {
      const err = await res.text();
      return { success: false, error: err };
    }
    const data = await res.json();
    return { success: true, data };
  } catch(err) {
    return { success: false, error: err.message };
  }
}

// Fluent Supabase mock-compatible API object
export const supabase = {
  auth: {
    signInWithPassword: ({ email, password }) => supabaseSignIn(email, password),
    signUp: ({ email, password, options }) => supabaseSignUp(email, password, {
      fullName: options?.data?.full_name || options?.data?.name || email.split('@')[0],
      phone: options?.data?.phone || '',
      role: options?.data?.role || 'customer'
    }),
    signOut: () => supabaseSignOut(),
    getSession: () => {
      try {
        const s = localStorage.getItem(SESSION_KEY);
        return { data: { session: s ? JSON.parse(s) : null } };
      } catch(e) {
        return { data: { session: null } };
      }
    }
  },
  from: (table) => ({
    insert: async (records) => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
          method: 'POST',
          headers: { ...getHeaders(), 'Prefer': 'return=representation' },
          body: JSON.stringify(records)
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      } catch(error) {
        return { data: null, error };
      }
    },
    select: async () => {
      try {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=*`, {
          method: 'GET',
          headers: getHeaders()
        });
        const data = await res.json();
        return { data, error: res.ok ? null : data };
      } catch(error) {
        return { data: null, error };
      }
    }
  })
};

export default supabase;
