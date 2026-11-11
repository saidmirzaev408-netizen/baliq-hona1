import React, { useState } from 'react';
import { Icons } from './Icons';
import { formatUZS } from '../utils/audio';

export default function LandingPageView({
  rooms,
  dishes,
  restaurant,
  currentUser,
  onOpenLogin,
  onOpenRegister,
  onLogout,
  onSwitchToAdmin,
  onBookRoom,
  onOrderDish,
  appliedDiscounts
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  const [activeHeroSlide, setActiveHeroSlide] = useState(0);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Categories matching the circular row from the user reference image
  const categoryList = [
    { id: 'ALL', name: 'Barchasi', icon: '🐟', count: dishes.length },
    { id: 'fried', name: 'Qovurilgan Baliq', icon: '🍳', count: dishes.filter(d => d.category === 'fried').length },
    { id: 'grilled', name: 'Gril & Mangal', icon: '🔥', count: dishes.filter(d => d.category === 'grilled').length },
    { id: 'soup', name: "Baliq Sho'rva (Uxa)", icon: '🍲', count: dishes.filter(d => d.category === 'soup').length },
    { id: 'baked', name: 'Dimlama Baliq', icon: '🥘', count: dishes.filter(d => d.category === 'baked').length },
    { id: 'seafood', name: 'Dengiz Mahsulotlari', icon: '🦐', count: dishes.filter(d => d.category === 'seafood').length },
    { id: 'kebab', name: 'Baliq Kabob', icon: '🍢', count: dishes.filter(d => d.category === 'kebab').length },
    { id: 'salad', name: 'Sarxil Salatlar', icon: '🥗', count: dishes.filter(d => d.category === 'salad').length },
    { id: 'drink', name: 'Ichimliklar', icon: '🍹', count: dishes.filter(d => d.category === 'drink').length },
  ];

  // Hero slides inspired by the user reference image
  const heroSlides = [
    {
      badge: "-40% MAXSUS CHEGIRMA",
      badgeColor: "bg-amber-500",
      title: "Haqiqiy Asil Baliq Ta'mi",
      subtitle: "Zarafshon va tog' daryolari sarxil baliqlari, Norvegiya qizil balig'i, yangi tutilgan tog' foreli, rozmarin va sarimsoqli maxsus limon sousi bilan.",
      dishName: "Qirollik Qizil Balig'i (Salmon Steak)",
      dishWeight: "450 gr",
      price: 145000,
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=1200&q=85",
      ingredients: ["Sarxil Farel", "Norvegiya Lososi", "Limon & Rozmarin", "Zaytun Moyi", "Maxsus Tartar Sous"]
    },
    {
      badge: "CHEF MAXSUS TAOMI",
      badgeColor: "bg-emerald-500",
      title: "Mangalda Pishirilgan Farel",
      subtitle: "Tog' bulog'ining tirik farel balig'i, maxsus o'tlar bilan marinadlangan va qizigan ko'mir cho'g'ida oltinrang qilib pishirilgan betakror taom.",
      dishName: "Tog' Foreli Mangalda",
      dishWeight: "500 gr",
      price: 110000,
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=85",
      ingredients: ["Tirik Farel", "Yalpiz & Zira", "Qizil qalampir", "Limon sharbati", "Gril pomidorlar"]
    },
    {
      badge: "ENG OMMABOP TAOM",
      badgeColor: "bg-cyan-500",
      title: "Qirollik Dengiz Assortisi",
      subtitle: "Katta do'stlar davrasi va oilaviy bayramlar uchun ulkan dengiz lagani: qisqichbaqalar, midiyalar, qizil baliq va maxsus dengiz souslari.",
      dishName: "Dengiz Qirollari Assortisi",
      dishWeight: "1200 gr",
      price: 280000,
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=1200&q=85",
      ingredients: ["Qirollik Qisqichbaqasi", "Midiya", "Kalmar", "Limonli sariyog'", "Sarimsoq baget"]
    }
  ];

  const currentHero = heroSlides[activeHeroSlide];

  // Filtered dishes
  const filteredDishes = dishes.filter(d => {
    const matchesCat = selectedCategory === 'ALL' || d.category === selectedCategory;
    const matchesSearch = !searchQuery ||
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Blog articles matching the blog section from user's image ("وبلاگ تیز و تند")
  const blogArticles = [
    {
      id: 1,
      title: "Farel balig'ini oltinrang qovurish siri va oshpaz maslahatlari",
      category: "Oshpaz Maslahati",
      date: "10 Noyabr, 2026",
      readTime: "4 daqiqa",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
      summary: "Baliqning shirasi ichida qolishi va tashqi qatlami karsildoq bo'lishi uchun yog' harorati kamida 180°C bo'lishi va maxsus makkajo'xori uni bilan qoplanishi kerak.",
      content: "FISH HOUSE bosh oshpazi Jamshid usta o'zining 15 yillik tajribasidan kelib chiqib, baliqni qovurishda eng ko'p yo'l qo'yiladigan xatolar va ularning oldini olish sirlarini o'rtoqlashadi..."
    },
    {
      id: 2,
      title: "Zarafshon va tog' daryolari baliqlarining salomatlikka 7 xil foydasi",
      category: "Salomatlik & Parhez",
      date: "08 Noyabr, 2026",
      readTime: "5 daqiqa",
      image: "https://images.unsplash.com/photo-1510130387422-82ebd32764f9?auto=format&fit=crop&w=600&q=80",
      summary: "Omega-3 yog' kislotalari, yuqori sifatli oqsil va fosfor miqdori bo'yicha tog' daryosi baliqlari organizm immunitetini mustahkamlashda tengsiz hisoblanadi.",
      content: "Yurak-qon tomir tizimini yaxshilash, miya faoliyatini kuchaytirish va bo'g'imlar salomatligi uchun haftasiga kamida 2 marotaba yangi tutilgan baliq iste'mol qilish tavsiya etiladi."
    },
    {
      id: 3,
      title: "Haqiqiy Baliq sho'rva (Uxa) tayyorlashning an'anaviy retsepti",
      category: "Klassik Retsept",
      date: "05 Noyabr, 2026",
      readTime: "6 daqiqa",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=600&q=80",
      summary: "Tiniq, xushbo'y va shifobaxsh baliq sho'rvasi tayyorlashda dafna yaprog'i, qora murch donalari va yangi shivit qachon qo'shilishi hal qiluvchi ahamiyatga ega.",
      content: "Ushbu maqolada biz qadimiy baliqchilar an'anasiga ko'ra ochiq olovda qozonda tayyorlanadigan haqiqiy podshohona Uxa taomining bosqichma-bosqich sirlarini taqdim etamiz."
    }
  ];

  // Testimonials matching the warm testimonial section from user's image ("مشتریان در مورد ما چه می‌گویند؟")
  const testimonials = [
    {
      id: 1,
      name: "Alisher Qodirov",
      role: "Tadbirkor, Toshkent",
      avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "Dengiz Marvaridi VIP xonasida xorijiy mehmonlarimiz bilan kechki ovqat qildik. Qovurilgan sazan va baliq sho'rva a'lo darajada pishirilgan! Xizmat ko'rsatish madaniyati juda yuqori."
    },
    {
      id: 2,
      name: "Nodira Karimova",
      role: "Dizayner",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "Tug'ilgan kunimni Atlantika banket zalida nishonladik. Har bir xonaning alohida akustikasi va qulayligi bor. Ayniqsa qizil baliq steyki va dengiz assortisi barchaga juda yoqdi!"
    },
    {
      id: 3,
      name: "Jasur Rahimov",
      role: "IT Loyiha Rahbari",
      avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
      rating: 5,
      comment: "Veb-sayt orqali stolni oldindan band qildik va menyudan taomlarni tanladik. Yetib kelganimizda stolimiz tayyor edi. Hisob-kitob tizimi juda shaffof, tavsiya qilaman!"
    }
  ];

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSuccess(true);
    setTimeout(() => {
      setNewsletterSuccess(false);
      setNewsletterEmail('');
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#070d1e] text-slate-100 font-sans selection:bg-turquoise-500 selection:text-navy-950">
      
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-gradient-to-r from-ocean-900 via-navy-900 to-ocean-900 text-xs text-slate-300 py-2 px-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-2">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="flex items-center gap-1.5 text-turquoise-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              Ish vaqti: {restaurant.workingHours || "11:00 - 23:30"}
            </span>
            <span className="hidden sm:inline text-slate-400">|</span>
            <span className="hidden sm:inline text-slate-300">📍 {restaurant.address || "Toshkent sh., Chilonzor"}</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="tel:+998712008899" className="text-turquoise-300 hover:text-white transition-colors flex items-center gap-1 font-semibold">
              <Icons.Phone className="w-3.5 h-3.5" />
              <span>+998 (71) 200-88-99</span>
            </a>
            <span className="text-slate-400">|</span>
            <button
              onClick={onSwitchToAdmin}
              className="px-2.5 py-1 rounded bg-turquoise-500/20 hover:bg-turquoise-500/30 text-turquoise-300 text-xs font-bold transition-all flex items-center gap-1 border border-turquoise-500/30"
              title="Restoran boshqaruv paneliga o'tish"
            >
              <Icons.Dashboard className="w-3.5 h-3.5" />
              <span>Admin & POS Panel</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & NAVIGATION (Inspired by reference layout) */}
      <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-md border-b border-white/10 shadow-2xl transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-ocean-600 via-turquoise-500 to-cyan-300 p-0.5 shadow-glow-cyan flex items-center justify-center transform hover:rotate-6 transition-transform">
              <div className="w-full h-full bg-navy-950 rounded-[14px] flex items-center justify-center text-turquoise-400">
                <Icons.Fish className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-black text-2xl tracking-wider text-white">FISH HOUSE</span>
                <span className="px-1.5 py-0.5 text-[9px] font-extrabold uppercase rounded bg-turquoise-500/20 text-turquoise-300 border border-turquoise-500/30">Baliq</span>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-turquoise-400 font-semibold">Premium Seafood Restaurant</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-7 text-sm font-bold text-slate-200">
            <a href="#hero" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Bosh sahifa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#categories" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Menyu
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#bestsellers" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Ommabop Taomlar
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#rooms" className="hover:text-turquoise-400 transition-colors py-1 relative group flex items-center gap-1">
              VIP Xonalar
              <span className="px-1.5 py-0.2 text-[9px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/30">ZANIT holati</span>
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#blog" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Oshpaz Blogi
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#reviews" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Mijozlar Fikri
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a href="#contact" className="hover:text-turquoise-400 transition-colors py-1 relative group">
              Aloqa
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-turquoise-400 group-hover:w-full transition-all duration-300"></span>
            </a>
          </nav>

          {/* Right Header Actions: Search, Booking Button, Auth */}
          <div className="flex items-center space-x-3">
            
            {/* Quick Search Input */}
            <div className="relative hidden md:block w-48 xl:w-56">
              <input
                type="text"
                placeholder="Taomni qidirish..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-navy-900/80 text-white text-xs pl-8 pr-3 py-2 rounded-xl border border-white/10 focus:outline-none focus:border-turquoise-400 transition-all placeholder-slate-400"
              />
              <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                  &times;
                </button>
              )}
            </div>

            {/* Book Room Button (Bright action button like in user image) */}
            <button
              onClick={() => onBookRoom('')}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-turquoise-500 hover:from-emerald-400 hover:to-turquoise-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-glow-cyan flex items-center gap-1.5 transform hover:-translate-y-0.5 transition-all"
            >
              <Icons.Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Stol Band Qilish</span>
              <span className="sm:hidden">Band Qilish</span>
            </button>

            {/* Auth Profile / Login Button */}
            {currentUser ? (
              <div className="relative flex items-center space-x-2 bg-navy-900 border border-white/15 px-3 py-1.5 rounded-xl">
                <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-turquoise-500 to-ocean-500 flex items-center justify-center text-xs font-bold text-navy-950">
                  {currentUser.name.charAt(0)}
                </div>
                <div className="hidden md:block text-left text-xs leading-none">
                  <p className="font-bold text-white truncate max-w-[90px]">{currentUser.name.split(' ')[0]}</p>
                  <p className="text-[10px] text-turquoise-400 capitalize">{currentUser.role}</p>
                </div>
                <button
                  onClick={onLogout}
                  title="Chiqish"
                  className="text-slate-400 hover:text-rose-400 p-0.5 transition-colors"
                >
                  <Icons.Logout className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-2 rounded-xl bg-navy-900 hover:bg-navy-850 text-white font-bold text-xs border border-white/15 hover:border-turquoise-400/50 transition-all flex items-center gap-1.5"
              >
                <Icons.User className="w-3.5 h-3.5 text-turquoise-400" />
                <span>Kirish</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* 3. HERO SHOWCASE WITH LUXURY WOOD BACKDROP & FLOATING INGREDIENTS */}
      {/* Inspired directly by the user's reference screenshot */}
      <section id="hero" className="relative overflow-hidden pt-8 pb-16 lg:py-20 border-b border-white/10 bg-[#160c07] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#2a170d] via-[#150b06] to-[#080402]">
        
        {/* Dark Wood Grain Overlay & Floating Elements */}
        <div className="absolute inset-0 opacity-20 pointer-events-none mix-blend-overlay bg-[radial-gradient(#d97706_1px,transparent_1px)] [background-size:16px_16px]"></div>
        
        {/* Floating realistic food elements (tomatoes, basil, lemon, spices) like in reference photo */}
        <div className="absolute top-12 left-10 text-3xl opacity-75 animate-bounce duration-1000 select-none pointer-events-none" style={{ animationDuration: '4s' }}>
          🍋
        </div>
        <div className="absolute bottom-16 left-1/4 text-2xl opacity-60 animate-pulse select-none pointer-events-none">
          🌿
        </div>
        <div className="absolute top-20 right-1/3 text-3xl opacity-80 animate-bounce select-none pointer-events-none" style={{ animationDuration: '5s' }}>
          🍅
        </div>
        <div className="absolute bottom-20 right-12 text-3xl opacity-70 animate-pulse select-none pointer-events-none">
          🍄
        </div>
        <div className="absolute top-1/2 left-8 text-2xl opacity-60 select-none pointer-events-none">
          🌶️
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Headline, Badges, Gourmet Ingredients List, CTAs */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Special Discount Floating Ribbon */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black shadow-glow-gold">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <Icons.Sparkles className="w-4 h-4 text-amber-400" />
                <span>{currentHero.badge}</span>
              </div>

              {/* Big Luxury Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-black text-white leading-tight tracking-tight">
                {currentHero.title}
              </h1>

              {/* Description */}
              <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0">
                {currentHero.subtitle}
              </p>

              {/* Gourmet Ingredients tags */}
              <div className="pt-1">
                <p className="text-xs uppercase tracking-widest text-amber-400/90 font-bold mb-2">Maxsus Tarkibi va Masalliqlari:</p>
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {currentHero.ingredients.map((ing, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-xs text-slate-200 backdrop-blur-sm">
                      ✨ {ing}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price & Action Buttons */}
              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                
                {/* Glowing Green Order Button like in reference photo */}
                <button
                  onClick={() => onBookRoom('')}
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-emerald-400 to-turquoise-400 hover:from-emerald-400 hover:to-turquoise-300 text-navy-950 font-black text-sm uppercase tracking-wider shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 transform hover:-translate-y-1 transition-all"
                >
                  <Icons.Sparkles className="w-5 h-5 text-navy-950" />
                  <span>Hoziroq Buyurtma Berish</span>
                  <span className="text-lg leading-none">&rarr;</span>
                </button>

                {/* View Menu Button */}
                <a
                  href="#categories"
                  className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-sm border border-white/20 hover:border-turquoise-400/50 backdrop-blur-md flex items-center justify-center gap-2 transition-all"
                >
                  <Icons.Fish className="w-4 h-4 text-turquoise-400" />
                  <span>Menyuni Ko'rish</span>
                </a>
              </div>

              {/* Hero Statistics Counters */}
              <div className="pt-4 grid grid-cols-3 gap-4 border-t border-white/10 max-w-md mx-auto lg:mx-0">
                <div>
                  <div className="text-2xl font-black text-amber-400">12+</div>
                  <div className="text-xs text-slate-400">Sara Baliq Taomlari</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-turquoise-400">8 ta</div>
                  <div className="text-xs text-slate-400">Hashamatli Zallar</div>
                </div>
                <div>
                  <div className="text-2xl font-black text-emerald-400">100%</div>
                  <div className="text-xs text-slate-400">Tirik & Yangi Baliq</div>
                </div>
              </div>

            </div>

            {/* Right Column: Giant Platter on Wood with floating promo badge & carousel */}
            <div className="lg:col-span-5 flex flex-col items-center">
              
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center">
                
                {/* Ambient glow behind platter */}
                <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/20 via-orange-600/30 to-turquoise-500/20 rounded-full blur-3xl animate-pulse"></div>
                
                {/* Circular Promo Badge like in reference screenshot (۵۰ درصد تخفیف) */}
                <div className="absolute -top-3 -right-3 z-30 w-24 h-24 rounded-full bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 text-navy-950 font-black p-2 flex flex-col items-center justify-center text-center shadow-2xl shadow-amber-500/50 transform rotate-12 hover:rotate-0 transition-transform cursor-pointer border-2 border-white/40">
                  <span className="text-lg leading-tight font-extrabold">-40%</span>
                  <span className="text-[10px] uppercase font-bold tracking-tighter">Chegirma</span>
                </div>

                {/* Main Signature Dish Image in Wood Plate Styling */}
                <div className="relative z-10 w-full h-full rounded-full p-3 bg-gradient-to-tr from-amber-950/80 via-yellow-900/40 to-amber-700/60 shadow-2xl border-4 border-amber-800/40 backdrop-blur-sm">
                  <img
                    src={currentHero.image}
                    alt={currentHero.dishName}
                    className="w-full h-full object-cover rounded-full shadow-2xl transform hover:scale-105 transition-transform duration-700"
                  />
                  
                  {/* Floating price tag bottom pill */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 px-5 py-2 rounded-full bg-navy-950/90 border border-turquoise-400/40 backdrop-blur-md shadow-2xl flex items-center gap-3">
                    <span className="text-xs font-bold text-slate-300">{currentHero.dishWeight}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-turquoise-400"></span>
                    <span className="text-sm font-black text-amber-400">{formatUZS(currentHero.price)}</span>
                  </div>
                </div>

              </div>

              {/* Slider Dots Indicator (like in reference screenshot) */}
              <div className="flex items-center space-x-2.5 mt-6 z-20">
                {heroSlides.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveHeroSlide(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      activeHeroSlide === idx ? 'w-8 bg-turquoise-400 shadow-glow-cyan' : 'w-2.5 bg-white/30 hover:bg-white/60'
                    }`}
                    title={`Slide ${idx + 1}`}
                  />
                ))}
              </div>

            </div>

          </div>
        </div>

        {/* Wavy bottom decorative shape transitioning to categories */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-[#070d1e] to-transparent"></div>
      </section>

      {/* 4. CIRCULAR CATEGORIES SECTION (Exact layout from user reference image) */}
      <section id="categories" className="py-12 bg-navy-950/90 border-b border-white/10 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="px-3 py-1 rounded-full bg-turquoise-500/10 border border-turquoise-500/30 text-turquoise-400 text-xs font-extrabold uppercase tracking-wider">
              Menyu Kategoriyalari
            </span>
            <h2 className="text-2xl sm:text-3xl font-display font-black text-white mt-2">
              Sevimli Taomingizni Tanlang
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Qovurilgan baliqlardan tortib, dengiz marvaridlarigacha barcha turdagi lazzatlar
            </p>
          </div>

          {/* Circular Category Icons Bar (Smooth horizontal scroll on mobile) */}
          <div className="flex items-center justify-center gap-4 sm:gap-6 lg:gap-8 overflow-x-auto pb-4 scrollbar-none">
            {categoryList.map(cat => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex flex-col items-center gap-2.5 group transition-all min-w-[76px] sm:min-w-[90px] ${
                    isSelected ? 'scale-105' : 'opacity-75 hover:opacity-100 hover:scale-105'
                  }`}
                >
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center text-2xl sm:text-3xl border-2 transition-all duration-300 shadow-lg ${
                    isSelected
                      ? 'bg-gradient-to-tr from-ocean-700 via-turquoise-600 to-cyan-400 border-white text-white shadow-glow-cyan rotate-6'
                      : 'bg-navy-900 border-white/10 text-slate-300 group-hover:border-turquoise-400/50 group-hover:bg-navy-850'
                  }`}>
                    <span>{cat.icon}</span>
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-bold leading-tight ${isSelected ? 'text-turquoise-300' : 'text-slate-300 group-hover:text-white'}`}>
                      {cat.name}
                    </p>
                    <span className="text-[10px] text-slate-500 font-semibold">{cat.count} xil</span>
                  </div>
                </button>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. BESTSELLING DISHES (Perv-forush-tarin Ghadaha / Eng ko'p sotilgan taomlar) */}
      <section id="bestsellers" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Icons.Fire className="w-4 h-4 text-amber-400" />
              <span>Eng Sara Taomlar</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mt-1">
              Ommabop Baliq Taomlari
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Restoranimiz mehmonlari tomonidan eng ko'p buyurtma qilingan shohona taomlar
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Jami: <strong className="text-turquoise-400">{filteredDishes.length}</strong> taom</span>
          </div>
        </div>

        {/* Dishes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDishes.map(dish => (
            <div
              key={dish.id}
              className="group bg-navy-900/80 rounded-3xl border border-white/10 overflow-hidden hover:border-turquoise-400/40 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Photo with badges */}
                <div className="relative h-48 overflow-hidden bg-navy-950">
                  <img
                    src={dish.photo}
                    alt={dish.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                  
                  {/* Grams Badge */}
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-[11px] font-bold text-slate-300 border border-white/10">
                    ⚖️ {dish.weightGrams} gr
                  </div>

                  {/* Hot Badge */}
                  {dish.isSpecial && (
                    <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-amber-500/90 text-navy-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                      👑 Chef Tavsiyasi
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-base text-white group-hover:text-turquoise-300 transition-colors line-clamp-1">
                      {dish.name}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {dish.description}
                  </p>
                </div>
              </div>

              {/* Price & Add to Order button */}
              <div className="p-5 pt-0">
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-slate-400 block font-semibold">Narxi</span>
                    <span className="text-base font-black text-amber-400">{formatUZS(dish.price)}</span>
                  </div>

                  <button
                    onClick={() => onOrderDish(dish)}
                    className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-black text-xs shadow-glow-cyan flex items-center gap-1.5 transition-all transform hover:scale-105"
                  >
                    <Icons.Plus className="w-3.5 h-3.5" />
                    <span>Buyurtma</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. DINING ROOMS SHOWCASE (WITH PROMINENT "ZANIT" STATUS BADGE) */}
      <section id="rooms" className="py-16 bg-navy-950 border-y border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="px-3 py-1 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-black uppercase tracking-wider">
              Xonalar & Kabinetlar
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mt-2">
              Shinam VIP Xonalar va Banket Zallari
            </h2>
            <p className="text-sm text-slate-400 mt-2">
              Oilaviy kechki ovqatlar, do'stlar suhbati va katta tantanalar uchun alohida jihozlangan xonalar.
              Xona holatini onlayn kuzatib, oldindan band qilishingiz mumkin.
            </p>
          </div>

          {/* Rooms Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {rooms.map(room => {
              const isOccupied = room.status === 'OCCUPIED';
              const isReserved = room.status === 'RESERVED';
              const isAvailable = room.status === 'AVAILABLE';

              return (
                <div
                  key={room.id}
                  className={`relative rounded-3xl overflow-hidden border transition-all duration-300 flex flex-col justify-between ${
                    isOccupied
                      ? 'bg-navy-900/90 border-red-500/40 shadow-glow-red'
                      : isReserved
                      ? 'bg-navy-900/90 border-amber-500/40'
                      : 'bg-navy-900/90 border-emerald-500/30 hover:border-turquoise-400/60'
                  }`}
                >
                  <div>
                    {/* Room Photo */}
                    <div className="relative h-44 overflow-hidden bg-navy-950">
                      <img
                        src={room.photo}
                        alt={room.name}
                        className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent"></div>
                      
                      {/* Room Number */}
                      <div className="absolute top-3 left-3 px-3 py-1 rounded-xl bg-navy-950/90 backdrop-blur-md text-xs font-black text-turquoise-300 border border-turquoise-500/30">
                        № {room.number}
                      </div>

                      {/* PROMINENT STATUS BADGE (ZANIT / BAND QILINGAN / BO'SH) */}
                      <div className="absolute top-3 right-3">
                        {isOccupied && (
                          <div className="px-3.5 py-1.5 rounded-xl bg-rose-600 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-rose-600/50 flex items-center gap-1.5 animate-pulse">
                            <span className="w-2 h-2 rounded-full bg-white"></span>
                            <span>ZANIT</span>
                          </div>
                        )}
                        {isReserved && (
                          <div className="px-3 py-1 rounded-xl bg-amber-500 text-navy-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                            <span>BAND QILINGAN</span>
                          </div>
                        )}
                        {isAvailable && (
                          <div className="px-3 py-1 rounded-xl bg-emerald-500 text-navy-950 font-black text-xs uppercase tracking-wider shadow-md flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-navy-950"></span>
                            <span>BO'SH</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Room Info */}
                    <div className="p-5">
                      <h3 className="font-bold text-lg text-white">{room.name}</h3>
                      <p className="text-xs text-turquoise-400 font-semibold">{room.subtitle}</p>

                      <div className="mt-3 flex items-center justify-between text-xs text-slate-300">
                        <span>Sig'imi: <strong>{room.capacityText}</strong></span>
                        <span className="px-2 py-0.5 rounded bg-white/5 text-slate-400">{room.floor}</span>
                      </div>

                      {/* Amenities pills */}
                      <div className="mt-3 flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((am, i) => (
                          <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-300 border border-white/5">
                            {am}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="p-5 pt-0">
                    {isAvailable ? (
                      <button
                        onClick={() => onBookRoom(room.id)}
                        className="w-full py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-navy-950 font-black text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
                      >
                        <Icons.Calendar className="w-3.5 h-3.5" />
                        <span>Xonani Band Qilish</span>
                      </button>
                    ) : isReserved ? (
                      <div className="text-center py-2 px-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold">
                        ⏰ {room.reservation ? `${room.reservation.time} ga band` : "Band qilingan"}
                      </div>
                    ) : (
                      <div className="text-center py-2 px-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-bold">
                        ⛔ Mehmonlar o'tiribdi (ZANIT)
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 7. SEAFOOD BLOG & CHEF TIPS (Exact layout from user reference image "وبلاگ تیز و تند") */}
      <section id="blog" className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-black uppercase tracking-wider">
            Oshpaz Tavsiyalari & Retseptlar
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-black text-white mt-2">
            FISH HOUSE Blogi & Yangiliklar
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Baliq taomlarini to'g'ri pishirish sirlari va salomatlik uchun foydali maslahatlar
          </p>
        </div>

        {/* 3 Blog Cards as in reference photo */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogArticles.map(article => (
            <div
              key={article.id}
              className="bg-navy-900/80 rounded-3xl border border-white/10 overflow-hidden hover:border-turquoise-400/50 hover:shadow-2xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-navy-950">
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-navy-950/80 backdrop-blur-md text-[11px] font-bold text-turquoise-300 border border-turquoise-400/30">
                    {article.category}
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-3 text-xs text-slate-400 mb-2">
                    <span>📅 {article.date}</span>
                    <span>•</span>
                    <span>⏱️ {article.readTime}</span>
                  </div>
                  <h3 className="font-bold text-lg text-white group-hover:text-turquoise-300 transition-colors line-clamp-2 leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                    {article.summary}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedArticle(article)}
                  className="w-full py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-turquoise-300 hover:text-white font-bold text-xs border border-white/10 transition-all flex items-center justify-center gap-1.5"
                >
                  <span>Batafsil O'qish</span>
                  <span>&rarr;</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. TESTIMONIALS SECTION (Yellow/Warm Styled like in reference screenshot "مشتریان در مورد ما چه می‌گویند؟") */}
      <section id="reviews" className="py-16 bg-gradient-to-b from-amber-500/10 via-amber-600/5 to-transparent border-t border-amber-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="px-3.5 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider">
              ⭐ Haqiqiy Sharhlar
            </span>
            <h2 className="text-3xl sm:text-4xl font-display font-black text-white mt-2">
              Mijozlarimiz Biz Haqimizda Nima Deydi?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Restoranimizga tashrif buyurgan aziz mehmonlarning samimiy fikrlari
            </p>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(item => (
              <div
                key={item.id}
                className="bg-navy-900/90 rounded-3xl p-6 border border-amber-500/30 shadow-xl relative backdrop-blur-md flex flex-col justify-between"
              >
                <div>
                  {/* Star Rating */}
                  <div className="flex items-center space-x-1 text-amber-400 mb-3 text-sm">
                    {"★★★★★".slice(0, item.rating)}
                  </div>
                  <p className="text-sm text-slate-200 italic leading-relaxed">
                    "{item.comment}"
                  </p>
                </div>

                <div className="flex items-center space-x-3 pt-5 mt-4 border-t border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-white">{item.name}</h4>
                    <p className="text-xs text-amber-300/80">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 9. NEWSLETTER SUBSCRIPTION (Matching reference screenshot section) */}
      <section className="py-16 max-w-5xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-ocean-900 via-navy-900 to-ocean-900 rounded-3xl p-8 sm:p-12 border border-turquoise-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8">
          
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <div className="space-y-3 text-center md:text-left max-w-md">
            <span className="px-3 py-1 rounded-full bg-turquoise-500/20 text-turquoise-300 text-xs font-bold border border-turquoise-500/30">
              🎁 Maxsus Aksiyalar
            </span>
            <h3 className="text-2xl sm:text-3xl font-display font-black text-white">
              Maxsus Chegirmalar Uchun Xabarnomaga Obuna Bo'ling
            </h3>
            <p className="text-xs sm:text-sm text-slate-300">
              Yangi baliq turlari, dam olish kunlari chegirmalari va oshpazimiz maxsus menyulari haqida birinchilardan bo'lib xabardor bo'ling.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full md:w-auto flex-1 max-w-md">
            {newsletterSuccess ? (
              <div className="p-4 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-xs font-bold text-center">
                🎉 Rahmat! Siz xabarnomamizga muvaffaqiyatli obuna bo'ldingiz!
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  placeholder="Elektron pochta manzilingiz..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 px-4 py-3.5 rounded-2xl bg-navy-950/90 text-white text-xs border border-white/20 focus:outline-none focus:border-turquoise-400"
                />
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 text-navy-950 font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30 whitespace-nowrap"
                >
                  Obuna Bo'lish
                </button>
              </div>
            )}
          </form>

        </div>
      </section>

      {/* 10. RICH FOOTER (Exact structure from user reference image) */}
      <footer id="contact" className="bg-[#040813] border-t border-white/10 pt-16 pb-8 text-slate-300 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-white/10">
            
            {/* Col 1: About & Logo */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-600 to-turquoise-400 flex items-center justify-center text-navy-950">
                  <Icons.Fish className="w-6 h-6" />
                </div>
                <div>
                  <span className="font-display font-black text-xl text-white">FISH HOUSE</span>
                  <p className="text-[9px] uppercase tracking-widest text-turquoise-400">Baliq Taomlari Restorani</p>
                </div>
              </div>
              <p className="text-slate-400 leading-relaxed text-xs">
                {restaurant.uzTagline || "Toshkentdagi eng sara baliq va dengiz mahsulotlari restorani. Tirik tog' fareli, sazan, oq amur va qirollik steyklari."}
              </p>
              <div className="flex items-center space-x-2 pt-2">
                <button onClick={onSwitchToAdmin} className="px-3 py-1.5 rounded-lg bg-navy-900 hover:bg-navy-850 text-turquoise-300 border border-white/10 font-bold text-xs flex items-center gap-1.5">
                  <Icons.Dashboard className="w-3.5 h-3.5" />
                  <span>Admin POS Boshqaruv</span>
                </button>
              </div>
            </div>

            {/* Col 2: Opening Hours */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Ish Tartibi</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex justify-between">
                  <span>Dushanba - Juma:</span>
                  <strong className="text-slate-200">11:00 - 23:30</strong>
                </li>
                <li className="flex justify-between">
                  <span>Shanba - Yakshanba:</span>
                  <strong className="text-turquoise-300">11:00 - 00:00</strong>
                </li>
                <li className="flex justify-between">
                  <span>Dam olish kunisiz:</span>
                  <strong className="text-emerald-400">Har kuni ochiq</strong>
                </li>
                <li className="pt-2 text-slate-500 text-[11px]">
                  * Oshxona soat 23:00 gacha buyurtma qabul qiladi.
                </li>
              </ul>
            </div>

            {/* Col 3: Fast Links */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Tezkor Havolalar</h4>
              <ul className="space-y-2">
                <li><a href="#hero" className="hover:text-turquoise-300 transition-colors">Bosh Sahifa</a></li>
                <li><a href="#categories" className="hover:text-turquoise-300 transition-colors">Baliq Taomlari Menyusi</a></li>
                <li><a href="#rooms" className="hover:text-turquoise-300 transition-colors">VIP Xonalar va Zallar</a></li>
                <li><a href="#blog" className="hover:text-turquoise-300 transition-colors">Oshpaz Blogi & Retseptlar</a></li>
                <li><a href="#reviews" className="hover:text-turquoise-300 transition-colors">Mijozlar Sharhlari</a></li>
                <li>
                  <button onClick={onOpenLogin} className="hover:text-turquoise-300 transition-colors text-left">
                    Tizimga Kirish / Ro'yxatdan O'tish
                  </button>
                </li>
              </ul>
            </div>

            {/* Col 4: Contacts & Address */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-white uppercase tracking-wider">Aloqa & Manzil</h4>
              <ul className="space-y-2 text-slate-400">
                <li className="flex items-start gap-2">
                  <span>📍</span>
                  <span>{restaurant.address || "Toshkent sh., Chilonzor tumani, Dengiz ko'chasi 7"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <span>📞</span>
                  <a href="tel:+998712008899" className="text-turquoise-300 hover:underline">{restaurant.phone || "+998 71 200-88-99"}</a>
                </li>
                <li className="flex items-center gap-2">
                  <span>✈️</span>
                  <a href="https://t.me/fishhouse_uz" target="_blank" rel="noreferrer" className="text-sky-400 hover:underline">{restaurant.telegram || "@fishhouse_uz"}</a>
                </li>
              </ul>
            </div>

          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
            <p>© 2026 FISH HOUSE. Barcha huquqlar himoyalangan.</p>
            <p>Premium Seafood & Fish Restaurant Management Platform</p>
          </div>
        </div>
      </footer>

      {/* Blog Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-navy-900 border border-white/20 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-turquoise-500/20 text-turquoise-300 text-xs font-bold">
                {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center font-bold"
              >
                &times;
              </button>
            </div>
            <img src={selectedArticle.image} alt={selectedArticle.title} className="w-full h-56 object-cover rounded-2xl" />
            <h3 className="text-2xl font-bold text-white">{selectedArticle.title}</h3>
            <p className="text-xs text-slate-400">Sana: {selectedArticle.date} • Mutolaa: {selectedArticle.readTime}</p>
            <p className="text-sm text-slate-200 leading-relaxed">{selectedArticle.summary}</p>
            <p className="text-sm text-slate-300 leading-relaxed">{selectedArticle.content}</p>
            <div className="pt-4 border-t border-white/10 flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="px-5 py-2.5 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-bold text-xs"
              >
                Yopish
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

