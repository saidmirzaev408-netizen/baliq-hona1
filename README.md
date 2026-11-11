# FISH HOUSE – Seafood Restaurant Platform (React JS + Tailwind CSS)

Professional baliq va dengiz mahsulotlari restorani boshqaruv platformasi hamda mijozlar uchun zamonaviy Landing sahifasi.

Loyihada **React JS, Tailwind CSS, HTML5, JavaScript va React Hooks** texnologiyalaridan to'liq foydalanilgan.

---

## 📁 Loyiha Strukturasi (React JS Project Architecture)

```
baliq hona 1/
├── landing.html              # 🌐 Mijozlar uchun Landing Sahifa (Yog'ochli fon, uchuvchi masalliqlar, kategoriyalar, blog, sharhlar)
├── index.html                # 🏢 Restoran Boshqaruv Tizimi (Admin POS, Xonalar, Jonli ZANIT holatlari, Chek chiqarish)
├── standalone.html           # 100% mustaqil zaxira versiya
├── data.js                   # Barcha xonalar, taomlar va dastlabki buyurtmalar
├── app.js                    # POS boshqaruv ilovasi kodi
├── package.json              # React 18, Vite va Tailwind CSS konfiguratsiyasi
├── vite.config.js            # Vite server sozlamalari (port 3000)
├── tailwind.config.js        # Ocean, Navy, Turquoise va Gold maxsus ranglar mavzusi
├── postcss.config.js         # CSS post-protsessor
├── src/
│   ├── main.jsx              # React ilovasining asosiy yuklovchisi
│   ├── App.jsx               # Asosiy React komponenti (Admin POS va Landing Page o'rtasida 1-klikda o'tish)
│   ├── index.css             # Tailwind va maxsus animatsiyalar, scrollbar, chek chop etish stillari
│   ├── data/
│   │   └── mockData.js       # 8 ta xona, 12 ta baliq taomi, buyurtmalar va rezervatsiyalar
│   ├── components/
│   │   ├── LandingPageView.jsx # Mijozlar uchun zamonaviy Landing sahifa (Siz yuklagan rasm asosida!)
│   │   ├── AuthView.jsx        # Login & Register (Kirish va Ro'yxatdan o'tish modali + 1-klikli demo akkauntlar)
│   │   └── Icons.jsx           # SVG vektor piktogrammalar to'plami (Fish, ChefHat, Receipt, etc.)
│   └── utils/
│       └── audio.js          # Web Audio API ovoz effektlari va UZS valyuta formatlash
└── README.md                 # Texnik qo'llanma
```

---

## 🚀 Ishga Tushirishning 2 Xil Usuli

### 1-usul: Hech qanday dastur o'rnatmasdan (To'g'ridan-to'g'ri 2 marta bosib ochish)
Hech qanday Node.js yoki paket o'rnatish shart emas!
- **Mijozlar Landing Sahifasi:** [landing.html](file:///c:/Users/user/Desktop/baliq%20hona%201/landing.html) faylini sichqoncha bilan 2 marta bosing.
- **Admin Boshqaruv Paneli & POS:** [index.html](file:///c:/Users/user/Desktop/baliq%20hona 1/index.html) faylini sichqoncha bilan 2 marta bosing.
- Ikkala sahifadan ham yuqori menyudagi tugma orqali bir-biriga erkin o'tish mumkin.

---

### 2-usul: React JS & Vite orqali (Keng qamrovli dasturchilar uchun)
Loyiha papkasida terminalni ochib quyidagi buyruqlarni bajaring:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Rivojlantirish serverini ishga tushirish (Hot Reload)
npm run dev
```
Brauzer avtomatik ravishda `http://localhost:3000` manzilida ochiladi.

---

## 🌟 Siz Yuklagan Dizayn Asosidagi Xususiyatlar:

1. **Yog'ochli fon & Uchuvchi masalliqlar (Hero Banner)**:
   - To'q yog'och fakturali hashamatli fon.
   - Jonli uchuvchi limon (🍋), pomidor (🍅), rozmarin (🌿), qo'ziqorin (🍄) va qalampir (🌶️) animatsiyalari.
   - Ulkan baliq lagani va aylanuvchi **`-40% MAXSUS CHEGIRMA`** nishoni.
   - *"Haqiqiy Asil Baliq Ta'mi"* shiori va yashil yaltiroq *"Hoziroq Buyurtma Berish"* tugmasi.
   - 3 slaydli karusel tugmachalari.

2. **Dumaloq Menyular Qatori (Circular Categories)**:
   - 🐟 Barchasi
   - 🍳 Qovurilgan Baliq
   - 🔥 Gril & Mangal
   - 🍲 Baliq Sho'rva (Uxa)
   - 🥘 Dimlama Baliq
   - 🦐 Dengiz Mahsulotlari
   - 🍢 Baliq Kabob
   - 🥗 Sarxil Salatlar
   - 🍹 Sovuq Ichimliklar

3. **Ommabop Baliq Taomlari (Bestsellers)**:
   - Har bir taom uchun gramm og'irligi, real UZS narxi va *"Buyurtma"* tugmasi.

4. **VIP Xonalar & Jonli "ZANIT" Holati**:
   - Band bo'lgan xonalarda yirik qizil pulsatsiyalanuvchi **`ZANIT`** yorlig'i.
   - Bo'sh xonalarda yashil **`BO'SH`** va to'g'ridan-to'g'ri **`Xonani Band Qilish`** tugmasi.

5. **Oshpazimiz Blogi & Yangiliklar (Culinary Blog)**:
   - Rasmga mos ravishda 3 ta maqola kartochkalari va to'liq o'qish modali.

6. **Mijozlarimiz Biz Haqimizda Nima Deydi? (Testimonials)**:
   - 5 yulduzli baho, mijoz surati va samimiy fikrlar bilan iliq oltinrang kartochkalar.

7. **Xabarnomaga Obuna Bo'lish (Newsletter)**:
   - Maxsus chegirmalarga tezkor obuna bo'lish formasi.

8. **Kirish & Ro'yxatdan O'tish (Login & Register)**:
   - Administrator, Ofitsiant, Bosh Oshpaz va Mijoz rollari uchun 1-bosishda demo kirish.
