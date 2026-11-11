# FISH HOUSE – Seafood Restaurant Platform (React JS + Tailwind CSS)

Professional baliq va dengiz mahsulotlari restorani boshqaruv platformasi.

Loyihada **React JS, Tailwind CSS, HTML5, JavaScript va React Hooks** texnologiyalaridan to'liq foydalanilgan.

---

## 📁 Loyiha Strukturasi (React JS Project Architecture)

```
baliq hona 1/
├── index.html              # Asosiy kirish nuqtasi (ham Vite, ham to'g'ridan-to'g'ri brauzerda ishlaydi)
├── standalone.html         # 100% mustaqil (zero-dependency) portativ versiya
├── package.json            # React 18, Vite va Tailwind CSS konfiguratsiyasi
├── vite.config.js          # Vite server sozlamalari
├── tailwind.config.js      # Ocean & Navy maxsus ranglar mavzusi
├── postcss.config.js       # CSS post-protsessor
├── src/
│   ├── main.jsx            # React ilovasining asosiy yuklovchisi
│   ├── App.jsx             # Asosiy React komponenti va state boshqaruvi
│   ├── index.css           # Tailwind va maxsus animatsiyalar, scrollbar, chek chop etish stillari
│   ├── data/
│   │   └── mockData.js     # 8 ta xona, 12 ta baliq taomi, buyurtmalar va rezervatsiyalar
│   ├── components/
│   │   └── Icons.jsx       # SVG vektor piktogrammalar to'plami (Fish, ChefHat, Receipt, etc.)
│   └── utils/
│       └── audio.js        # Web Audio API ovoz effektlari va UZS valyuta formatlash
└── README.md               # Texnik qo'llanma
```

---

## 🚀 Ishga Tushirishning 2 Xil Usuli

### 1-usul: React JS & Vite orqali (Tavsiya etiladi)
Loyiha papkasida terminalni ochib quyidagi buyruqlarni bajaring:

```bash
# 1. Bog'liqliklarni o'rnatish
npm install

# 2. Rivojlantirish serverini ishga tushirish (Hot Reload)
npm run dev
```
Brauzer avtomatik ravishda `http://localhost:3000` manzilida ochiladi.

---

### 2-usul: Hech qanday dastur o'rnatmasdan (To'g'ridan-to'g'ri)
Hech qanday Node.js yoki paket o'rnatish shart emas!
- [index.html](file:///c:/Users/user/Desktop/baliq%20hona%201/index.html) yoki [standalone.html](file:///c:/Users/user/Desktop/baliq%20hona%201/standalone.html) faylini sichqoncha bilan ikki marta bosib istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching.
- Platforma to'liq quvvatda ishlaydi.

---

## 🌟 Asosiy Xususiyatlar:
1. **Boshqaruv Paneli (Dashboard)**:
   - Jami xonalar, Bo'sh xonalar, **`ZANIT`** xonalar soni, Bugungi tushum (UZS), Jami taomlar.
   - Jonli xonalar holati monitori.
2. **Xonalar va Kabinetlar (Dining Rooms)**:
   - 8 ta xona kartasi: `BO'SH` (yashil), `BAND QILINGAN` (to'q sariq) va **`ZANIT`** (katta yorqin qizil nishon).
   - Filtrlash va qidiruv tizimi.
3. **Baliq Taomlari Menyusi (Food Menu)**:
   - 12 xil baliq taomi (Sudak, Forel, Sazan, Uxa sho'rva, Norvegiya Salmon steyki, Qarsildoq zog'ora, Som baliq, Assorti, Qisqichbaqalar, Osetrina).
   - Vazni (gramm) va real narxlari (UZS).
4. **Xona Tafsilotlari & Hisob-kitob (Room Bill)**:
   - Avtomatik formula: `Taomlar summasi + 10% xizmat haqi = Jami To'lov`.
   - **Chek Chop Etish (Print Bill)**: Rasmiy 80mm fiskal chek printeri ko'rinishida chiqarish.
   - To'lovni qabul qilish (Naqd, Karta, Click) va xonani bo'shatish.
5. **Rezervatsiya (Stol Band Qilish)**:
   - Sana, vaqt, mehmonlar soni va depozit bilan band qilish.
6. **Statistika va Hisobotlar**:
   - Kunlik tushum, o'rtacha chek va eng ko'p sotilgan baliq taomlari reytingi.

FISH HOUSE – Mazali baliq taomlari va qulay xizmat! 🐟
