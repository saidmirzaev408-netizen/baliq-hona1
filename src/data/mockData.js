export const INITIAL_DATA = {
  restaurant: {
    name: "FISH HOUSE",
    tagline: "Premium Seafood & Fish Restaurant",
    uzTagline: "Eng Sara Baliq va Dengiz Taomlari Restorani",
    address: "Toshkent sh., Chilonzor tumani, Dengiz ko'chasi, 7-uy",
    phone: "+998 (71) 200-88-99",
    telegram: "@fishhouse_uz",
    workingHours: "11:00 - 23:30",
    serviceChargePercent: 10,
    currency: "UZS"
  },
  rooms: [
    {
      id: "r101",
      number: "101",
      name: "Dengiz Marvaridi",
      subtitle: "Ocean Pearl VIP Hall",
      type: "VIP",
      seats: 12,
      capacityText: "10-12 kishi",
      status: "OCCUPIED",
      photo: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80",
      amenities: ["Dengiz Akvariumi", "Smart TV 75\"", "Konditsioner", "Wi-Fi 6", "VIP Xizmat", "Maxsus Ofitsiant"],
      floor: "1-qavat",
      description: "Haqiqiy dengiz marvaridi muhitidagi hashamatli VIP xona. Xonada ulkan tirik baliqli dengiz akvariumi va yuqori darajadagi akustik tizim o'rnatilgan.",
      customer: {
        name: "Alisher Qodirov",
        phone: "+998 90 123-45-67",
        guests: 8,
        checkInTime: "13:15",
        waiter: "Sardor Saidov",
        notes: "Mehmonlar xorijiy hamkorlar. Baliq yaxshilab qovurilsin."
      }
    },
    {
      id: "r102",
      number: "102",
      name: "Moviy To'lqin",
      subtitle: "Blue Wave Chamber",
      type: "Kabinet",
      seats: 8,
      capacityText: "6-8 kishi",
      status: "AVAILABLE",
      photo: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=900&q=80",
      amenities: ["Smart TV", "Konditsioner", "Fon Musiqasi", "Tezkor Wi-Fi"],
      floor: "1-qavat",
      description: "Moviy dengiz to'lqinlari tusidagi shinam kabinet. Do'stlar davrasi va kichik oilaviy kechki ovqatlar uchun juda qulay.",
      customer: null
    },
    {
      id: "r103",
      number: "103",
      name: "Liman Sohil",
      subtitle: "Harbour Lounge",
      type: "Lounge",
      seats: 6,
      capacityText: "4-6 kishi",
      status: "OCCUPIED",
      photo: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=900&q=80",
      amenities: ["Yumshoq Divanlar", "Konditsioner", "Tabiiy Yog'och Dizayn", "Wi-Fi"],
      floor: "1-qavat",
      description: "Tabiiy yog'och mebellari va sokin bandargoh muhitiga ega kofe-lounge kabinet. O'ta qulay yumshoq charm divanlar bilan jihozlangan.",
      customer: {
        name: "Bobur Mirzayev",
        phone: "+998 97 888-99-00",
        guests: 5,
        checkInTime: "13:40",
        waiter: "Jahongir Olimov",
        notes: "Achchiq sous alohida keltirilsin."
      }
    },
    {
      id: "r104",
      number: "104",
      name: "Atlantika Katta Zali",
      subtitle: "Atlantic Grand Banquet",
      type: "Banket Zali",
      seats: 24,
      capacityText: "18-24 kishi",
      status: "RESERVED",
      photo: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=900&q=80",
      amenities: ["Katta Proyektor", "Professional Karaoke", "2 ta Konditsioner", "Alohida Sanuzel", "VIP Stol"],
      floor: "2-qavat",
      description: "Katta tantanalar, yubileylar va korporativ baliq ziyofatlari uchun mo'ljallangan ulkan banket xonasi.",
      customer: null,
      reservation: {
        id: "res-104",
        name: "Nodira Karimova",
        phone: "+998 93 555-12-34",
        date: "Bugun (11 Noyabr)",
        time: "19:00",
        guests: 20,
        deposit: 500000,
        notes: "Tug'ilgan kun nishonlanadi. Stol bayramona bezatilsin."
      }
    },
    {
      id: "r105",
      number: "105",
      name: "Oltin Baliqcha",
      subtitle: "Golden Fish VIP Suite",
      type: "VIP",
      seats: 10,
      capacityText: "8-10 kishi",
      status: "AVAILABLE",
      photo: "https://images.unsplash.com/photo-1551632436-cbf8fc35adfe?auto=format&fit=crop&w=900&q=80",
      amenities: ["Zarhal Bezatish", "Konditsioner", "Smart TV", "Musiqa Markazi", "Wi-Fi"],
      floor: "2-qavat",
      description: "Sharqona zarhal elementlar va dengiz turkumi uyg'unlashgan muhtasham VIP salon. Muhim biznes uchrashuvlariga mos.",
      customer: null
    },
    {
      id: "r106",
      number: "106",
      name: "Marjon Qoyasi",
      subtitle: "Coral Reef Family Room",
      type: "Oilaviy",
      seats: 6,
      capacityText: "4-6 kishi",
      status: "AVAILABLE",
      photo: "https://images.unsplash.com/photo-1578474846511-04ba529f0b88?auto=format&fit=crop&w=900&q=80",
      amenities: ["Bolalar Stulchalari", "Rang-barang Akvarium", "Smart TV (Multfilmlar)", "Konditsioner"],
      floor: "1-qavat",
      description: "Oilaviy hordiq chiqarish va bolalar bilan tashrif buyuruvchilar uchun qulay, marjon rangidagi shinam xona.",
      customer: null
    },
    {
      id: "r107",
      number: "107",
      name: "Kaspiy Bo'yi",
      subtitle: "Caspian Traditional Cabin",
      type: "Kabinet",
      seats: 8,
      capacityText: "6-8 kishi",
      status: "OCCUPIED",
      photo: "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?auto=format&fit=crop&w=900&q=80",
      amenities: ["Milliy Tapchan & Stol", "Konditsioner", "Choy Marosimi To'plami", "Wi-Fi"],
      floor: "1-qavat",
      description: "Kaspiy dengizi an'anaviy baliqchi kulbasi uslubida yaratilgan, milliy qulaylik va xushbo'y choy anjomlari bilan to'ldirilgan kabinet.",
      customer: {
        name: "Farhod Yoqubov",
        phone: "+998 99 444-23-11",
        guests: 7,
        checkInTime: "12:50",
        waiter: "Aziz Qosimov",
        notes: "Choy ko'k bo'lsin, limon bilan."
      }
    },
    {
      id: "r108",
      number: "108",
      name: "Tinch Okean VIP",
      subtitle: "Pacific Luxury Suite",
      type: "VIP",
      seats: 16,
      capacityText: "12-16 kishi",
      status: "RESERVED",
      photo: "https://images.unsplash.com/photo-1590846406792-0adc7f938f1d?auto=format&fit=crop&w=900&q=80",
      amenities: ["Karaoke Studio", "Panorama Oyna", "Bar Stoykasi", "Smart TV 85\"", "Konditsioner"],
      floor: "2-qavat",
      description: "Tinch okeanining chuqur moviy jozibasi bilan bezatilgan premium darajadagi xona. Ovoz o'tkazmaydigan devorlar va professional karaoke tizimi.",
      customer: null,
      reservation: {
        id: "res-108",
        name: "Rustam Rahimov",
        phone: "+998 91 777-65-43",
        date: "Bugun (11 Noyabr)",
        time: "20:30",
        guests: 14,
        deposit: 1000000,
        notes: "Xorijiy delegatsiya bilan muzokara kechasi."
      }
    }
  ],
  dishes: [
    {
      id: "d1",
      name: "Qovurilgan Oq Baliq (Sudak)",
      name_ru: "Жареный Судак по-домашнему",
      name_en: "Pan-Fried Zander (Pike Perch)",
      category: "fried",
      categoryName: "Qovurilgan Baliq",
      price: 85000,
      weight: "500 gr",
      image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80",
      description: "Zarafshon daryosining toza sudak balig'i. Maxsus un va ziravorlarda oltinrang qarsildoq qilib qovurilgan, limon va ukrop sousi bilan tortiladi.",
      desc_ru: "Свежий судак из Зарафшана, обжаренный до хрустящей золотистой корочки в фирменных специях. Подается с лимоном и укропным соусом.",
      desc_en: "Fresh river zander fried to a crispy golden perfection in seasoned flour. Served with fresh lemon and creamy dill sauce.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "20-25 daqiqa",
      cookTime_ru: "20-25 минут",
      cookTime_en: "20-25 mins"
    },
    {
      id: "d2",
      name: "Grilda Pishirilgan Forel",
      name_ru: "Форель на Гриле с Розмарином",
      name_en: "Charcoal Grilled Mountain Trout",
      category: "grilled",
      categoryName: "Gril Baliq",
      price: 115000,
      weight: "450 gr",
      image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=700&q=80",
      description: "Bo'stonliq tog' irmoqlarining yangi uzilgan tog' foreli balig'i. Cho'g'da rozmarin, zaytun moyi va limon sharbati bilan nafis pishiriladi.",
      desc_ru: "Свежевыловленная горная форель Бостанлыка, запеченная на углях с розмарином, оливковым маслом и свежим лимонным соком.",
      desc_en: "Freshly caught mountain stream trout, grilled on embers with rosemary, extra virgin olive oil, and lemon juice.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "25-30 daqiqa",
      cookTime_ru: "25-30 минут",
      cookTime_en: "25-30 mins"
    },
    {
      id: "d3",
      name: "Tandirda Pishirilgan Sazan",
      name_ru: "Сазан Запеченный в Тандыре",
      name_en: "Tandoor Oven Baked Carp",
      category: "baked",
      categoryName: "Maxsus Taom",
      price: 95000,
      weight: "650 gr",
      image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=700&q=80",
      description: "An'anaviy tandirda maxsus o'tlar va anor donalari bilan dimlab pishirilgan xushbo'y sazan balig'i. Nihoyatda sersuv va mayin go'shtli.",
      desc_ru: "Ароматный сазан, запеченный в традиционном тандыре с пряными травами и зернами граната. Сочное и нежное мясо.",
      desc_en: "Aromatic wild carp baked inside an authentic clay tandoor with mountain herbs and pomegranate seeds. Incredibly tender and juicy.",
      status: "AVAILABLE",
      popular: false,
      cookTime: "30-35 daqiqa",
      cookTime_ru: "30-35 минут",
      cookTime_en: "30-35 mins"
    },
    {
      id: "d4",
      name: "Baliqli Qirollik Uxa Sho'rvasi",
      name_ru: "Царская Рыбная Уха со Специями",
      name_en: "Royal Fishermen's Ukha Soup",
      category: "soup",
      categoryName: "Baliq Sho'rva",
      price: 45000,
      weight: "400 gr",
      image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=700&q=80",
      description: "Uch xil baliq bulonida za'faron, yangi ko'katlar va butun baliq filesi bilan pishirilgan an'anaviy shifobaxsh sho'rva.",
      desc_ru: "Наваристая уха на тройном рыбном бульоне с шафраном, свежей зеленью и нежным филе речной рыбы.",
      desc_en: "Traditional rich triple-fish broth soup with wild herbs, saffron, and tender boneless fish fillets.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "15-20 daqiqa",
      cookTime_ru: "15-20 минут",
      cookTime_en: "15-20 mins"
    },
    {
      id: "d5",
      name: "Norvegiya Qizil Baliq Steyki (Salmon)",
      name_ru: "Стейк из Норвежского Лосося (Сёмга)",
      name_en: "Norwegian Salmon Steak",
      category: "special",
      categoryName: "Maxsus Taom",
      price: 165000,
      weight: "350 gr",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=700&q=80",
      description: "Haqiqiy Norvegiya syomga balig'i filesidan tayyorlangan premium steyk. Grilda sariyog' va limon sousi bilan qovuriladi.",
      desc_ru: "Премиальный сочный стейк из свежего норвежского лосося. Обжаривается на гриле со сливочно-лимонным соусом.",
      desc_en: "Premium Norwegian salmon steak grilled to perfection with creamy butter-lemon glaze and microgreens.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "20 daqiqa",
      cookTime_ru: "20 минут",
      cookTime_en: "20 mins"
    },
    {
      id: "d6",
      name: "Qarsildoq Zog'ora Baliq (Sazan)",
      name_ru: "Хрустящий Жареный Сазан",
      name_en: "Crispy Fried Golden Carp",
      category: "fried",
      categoryName: "Qovurilgan Baliq",
      price: 78000,
      weight: "600 gr",
      image: "https://images.unsplash.com/photo-1580476262798-bddd9f4b7369?auto=format&fit=crop&w=700&q=80",
      description: "O'zbekona uslubda maxsus qizil piyoz va oq sirka sousi bilan beriladigan qarsildoq qovurilgan zog'ora balig'i.",
      desc_ru: "Сазан по-восточному, обжаренный до хруста в казане. Подается с маринованным красным луком и зеленью.",
      desc_en: "Crispy fried carp served in traditional style with sliced sweet red onions and vinegar-herb drizzle.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "20-25 daqiqa",
      cookTime_ru: "20-25 минут",
      cookTime_en: "20-25 mins"
    },
    {
      id: "d7",
      name: "Grilda Limo Baliq (Som)",
      name_ru: "Нежный Сом на Углях",
      name_en: "BBQ Grilled Catfish Fillet",
      category: "grilled",
      categoryName: "Gril Baliq",
      price: 92000,
      weight: "500 gr",
      image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=700&q=80",
      description: "Suyaksiz mayin som go'shti, cho'g'da maxsus marinad qilinib anor sharbati va sumax sepib pishiriladi.",
      desc_ru: "Нежнейшее бескостное филе речного сома, маринованное в гранатовом соке и запеченное на открытом огне.",
      desc_en: "Boneless river catfish fillet marinated in wild pomegranate molasses and flame-grilled over coals.",
      status: "AVAILABLE",
      popular: false,
      cookTime: "25 daqiqa",
      cookTime_ru: "25 минут",
      cookTime_en: "25 mins"
    },
    {
      id: "d8",
      name: "Dengiz Baliq Kabobi",
      name_ru: "Шашлык из Филе Рыбы",
      name_en: "Fish Skewer Kebab",
      category: "grilled",
      categoryName: "Gril Baliq",
      price: 88000,
      weight: "350 gr",
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=700&q=80",
      description: "Sixga tizilgan shira to'la baliq lahm go'shti, pomidor va shirin bulg'or qalampiri bilan ochiq olovda qovuriladi.",
      desc_ru: "Сочный шашлык из филе белой рыбы на шампурах, обжаренный с томатами и сладким перцем на живом огне.",
      desc_en: "Succulent fish skewers alternated with cherry tomatoes and sweet bell peppers, grilled over open flames.",
      status: "AVAILABLE",
      popular: false,
      cookTime: "20 daqiqa",
      cookTime_ru: "20 минут",
      cookTime_en: "20 mins"
    },
    {
      id: "d9",
      name: "Qirollik Dengiz Assortisi",
      name_ru: "Царское Морское Ассорти",
      name_en: "Grand Royal Seafood Platter",
      category: "seafood",
      categoryName: "Dengiz Mahsulotlari",
      price: 340000,
      weight: "1200 gr",
      image: "https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=700&q=80",
      description: "Katta ziyofatlar uchun maxsus lagan: qovurilgan forel, qisqichbaqalar, kalmar halqalari, midiyalar va souslar to'plami.",
      desc_ru: "Праздничное блюдо для компании: жареная форель, тигровые креветки, кольца кальмара, мидии и набор авторских соусов.",
      desc_en: "Grand banquet feast: crispy trout, jumbo tiger prawns, calamari rings, mussels, and assorted chef dipping sauces.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "30-35 daqiqa",
      cookTime_ru: "30-35 минут",
      cookTime_en: "30-35 mins"
    },
    {
      id: "d10",
      name: "Qisqichbaqa Qovurmasi (Tiger Prawns)",
      name_ru: "Тигровые Креветки в Чесночном Масле",
      name_en: "Garlic Butter Tiger Prawns",
      category: "seafood",
      categoryName: "Dengiz Mahsulotlari",
      price: 140000,
      weight: "320 gr",
      image: "https://images.unsplash.com/photo-1559742811-822873691df8?auto=format&fit=crop&w=700&q=80",
      description: "Sariyog' va sarimsoqpiyoz bilan tavada qovurilgan yo'lbars qisqichbaqalari. Shirin chili sousi bilan tortiladi.",
      desc_ru: "Отборные тигровые креветки, обжаренные на сливочном масле с чесноком и белым вином. Подаются со сладким соусом чили.",
      desc_en: "Pan-seared jumbo tiger prawns in garlic herb butter sauce. Served with a side of sweet chili dip.",
      status: "AVAILABLE",
      popular: false,
      cookTime: "15 daqiqa",
      cookTime_ru: "15 минут",
      cookTime_en: "15 mins"
    },
    {
      id: "d11",
      name: "Osetrina / Oltin Baliqcha Maxsus",
      name_ru: "Фирменная Осетрина в Сливочном Соусе",
      name_en: "Chef's Sturgeon in Caviar Cream",
      category: "special",
      categoryName: "Maxsus Taom",
      price: 280000,
      weight: "800 gr",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=700&q=80",
      description: "Restoranning eng sara taomi: osetrina balig'i qaymoqli ikra sousida pishiriladi. Qirollarga munosib betakror ta'm.",
      desc_ru: "Коронное блюдо ресторана: осетрина, запеченная в нежном сливочно-икорном соусе. Изысканный деликатес.",
      desc_en: "The crown jewel of our menu: fresh royal sturgeon baked in a velvety caviar cream reduction.",
      status: "AVAILABLE",
      popular: true,
      cookTime: "35 daqiqa",
      cookTime_ru: "35 минут",
      cookTime_en: "35 mins"
    },
    {
      id: "d12",
      name: "Baxoriy Baliq Salati",
      name_ru: "Весенний Салат с Копченым Лососем",
      name_en: "Spring Smoked Salmon Salad",
      category: "soup",
      categoryName: "Salat & Qo'shimcha",
      price: 48000,
      weight: "300 gr",
      image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=700&q=80",
      description: "Dudlangan qizil baliq bo'laklari, yangi avokado, rukola va zaytun moyi bilan to'yintirilgan salqin salat.",
      desc_ru: "Легкий освежающий салат с ломтиками подкопченного лосося, авокадо, руколой и оливковой заправкой.",
      desc_en: "Crisp baby greens, avocado, and smoked salmon slices tossed in extra virgin olive oil vinaigrette.",
      status: "AVAILABLE",
      popular: false,
      cookTime: "10 daqiqa",
      cookTime_ru: "10 минут",
      cookTime_en: "10 mins"
    }
  ],
  roomOrders: {
    r101: [
      { id: "ord-1", dishId: "d1", name: "Qovurilgan Oq Baliq (Sudak)", price: 85000, quantity: 2, weight: "500 gr", time: "13:20", status: "completed" },
      { id: "ord-2", dishId: "d5", name: "Norvegiya Qizil Baliq Steyki (Salmon)", price: 165000, quantity: 2, weight: "350 gr", time: "13:20", status: "completed" },
      { id: "ord-3", dishId: "d4", name: "Baliqli Qirollik Uxa Sho'rvasi", price: 45000, quantity: 3, weight: "400 gr", time: "13:22", status: "completed" },
      { id: "ord-4", dishId: "d12", name: "Baxoriy Baliq Salati", price: 48000, quantity: 2, weight: "300 gr", time: "13:25", status: "completed" }
    ],
    r103: [
      { id: "ord-5", dishId: "d2", name: "Grilda Pishirilgan Forel", price: 115000, quantity: 2, weight: "450 gr", time: "13:45", status: "preparing" },
      { id: "ord-6", dishId: "d3", name: "Tandirda Pishirilgan Sazan", price: 95000, quantity: 1, weight: "650 gr", time: "13:45", status: "preparing" },
      { id: "ord-7", dishId: "d8", name: "Dengiz Baliq Kabobi", price: 88000, quantity: 2, weight: "350 gr", time: "13:48", status: "preparing" }
    ],
    r107: [
      { id: "ord-8", dishId: "d6", name: "Qarsildoq Zog'ora Baliq (Sazan)", price: 78000, quantity: 3, weight: "600 gr", time: "12:55", status: "pending" },
      { id: "ord-9", dishId: "d7", name: "Grilda Limo Baliq (Som)", price: 92000, quantity: 2, weight: "500 gr", time: "12:55", status: "pending" },
      { id: "ord-10", dishId: "d4", name: "Baliqli Qirollik Uxa Sho'rvasi", price: 45000, quantity: 4, weight: "400 gr", time: "12:58", status: "pending" }
    ]
  },
  reservations: [
    {
      id: "res-104",
      roomId: "r104",
      roomNumber: "104",
      roomName: "Atlantika Katta Zali",
      customerName: "Nodira Karimova",
      phone: "+998 93 555-12-34",
      date: "2026-11-11",
      displayDate: "Bugun",
      time: "19:00",
      guests: 20,
      deposit: 500000,
      notes: "Tug'ilgan kun tantanasi, dasturxonga mevalar va ichimliklar oldindan qo'yilsin.",
      status: "confirmed",
      createdAt: "2026-11-11 10:30"
    },
    {
      id: "res-108",
      roomId: "r108",
      roomNumber: "108",
      roomName: "Tinch Okean VIP",
      customerName: "Rustam Rahimov",
      phone: "+998 91 777-65-43",
      date: "2026-11-11",
      displayDate: "Bugun",
      time: "20:30",
      guests: 14,
      deposit: 1000000,
      notes: "Biznes muzokara kechki ovqati.",
      status: "confirmed",
      createdAt: "2026-11-11 11:15"
    },
    {
      id: "res-102",
      roomId: "r102",
      roomNumber: "102",
      roomName: "Moviy To'lqin",
      customerName: "Jamshid Temirov",
      phone: "+998 94 666-44-33",
      date: "2026-11-12",
      displayDate: "Ertaga",
      time: "18:00",
      guests: 6,
      deposit: 200000,
      notes: "Oila a'zolari bilan kechki ovqat.",
      status: "confirmed",
      createdAt: "2026-11-11 12:00"
    }
  ],
  salesHistory: [
    {
      id: "bill-1001",
      roomNumber: "105",
      roomName: "Oltin Baliqcha",
      customerName: "Shuhrat Bekmurodov",
      date: "2026-11-11",
      time: "12:30",
      items: [
        { name: "Norvegiya Qizil Baliq Steyki", quantity: 3, price: 165000 },
        { name: "Qirollik Dengiz Assortisi", quantity: 1, price: 340000 },
        { name: "Baliqli Qirollik Uxa Sho'rvasi", quantity: 3, price: 45000 }
      ],
      subtotal: 970000,
      serviceCharge: 97000,
      total: 1067000,
      paymentMethod: "Karta (Uzcard)"
    },
    {
      id: "bill-1002",
      roomNumber: "102",
      roomName: "Moviy To'lqin",
      customerName: "Davron Salimov",
      date: "2026-11-11",
      time: "11:45",
      items: [
        { name: "Qovurilgan Oq Baliq (Sudak)", quantity: 2, price: 85000 },
        { name: "Grilda Forel Baliq", quantity: 2, price: 110000 },
        { name: "Baxoriy Baliq Salati", quantity: 2, price: 48000 }
      ],
      subtotal: 486000,
      serviceCharge: 48600,
      total: 534600,
      paymentMethod: "Click"
    }
  ],
  staff: [
    {
      id: "st-101",
      name: "Jamshid Rustamov",
      role: "Bosh Oshpaz (Executive Chef)",
      roleType: "chef",
      phone: "+998 (90) 111-22-33",
      avatar: "https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=300&q=80",
      shift: "10:00 - 22:00",
      status: "active", // active, off, vacation
      salary: "12 000 000 UZS",
      assignedRooms: ["Oshxona Boshqaruvi", "Issiq Sex"],
      todayOrders: 34,
      rating: 4.9,
      experience: "15 yil"
    },
    {
      id: "st-102",
      name: "Sardor Saidov",
      role: "Katta Ofitsiant (Head Waiter)",
      roleType: "waiter",
      phone: "+998 (91) 222-33-44",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
      shift: "11:00 - 23:30",
      status: "active",
      salary: "5 500 000 UZS + %",
      assignedRooms: ["№101 Dengiz Marvaridi", "№104 Atlantika Katta Zali"],
      todayOrders: 18,
      rating: 4.8,
      experience: "5 yil"
    },
    {
      id: "st-103",
      name: "Malika Umarova",
      role: "Restoran Menejeri (Admin)",
      roleType: "admin",
      phone: "+998 (90) 444-55-66",
      avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&q=80",
      shift: "10:00 - 20:00",
      status: "active",
      salary: "8 000 000 UZS",
      assignedRooms: ["Barcha Zallar", "Rezervatsiyalar"],
      todayOrders: 27,
      rating: 5.0,
      experience: "7 yil"
    },
    {
      id: "st-104",
      name: "Jahongir Olimov",
      role: "Ofitsiant (Waiter)",
      roleType: "waiter",
      phone: "+998 (93) 333-44-55",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
      shift: "11:00 - 23:30",
      status: "active",
      salary: "4 800 000 UZS + %",
      assignedRooms: ["№103 Liman Sohil", "№105 Oltin Baliqcha"],
      todayOrders: 12,
      rating: 4.7,
      experience: "3 yil"
    },
    {
      id: "st-105",
      name: "Bekzod To'rayev",
      role: "Mangal & Gril Ustasi (Grill Chef)",
      roleType: "chef",
      phone: "+998 (94) 555-66-77",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
      shift: "12:00 - 23:00",
      status: "active",
      salary: "7 500 000 UZS",
      assignedRooms: ["Mangalhudud", "Ochiq Olov Sehi"],
      todayOrders: 22,
      rating: 4.9,
      experience: "8 yil"
    },
    {
      id: "st-106",
      name: "Gulbahor Yusupova",
      role: "Bosh Kassir (Head Cashier)",
      roleType: "cashier",
      phone: "+998 (97) 666-77-88",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
      shift: "11:00 - 23:30",
      status: "active",
      salary: "5 000 000 UZS",
      assignedRooms: ["Kassa & Terminal", "Hisob-Kitob"],
      todayOrders: 42,
      rating: 4.95,
      experience: "4 yil"
    },
    {
      id: "st-107",
      name: "Aziz Rahimov",
      role: "Kichik Ofitsiant (Junior Waiter)",
      roleType: "waiter",
      phone: "+998 (99) 777-88-99",
      avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80",
      shift: "16:00 - 23:30",
      status: "off",
      salary: "3 800 000 UZS",
      assignedRooms: ["№107 Kaspiy Bo'yi"],
      todayOrders: 0,
      rating: 4.6,
      experience: "1 yil"
    }
  ]
};

// Localize dish according to selected language (uz, ru, en)
export function getLocalizedDish(dish, lang = 'uz') {
  if (!dish) return dish;
  
  // If dish came from localStorage without translations, look up matching master dish
  const master = INITIAL_DATA.dishes.find(d => d.id === dish.id || d.name === dish.name) || {};
  const nameRu = dish.name_ru || master.name_ru || dish.name;
  const descRu = dish.desc_ru || master.desc_ru || dish.description;
  const cookRu = dish.cookTime_ru || master.cookTime_ru || dish.cookTime;

  const nameEn = dish.name_en || master.name_en || dish.name;
  const descEn = dish.desc_en || master.desc_en || dish.description;
  const cookEn = dish.cookTime_en || master.cookTime_en || dish.cookTime;

  if (lang === 'ru') {
    return {
      ...dish,
      name: nameRu,
      description: descRu,
      cookTime: cookRu
    };
  }
  if (lang === 'en') {
    return {
      ...dish,
      name: nameEn,
      description: descEn,
      cookTime: cookEn
    };
  }
  return dish;
}

export const ROOM_TRANSLATIONS = {
  r101: {
    ru: { name: "Морская Жемчужина", subtitle: "Ocean Pearl VIP Зал", type: "VIP Зал", capacityText: "10-12 персон", description: "Роскошный VIP-зал с атмосферой морской жемчужины. Оснащен огромным морским аквариумом с живой рыбой и премиальной акустикой." },
    en: { name: "Ocean Pearl", subtitle: "Ocean Pearl VIP Hall", type: "VIP Hall", capacityText: "10-12 guests", description: "Luxurious VIP hall enveloped in an oceanic atmosphere. Features a giant live marine aquarium and high-end surround sound." }
  },
  r102: {
    ru: { name: "Синяя Волна", subtitle: "Кабинет Синяя Волна", type: "Кабинет", capacityText: "6-8 персон", description: "Уютный кабинет в лазурных морских тонах. Идеально для отдыха в кругу близких друзей и семейных ужинов." },
    en: { name: "Blue Wave", subtitle: "Blue Wave Chamber", type: "Chamber", capacityText: "6-8 guests", description: "Cozy private room styled in soothing ocean blue tones. Excellent for intimate gatherings and family seafood dinners." }
  },
  r103: {
    ru: { name: "Лиман Причал", subtitle: "Harbour Лаунж", type: "Лаунж", capacityText: "4-6 персон", description: "Лаунж-кабинет с отделкой из натурального дерева в атмосфере тихого причала. Оснащен мягкими кожаными диванами." },
    en: { name: "Harbour Lounge", subtitle: "Harbour Seaside Lounge", type: "Lounge", capacityText: "4-6 guests", description: "Natural timber finishes and tranquil marina ambiance. Equipped with plush premium leather sofas." }
  },
  r104: {
    ru: { name: "Большой Зал Атлантика", subtitle: "Банкетный Зал Атлантика", type: "Банкетный Зал", capacityText: "18-24 персон", description: "Просторный банкетный зал для больших торжеств, юбилеев и корпоративных рыбных пиршеств." },
    en: { name: "Atlantic Grand Banquet", subtitle: "Atlantic Grand Banquet", type: "Banquet Hall", capacityText: "18-24 guests", description: "Expansive banquet hall tailored for grand celebrations, anniversaries, and lavish corporate seafood banquets." }
  },
  r105: {
    ru: { name: "Золотая Рыбка", subtitle: "Golden Fish VIP Апартаменты", type: "VIP Зал", capacityText: "8-10 персон", description: "Величественный VIP-зал, сочетающий восточную позолоту и морские мотивы. Прекрасно подходит для важных деловых встреч." },
    en: { name: "Golden Fish", subtitle: "Golden Fish VIP Suite", type: "VIP Suite", capacityText: "8-10 guests", description: "Stately VIP parlor blending golden oriental artistry with oceanic grandeur. Suited for VIP executive meetings." }
  },
  r106: {
    ru: { name: "Коралловый Риф", subtitle: "Семейный Зал Коралловый Риф", type: "Семейный Зал", capacityText: "4-6 персон", description: "Уютный зал в коралловых тонах для семейного отдыха и гостей с детьми." },
    en: { name: "Coral Reef", subtitle: "Coral Reef Family Room", type: "Family Room", capacityText: "4-6 guests", description: "Warm and inviting coral-hued chamber crafted for families with young children." }
  },
  r107: {
    ru: { name: "Каспийский Берег", subtitle: "Традиционный Кабинет Каспий", type: "Кабинет", capacityText: "6-8 персон", description: "Кабинет в традиционном стиле каспийских рыбаков с топчаном и набором для чайной церемонии." },
    en: { name: "Caspian Cabin", subtitle: "Caspian Traditional Cabin", type: "Cabin", capacityText: "6-8 guests", description: "Traditional Caspian fisherman retreat with tapchan seating and an artisan tea ceremony set." }
  },
  r108: {
    ru: { name: "Тихий Океан VIP", subtitle: "Pacific Luxury Апартаменты", type: "VIP Зал", capacityText: "12-16 персон", description: "Премиальный зал с глубоким тихоокеанским колоритом, панорамным окном и профессиональной системой караоке." },
    en: { name: "Pacific Ocean VIP", subtitle: "Pacific Luxury Suite", type: "VIP Suite", capacityText: "12-16 guests", description: "Top-tier private retreat featuring soundproof acoustic isolation, panoramic glazing, and studio karaoke." }
  }
};

export function getLocalizedRoom(room, lang = 'uz') {
  if (!room) return room;
  const trans = ROOM_TRANSLATIONS[room.id] && ROOM_TRANSLATIONS[room.id][lang];
  if (trans) {
    return {
      ...room,
      name: trans.name,
      subtitle: trans.subtitle,
      type: trans.type,
      capacityText: trans.capacityText,
      description: trans.description
    };
  }
  return room;
}

export function getLocalizedStaff(member, lang = 'uz') {
  if (!member) return member;
  if (lang === 'ru') {
    const roleRu = member.roleType === 'waiter' ? 'Официант' :
      member.roleType === 'chef' ? 'Повар' :
      member.roleType === 'admin' ? 'Администратор' :
      member.roleType === 'cashier' ? 'Кассир' : member.role;
    return { ...member, role: `${roleRu} (${member.shift})` };
  }
  if (lang === 'en') {
    const roleEn = member.roleType === 'waiter' ? 'Waiter' :
      member.roleType === 'chef' ? 'Chef' :
      member.roleType === 'admin' ? 'Manager' :
      member.roleType === 'cashier' ? 'Cashier' : member.role;
    return { ...member, role: `${roleEn} (${member.shift})` };
  }
  return member;
}

