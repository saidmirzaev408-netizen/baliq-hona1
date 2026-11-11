import React, { useState } from 'react';
import { Icons } from './Icons';
import { SupabaseAuth } from '../lib/supabase';

export default function AuthView({ onLoginSuccess, onCancel }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  // Register form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhone, setRegPhone] = useState('+998 ');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [regRole, setRegRole] = useState('customer'); // customer, waiter, chef, admin

  const [errorMessage, setErrorMessage] = useState('');

  // Pre-configured demo accounts for 1-click testing
  const demoAccounts = [
    { label: '👑 Administrator', email: 'admin@fishhouse.uz', pass: 'admin123', role: 'admin', name: 'Administrator' },
    { label: '🤵 Ofitsiant (Waiter)', email: 'waiter@fishhouse.uz', pass: 'waiter123', role: 'waiter', name: 'Sardor Saidov' },
    { label: '👨‍🍳 Bosh Oshpaz (Chef)', email: 'chef@fishhouse.uz', pass: 'chef123', role: 'chef', name: 'Usta Jamshid' },
    { label: '👤 Doimiy Mijoz', email: 'customer@fishhouse.uz', pass: 'user123', role: 'customer', name: 'Alisher Qodirov' },
  ];

  const handleDemoLogin = (account) => {
    onLoginSuccess({
      email: account.email,
      name: account.name,
      role: account.role,
      phone: '+998 90 123-45-67'
    });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!loginEmail || !loginPassword) {
      setErrorMessage("Iltimos, email va parolni to'liq kiriting!");
      setLoading(false);
      return;
    }

    // Try Supabase Auth first
    if (loginEmail.includes('@')) {
      const supaRes = await SupabaseAuth.signIn(loginEmail, loginPassword);
      if (supaRes.success && supaRes.user) {
        setLoading(false);
        const meta = supaRes.user.user_metadata || {};
        onLoginSuccess({
          id: supaRes.user.id,
          email: supaRes.user.email,
          name: meta.name || loginEmail.split('@')[0],
          role: meta.role || (loginEmail.includes('admin') ? 'admin' : 'customer'),
          phone: meta.phone || '+998 90 000-00-00',
          provider: 'supabase'
        });
        return;
      }
    }

    // Check against registered users in localStorage or default
    try {
      const users = JSON.parse(localStorage.getItem('FISH_HOUSE_USERS_V1') || '[]');
      const matched = users.find(u => (u.email.toLowerCase() === loginEmail.toLowerCase() || u.phone === loginEmail) && u.password === loginPassword);
      
      if (matched) {
        setLoading(false);
        onLoginSuccess(matched);
        return;
      }
    } catch(err) {}

    // Check demo accounts
    const demo = demoAccounts.find(d => d.email.toLowerCase() === loginEmail.toLowerCase() && d.pass === loginPassword);
    if (demo) {
      setLoading(false);
      onLoginSuccess({
        email: demo.email,
        name: demo.name,
        role: demo.role,
        phone: '+998 90 123-45-67'
      });
      return;
    }

    // If simple test credentials
    if (loginEmail.includes('@') && loginPassword.length >= 4) {
      setLoading(false);
      onLoginSuccess({
        email: loginEmail,
        name: loginEmail.split('@')[0],
        role: loginEmail.includes('admin') ? 'admin' : 'waiter',
        phone: '+998 90 000-00-00'
      });
      return;
    }

    setLoading(false);
    setErrorMessage("Noto'g'ri email yoki parol. Demo hisoblardan birini tanlab ko'ring!");
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!regFullName || !regEmail || !regPassword) {
      setErrorMessage("Iltimos, barcha majburiy maydonlarni to'ldiring!");
      setLoading(false);
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setErrorMessage("Kiritilgan parollar bir-biriga mos kelmadi!");
      setLoading(false);
      return;
    }

    if (regPassword.length < 4) {
      setErrorMessage("Parol kamida 4 ta belgidan iborat bo'lishi kerak!");
      setLoading(false);
      return;
    }

    // Attempt registration in Supabase
    const supaRes = await SupabaseAuth.signUp(regEmail, regPassword, {
      name: regFullName,
      role: regRole,
      phone: regPhone
    });

    const newUser = {
      id: supaRes.user ? supaRes.user.id : ('usr-' + Date.now()),
      name: regFullName,
      phone: regPhone,
      email: regEmail,
      password: regPassword,
      role: regRole,
      provider: supaRes.success ? 'supabase' : 'local',
      createdAt: new Date().toISOString()
    };

    // Save to users in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('FISH_HOUSE_USERS_V1') || '[]');
      existing.push(newUser);
      localStorage.setItem('FISH_HOUSE_USERS_V1', JSON.stringify(existing));
    } catch(err) {}

    setLoading(false);
    onLoginSuccess(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/90 backdrop-blur-md overflow-y-auto">
      {/* Background glowing effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-ocean-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md rounded-3xl glass-card border border-turquoise-500/30 p-6 sm:p-8 space-y-6 bg-navy-900/95 shadow-glass my-8">
        
        {/* Header Logo */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-ocean-700 via-turquoise-500 to-cyan-300 p-0.5 shadow-glow-cyan flex items-center justify-center">
            <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-turquoise-400">
              <Icons.Fish className="w-8 h-8 animate-pulse" />
            </div>
          </div>
          <h2 className="font-display font-extrabold text-2xl text-white tracking-wide">
            FISH HOUSE
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? "Yangi hisob yaratish (Ro'yxatdan o'tish)" : "Restoran tizimiga kirish (Login)"}
          </p>
        </div>

        {/* Tab Switcher: Login vs Register */}
        <div className="flex p-1 rounded-xl bg-navy-950 border border-white/10 text-xs font-bold">
          <button
            type="button"
            onClick={() => { setIsRegister(false); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${!isRegister ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            Tizimga Kirish (Login)
          </button>
          <button
            type="button"
            onClick={() => { setIsRegister(true); setErrorMessage(''); }}
            className={`flex-1 py-2 rounded-lg transition-all ${isRegister ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'text-slate-400 hover:text-white'}`}
          >
            Ro'yxatdan O'tish (Register)
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/70 border border-red-500/50 text-red-300 text-xs flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* --- LOGIN FORM --- */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email yoki Telefon:</label>
              <input
                type="text"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="admin@fishhouse.uz yoki +998..."
                className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400 text-sm transition-colors"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-slate-300 font-semibold">Parol:</label>
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[11px] text-turquoise-400 hover:text-turquoise-300"
                >
                  {showPassword ? "Yashirish" : "Ko'rsatish"}
                </button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400 text-sm transition-colors font-mono"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded bg-navy-950 border-white/20 text-turquoise-500 focus:ring-0"
                />
                <span>Meni eslab qol</span>
              </label>
              <button
                type="button"
                onClick={() => alert("Parolni tiklash uchun ma'muriyat bilan bog'laning: +998 71 200-88-99")}
                className="text-turquoise-400 hover:underline"
              >
                Parolni unutdingizmi?
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-extrabold text-sm shadow-glow-cyan transition-all transform active:scale-95"
            >
              Kirish (Sign In) &rarr;
            </button>

            {/* Quick 1-Click Demo Accounts */}
            <div className="pt-4 border-t border-white/10 space-y-2">
              <p className="text-[11px] font-semibold text-slate-400 text-center uppercase tracking-wider">
                Tezkor Demo Kirish (1-bosishda):
              </p>
              <div className="grid grid-cols-2 gap-2">
                {demoAccounts.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDemoLogin(acc)}
                    className="p-2.5 rounded-xl bg-navy-950 hover:bg-navy-850 border border-white/10 text-slate-300 hover:text-white text-[11px] font-bold text-left transition-colors flex items-center gap-1.5"
                  >
                    <span>{acc.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </form>
        ) : (
          /* --- REGISTER FORM --- */
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">To'liq Ism (Full Name) *:</label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={(e) => setRegFullName(e.target.value)}
                placeholder="Jasur Rahimov"
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Telefon *:</label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Rol / Lavozim:</label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white text-xs font-semibold"
                >
                  <option value="customer">Mijoz (Mehmon)</option>
                  <option value="waiter">Ofitsiant (Xizmatchi)</option>
                  <option value="chef">Oshpaz (Oshxona)</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-slate-300 font-semibold block mb-1">Email Manzil *:</label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="nom@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-turquoise-400 text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Parol *:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-slate-300 font-semibold block mb-1">Tasdiqlash *:</label>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white font-mono text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-950 transition-all mt-2"
            >
              Ro'yxatdan O'tish (Register) &rarr;
            </button>
          </form>
        )}

        {/* Close / Return link */}
        {onCancel && (
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="text-xs text-slate-400 hover:text-white"
            >
              Tizimga kirmasdan davom etish
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

