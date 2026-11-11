import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_DATA } from './data/mockData';
import { AudioService, formatUZS } from './utils/audio';
import { Icons } from './components/Icons';
import AuthView from './components/AuthView';
import LandingPageView from './components/LandingPageView';
import { FishHouseLogo } from './components/FishHouseLogo';

export default function App() {
  const initialData = useMemo(() => {
    try {
      const saved = localStorage.getItem('FISH_HOUSE_APP_STATE_V1');
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return INITIAL_DATA;
  }, []);

  const [rooms, setRooms] = useState(initialData.rooms || []);
  const [dishes, setDishes] = useState(initialData.dishes || []);
  const [roomOrders, setRoomOrders] = useState(initialData.roomOrders || {});
  const [reservations, setReservations] = useState(initialData.reservations || []);
  const [salesHistory, setSalesHistory] = useState(initialData.salesHistory || []);
  const [settings, setSettings] = useState(initialData.restaurant || {
    name: "FISH HOUSE",
    address: "Toshkent sh., Chilonzor tumani, Dengiz ko'chasi, 7-uy",
    phone: "+998 (71) 200-88-99",
    telegram: "@fishhouse_uz",
    workingHours: "11:00 - 23:30",
    serviceChargePercent: 10,
    currency: "UZS"
  });

  // Current authenticated user
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const u = localStorage.getItem('FISH_HOUSE_ACTIVE_USER');
      if (u) return JSON.parse(u);
    } catch (e) { }
    return { name: "Administrator", email: "admin@fishhouse.uz", role: "admin", phone: "+998 71 200-88-99" };
  });

  const [showAuthModal, setShowAuthModal] = useState(false);

  // App View Mode: 'admin' (Restaurant POS Management) or 'portal' (Customer Landing Page)
  const [viewMode, setViewMode] = useState('admin');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState('r101');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Filters and searches
  const [roomFilter, setRoomFilter] = useState('ALL');
  const [roomSearch, setRoomSearch] = useState('');
  const [menuFilter, setMenuFilter] = useState('ALL');
  const [menuSearch, setMenuSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL');
  const [reportPeriod, setReportPeriod] = useState('daily');
  const [promoInput, setPromoInput] = useState({});

  // Discount Promo Codes per room
  const [appliedDiscounts, setAppliedDiscounts] = useState({});

  // Modals state
  const [orderModal, setOrderModal] = useState({ isOpen: false, dish: null, targetRoomId: '' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, targetRoomId: '' });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, room: null });
  const [receiptModal, setReceiptModal] = useState({ isOpen: false, billData: null });
  const [checkInModal, setCheckInModal] = useState({ isOpen: false, room: null });
  const [transferModal, setTransferModal] = useState({ isOpen: false, sourceRoomId: '' });
  const [addRoomModal, setAddRoomModal] = useState(false);
  const [addDishModal, setAddDishModal] = useState(false);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (type === 'success') AudioService.playSuccess();
    else if (type === 'order') AudioService.playOrder();
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  useEffect(() => {
    AudioService.enabled = soundEnabled;
  }, [soundEnabled]);

  useEffect(() => {
    try {
      localStorage.setItem('FISH_HOUSE_APP_STATE_V1', JSON.stringify({
        rooms, dishes, roomOrders, reservations, salesHistory, restaurant: settings
      }));
    } catch (e) { }
  }, [rooms, dishes, roomOrders, reservations, salesHistory, settings]);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    try {
      localStorage.setItem('FISH_HOUSE_ACTIVE_USER', JSON.stringify(user));
    } catch (e) { }
    showToast(`Xush kelibsiz, ${user.name}! (${user.role ? user.role.toUpperCase() : 'USER'})`, 'success');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem('FISH_HOUSE_ACTIVE_USER');
    } catch (e) { }
    showToast("Tizimdan chiqildi", 'info');
  };

  const calcRoomSubtotal = (roomId) => {
    const orders = roomOrders[roomId] || [];
    return orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calcRoomDiscount = (roomId) => {
    const sub = calcRoomSubtotal(roomId);
    const pct = appliedDiscounts[roomId] || 0;
    return Math.round(sub * (pct / 100));
  };

  const calcRoomService = (roomId) => {
    const sub = calcRoomSubtotal(roomId) - calcRoomDiscount(roomId);
    return Math.round(Math.max(0, sub) * ((settings.serviceChargePercent || 10) / 100));
  };

  const calcRoomTotal = (roomId) => {
    const sub = calcRoomSubtotal(roomId);
    const disc = calcRoomDiscount(roomId);
    const serv = calcRoomService(roomId);
    return Math.max(0, sub - disc + serv);
  };

  const metrics = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
    const reservedRooms = rooms.filter(r => r.status === 'RESERVED').length;

    const pastRev = salesHistory.reduce((acc, curr) => acc + (curr.total || 0), 0);
    const liveRev = rooms
      .filter(r => r.status === 'OCCUPIED')
      .reduce((acc, r) => acc + calcRoomTotal(r.id), 0);
    const todayRevenue = pastRev + liveRev;

    let totalFoodOrders = 0;
    Object.values(roomOrders).forEach(orders => {
      totalFoodOrders += orders.reduce((acc, o) => acc + o.quantity, 0);
    });

    return {
      totalRooms, availableRooms, occupiedRooms, reservedRooms, todayRevenue, totalFoodOrders
    };
  }, [rooms, roomOrders, salesHistory, settings, appliedDiscounts]);

  const handleOpenRoomDetails = (roomId) => {
    AudioService.playClick();
    setSelectedRoomId(roomId);
    setActiveTab('room-detail');
  };

  const handleOpenPayment = (room) => {
    AudioService.playClick();
    setPaymentModal({ isOpen: true, room });
  };

  const handleUpdateRoomStatus = (roomId, newStatus) => {
    AudioService.playClick();
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        let updatedCustomer = r.customer;
        if (newStatus === 'AVAILABLE') updatedCustomer = null;
        else if (newStatus === 'OCCUPIED' && !r.customer) {
          updatedCustomer = {
            name: "Yangi Mehmon",
            phone: "+998 90 000-00-00",
            guests: r.seats,
            checkInTime: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            waiter: currentUser ? currentUser.name : "Navbatchi Ofitsiant"
          };
        }
        return { ...r, status: newStatus, customer: updatedCustomer };
      }
      return r;
    }));
    showToast(`Xona holati "${newStatus === 'OCCUPIED' ? 'ZANIT' : newStatus === 'AVAILABLE' ? 'BO\'SH' : 'BAND QILINGAN'}" ga o'zgartirildi!`);
  };

  const handleCheckInGuest = (roomId, guestData) => {
    setRooms(prev => prev.map(r => {
      if (r.id === roomId) {
        return {
          ...r,
          status: 'OCCUPIED',
          customer: {
            name: guestData.name || 'Hurmatli Mehmon',
            phone: guestData.phone || '+998 90 000-00-00',
            guests: Number(guestData.guests) || r.seats,
            checkInTime: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            waiter: guestData.waiter || (currentUser ? currentUser.name : 'Ofitsiant'),
            notes: guestData.notes || ''
          }
        };
      }
      return r;
    }));
    setCheckInModal({ isOpen: false, room: null });
    showToast("Xona ochildi va ZANIT holatiga o'tkazildi!", 'success');
  };

  const handleAddFoodToRoom = (roomId, dish, quantity = 1, notes = '') => {
    AudioService.playOrder();
    const newOrderItem = {
      id: 'ord-' + Date.now(),
      dishId: dish.id,
      name: dish.name,
      price: dish.price,
      quantity: Number(quantity),
      weight: dish.weight || (dish.weightGrams ? `${dish.weightGrams} gr` : '450 gr'),
      notes: notes,
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      status: 'pending'
    };

    setRoomOrders(prev => {
      const currentList = prev[roomId] ? [...prev[roomId]] : [];
      const existingIdx = currentList.findIndex(item => item.dishId === dish.id && !item.notes && !notes);
      if (existingIdx >= 0) {
        currentList[existingIdx] = {
          ...currentList[existingIdx],
          quantity: currentList[existingIdx].quantity + Number(quantity)
        };
      } else {
        currentList.push(newOrderItem);
      }
      return { ...prev, [roomId]: currentList };
    });

    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom && targetRoom.status === 'AVAILABLE') {
      handleUpdateRoomStatus(roomId, 'OCCUPIED');
    }

    setOrderModal({ isOpen: false, dish: null, targetRoomId: '' });
    showToast(`${dish.name} (${quantity} dona) buyurtmaga qo'shildi!`, 'order');
  };

  const handleUpdateOrderItemQty = (roomId, orderItemId, delta) => {
    AudioService.playClick();
    setRoomOrders(prev => {
      const list = prev[roomId] || [];
      const updated = list.map(item => {
        if (item.id === orderItemId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
      return { ...prev, [roomId]: updated };
    });
  };

  const handleRemoveOrderItem = (roomId, orderItemId) => {
    AudioService.playClick();
    setRoomOrders(prev => {
      const list = prev[roomId] || [];
      return { ...prev, [roomId]: list.filter(item => item.id !== orderItemId) };
    });
    showToast("Taom olib tashlandi", 'info');
  };

  const handleUpdateOrderStatus = (roomId, orderItemId, newStatus) => {
    AudioService.playClick();
    setRoomOrders(prev => {
      const list = prev[roomId] || [];
      const updated = list.map(item => item.id === orderItemId ? { ...item, status: newStatus } : item);
      return { ...prev, [roomId]: updated };
    });
    showToast(`Buyurtma holati: ${newStatus.toUpperCase()}`, 'success');
  };

  const handleApplyPromo = (roomId, code) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'BALIQ10' || cleanCode === 'FISH10') {
      setAppliedDiscounts(prev => ({ ...prev, [roomId]: 10 }));
      showToast("10% maxsus chegirma qo'llandi!", 'success');
    } else if (cleanCode === 'VIP20' || cleanCode === 'MARVARID20') {
      setAppliedDiscounts(prev => ({ ...prev, [roomId]: 20 }));
      showToast("20% VIP chegirma qo'llandi!", 'success');
    } else if (cleanCode === 'OMAD' || cleanCode === 'CHEF15') {
      setAppliedDiscounts(prev => ({ ...prev, [roomId]: 15 }));
      showToast("15% Chef chegirmasi qo'llandi!", 'success');
    } else {
      showToast("Noto'g'ri promokod. Sinab ko'ring: BALIQ10, VIP20, CHEF15", 'info');
    }
  };

  const handleTransferTable = (sourceRoomId, targetRoomId) => {
    if (!sourceRoomId || !targetRoomId || sourceRoomId === targetRoomId) return;
    const sourceRoom = rooms.find(r => r.id === sourceRoomId);
    const targetRoom = rooms.find(r => r.id === targetRoomId);
    if (!sourceRoom || !targetRoom) return;

    const sourceOrders = roomOrders[sourceRoomId] || [];

    setRoomOrders(prev => {
      const copy = { ...prev };
      copy[targetRoomId] = [...(copy[targetRoomId] || []), ...sourceOrders];
      delete copy[sourceRoomId];
      return copy;
    });

    setRooms(prev => prev.map(r => {
      if (r.id === targetRoomId) {
        return {
          ...r,
          status: 'OCCUPIED',
          customer: sourceRoom.customer || { name: 'Ko\'chirilgan Mehmon', phone: '', checkInTime: '13:00' }
        };
      }
      if (r.id === sourceRoomId) {
        return {
          ...r,
          status: 'AVAILABLE',
          customer: null,
          reservation: null
        };
      }
      return r;
    }));

    setTransferModal({ isOpen: false, sourceRoomId: '' });
    setSelectedRoomId(targetRoomId);
    showToast(`Buyurtma №${sourceRoom.number} dan №${targetRoom.number} xonasiga ko'chirildi!`, 'success');
  };

  const handleCreateReservation = (reservationData) => {
    const newRes = {
      id: 'res-' + Date.now(),
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('uz-UZ')
    };

    setReservations(prev => [newRes, ...prev]);
    setRooms(prev => prev.map(r => r.id === reservationData.roomId ? { ...r, status: 'RESERVED', reservation: newRes } : r));
    setBookingModal({ isOpen: false, targetRoomId: '' });
    showToast(`Xona №${reservationData.roomNumber} muvaffaqiyatli band qilindi!`, 'success');
  };

  const handleSeatReservation = (reservation) => {
    AudioService.playSuccess();
    setRooms(prev => prev.map(r => {
      if (r.id === reservation.roomId) {
        return {
          ...r,
          status: 'OCCUPIED',
          customer: {
            name: reservation.customerName,
            phone: reservation.phone,
            guests: reservation.guests,
            checkInTime: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
            waiter: currentUser ? currentUser.name : "Sardor Saidov",
            notes: reservation.notes
          },
          reservation: null
        };
      }
      return r;
    }));
    setReservations(prev => prev.map(res => res.id === reservation.id ? { ...res, status: 'seated' } : res));
    showToast(`Mehmon ${reservation.customerName} joylashtirildi! Xona: ZANIT`, 'success');
  };

  const handleCancelReservation = (reservationId) => {
    const res = reservations.find(r => r.id === reservationId);
    if (!res) return;
    setReservations(prev => prev.filter(r => r.id !== reservationId));
    setRooms(prev => prev.map(r => r.id === res.roomId && r.status === 'RESERVED' ? { ...r, status: 'AVAILABLE', reservation: null } : r));
    showToast("Bandlik bekor qilindi", 'info');
  };

  const handleConfirmPayment = (room, paymentMethod = "Naqd") => {
    AudioService.playCash();
    const orders = roomOrders[room.id] || [];
    const subtotal = calcRoomSubtotal(room.id);
    const serviceCharge = calcRoomService(room.id);
    const total = calcRoomTotal(room.id);

    const newBill = {
      id: 'bill-' + Date.now().toString().slice(-4),
      roomNumber: room.number,
      roomName: room.name,
      customerName: room.customer ? room.customer.name : 'Mijoz',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      items: orders.map(o => ({
        name: o.name,
        quantity: o.quantity,
        price: o.price,
        subtotal: o.price * o.quantity
      })),
      subtotal,
      serviceCharge,
      total,
      paymentMethod
    };

    setSalesHistory(prev => [newBill, ...prev]);
    setRoomOrders(prev => {
      const copy = { ...prev };
      delete copy[room.id];
      return copy;
    });

    setRooms(prev => prev.map(r => r.id === room.id ? { ...r, status: 'AVAILABLE', customer: null, reservation: null } : r));
    setPaymentModal({ isOpen: false, room: null });
    setReceiptModal({ isOpen: true, billData: newBill });
    showToast(`To'lov qabul qilindi: ${formatUZS(total)}. Xona BO'SH holatiga o'tdi!`, 'success');
  };

  const handlePrintCurrentRoomBill = (room) => {
    AudioService.playClick();
    const orders = roomOrders[room.id] || [];
    const subtotal = calcRoomSubtotal(room.id);
    const serviceCharge = calcRoomService(room.id);
    const total = calcRoomTotal(room.id);

    const billData = {
      id: 'chk-' + Math.floor(1000 + Math.random() * 9000),
      roomNumber: room.number,
      roomName: room.name,
      customerName: room.customer ? room.customer.name : 'Mijoz',
      waiter: room.customer ? room.customer.waiter : 'Ofitsiant',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
      items: orders.map(o => ({
        name: o.name,
        quantity: o.quantity,
        price: o.price,
        subtotal: o.price * o.quantity
      })),
      subtotal,
      serviceCharge,
      total,
      paymentMethod: 'Hisob-faktura (To\'lanmagan)'
    };

    setReceiptModal({ isOpen: true, billData });
  };

  const handleResetDemoData = () => {
    if (window.confirm("Barcha ma'lumotlarni boshlang'ich holatga qaytarmoqchimisiz?")) {
      localStorage.removeItem('FISH_HOUSE_APP_STATE_V1');
      setRooms(INITIAL_DATA.rooms);
      setDishes(INITIAL_DATA.dishes);
      setRoomOrders(INITIAL_DATA.roomOrders);
      setReservations(INITIAL_DATA.reservations);
      setSalesHistory(INITIAL_DATA.salesHistory);
      setSettings(INITIAL_DATA.restaurant);
      setAppliedDiscounts({});
      showToast("Namunaviy ma'lumotlar to'liq tiklandi!", 'success');
    }
  };

  const handleAddNewRoom = (roomData) => {
    const newRoom = {
      id: 'r' + Date.now().toString().slice(-4),
      number: roomData.number,
      name: roomData.name,
      subtitle: roomData.subtitle || `${roomData.name} Zali`,
      type: roomData.type || 'VIP',
      seats: Number(roomData.seats) || 8,
      capacityText: `${roomData.seats} kishi`,
      status: 'AVAILABLE',
      photo: roomData.photo || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=900&q=80',
      amenities: ['Smart TV', 'Konditsioner', 'Wi-Fi'],
      floor: roomData.floor || '1-qavat',
      description: roomData.description || 'Yangi shinam restoran xonasi.',
      customer: null
    };
    setRooms(prev => [...prev, newRoom]);
    setAddRoomModal(false);
    showToast(`Yangi xona №${newRoom.number} muvaffaqiyatli qo'shildi!`, 'success');
  };

  const handleDeleteRoom = (roomId) => {
    const r = rooms.find(item => item.id === roomId);
    if (!r) return;
    if (window.confirm(`Haqiqatan ham №${r.number} – ${r.name} xonasini o'chirmoqchimisiz?`)) {
      setRooms(prev => prev.filter(item => item.id !== roomId));
      showToast(`№${r.number} xonasi o'chirildi`, 'info');
    }
  };

  const handleAddNewDish = (dishData) => {
    const newDish = {
      id: 'd' + Date.now().toString().slice(-4),
      name: dishData.name,
      category: dishData.category || 'fried',
      categoryName: dishData.category === 'grilled' ? 'Gril Baliq' : dishData.category === 'soup' ? 'Baliq Sho\'rva' : 'Qovurilgan Baliq',
      price: Number(dishData.price) || 85000,
      weight: dishData.weight ? `${dishData.weight} gr` : '500 gr',
      image: dishData.image || 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=700&q=80',
      description: dishData.description || 'Sara ziravorlar bilan tayyorlangan shohona taom.',
      status: 'AVAILABLE',
      popular: false,
      cookTime: '20-25 daqiqa'
    };
    setDishes(prev => [newDish, ...prev]);
    setAddDishModal(false);
    showToast(`Yangi taom "${newDish.name}" menyuga qo'shildi!`, 'success');
  };

  const handleDeleteDish = (dishId) => {
    const d = dishes.find(item => item.id === dishId);
    if (!d) return;
    if (window.confirm(`"${d.name}" taomini menyudan o'chirmoqchimisiz?`)) {
      setDishes(prev => prev.filter(item => item.id !== dishId));
      showToast(`Taom o'chirildi`, 'info');
    }
  };

  // Filtered rooms
  const filteredRooms = rooms.filter(r => {
    const matchesFilter = roomFilter === 'ALL' || r.status === roomFilter;
    const matchesSearch = !roomSearch ||
      r.number.toLowerCase().includes(roomSearch.toLowerCase()) ||
      r.name.toLowerCase().includes(roomSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Filtered dishes
  const filteredDishes = dishes.filter(d => {
    const matchesCat = menuFilter === 'ALL' || d.category === menuFilter;
    const matchesSearch = !menuSearch ||
      d.name.toLowerCase().includes(menuSearch.toLowerCase()) ||
      (d.description && d.description.toLowerCase().includes(menuSearch.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // All active kitchen orders across all rooms
  const allKitchenOrders = useMemo(() => {
    const list = [];
    Object.entries(roomOrders).forEach(([roomId, orders]) => {
      const room = rooms.find(r => r.id === roomId);
      orders.forEach(ord => {
        list.push({
          ...ord,
          roomId,
          roomNumber: room ? room.number : '?',
          roomName: room ? room.name : 'Noma\'lum xona'
        });
      });
    });
    return list;
  }, [roomOrders, rooms]);

  const filteredKitchenOrders = allKitchenOrders.filter(ord => {
    if (orderStatusFilter === 'ALL') return true;
    return ord.status === orderStatusFilter;
  });

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 font-sans selection:bg-turquoise-500 selection:text-navy-950">

      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-glass border border-turquoise-500/40 bg-navy-900/95 text-white backdrop-blur-md animate-bounce">
          <div className="w-3 h-3 rounded-full bg-turquoise-400 animate-ping"></div>
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Top Banner: Mode & User Bar */}
      <div className="bg-gradient-to-r from-ocean-950 via-navy-900 to-ocean-950 border-b border-turquoise-500/20 px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-2 z-30 relative">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-turquoise-300">
              {viewMode === 'admin' ? "Restoran Boshqaruvi (Admin POS)" : "Mijozlar Portali (Landing Sayt)"}
            </span>
          </div>

          <button
            onClick={() => setViewMode(viewMode === 'admin' ? 'portal' : 'admin')}
            className="px-3 py-1 rounded-lg bg-navy-800 hover:bg-navy-750 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-all"
          >
            {viewMode === 'admin' ? "🌐 Mijozlar Saytiga O'tish" : "🏢 Boshqaruv Paneliga O'tish"}
          </button>
        </div>

        {/* User Auth Info & Login/Register Button */}
        <div className="flex items-center space-x-3 ml-auto">
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-navy-900/80 px-3 py-1 rounded-full border border-white/10">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span className="font-bold text-white text-xs">{currentUser.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-turquoise-500/20 text-turquoise-300 uppercase font-semibold">
                {currentUser.role}
              </span>
              <button
                onClick={handleLogout}
                className="text-xs text-red-400 hover:text-red-300 ml-2 font-semibold"
                title="Tizimdan chiqish"
              >
                Chiqish
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              className="px-3.5 py-1 rounded-lg bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-extrabold text-xs shadow-glow-cyan"
            >
              🔐 Kirish / Ro'yxatdan o'tish
            </button>
          )}
        </div>
      </div>

      {/* Auth Modal (Login / Register) */}
      {showAuthModal && (
        <AuthView
          onLoginSuccess={handleLoginSuccess}
          onCancel={() => setShowAuthModal(false)}
        />
      )}

      {/* CONDITIONAL RENDER: CUSTOMER LANDING PAGE vs ADMIN POS PLATFORM */}
      {viewMode === 'portal' ? (
        <LandingPageView
          rooms={rooms}
          dishes={dishes}
          restaurant={settings}
          currentUser={currentUser}
          onOpenLogin={() => setShowAuthModal(true)}
          onOpenRegister={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onSwitchToAdmin={() => setViewMode('admin')}
          onBookRoom={(roomId) => setBookingModal({ isOpen: true, targetRoomId: roomId || '' })}
          onOrderDish={(dish) => setOrderModal({ isOpen: true, dish, targetRoomId: selectedRoomId || 'r101' })}
          appliedDiscounts={appliedDiscounts}
        />
      ) : (
        /* ADMIN MANAGEMENT POS PLATFORM */
        <div className="flex h-[calc(100vh-41px)] overflow-hidden">

          {/* Sidebar */}
          <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-navy-900 border-r border-white/10 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
            <div className="h-20 px-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-[#061020] via-navy-900 to-[#071126]">
              {/* FISH HOUSE Logo */}
              <FishHouseLogo className="h-12" textSize="text-xl" showSubtitle={true} />
              <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white ml-2">
                <Icons.X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
              <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                Menyular
              </div>
              {[
                { id: 'dashboard', label: 'Boshqaruv Paneli', icon: Icons.LayoutDashboard },
                { id: 'rooms', label: 'Xonalar va Kabinetlar', icon: Icons.DoorClosed, badge: metrics.occupiedRooms, badgeColor: 'bg-red-500 text-white' },
                { id: 'menu', label: 'Baliq Taomlari', icon: Icons.Fish },
                { id: 'reservations', label: 'Band Qilinganlar', icon: Icons.Calendar, badge: metrics.reservedRooms, badgeColor: 'bg-amber-500 text-navy-950' },
                { id: 'orders', label: 'Oshxona Buyurtmalari', icon: Icons.ChefHat, badge: allKitchenOrders.filter(o => o.status === 'pending').length, badgeColor: 'bg-cyan-500 text-navy-950' },
                { id: 'bills', label: 'Umumiy Hisob-Kitob', icon: Icons.Receipt, badge: metrics.occupiedRooms, badgeColor: 'bg-emerald-500 text-navy-950' },
                { id: 'reports', label: 'Hisobotlar', icon: Icons.BarChart3 },
                { id: 'settings', label: 'Sozlamalar', icon: Icons.Settings }
              ].map(item => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      AudioService.playClick();
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${isActive
                      ? 'bg-gradient-to-r from-ocean-700/80 to-turquoise-600/70 text-white shadow-glow-cyan font-semibold border border-turquoise-400/40'
                      : 'text-slate-300 hover:bg-navy-800/80 hover:text-white border border-transparent'
                      }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-turquoise-200' : 'text-slate-400'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-turquoise-500 text-navy-950'}`}>
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Room Status Widget */}
            <div className="p-4 mx-3 mb-4 rounded-xl bg-navy-850/90 border border-white/5 text-xs space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-semibold">
                <span>Xonalar Holati</span>
                <span className="text-white font-bold">{metrics.totalRooms} ta</span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1 text-center">
                <div className="p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/30">
                  <span className="block text-emerald-400 font-extrabold text-sm">{metrics.availableRooms}</span>
                  <span className="text-[10px] text-emerald-200">Bo'sh</span>
                </div>
                <div className="p-1.5 rounded-lg bg-red-950/80 border border-red-500/40">
                  <span className="block text-red-400 font-extrabold text-sm">{metrics.occupiedRooms}</span>
                  <span className="text-[10px] text-red-200 font-bold">Zanit</span>
                </div>
                <div className="p-1.5 rounded-lg bg-amber-950/60 border border-amber-500/30">
                  <span className="block text-amber-400 font-extrabold text-sm">{metrics.reservedRooms}</span>
                  <span className="text-[10px] text-amber-200">Band</span>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

            {/* Topbar */}
            <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-navy-900/90 backdrop-blur-md flex items-center justify-between z-20">
              <div className="flex items-center space-x-3">
                <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-lg bg-navy-800 text-slate-300">
                  <Icons.Menu className="w-5 h-5" />
                </button>
                <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide">
                  {activeTab === 'dashboard' ? 'Boshqaruv Paneli' :
                    activeTab === 'rooms' ? 'Xonalar va Kabinetlar' :
                      activeTab === 'room-detail' ? 'Xona Tafsilotlari & Hisob' :
                        activeTab === 'menu' ? 'Baliq Taomlari Menyusi' :
                          activeTab === 'reservations' ? 'Band Qilingan Xonalar' :
                            activeTab === 'orders' ? 'Oshxona Buyurtmalari Nazorati' :
                              activeTab === 'bills' ? 'Umumiy Hisob-Kitob & Cheklar' :
                                activeTab === 'reports' ? 'Hisobotlar va Statistika' : 'Tizim Sozlamalari'}
                </h1>
              </div>

              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
                  <span>{metrics.occupiedRooms} ta xona ZANIT</span>
                </div>

                <button
                  onClick={() => setSoundEnabled(!soundEnabled)}
                  title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
                  className={`p-2 rounded-lg border ${soundEnabled ? 'bg-turquoise-500/10 border-turquoise-500/40 text-turquoise-400' : 'bg-navy-800 border-white/10 text-slate-400'}`}
                >
                  {soundEnabled ? <Icons.Volume2 className="w-4 h-4" /> : <Icons.VolumeX className="w-4 h-4" />}
                </button>

                <button
                  onClick={() => setBookingModal({ isOpen: true, targetRoomId: '' })}
                  className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-bold text-xs sm:text-sm shadow-glow-cyan"
                >
                  + Stol Band Qilish
                </button>
              </div>
            </header>

            {/* Content Body */}
            <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">

              {/* TAB 1: DASHBOARD */}
              {activeTab === 'dashboard' && (
                <div className="space-y-6">
                  {/* 6 Stat Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {[
                      { title: "Jami Xonalar", value: `${metrics.totalRooms} ta`, icon: Icons.DoorClosed, color: "text-blue-400" },
                      { title: "Bo'sh Xonalar", value: `${metrics.availableRooms} ta`, icon: Icons.Check, color: "text-emerald-400" },
                      { title: "Band Xonalar (ZANIT)", value: `${metrics.occupiedRooms} ta`, icon: Icons.Users, color: "text-red-400", pulse: true },
                      { title: "Rezervatsiyalar", value: `${metrics.reservedRooms} ta`, icon: Icons.Calendar, color: "text-amber-400" },
                      { title: "Bugungi Tushum", value: formatUZS(metrics.todayRevenue), icon: Icons.TrendingUp, color: "text-cyan-300" },
                      { title: "Jami Buyurtmalar", value: `${metrics.totalFoodOrders} ta taom`, icon: Icons.Utensils, color: "text-indigo-400" }
                    ].map((c, i) => {
                      const Icon = c.icon;
                      return (
                        <div key={i} className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between hover:border-turquoise-500/40 transition-all">
                          <div>
                            <p className="text-xs uppercase text-slate-400 font-semibold">{c.title}</p>
                            <p className={`text-2xl font-extrabold font-display mt-2 ${c.color} ${c.pulse ? 'animate-pulse' : ''}`}>{c.value}</p>
                          </div>
                          <div className="p-3 rounded-xl bg-navy-900 border border-white/10 text-white">
                            <Icon className="w-6 h-6" />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Quick Room Grid Monitor */}
                  <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-white text-base flex items-center gap-2">
                        <Icons.DoorClosed className="w-5 h-5 text-turquoise-400" />
                        <span>Xonalar Holati (Jonli Monitor)</span>
                      </h3>
                      <button onClick={() => setActiveTab('rooms')} className="text-xs text-turquoise-400 hover:underline">Barchasini ko'rish &rarr;</button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                      {rooms.map(room => {
                        const isOccupied = room.status === 'OCCUPIED';
                        const isReserved = room.status === 'RESERVED';
                        return (
                          <button
                            key={room.id}
                            onClick={() => handleOpenRoomDetails(room.id)}
                            className={`p-3 rounded-xl border text-left transition-all hover:scale-105 ${isOccupied ? 'bg-red-950/70 border-red-500/60 shadow-glow-red' : isReserved ? 'bg-amber-950/50 border-amber-500/40' : 'bg-navy-850/80 border-emerald-500/40'
                              }`}
                          >
                            <div className="flex justify-between items-center mb-1">
                              <span className="text-xs font-bold text-slate-300">№{room.number}</span>
                              <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500 animate-pulse' : isReserved ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                            </div>
                            <p className="text-xs font-bold text-white truncate">{room.name}</p>
                            <p className="text-[10px] mt-1 font-extrabold">
                              {isOccupied ? <span className="text-red-400 animate-pulse">ZANIT</span> : isReserved ? <span className="text-amber-300">BAND</span> : <span className="text-emerald-300">BO'SH</span>}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Active Orders & Fast Actions */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Active Tables Overview */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Icons.Receipt className="w-4 h-4 text-emerald-400" />
                        <span>Band Xonalar va Jonli Hisoblar</span>
                      </h3>
                      {rooms.filter(r => r.status === 'OCCUPIED').length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">Hozirda barcha xonalar bo'sh.</p>
                      ) : (
                        <div className="space-y-2">
                          {rooms.filter(r => r.status === 'OCCUPIED').map(room => (
                            <div key={room.id} className="p-3 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white">№{room.number} – {room.name}</span>
                                <p className="text-[10px] text-slate-400">Mehmon: {room.customer?.name} &bull; {room.customer?.checkInTime}</p>
                              </div>
                              <div className="text-right">
                                <span className="font-mono font-bold text-turquoise-300">{formatUZS(calcRoomTotal(room.id))}</span>
                                <button onClick={() => handleOpenRoomDetails(room.id)} className="block text-[10px] text-turquoise-400 hover:underline">Hisobni ko'rish</button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Quick Kitchen Alert */}
                    <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-3">
                      <h3 className="font-bold text-white text-sm flex items-center gap-2">
                        <Icons.ChefHat className="w-4 h-4 text-cyan-400" />
                        <span>Oshxonadagi Yangi Buyurtmalar</span>
                      </h3>
                      {allKitchenOrders.filter(o => o.status === 'pending').length === 0 ? (
                        <p className="text-xs text-slate-400 py-4 text-center">Kutilayotgan yangi buyurtmalar yo'q.</p>
                      ) : (
                        <div className="space-y-2">
                          {allKitchenOrders.filter(o => o.status === 'pending').slice(0, 4).map(ord => (
                            <div key={ord.id} className="p-3 rounded-xl bg-navy-900 border border-cyan-500/30 flex items-center justify-between text-xs">
                              <div>
                                <span className="font-bold text-white">№{ord.roomNumber} &bull; {ord.name} ({ord.quantity}x)</span>
                                <p className="text-[10px] text-slate-400">{ord.time} da buyurtma berilgan</p>
                              </div>
                              <button onClick={() => handleUpdateOrderStatus(ord.roomId, ord.id, 'preparing')} className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 font-bold text-[10px]">
                                Tayyorlash &rarr;
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DINING ROOMS (Xonalar va Kabinetlar) */}
              {activeTab === 'rooms' && (
                <div className="space-y-6">
                  {/* Filters & Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'ALL', label: `Barchasi (${rooms.length})` },
                        { id: 'AVAILABLE', label: `Bo'sh (${rooms.filter(r => r.status === 'AVAILABLE').length})`, color: 'text-emerald-400' },
                        { id: 'OCCUPIED', label: `ZANIT (${rooms.filter(r => r.status === 'OCCUPIED').length})`, color: 'text-red-400' },
                        { id: 'RESERVED', label: `Band (${rooms.filter(r => r.status === 'RESERVED').length})`, color: 'text-amber-400' }
                      ].map(f => (
                        <button
                          key={f.id}
                          onClick={() => setRoomFilter(f.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${roomFilter === f.id ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300 hover:bg-navy-800'
                            }`}
                        >
                          {f.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 sm:w-48">
                        <input
                          type="text"
                          placeholder="Qidirish (№ yoki nom)..."
                          value={roomSearch}
                          onChange={(e) => setRoomSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-xs text-white placeholder-slate-400"
                        />
                        <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>

                      <button
                        onClick={() => setAddRoomModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-black text-xs shadow-glow-cyan flex items-center gap-1.5"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        <span>+ Yangi Xona</span>
                      </button>
                    </div>
                  </div>

                  {/* Rooms Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRooms.map(room => {
                      const isOccupied = room.status === 'OCCUPIED';
                      const isReserved = room.status === 'RESERVED';
                      const isAvailable = room.status === 'AVAILABLE';
                      const bill = isOccupied ? calcRoomTotal(room.id) : 0;

                      return (
                        <div key={room.id} className="rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-between hover:border-turquoise-500/40 transition-all">
                          <div>
                            <div className="relative h-48 w-full bg-navy-950">
                              <img src={room.photo} alt={room.name} className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/60"></div>
                              <div className="absolute top-3 left-3 flex gap-1">
                                <span className="px-2 py-0.5 rounded bg-navy-950/80 text-white font-mono text-xs font-bold">№{room.number}</span>
                                <span className="px-2 py-0.5 rounded bg-ocean-700/80 text-cyan-200 text-xs">{room.type}</span>
                              </div>

                              {/* PROMINENT STATUS BADGE */}
                              <div className="absolute top-3 right-3">
                                {isOccupied && <span className="px-3 py-1.5 rounded-lg shimmer-badge text-white font-black text-xs shadow-glow-red border border-red-300 animate-pulse">ZANIT</span>}
                                {isAvailable && <span className="px-3 py-1 rounded-lg bg-emerald-500 text-navy-950 font-black text-xs">BO'SH</span>}
                                {isReserved && <span className="px-3 py-1 rounded-lg bg-amber-500 text-navy-950 font-black text-xs">BAND QILINGAN</span>}
                              </div>

                              <div className="absolute bottom-3 left-3 text-xs text-white">
                                <span>{room.seats} o'rinli ({room.capacityText})</span>
                              </div>
                            </div>

                            <div className="p-4 space-y-2">
                              <div className="flex justify-between items-start">
                                <h3 className="font-bold text-white text-base">{room.name}</h3>
                                <button onClick={() => handleDeleteRoom(room.id)} title="Xonani o'chirish" className="text-slate-500 hover:text-rose-400 p-1">
                                  <Icons.Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>

                              {isOccupied && (
                                <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs flex justify-between items-center">
                                  <span>Mehmon: <strong>{room.customer?.name}</strong></span>
                                  <span className="text-turquoise-300 font-mono font-bold">{formatUZS(bill)}</span>
                                </div>
                              )}

                              {isReserved && room.reservation && (
                                <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200">
                                  <span>⏰ {room.reservation.time} ga: <strong>{room.reservation.name || room.reservation.customerName}</strong></span>
                                </div>
                              )}

                              <div className="flex flex-wrap gap-1 pt-1">
                                {room.amenities?.slice(0, 3).map((am, idx) => (
                                  <span key={idx} className="text-[10px] px-2 py-0.5 rounded bg-navy-850 text-slate-300 border border-white/5">{am}</span>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="p-4 pt-0">
                            <div className="flex gap-2 pt-2 border-t border-white/5">
                              <button onClick={() => handleOpenRoomDetails(room.id)} className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-white text-xs font-semibold">
                                Tafsilotlar
                              </button>
                              {isOccupied && (
                                <button onClick={() => handleOpenPayment(room)} className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold">
                                  Hisob & Yopish
                                </button>
                              )}
                              {isAvailable && (
                                <button onClick={() => setCheckInModal({ isOpen: true, room })} className="flex-1 py-2 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 text-xs font-bold">
                                  Xonani Ochish
                                </button>
                              )}
                              {isReserved && room.reservation && (
                                <button onClick={() => handleSeatReservation(room.reservation)} className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 text-xs font-bold">
                                  Joylashtirish
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 3: ROOM DETAILS & ACTIVE BILL */}
              {activeTab === 'room-detail' && selectedRoom && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10">
                    <button onClick={() => setActiveTab('rooms')} className="px-3.5 py-2 rounded-xl bg-navy-850 text-slate-300 text-xs font-semibold flex items-center gap-1.5 hover:text-white">
                      <Icons.ArrowLeft className="w-4 h-4" />
                      <span>Xonalar ro'yxatiga qaytish</span>
                    </button>
                    {selectedRoom.status === 'OCCUPIED' && (
                      <button
                        onClick={() => setTransferModal({ isOpen: true, sourceRoomId: selectedRoom.id })}
                        className="px-3 py-1.5 rounded-lg bg-navy-800 text-turquoise-300 border border-turquoise-500/30 text-xs font-bold hover:bg-navy-750"
                      >
                        ⇄ Xonani Boshqasiga Ko'chirish
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Room Details */}
                    <div className="lg:col-span-5 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                      <div className="relative h-56 rounded-2xl overflow-hidden">
                        <img src={selectedRoom.photo} alt={selectedRoom.name} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3">
                          {selectedRoom.status === 'OCCUPIED' ? <span className="px-3 py-1.5 rounded-lg bg-red-600 text-white font-black text-xs animate-pulse">ZANIT</span> :
                            selectedRoom.status === 'RESERVED' ? <span className="px-3 py-1.5 rounded-lg bg-amber-500 text-navy-950 font-black text-xs">BAND</span> :
                              <span className="px-3 py-1.5 rounded-lg bg-emerald-500 text-navy-950 font-black text-xs">BO'SH</span>}
                        </div>
                      </div>

                      <div>
                        <h2 className="text-2xl font-bold text-white">№{selectedRoom.number} – {selectedRoom.name}</h2>
                        <p className="text-xs text-turquoise-400 font-semibold">{selectedRoom.subtitle} ({selectedRoom.capacityText})</p>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedRoom.description}</p>
                      </div>

                      {/* Customer Info */}
                      {selectedRoom.customer ? (
                        <div className="p-3.5 rounded-xl bg-navy-900 border border-white/10 space-y-1.5 text-xs">
                          <p className="font-bold text-white">Mehmon Ma'lumotlari:</p>
                          <p className="text-slate-300">Ismi: <strong>{selectedRoom.customer.name}</strong></p>
                          <p className="text-slate-300">Telefon: {selectedRoom.customer.phone}</p>
                          <p className="text-slate-300">Mehmonlar soni: {selectedRoom.customer.guests} kishi</p>
                          <p className="text-slate-300">Biriktirilgan Ofitsiant: {selectedRoom.customer.waiter}</p>
                        </div>
                      ) : (
                        <div className="p-3.5 rounded-xl bg-navy-900/60 border border-white/5 text-xs text-slate-400 text-center">
                          Bu xona hozir bo'sh. Mehmon kelganda "Xonani Ochish" tugmasini bosing.
                        </div>
                      )}

                      {/* Status Buttons */}
                      <div className="pt-2 flex gap-2">
                        <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'AVAILABLE')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${selectedRoom.status === 'AVAILABLE' ? 'bg-emerald-500 text-navy-950' : 'bg-navy-850 text-emerald-400'}`}>BO'SH</button>
                        <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'OCCUPIED')} className={`flex-1 py-2 rounded-xl text-xs font-black ${selectedRoom.status === 'OCCUPIED' ? 'bg-red-600 text-white' : 'bg-navy-850 text-red-400'}`}>ZANIT</button>
                        <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'RESERVED')} className={`flex-1 py-2 rounded-xl text-xs font-bold ${selectedRoom.status === 'RESERVED' ? 'bg-amber-500 text-navy-950' : 'bg-navy-850 text-amber-400'}`}>BAND</button>
                      </div>
                    </div>

                    {/* Right: Ordered Food & Live Bill */}
                    <div className="lg:col-span-7 glass-card rounded-2xl p-6 border border-white/10 space-y-4 flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-white/10">
                          <h3 className="font-bold text-white text-base">Xonaning Buyurtmalari va Hisobi</h3>
                          <button
                            onClick={() => setActiveTab('menu')}
                            className="px-3 py-1.5 rounded-lg bg-turquoise-500 text-navy-950 font-bold text-xs shadow-glow-cyan"
                          >
                            + Taom Qo'shish
                          </button>
                        </div>

                        {/* Orders List */}
                        {(roomOrders[selectedRoom.id] || []).length === 0 ? (
                          <div className="text-center py-12 text-slate-400 text-xs">
                            <Icons.Utensils className="w-8 h-8 mx-auto mb-2 opacity-50" />
                            <span>Bu xonaga hali taom buyurtma qilinmagan. Yuqoridagi "+ Taom Qo'shish" tugmasini bosing.</span>
                          </div>
                        ) : (
                          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                            {(roomOrders[selectedRoom.id] || []).map(item => (
                              <div key={item.id} className="p-3 rounded-xl bg-navy-900 border border-white/5 flex items-center justify-between text-xs">
                                <div>
                                  <span className="font-bold text-white">{item.name}</span>
                                  <p className="text-[11px] text-slate-400">{formatUZS(item.price)} x {item.quantity} = <strong className="text-turquoise-300 font-mono">{formatUZS(item.price * item.quantity)}</strong></p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="flex items-center bg-navy-950 rounded-lg border border-white/10">
                                    <button onClick={() => handleUpdateOrderItemQty(selectedRoom.id, item.id, -1)} className="px-2 py-1 text-slate-300 hover:text-white font-bold">-</button>
                                    <span className="px-2 font-mono font-bold text-white">{item.quantity}</span>
                                    <button onClick={() => handleUpdateOrderItemQty(selectedRoom.id, item.id, 1)} className="px-2 py-1 text-slate-300 hover:text-white font-bold">+</button>
                                  </div>
                                  <button onClick={() => handleRemoveOrderItem(selectedRoom.id, item.id)} className="text-slate-500 hover:text-rose-400 p-1">
                                    <Icons.Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Bill Calculation Box */}
                      <div className="p-4 rounded-xl bg-navy-900 border border-turquoise-500/30 space-y-3 text-xs mt-4">
                        <div className="flex justify-between text-slate-300">
                          <span>Taomlar summasi (Subtotal):</span>
                          <span className="font-mono font-bold text-white">{formatUZS(calcRoomSubtotal(selectedRoom.id))}</span>
                        </div>

                        {calcRoomDiscount(selectedRoom.id) > 0 && (
                          <div className="flex justify-between text-emerald-400">
                            <span>Maxsus Chegirma ({appliedDiscounts[selectedRoom.id]}%):</span>
                            <span className="font-mono">-{formatUZS(calcRoomDiscount(selectedRoom.id))}</span>
                          </div>
                        )}

                        <div className="flex justify-between text-slate-300">
                          <span>Xizmat haqi ({settings.serviceChargePercent}%):</span>
                          <span className="font-mono">+{formatUZS(calcRoomService(selectedRoom.id))}</span>
                        </div>

                        {/* Promo Code Input */}
                        <div className="pt-2 border-t border-white/10 flex gap-2">
                          <input
                            type="text"
                            placeholder="Promokod (BALIQ10, VIP20)..."
                            value={promoInput[selectedRoom.id] || ''}
                            onChange={(e) => setPromoInput({ ...promoInput, [selectedRoom.id]: e.target.value })}
                            className="flex-1 px-3 py-1.5 rounded-lg bg-navy-950 border border-white/10 text-white text-xs uppercase"
                          />
                          <button
                            onClick={() => handleApplyPromo(selectedRoom.id, promoInput[selectedRoom.id])}
                            className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-turquoise-300 font-bold text-xs"
                          >
                            Qo'llash
                          </button>
                        </div>

                        <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                          <span className="font-bold text-white text-sm">UMUMIY HISOB (TOTAL):</span>
                          <span className="font-mono font-black text-turquoise-300 text-xl">{formatUZS(calcRoomTotal(selectedRoom.id))}</span>
                        </div>

                        {/* Split Bill */}
                        {selectedRoom.customer?.guests > 1 && (
                          <div className="p-2 rounded-lg bg-navy-950/70 text-[11px] flex justify-between text-slate-300">
                            <span>Kishi boshiga ({selectedRoom.customer.guests} kishi):</span>
                            <span className="font-mono font-bold text-amber-300">
                              {formatUZS(Math.round(calcRoomTotal(selectedRoom.id) / selectedRoom.customer.guests))}
                            </span>
                          </div>
                        )}

                        {/* Bill Actions */}
                        <div className="pt-2 flex gap-2">
                          <button
                            onClick={() => handlePrintCurrentRoomBill(selectedRoom)}
                            className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs flex items-center justify-center gap-1.5 border border-white/10"
                          >
                            <Icons.Printer className="w-4 h-4 text-turquoise-400" />
                            <span>Chekni Chop Etish</span>
                          </button>
                          <button
                            onClick={() => handleOpenPayment(selectedRoom)}
                            className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg shadow-emerald-950"
                          >
                            To'lovni Qabul Qilish & Bo'shatish
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FISH FOOD MENU */}
              {activeTab === 'menu' && (
                <div className="space-y-6">
                  {/* Category Pills & Search */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { id: 'ALL', label: 'Barcha Taomlar' },
                        { id: 'fried', label: 'Qovurilgan Baliq' },
                        { id: 'grilled', label: 'Gril & Mangal' },
                        { id: 'soup', label: 'Sho\'rvalar (Uxa)' },
                        { id: 'baked', label: 'Dimlama Baliq' },
                        { id: 'seafood', label: 'Dengiz Mahsulotlari' },
                        { id: 'special', label: 'Maxsus Taomlar' }
                      ].map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setMenuFilter(cat.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${menuFilter === cat.id ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300 hover:bg-navy-800'
                            }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="relative flex-1 sm:w-48">
                        <input
                          type="text"
                          placeholder="Taomni qidirish..."
                          value={menuSearch}
                          onChange={(e) => setMenuSearch(e.target.value)}
                          className="w-full pl-8 pr-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-xs text-white placeholder-slate-400"
                        />
                        <Icons.Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                      </div>

                      <button
                        onClick={() => setAddDishModal(true)}
                        className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-black text-xs shadow-glow-cyan flex items-center gap-1.5"
                      >
                        <Icons.Plus className="w-3.5 h-3.5" />
                        <span>+ Yangi Taom</span>
                      </button>
                    </div>
                  </div>

                  {/* Food Cards Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredDishes.map(dish => (
                      <div key={dish.id} className="rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-between hover:border-turquoise-500/40 transition-all">
                        <div>
                          <div className="h-44 w-full relative bg-navy-950">
                            <img src={dish.image || dish.photo} alt={dish.name} className="w-full h-full object-cover" />
                            <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-turquoise-300 text-[11px] font-bold">
                              ⚖️ {dish.weight || (dish.weightGrams ? `${dish.weightGrams} gr` : '500 gr')}
                            </span>
                            {dish.popular && (
                              <span className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-amber-500 text-navy-950 text-[10px] font-extrabold uppercase">
                                Xit Taom
                              </span>
                            )}
                          </div>

                          <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-white text-base">{dish.name}</h4>
                              <button onClick={() => handleDeleteDish(dish.id)} title="Taomni o'chirish" className="text-slate-500 hover:text-rose-400 p-1">
                                <Icons.Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{dish.description}</p>
                            <p className="text-[11px] text-cyan-300 font-semibold">⏱️ Pishish vaqti: {dish.cookTime || '20 daqiqa'}</p>
                          </div>
                        </div>

                        <div className="p-4 pt-0">
                          <div className="flex justify-between items-center pt-3 border-t border-white/10">
                            <span className="font-mono font-black text-amber-400 text-base">{formatUZS(dish.price)}</span>
                            <button
                              onClick={() => setOrderModal({ isOpen: true, dish, targetRoomId: selectedRoomId || 'r101' })}
                              className="px-3 py-1.5 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-bold text-xs shadow-glow-cyan flex items-center gap-1"
                            >
                              <Icons.Plus className="w-3.5 h-3.5" />
                              <span>Xonaga Buyurtma</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: RESERVATIONS (Band Qilingan Xonalar) */}
              {activeTab === 'reservations' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-base">Xona Rezervatsiyalari</h3>
                      <p className="text-xs text-slate-400">Oldindan band qilingan mijozlar ro'yxati</p>
                    </div>
                    <button
                      onClick={() => setBookingModal({ isOpen: true, targetRoomId: '' })}
                      className="px-4 py-2 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-black text-xs shadow-glow-cyan flex items-center gap-1.5"
                    >
                      <Icons.Plus className="w-3.5 h-3.5" />
                      <span>+ Yangi Band Qilish</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reservations.map(res => (
                      <div key={res.id} className="p-5 rounded-2xl glass-card border border-white/10 space-y-3 text-xs hover:border-amber-500/40 transition-all flex flex-col justify-between">
                        <div className="space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-white text-sm">{res.customerName}</h4>
                              <p className="text-[11px] text-slate-400">📞 {res.phone}</p>
                            </div>
                            <span className="px-2.5 py-1 rounded-full bg-amber-500 text-navy-950 font-bold text-xs">
                              ⏰ {res.time}
                            </span>
                          </div>

                          <div className="p-3 rounded-xl bg-navy-900 border border-white/5 space-y-1">
                            <p className="text-slate-300">Xona: <strong className="text-turquoise-300">№{res.roomNumber} ({res.roomName})</strong></p>
                            <p className="text-slate-300">Sana: <strong>{res.date}</strong></p>
                            <p className="text-slate-300">Mehmonlar soni: <strong>{res.guests} kishi</strong></p>
                            {res.deposit && <p className="text-slate-300">Garov (Zalog): <strong className="text-emerald-400">{formatUZS(res.deposit)}</strong></p>}
                            {res.notes && <p className="text-slate-400 italic">Eslatma: "{res.notes}"</p>}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-white/10 flex gap-2">
                          <button
                            onClick={() => handleSeatReservation(res)}
                            className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs"
                          >
                            Joylashtirish (Zanit)
                          </button>
                          <button
                            onClick={() => handleCancelReservation(res.id)}
                            className="px-3 py-2 rounded-xl bg-navy-800 text-rose-400 hover:bg-rose-950/60 font-semibold text-xs border border-white/5"
                          >
                            Bekor qilish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: KITCHEN ORDERS (Oshxona Buyurtmalari) */}
              {activeTab === 'orders' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      {[
                        { id: 'ALL', label: `Barchasi (${allKitchenOrders.length})` },
                        { id: 'pending', label: 'Kutilmoqda', color: 'text-amber-400' },
                        { id: 'preparing', label: 'Tayyorlanmoqda', color: 'text-cyan-400' },
                        { id: 'ready', label: 'Tayyor', color: 'text-emerald-400' }
                      ].map(st => (
                        <button
                          key={st.id}
                          onClick={() => setOrderStatusFilter(st.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${orderStatusFilter === st.id ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-850 text-slate-300'}`}
                        >
                          {st.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {filteredKitchenOrders.length === 0 ? (
                    <div className="text-center py-16 text-slate-400 text-sm glass-card rounded-2xl p-8 border border-white/10">
                      <Icons.ChefHat className="w-12 h-12 mx-auto mb-3 opacity-40 text-cyan-400" />
                      <p>Hozircha buyurtmalar mavjud emas.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {filteredKitchenOrders.map(ord => (
                        <div key={ord.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-xs font-bold text-turquoise-400">№{ord.roomNumber} – {ord.roomName}</span>
                              <h4 className="font-extrabold text-white text-base mt-0.5">{ord.name}</h4>
                              <p className="text-xs text-slate-400 font-mono">Miqdori: <strong className="text-white text-sm">{ord.quantity}x</strong></p>
                            </div>
                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${ord.status === 'ready' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                              ord.status === 'preparing' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' :
                                'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                              }`}>
                              {ord.status === 'ready' ? 'Tayyor' : ord.status === 'preparing' ? 'Pishmoqda' : 'Kutilmoqda'}
                            </span>
                          </div>

                          {ord.notes && (
                            <p className="text-xs p-2 rounded-lg bg-navy-950/60 text-amber-300 border border-amber-500/20 italic">
                              "{ord.notes}"
                            </p>
                          )}

                          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs">
                            <span className="text-slate-400">⏰ {ord.time}</span>
                            <div className="flex gap-1.5">
                              {ord.status === 'pending' && (
                                <button onClick={() => handleUpdateOrderStatus(ord.roomId, ord.id, 'preparing')} className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs">
                                  Pishirishni Boshlash
                                </button>
                              )}
                              {ord.status === 'preparing' && (
                                <button onClick={() => handleUpdateOrderStatus(ord.roomId, ord.id, 'ready')} className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
                                  Tayyor Bo'ldi
                                </button>
                              )}
                              {ord.status === 'ready' && (
                                <button onClick={() => handleRemoveOrderItem(ord.roomId, ord.id)} className="px-3 py-1.5 rounded-lg bg-navy-800 text-slate-300 hover:text-white font-semibold text-xs">
                                  Tugatish & Olib ketish
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 7: ROOM BILLS (Umumiy Hisob-Kitob) */}
              {activeTab === 'bills' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold text-white text-base">Faol Xonalar Hisoblari (Jonli Kassa)</h3>
                    <p className="text-xs text-slate-400">Barcha band xonalar bo'yicha jonli hisob-kitoblar</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {rooms.filter(r => r.status === 'OCCUPIED').map(room => (
                      <div key={room.id} className="p-5 rounded-2xl glass-card border border-white/10 space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px]">ZANIT</span>
                            <h4 className="font-bold text-white text-base mt-1">№{room.number} – {room.name}</h4>
                            <p className="text-xs text-slate-400">Mijoz: {room.customer?.name} &bull; {room.customer?.phone}</p>
                          </div>
                          <span className="font-mono font-black text-turquoise-300 text-lg">{formatUZS(calcRoomTotal(room.id))}</span>
                        </div>

                        <div className="space-y-1.5 py-2 border-y border-white/10 text-xs">
                          {(roomOrders[room.id] || []).map((it, idx) => (
                            <div key={idx} className="flex justify-between text-slate-300">
                              <span>{it.name} ({it.quantity}x)</span>
                              <span className="font-mono">{formatUZS(it.price * it.quantity)}</span>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <button onClick={() => handlePrintCurrentRoomBill(room)} className="flex-1 py-2 rounded-xl bg-navy-800 text-slate-200 font-bold text-xs flex items-center justify-center gap-1">
                            <Icons.Printer className="w-3.5 h-3.5 text-turquoise-400" />
                            <span>Chek</span>
                          </button>
                          <button onClick={() => handleOpenPayment(room)} className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs">
                            To'lovni Yopish
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Closed Bills History */}
                  <div className="pt-6">
                    <h3 className="font-bold text-white text-base mb-3">To'langan Hisoblar Tarixi</h3>
                    <div className="glass-card rounded-2xl border border-white/10 overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-navy-900 border-b border-white/10 text-slate-400 uppercase text-[10px]">
                            <tr>
                              <th className="p-3.5">Chek ID</th>
                              <th className="p-3.5">Xona</th>
                              <th className="p-3.5">Mijoz</th>
                              <th className="p-3.5">Sana & Vaqt</th>
                              <th className="p-3.5">To'lov Usuli</th>
                              <th className="p-3.5 text-right">Summa</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-white/5">
                            {salesHistory.slice(0, 10).map((bill, idx) => (
                              <tr key={idx} className="hover:bg-navy-900/50">
                                <td className="p-3.5 font-mono text-turquoise-300 font-bold">{bill.id}</td>
                                <td className="p-3.5 font-bold text-white">№{bill.roomNumber} ({bill.roomName})</td>
                                <td className="p-3.5 text-slate-300">{bill.customerName}</td>
                                <td className="p-3.5 text-slate-400">{bill.date} {bill.time}</td>
                                <td className="p-3.5"><span className="px-2 py-0.5 rounded bg-navy-800 text-slate-300">{bill.paymentMethod || 'Naqd'}</span></td>
                                <td className="p-3.5 text-right font-mono font-bold text-emerald-400">{formatUZS(bill.total)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 8: REPORTS & STATISTICS (Hisobotlar) */}
              {activeTab === 'reports' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-bold text-white text-base">Restoran Tushumi va Statistikasi</h3>
                      <p className="text-xs text-slate-400">Kunlik, haftalik va oylik daromad tahlili</p>
                    </div>
                    <div className="flex gap-2">
                      {['daily', 'weekly', 'monthly'].map(p => (
                        <button
                          key={p}
                          onClick={() => setReportPeriod(p)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase ${reportPeriod === p ? 'bg-turquoise-500 text-navy-950 font-black' : 'bg-navy-850 text-slate-300'}`}
                        >
                          {p === 'daily' ? 'Kunlik' : p === 'weekly' ? 'Haftalik' : 'Oylik'}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="glass-card rounded-2xl p-5 border border-white/10">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Bugungi Sof Daromad</p>
                      <h2 className="text-3xl font-extrabold text-cyan-300 font-mono mt-2">{formatUZS(metrics.todayRevenue)}</h2>
                      <p className="text-[11px] text-emerald-400 mt-1">&uarr; Kechagiga nisbatan +18% yuqori</p>
                    </div>
                    <div className="glass-card rounded-2xl p-5 border border-white/10">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Haftalik Daromad</p>
                      <h2 className="text-3xl font-extrabold text-white font-mono mt-2">{formatUZS(metrics.todayRevenue * 6.5)}</h2>
                      <p className="text-[11px] text-slate-400 mt-1">42 ta buyurtma qabul qilingan</p>
                    </div>
                    <div className="glass-card rounded-2xl p-5 border border-white/10">
                      <p className="text-xs text-slate-400 uppercase font-semibold">Oylik Prognoz</p>
                      <h2 className="text-3xl font-extrabold text-amber-400 font-mono mt-2">{formatUZS(metrics.todayRevenue * 28)}</h2>
                      <p className="text-[11px] text-amber-300 mt-1">Reja 92% bajarildi</p>
                    </div>
                  </div>

                  {/* Top Popular Fish Dishes */}
                  <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                    <h4 className="font-bold text-white text-base">Eng Ko'p Sotilgan Baliq Taomlari</h4>
                    <div className="space-y-3">
                      {dishes.slice(0, 5).map((dish, i) => {
                        const count = 38 - i * 6;
                        const pct = Math.round((count / 38) * 100);
                        return (
                          <div key={dish.id} className="space-y-1 text-xs">
                            <div className="flex justify-between font-semibold">
                              <span className="text-white">{i + 1}. {dish.name}</span>
                              <span className="text-turquoise-300 font-mono">{count} porsiya ({formatUZS(dish.price * count)})</span>
                            </div>
                            <div className="w-full h-2 rounded-full bg-navy-950 overflow-hidden">
                              <div className="h-full rounded-full bg-gradient-to-r from-turquoise-500 to-cyan-400" style={{ width: `${pct}%` }}></div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 9: SETTINGS (Sozlamalar) */}
              {activeTab === 'settings' && (
                <div className="space-y-6 max-w-2xl">
                  <div>
                    <h3 className="font-bold text-white text-base">Restoran Sozlamalari</h3>
                    <p className="text-xs text-slate-400">Muassasa ma'lumotlari va xizmat haqi parametrlari</p>
                  </div>

                  <form onSubmit={(e) => {
                    e.preventDefault();
                    showToast("Sozlamalar muvaffaqiyatli saqlandi!", 'success');
                  }} className="glass-card rounded-2xl p-6 border border-white/10 space-y-4 text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">Restoran Nomi:</label>
                      <input
                        type="text"
                        value={settings.name}
                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">Manzil:</label>
                      <input
                        type="text"
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Telefon Raqam:</label>
                        <input
                          type="text"
                          value={settings.phone}
                          onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"
                        />
                      </div>
                      <div>
                        <label className="text-slate-300 block mb-1 font-semibold">Xizmat Haqi Foizi (%):</label>
                        <input
                          type="number"
                          value={settings.serviceChargePercent}
                          onChange={(e) => setSettings({ ...settings, serviceChargePercent: Number(e.target.value) })}
                          className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1 font-semibold">Ish Vaqti:</label>
                      <input
                        type="text"
                        value={settings.workingHours}
                        onChange={(e) => setSettings({ ...settings, workingHours: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"
                      />
                    </div>
                    <div className="pt-2 flex justify-between items-center">
                      <button type="submit" className="px-5 py-2.5 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-black shadow-glow-cyan">
                        O'zgarishlarni Saqlash
                      </button>
                      <button type="button" onClick={handleResetDemoData} className="px-4 py-2.5 rounded-xl bg-navy-800 text-rose-400 hover:bg-rose-950 font-bold border border-rose-500/20">
                        Boshlang'ich Ma'lumotlarni Qaytarish
                      </button>
                    </div>
                  </form>
                </div>
              )}

            </main>
          </div>
        </div>
      )}

      {/* MODAL: Order Food to Room */}
      {orderModal.isOpen && orderModal.dish && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Xonaga Taom Buyurtma Qilish</h3>
              <button onClick={() => setOrderModal({ isOpen: false, dish: null, targetRoomId: '' })} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="flex gap-3 items-center p-3 rounded-xl bg-navy-900 border border-white/5">
              <img src={orderModal.dish.image || orderModal.dish.photo} alt={orderModal.dish.name} className="w-16 h-16 rounded-lg object-cover" />
              <div>
                <h4 className="font-bold text-white text-sm">{orderModal.dish.name}</h4>
                <p className="text-turquoise-300 font-mono font-bold">{formatUZS(orderModal.dish.price)}</p>
                <p className="text-slate-400 text-[11px]">{orderModal.dish.weight || '500 gr'}</p>
              </div>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleAddFoodToRoom(fd.get('targetRoomId'), orderModal.dish, Number(fd.get('quantity')), fd.get('notes'));
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Qaysi Xonaga:</label>
                <select name="targetRoomId" defaultValue={orderModal.targetRoomId || selectedRoomId} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold">
                  {rooms.map(r => (
                    <option key={r.id} value={r.id}>
                      №{r.number} – {r.name} ({r.status === 'OCCUPIED' ? 'ZANIT' : r.status === 'RESERVED' ? 'BAND' : 'BO\'SH'})
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Porsiyalar Soni:</label>
                <input name="quantity" type="number" min="1" defaultValue="1" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Oshxona Uchun Eslatma (Ixtiyoriy):</label>
                <input name="notes" placeholder="Masalan: Achchiq sous alohida keltirilsin" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setOrderModal({ isOpen: false, dish: null, targetRoomId: '' })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-turquoise-500 text-navy-950 font-black shadow-glow-cyan">Buyurtmani Tasdiqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Booking / Reservation */}
      {bookingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Xonani Band Qilish (Bron)</h3>
              <button onClick={() => setBookingModal({ isOpen: false, targetRoomId: '' })} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              const rId = fd.get('roomId');
              const selRoom = rooms.find(r => r.id === rId);
              handleCreateReservation({
                roomId: rId,
                roomNumber: selRoom ? selRoom.number : '?',
                roomName: selRoom ? selRoom.name : 'Xona',
                customerName: fd.get('customerName'),
                phone: fd.get('phone'),
                date: fd.get('date'),
                time: fd.get('time'),
                guests: Number(fd.get('guests')),
                deposit: Number(fd.get('deposit')) || 0,
                notes: fd.get('notes')
              });
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Xonani Tanlang:</label>
                <select name="roomId" defaultValue={bookingModal.targetRoomId || rooms.find(r => r.status === 'AVAILABLE')?.id || rooms[0].id} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold">
                  {rooms.map(r => (
                    <option key={r.id} value={r.id} disabled={r.status === 'OCCUPIED'}>
                      №{r.number} – {r.name} ({r.seats} o'rinli) {r.status === 'OCCUPIED' ? '(ZANIT - Band qilib bo\'lmaydi)' : r.status === 'RESERVED' ? '(Band qilingan)' : '(Bo\'sh)'}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Sana:</label>
                  <input name="date" type="date" required defaultValue={new Date().toISOString().split('T')[0]} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Vaqt:</label>
                  <input name="time" type="time" required defaultValue="19:00" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Mijoz Ism-Familiyasi:</label>
                <input name="customerName" required placeholder="Masalan: Jamshid Karimov" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Telefon Raqami:</label>
                  <input name="phone" required defaultValue="+998 " className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Mehmonlar Soni:</label>
                  <input name="guests" type="number" min="1" max="50" defaultValue="4" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Oldindan Garov / Zalog (UZS):</label>
                <input name="deposit" type="number" defaultValue="200000" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Eslatma:</label>
                <input name="notes" placeholder="Tug'ilgan kun dasturxoni..." className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setBookingModal({ isOpen: false, targetRoomId: '' })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-black shadow-glow-cyan">Band Qilishni Tasdiqlash</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Check-In Guest (Xonani Ochish) */}
      {checkInModal.isOpen && checkInModal.room && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">№{checkInModal.room.number} – Xonani Ochish (ZANIT)</h3>
              <button onClick={() => setCheckInModal({ isOpen: false, room: null })} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleCheckInGuest(checkInModal.room.id, {
                name: fd.get('name'),
                phone: fd.get('phone'),
                guests: fd.get('guests'),
                waiter: fd.get('waiter'),
                notes: fd.get('notes')
              });
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Mehmon Ismi:</label>
                <input name="name" required placeholder="Masalan: Sardor Komilov" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Telefon:</label>
                  <input name="phone" defaultValue="+998 90 " className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Kishilar soni:</label>
                  <input name="guests" type="number" defaultValue={checkInModal.room.seats} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Xizmat ko'rsatuvchi ofitsiant:</label>
                <input name="waiter" defaultValue={currentUser ? currentUser.name : "Sardor Saidov"} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setCheckInModal({ isOpen: false, room: null })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-turquoise-500 text-navy-950 font-black shadow-glow-cyan">Xonani ZANIT Qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Transfer Table (Xonani Ko'chirish) */}
      {transferModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Xonani Boshqasiga Ko'chirish</h3>
              <button onClick={() => setTransferModal({ isOpen: false, sourceRoomId: '' })} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleTransferTable(transferModal.sourceRoomId, fd.get('targetRoomId'));
            }} className="space-y-3">
              <p className="text-slate-300">
                Hozirgi xonadagi barcha buyurtmalar va mehmon ma'lumotlari yangi tanlangan bo'sh xonaga ko'chiriladi.
              </p>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Qaysi Bo'sh Xonaga Ko'chiriladi:</label>
                <select name="targetRoomId" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold">
                  {rooms.filter(r => r.id !== transferModal.sourceRoomId && r.status === 'AVAILABLE').map(r => (
                    <option key={r.id} value={r.id}>
                      №{r.number} – {r.name} ({r.seats} kishilik, BO'SH)
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setTransferModal({ isOpen: false, sourceRoomId: '' })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-turquoise-500 text-navy-950 font-black shadow-glow-cyan">Ko'chirishni Bajarish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Payment Modal (Hisobni Yopish & Bo'shatish) */}
      {paymentModal.isOpen && paymentModal.room && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">To'lovni Qabul Qilish & Bo'shatish</h3>
              <button onClick={() => setPaymentModal({ isOpen: false, room: null })} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <div className="p-4 rounded-xl bg-navy-900 border border-turquoise-500/30 space-y-2">
              <div className="flex justify-between text-slate-300">
                <span>Xona:</span>
                <strong className="text-white">№{paymentModal.room.number} ({paymentModal.room.name})</strong>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Mehmon:</span>
                <span>{paymentModal.room.customer?.name || 'Mijoz'}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Taomlar summasi:</span>
                <span className="font-mono">{formatUZS(calcRoomSubtotal(paymentModal.room.id))}</span>
              </div>
              {calcRoomDiscount(paymentModal.room.id) > 0 && (
                <div className="flex justify-between text-emerald-400">
                  <span>Chegirma:</span>
                  <span className="font-mono">-{formatUZS(calcRoomDiscount(paymentModal.room.id))}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-300">
                <span>Xizmat haqi ({settings.serviceChargePercent}%):</span>
                <span className="font-mono">+{formatUZS(calcRoomService(paymentModal.room.id))}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline font-bold">
                <span className="text-white text-sm">JAMI TO'LOV:</span>
                <span className="text-turquoise-300 text-xl font-mono">{formatUZS(calcRoomTotal(paymentModal.room.id))}</span>
              </div>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleConfirmPayment(paymentModal.room, fd.get('paymentMethod'));
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">To'lov Usulini Tanlang:</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'Naqd', label: '💵 Naqd' },
                    { id: 'Karta / Terminal', label: '💳 Uzcard / Humo' },
                    { id: 'Click / Payme', label: '📱 Click / Payme' }
                  ].map((m, idx) => (
                    <label key={m.id} className="p-3 rounded-xl bg-navy-900 border border-white/10 flex flex-col items-center justify-center cursor-pointer hover:border-turquoise-500/50">
                      <input type="radio" name="paymentMethod" value={m.id} defaultChecked={idx === 0} className="mb-1 text-turquoise-500" />
                      <span className="text-[11px] font-bold text-center text-white">{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setPaymentModal({ isOpen: false, room: null })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-lg shadow-emerald-950">
                  To'lovni Tasdiqlash & Bo'shatish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Printable Receipt Modal */}
      {receiptModal.isOpen && receiptModal.billData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 space-y-4 my-8 font-mono text-xs shadow-2xl">
            <div className="no-print flex justify-between items-center pb-2 border-b">
              <span className="font-bold text-slate-600">Rasmiy Fiskal Chek</span>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-3 py-1 bg-navy-900 text-white rounded text-xs font-bold">Chop Etish</button>
                <button onClick={() => setReceiptModal({ isOpen: false, billData: null })} className="text-slate-500 font-bold px-2">&times;</button>
              </div>
            </div>
            <div id="printable-receipt-area" className="space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-extrabold text-base font-display">FISH HOUSE</h3>
                <p className="text-[10px] text-slate-600">{settings.address} &bull; {settings.phone}</p>
              </div>
              <div className="border-b pb-2 space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Chek: <strong>{receiptModal.billData.id}</strong></span><span>{receiptModal.billData.date}</span></div>
                <div className="flex justify-between"><span>Xona: <strong>№{receiptModal.billData.roomNumber}</strong></span><span>{receiptModal.billData.time}</span></div>
                <div className="flex justify-between"><span>Mijoz: {receiptModal.billData.customerName}</span></div>
                {receiptModal.billData.paymentMethod && <div className="flex justify-between"><span>To'lov usuli:</span><span>{receiptModal.billData.paymentMethod}</span></div>}
              </div>
              <div className="border-b pb-2 space-y-1">
                {(receiptModal.billData.items || []).map((it, idx) => (
                  <div key={idx} className="flex justify-between">
                    <span>{it.name} ({it.quantity}x)</span>
                    <span className="font-bold">{formatUZS(it.subtotal || (it.price * it.quantity))}</span>
                  </div>
                ))}
              </div>
              <div className="border-b pb-2 space-y-1">
                <div className="flex justify-between"><span>Taomlar summasi:</span><span>{formatUZS(receiptModal.billData.subtotal)}</span></div>
                <div className="flex justify-between"><span>Xizmat haqi ({settings.serviceChargePercent}%):</span><span>+{formatUZS(receiptModal.billData.serviceCharge)}</span></div>
                <div className="flex justify-between font-extrabold text-sm pt-1 border-t"><span>JAMI TO'LOV:</span><span>{formatUZS(receiptModal.billData.total)}</span></div>
              </div>
              <div className="text-center pt-2">
                <p className="font-bold text-[10px]">TASHRIFINGIZ UCHUN RAHMAT!</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add New Room */}
      {addRoomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Yangi Xona / Kabinet Qo'shish</h3>
              <button onClick={() => setAddRoomModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleAddNewRoom({
                number: fd.get('number'),
                name: fd.get('name'),
                subtitle: fd.get('subtitle'),
                type: fd.get('type'),
                seats: fd.get('seats'),
                photo: fd.get('photo'),
                description: fd.get('description')
              });
            }} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Xona Raqami:</label>
                  <input name="number" required placeholder="Masalan: 109" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Xona Turi:</label>
                  <select name="type" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white">
                    <option value="VIP">VIP Hall</option>
                    <option value="Kabinet">Kabinet</option>
                    <option value="Lounge">Lounge</option>
                    <option value="Oila">Oilaviy Zal</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Xona Nomi:</label>
                <input name="name" required placeholder="Masalan: Oltin Baliq Zali" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">O'rinlar Soni:</label>
                  <input name="seats" type="number" required defaultValue="8" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Inglizcha Subtitle:</label>
                  <input name="subtitle" placeholder="Golden Fish Chamber" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Rasm URL:</label>
                <input name="photo" placeholder="https://images.unsplash.com/..." className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Tavsif:</label>
                <textarea name="description" rows="2" placeholder="Xona haqida qisqacha ma'lumot..." className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"></textarea>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setAddRoomModal(false)} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-turquoise-500 text-navy-950 font-black shadow-glow-cyan">Xonani Qo'shish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add New Dish */}
      {addDishModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl glass-card border border-white/10 p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-bold text-white text-base">Yangi Baliq Taomi Qo'shish</h3>
              <button onClick={() => setAddDishModal(false)} className="text-slate-400 hover:text-white">&times;</button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.target);
              handleAddNewDish({
                name: fd.get('name'),
                category: fd.get('category'),
                price: fd.get('price'),
                weight: fd.get('weight'),
                image: fd.get('image'),
                description: fd.get('description')
              });
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Taom Nomi:</label>
                <input name="name" required placeholder="Masalan: Farel Baliq Mangalda" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Kategoriya:</label>
                  <select name="category" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white">
                    <option value="fried">Qovurilgan Baliq</option>
                    <option value="grilled">Gril & Mangal</option>
                    <option value="soup">Sho'rva (Uxa)</option>
                    <option value="baked">Dimlama Baliq</option>
                    <option value="seafood">Dengiz Mahsulotlari</option>
                  </select>
                </div>
                <div>
                  <label className="text-slate-300 block mb-1 font-semibold">Narxi (UZS):</label>
                  <input name="price" type="number" required defaultValue="95000" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold" />
                </div>
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Vazni (gramm):</label>
                <input name="weight" defaultValue="500" placeholder="500" className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Rasm URL:</label>
                <input name="image" placeholder="https://..." className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1 font-semibold">Tavsif:</label>
                <textarea name="description" rows="2" placeholder="Taom haqida qisqacha..." className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white"></textarea>
              </div>
              <div className="pt-2 flex gap-2">
                <button type="button" onClick={() => setAddDishModal(false)} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-bold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2.5 rounded-xl bg-turquoise-500 text-navy-950 font-black shadow-glow-cyan">Menyuga Qo'shish</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
