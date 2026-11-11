import React, { useState } from 'react';
import { SupabaseAuth } from '../lib/supabase';

export default function AuthView({ onLoginSuccess, onCancel }) {
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDemoAccounts, setShowDemoAccounts] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('customer'); // customer, waiter, chef, admin
  const [fullName, setFullName] = useState('');

  // 1-Click Demo Accounts for rapid testing
  const demoAccounts = [
    { label: '👑 Admin (Mudir)', email: 'admin@fishhouse.uz', pass: 'admin123', role: 'admin', name: 'Administrator' },
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

  const handleSocialLogin = (provider) => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onLoginSuccess({
        id: `social-${Date.now()}`,
        email: provider === 'Google' ? 'james.schleifer@gmail.com' : 'apple.user@icloud.com',
        name: provider === 'Google' ? 'James Schleifer' : 'Apple User',
        role: 'customer',
        provider: provider.toLowerCase()
      });
    }, 600);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    if (!email || !password) {
      setErrorMessage("Iltimos, email va parolni to'liq kiriting!");
      setLoading(false);
      return;
    }

    if (isRegister) {
      if (password.length < 6) {
        setErrorMessage("Parol kamida 6 ta belgidan iborat bo'lishi kerak!");
        setLoading(false);
        return;
      }
      if (password !== confirmPassword) {
        setErrorMessage("Parollar bir-biriga mos kelmadi!");
        setLoading(false);
        return;
      }

      // Try Supabase Auth Sign Up
      let supaRes = { success: false };
      try {
        supaRes = await SupabaseAuth.signUp(email, password, {
          name: fullName || email.split('@')[0],
          role: role
        });
      } catch (err) { }

      const newUser = {
        id: supaRes.user ? supaRes.user.id : ('usr-' + Date.now()),
        name: fullName || email.split('@')[0],
        email: email,
        password: password,
        role: role,
        provider: supaRes.success ? 'supabase' : 'local',
        createdAt: new Date().toISOString()
      };

      try {
        const existing = JSON.parse(localStorage.getItem('FISH_HOUSE_USERS_V1') || '[]');
        existing.push(newUser);
        localStorage.setItem('FISH_HOUSE_USERS_V1', JSON.stringify(existing));
      } catch (err) { }

      setLoading(false);
      onLoginSuccess(newUser);
    } else {
      // Login process
      // 1. Try Supabase
      if (email.includes('@')) {
        try {
          const supaRes = await SupabaseAuth.signIn(email, password);
          if (supaRes.success && supaRes.user) {
            setLoading(false);
            const meta = supaRes.user.user_metadata || {};
            onLoginSuccess({
              id: supaRes.user.id,
              email: supaRes.user.email,
              name: meta.name || email.split('@')[0],
              role: meta.role || (email.includes('admin') ? 'admin' : 'customer'),
              provider: 'supabase'
            });
            return;
          }
        } catch (err) { }
      }

      // 2. Check registered users in localStorage
      try {
        const users = JSON.parse(localStorage.getItem('FISH_HOUSE_USERS_V1') || '[]');
        const matched = users.find(u => u.email.toLowerCase() === email.toLowerCase() && u.password === password);
        if (matched) {
          setLoading(false);
          onLoginSuccess(matched);
          return;
        }
      } catch (err) { }

      // 3. Check demo accounts
      const demo = demoAccounts.find(d => d.email.toLowerCase() === email.toLowerCase() && d.pass === password);
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

      // 4. Default test fallback
      if (email.includes('@') && password.length >= 4) {
        setLoading(false);
        onLoginSuccess({
          email: email,
          name: email.split('@')[0],
          role: email.includes('admin') ? 'admin' : 'customer'
        });
        return;
      }

      setLoading(false);
      setErrorMessage("Email yoki parol noto'g'ri. Demo hisoblardan foydalanib ko'ring.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto font-sans">
      
      {/* Smartphone Mockup Container */}
      <div className="relative w-full max-w-[390px] rounded-[48px] bg-[#0c0d0e] border-[8px] border-[#222428] shadow-[0_25px_70px_rgba(0,0,0,0.9)] overflow-hidden my-auto text-white">
        
        {/* iPhone Top Status Bar */}
        <div className="pt-3 px-7 flex items-center justify-between text-xs font-semibold text-white/90 select-none">
          <span>9:41</span>
          
          {/* Dynamic Island / Speaker Pill */}
          <div className="w-24 h-5 rounded-full bg-black border border-white/5 flex items-center justify-end px-2 gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1c1c1e]"></div>
            <div className="w-2 h-2 rounded-full bg-[#0d2a4a]"></div>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Cellular */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M2 17h3v4H2v-4zm6-5h3v9H8v-9zm6-4h3v13h-3V8zm6-5h3v18h-3V3z" />
            </svg>
            {/* Wifi */}
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 4C7.31 4 3.07 5.9 0 8.98L12 21 24 8.98C20.93 5.9 16.69 4 12 4zm0 3c3.78 0 7.22 1.48 9.77 3.91L12 18.66 2.23 10.91C4.78 8.48 8.22 7 12 7z" />
            </svg>
            {/* Battery */}
            <div className="w-5 h-2.5 rounded-[4px] border border-white/80 p-0.5 flex items-center">
              <div className="h-full w-3 bg-white rounded-[1px]"></div>
            </div>
          </div>
        </div>

        {/* Inner Content Area */}
        <div className="px-6 pt-5 pb-8 space-y-4 max-h-[85vh] overflow-y-auto">
          
          {/* Top Row: Circular Back Button & Demo Account Pill */}
          <div className="flex items-center justify-between">
            <button
              type="button"
              onClick={onCancel || (() => {})}
              className="w-10 h-10 rounded-full bg-[#1c1c1e] hover:bg-[#2c2c2e] active:scale-95 transition-all flex items-center justify-center text-white"
              title="Orqaga"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Quick Demo Switcher Pill */}
            <button
              type="button"
              onClick={() => setShowDemoAccounts(!showDemoAccounts)}
              className="px-3 py-1.5 rounded-full bg-[#1c1c1e] text-[11px] font-semibold text-[#f5b82e] border border-[#f5b82e]/20 hover:bg-[#2c2c2e] transition-colors"
            >
              ⚡ Demo hisoblar
            </button>
          </div>

          {/* Quick Demo Accounts Drawer */}
          {showDemoAccounts && (
            <div className="p-3 rounded-2xl bg-[#18191c] border border-white/10 space-y-2 text-xs">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">1-bosishda tizimga kirish:</p>
              <div className="grid grid-cols-2 gap-1.5">
                {demoAccounts.map((acc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleDemoLogin(acc)}
                    className="p-2 rounded-xl bg-[#222428] hover:bg-[#2c2f35] text-left text-[11px] font-bold text-zinc-200 hover:text-white transition-colors truncate"
                  >
                    {acc.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Title Header */}
          <div className="pt-1">
            <h1 className="text-[26px] font-bold text-white tracking-tight leading-tight">
              {isRegister ? "Sign Up To Your Account." : "Sign In To Your Account."}
            </h1>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-red-950/70 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-red-400"></span>
              <span className="flex-1">{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jamesschleifer@gmail.com"
                className="w-full px-4 py-3.5 rounded-2xl bg-[#1c1c1e] text-white placeholder-zinc-500 text-sm focus:outline-none focus:ring-1 focus:ring-[#f5b82e] border border-transparent transition-all"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">Password</label>
              <div className="relative flex items-center">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-[#1c1c1e] text-white placeholder-zinc-500 text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-[#f5b82e] border border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors p-1"
                >
                  {showPassword ? (
                    /* Eye open */
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  ) : (
                    /* Eye slash */
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field (Only on Register / Sign Up) */}
            {isRegister && (
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Conform Password</label>
                <div className="relative flex items-center">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-4 pr-11 py-3.5 rounded-2xl bg-[#1c1c1e] text-white placeholder-zinc-500 text-sm tracking-widest focus:outline-none focus:ring-1 focus:ring-[#f5b82e] border border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 text-zinc-400 hover:text-white transition-colors p-1"
                  >
                    {showConfirmPassword ? (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Optional Role Pill Selection when Registering */}
            {isRegister && (
              <div className="space-y-1.5 pt-1">
                <label className="text-xs font-medium text-zinc-400 block">Lavozim / Rol:</label>
                <div className="grid grid-cols-4 gap-1 text-[11px]">
                  {[
                    { id: 'customer', label: 'Mijoz' },
                    { id: 'waiter', label: 'Ofitsiant' },
                    { id: 'chef', label: 'Oshpaz' },
                    { id: 'admin', label: 'Admin' }
                  ].map(r => (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => setRole(r.id)}
                      className={`py-1.5 px-1 rounded-xl font-bold transition-all ${
                        role === r.id
                          ? 'bg-[#f5b82e] text-black shadow-md'
                          : 'bg-[#1c1c1e] text-zinc-400 hover:text-white'
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Big Golden Action Button (Sign UP / Sign IN) */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-full bg-[#f5b82e] hover:bg-[#e5aa26] active:scale-[0.98] text-black font-extrabold text-[15px] shadow-[0_10px_25px_rgba(245,184,46,0.25)] transition-all flex items-center justify-center"
              >
                {loading ? (
                  <span className="inline-block w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>{isRegister ? "Sign UP" : "Sign IN"}</span>
                )}
              </button>
            </div>

            {/* Remember Me Checkbox */}
            <div className="pt-1 flex items-center">
              <button
                type="button"
                onClick={() => setRememberMe(!rememberMe)}
                className="flex items-center gap-2.5 text-xs text-zinc-300 hover:text-white select-none transition-colors"
              >
                <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-all ${
                  rememberMe ? 'border-[#f5b82e] bg-[#f5b82e]' : 'border-zinc-500 bg-transparent'
                }`}>
                  {rememberMe && <div className="w-1.5 h-1.5 rounded-full bg-black"></div>}
                </div>
                <span>Remember me</span>
              </button>
            </div>
          </form>

          {/* OR Divider */}
          <div className="pt-2 flex items-center gap-3">
            <div className="flex-1 h-[1px] bg-zinc-800"></div>
            <span className="text-[11px] font-bold text-zinc-500 tracking-wider">OR</span>
            <div className="flex-1 h-[1px] bg-zinc-800"></div>
          </div>

          {/* Social Logins */}
          <div className="space-y-2.5 pt-1">
            {/* Google */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Google')}
              className="w-full py-3.5 px-4 rounded-full bg-[#1c1c1e] hover:bg-[#27272a] active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign in with Google</span>
            </button>

            {/* Apple */}
            <button
              type="button"
              onClick={() => handleSocialLogin('Apple')}
              className="w-full py-3.5 px-4 rounded-full bg-[#1c1c1e] hover:bg-[#27272a] active:scale-[0.98] text-white text-xs font-semibold flex items-center justify-center gap-2.5 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 0.92-2.85-.9.04-1.99.6-2.64 1.35-.58.67-1.09 1.74-.95 2.77 1 .08 2.04-.52 2.67-1.27z" />
              </svg>
              <span>Continue with Apple</span>
            </button>
          </div>

          {/* Bottom Switcher: Don't have an account? Login / Sign Up */}
          <div className="pt-4 text-center">
            {isRegister ? (
              <p className="text-xs text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(false);
                    setErrorMessage('');
                  }}
                  className="font-bold text-[#f5b82e] hover:underline"
                >
                  Login
                </button>
              </p>
            ) : (
              <p className="text-xs text-zinc-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage('');
                  }}
                  className="font-bold text-[#f5b82e] hover:underline"
                >
                  Sign Up
                </button>
              </p>
            )}
          </div>

          {/* iPhone Home Bar indicator */}
          <div className="pt-2 flex justify-center">
            <div className="w-32 h-1 bg-white/20 rounded-full"></div>
          </div>

        </div>
      </div>
    </div>
  );
}
