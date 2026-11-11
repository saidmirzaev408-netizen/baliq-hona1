import React, { useState, useEffect, useMemo } from 'react';
import { INITIAL_DATA } from './data/mockData';
import { AudioService, formatUZS } from './utils/audio';
import { Icons } from './components/Icons';

export default function App() {
  const initialData = useMemo(() => {
    try {
      const saved = localStorage.getItem('FISH_HOUSE_APP_STATE_V1');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return INITIAL_DATA;
  }, []);

  const [rooms, setRooms] = useState(initialData.rooms || []);
  const [dishes, setDishes] = useState(initialData.dishes || []);
  const [roomOrders, setRoomOrders] = useState(initialData.roomOrders || {});
  const [reservations, setReservations] = useState(initialData.reservations || []);
  const [salesHistory, setSalesHistory] = useState(initialData.salesHistory || []);
  const [settings, setSettings] = useState(initialData.restaurant || {
    name: "FISH HOUSE",
    serviceChargePercent: 10,
    currency: "UZS"
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedRoomId, setSelectedRoomId] = useState('r101');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Modals state
  const [orderModal, setOrderModal] = useState({ isOpen: false, dish: null, targetRoomId: '' });
  const [bookingModal, setBookingModal] = useState({ isOpen: false, targetRoomId: '' });
  const [paymentModal, setPaymentModal] = useState({ isOpen: false, room: null });
  const [receiptModal, setReceiptModal] = useState({ isOpen: false, billData: null });
  const [roomModal, setRoomModal] = useState({ isOpen: false, isEdit: false, roomData: null });
  const [checkInModal, setCheckInModal] = useState({ isOpen: false, room: null });

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
    } catch(e) {}
  }, [rooms, dishes, roomOrders, reservations, salesHistory, settings]);

  const calcRoomSubtotal = (roomId) => {
    const orders = roomOrders[roomId] || [];
    return orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calcRoomService = (roomId) => {
    return Math.round(calcRoomSubtotal(roomId) * ((settings.serviceChargePercent || 10) / 100));
  };

  const calcRoomTotal = (roomId) => {
    return calcRoomSubtotal(roomId) + calcRoomService(roomId);
  };

  const getRoomItemCount = (roomId) => {
    const orders = roomOrders[roomId] || [];
    return orders.reduce((cnt, item) => cnt + item.quantity, 0);
  };

  const metrics = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
    const reservedRooms = rooms.filter(r => r.status === 'RESERVED').length;

    const pastRev = salesHistory.reduce((acc, curr) => acc + curr.total, 0);
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
  }, [rooms, roomOrders, salesHistory, settings]);

  const handleOpenRoomDetails = (roomId) => {
    AudioService.playClick();
    setSelectedRoomId(roomId);
    setActiveTab('room-detail');
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
            waiter: "Navbatchi Ofitsiant"
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
            waiter: guestData.waiter || 'Navbatchi ofitsiant',
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
      weight: dish.weight,
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
    showToast(`Holat: ${newStatus === 'completed' ? 'Yetkazildi' : newStatus === 'preparing' ? 'Tayyorlanmoqda' : 'Kutilmoqda'}`);
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
            waiter: "Sardor Saidov",
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

  const handleCancelReservation = (reservationId, roomId) => {
    AudioService.playClick();
    setReservations(prev => prev.map(res => res.id === reservationId ? { ...res, status: 'cancelled' } : res));
    setRooms(prev => prev.map(r => r.id === roomId && r.status === 'RESERVED' ? { ...r, status: 'AVAILABLE', reservation: null } : r));
    showToast("Band qilish bekor qilindi", 'info');
  };

  const handleOpenPayment = (room) => {
    AudioService.playClick();
    setPaymentModal({ isOpen: true, room });
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
      showToast("Namunaviy ma'lumotlar qayta tiklandi!", 'success');
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950 text-slate-100 font-sans">
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-glass border border-turquoise-500/40 bg-navy-900/95 text-white backdrop-blur-md animate-bounce">
          <div className="w-3 h-3 rounded-full bg-turquoise-400 animate-ping"></div>
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-navy-900 border-r border-white/10 z-40 flex flex-col transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-navy-900 to-navy-850">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-ocean-700 via-turquoise-500 to-cyan-300 p-0.5 shadow-glow-cyan flex items-center justify-center">
              <div className="w-full h-full bg-navy-950 rounded-[10px] flex items-center justify-center text-turquoise-400">
                <Icons.Fish className="w-6 h-6 animate-pulse" />
              </div>
            </div>
            <div>
              <span className="font-display font-extrabold text-lg tracking-wider text-white bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-turquoise-300">
                FISH HOUSE
              </span>
              <p className="text-[10px] uppercase tracking-widest text-turquoise-400 font-semibold">Seafood Restaurant</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
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
            { id: 'orders', label: 'Oshxona Buyurtmalari', icon: Icons.ChefHat },
            { id: 'bills', label: 'Umumiy Hisob-Kitob', icon: Icons.Receipt },
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
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-medium transition-all group ${
                  isActive 
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

      {/* Main Container */}
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
               activeTab === 'room-detail' ? 'Xona Tafsilotlari' :
               activeTab === 'menu' ? 'Baliq Taomlari' :
               activeTab === 'reservations' ? 'Band Qilinganlar' :
               activeTab === 'orders' ? 'Oshxona Buyurtmalari' :
               activeTab === 'bills' ? 'Umumiy Hisob-Kitob' :
               activeTab === 'reports' ? 'Hisobotlar' : 'Sozlamalar'}
            </h1>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
              <span>{metrics.occupiedRooms} ta xona ZANIT</span>
            </div>

            <button 
              onClick={() => setSoundEnabled(!soundEnabled)}
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
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              {/* Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { title: "Jami Xonalar", value: metrics.totalRooms, icon: Icons.DoorClosed, color: "text-blue-400" },
                  { title: "Bo'sh Xonalar", value: metrics.availableRooms, icon: Icons.Check, color: "text-emerald-400" },
                  { title: "Band Xonalar (ZANIT)", value: metrics.occupiedRooms, icon: Icons.Users, color: "text-red-400" },
                  { title: "Rezervatsiyalar", value: metrics.reservedRooms, icon: Icons.Calendar, color: "text-amber-400" },
                  { title: "Bugungi Tushum", value: formatUZS(metrics.todayRevenue), icon: Icons.TrendingUp, color: "text-cyan-300" },
                  { title: "Jami Buyurtmalar", value: `${metrics.totalFoodOrders} ta taom`, icon: Icons.Utensils, color: "text-indigo-400" }
                ].map((c, i) => {
                  const Icon = c.icon;
                  return (
                    <div key={i} className="glass-card rounded-2xl p-5 border border-white/10 flex items-center justify-between">
                      <div>
                        <p className="text-xs uppercase text-slate-400 font-semibold">{c.title}</p>
                        <p className={`text-2xl font-extrabold font-display mt-2 ${c.color}`}>{c.value}</p>
                      </div>
                      <div className="p-3 rounded-xl bg-navy-900 border border-white/10 text-white">
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Quick Room Grid */}
              <div className="glass-card rounded-2xl p-6 border border-white/10">
                <h3 className="font-bold text-white text-base mb-4 flex items-center gap-2">
                  <Icons.DoorClosed className="w-5 h-5 text-turquoise-400" />
                  <span>Xonalar Holati (Jonli Monitor)</span>
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
                  {rooms.map(room => {
                    const isOccupied = room.status === 'OCCUPIED';
                    const isReserved = room.status === 'RESERVED';
                    return (
                      <button
                        key={room.id}
                        onClick={() => handleOpenRoomDetails(room.id)}
                        className={`p-3 rounded-xl border text-left transition-all hover:scale-105 ${
                          isOccupied ? 'bg-red-950/70 border-red-500/60 shadow-glow-red' : isReserved ? 'bg-amber-950/50 border-amber-500/40' : 'bg-navy-850/80 border-emerald-500/40'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs font-bold text-slate-300">№{room.number}</span>
                          <span className={`w-2 h-2 rounded-full ${isOccupied ? 'bg-red-500 animate-pulse' : isReserved ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
                        </div>
                        <p className="text-xs font-bold text-white truncate">{room.name}</p>
                        <p className="text-[10px] mt-1 font-extrabold">{isOccupied ? <span className="text-red-400">ZANIT</span> : isReserved ? <span className="text-amber-300">BAND</span> : <span className="text-emerald-300">BO'SH</span>}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'rooms' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {rooms.map(room => {
                  const isOccupied = room.status === 'OCCUPIED';
                  const isReserved = room.status === 'RESERVED';
                  const isAvailable = room.status === 'AVAILABLE';
                  const bill = isOccupied ? calcRoomTotal(room.id) : 0;

                  return (
                    <div key={room.id} className="rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-between">
                      <div className="relative h-48 w-full">
                        <img src={room.photo} alt={room.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/50"></div>
                        <div className="absolute top-3 left-3 flex gap-1">
                          <span className="px-2 py-0.5 rounded bg-navy-950/80 text-white font-mono text-xs font-bold">№{room.number}</span>
                          <span className="px-2 py-0.5 rounded bg-ocean-700/80 text-cyan-200 text-xs">{room.type}</span>
                        </div>
                        <div className="absolute top-3 right-3">
                          {isOccupied && <span className="px-3 py-1.5 rounded-lg shimmer-badge text-white font-extrabold text-xs shadow-glow-red border border-red-300">ZANIT</span>}
                          {isAvailable && <span className="px-3 py-1 rounded-lg bg-emerald-500 text-navy-950 font-extrabold text-xs">BO'SH</span>}
                          {isReserved && <span className="px-3 py-1 rounded-lg bg-amber-500 text-navy-950 font-extrabold text-xs">BAND QILINGAN</span>}
                        </div>
                        <div className="absolute bottom-3 left-3 text-xs text-white">
                          <span>{room.seats} o'rinli ({room.capacityText})</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-3">
                        <h3 className="font-bold text-white text-base">{room.name}</h3>
                        {isOccupied && (
                          <div className="p-2.5 rounded-xl bg-red-950/40 border border-red-500/30 text-xs flex justify-between items-center">
                            <span>Mehmon: <strong>{room.customer?.name}</strong></span>
                            <span className="text-turquoise-300 font-mono font-bold">{formatUZS(bill)}</span>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <button onClick={() => handleOpenRoomDetails(room.id)} className="flex-1 py-2 rounded-xl bg-navy-800 text-white text-xs font-semibold">Tafsilotlar</button>
                          {isOccupied && <button onClick={() => handleOpenPayment(room)} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">Hisob & Yopish</button>}
                          {isAvailable && <button onClick={() => setCheckInModal({ isOpen: true, room })} className="flex-1 py-2 rounded-xl bg-turquoise-500 text-navy-950 text-xs font-bold">Xonani Ochish</button>}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'room-detail' && selectedRoom && (
            <div className="space-y-6">
              <button onClick={() => setActiveTab('rooms')} className="px-3.5 py-2 rounded-xl bg-navy-850 text-slate-300 text-xs font-semibold flex items-center gap-1.5">
                <Icons.ArrowLeft className="w-4 h-4" />
                <span>Orqaga</span>
              </button>
              <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-white">№{selectedRoom.number} – {selectedRoom.name}</h2>
                    <p className="text-xs text-slate-400">{selectedRoom.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'AVAILABLE')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${selectedRoom.status === 'AVAILABLE' ? 'bg-emerald-500 text-navy-950' : 'bg-navy-850 text-emerald-400'}`}>BO'SH</button>
                    <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'OCCUPIED')} className={`px-3 py-1.5 rounded-lg text-xs font-extrabold ${selectedRoom.status === 'OCCUPIED' ? 'bg-red-600 text-white' : 'bg-navy-850 text-red-400'}`}>ZANIT</button>
                    <button onClick={() => handleUpdateRoomStatus(selectedRoom.id, 'RESERVED')} className={`px-3 py-1.5 rounded-lg text-xs font-bold ${selectedRoom.status === 'RESERVED' ? 'bg-amber-500 text-navy-950' : 'bg-navy-850 text-amber-400'}`}>BAND</button>
                  </div>
                </div>

                {/* Bill Box */}
                <div className="p-4 rounded-xl bg-navy-900 border border-turquoise-500/30 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>Taomlar summasi:</span>
                    <span className="font-mono font-bold text-white">{formatUZS(calcRoomSubtotal(selectedRoom.id))}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Xizmat haqi ({settings.serviceChargePercent}%):</span>
                    <span className="font-mono">+{formatUZS(calcRoomService(selectedRoom.id))}</span>
                  </div>
                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                    <span className="font-bold text-white text-sm">UMUMIY HISOB:</span>
                    <span className="font-mono font-extrabold text-turquoise-300 text-xl">{formatUZS(calcRoomTotal(selectedRoom.id))}</span>
                  </div>
                  <div className="pt-3 flex gap-2">
                    <button onClick={() => handlePrintCurrentRoomBill(selectedRoom)} className="flex-1 py-2 rounded-xl bg-navy-800 text-white font-bold text-xs flex items-center justify-center gap-1.5">
                      <Icons.Printer className="w-4 h-4 text-turquoise-400" />
                      <span>Chekni Chop Etish</span>
                    </button>
                    <button onClick={() => handleOpenPayment(selectedRoom)} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold text-xs">
                      To'lov & Bo'shatish
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'menu' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {dishes.map(dish => (
                <div key={dish.id} className="rounded-2xl overflow-hidden glass-card border border-white/10 flex flex-col justify-between">
                  <div className="h-44 w-full relative">
                    <img src={dish.image} alt={dish.name} className="w-full h-full object-cover" />
                    <span className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/60 text-turquoise-300 text-xs font-bold">{dish.weight}</span>
                  </div>
                  <div className="p-4 space-y-3">
                    <h4 className="font-bold text-white text-base">{dish.name}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2">{dish.description}</p>
                    <div className="flex justify-between items-center pt-2 border-t border-white/10">
                      <span className="font-mono font-bold text-turquoise-300 text-sm">{formatUZS(dish.price)}</span>
                      <button onClick={() => handleAddFoodToRoom(selectedRoomId, dish, 1)} className="px-3 py-1.5 rounded-lg bg-turquoise-500 text-navy-950 font-bold text-xs">
                        + Xonaga Qo'shish
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'reservations' && (
            <div className="space-y-4">
              <button onClick={() => setBookingModal({ isOpen: true, targetRoomId: '' })} className="px-4 py-2 rounded-xl bg-turquoise-500 text-navy-950 font-bold text-xs">
                + Yangi Band Qilish
              </button>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {reservations.map(res => (
                  <div key={res.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-2 text-xs">
                    <div className="flex justify-between items-start">
                      <span className="font-bold text-white text-sm">{res.customerName}</span>
                      <span className="px-2 py-0.5 rounded bg-amber-500 text-navy-950 font-bold">{res.time}</span>
                    </div>
                    <p className="text-slate-300">Xona: <strong>№{res.roomNumber} ({res.roomName})</strong></p>
                    <p className="text-slate-400">{res.guests} kishi &bull; {res.phone}</p>
                    {res.status === 'confirmed' && (
                      <button onClick={() => handleSeatReservation(res)} className="w-full mt-2 py-2 rounded-lg bg-emerald-600 text-white font-bold text-xs">
                        Xonaga Joylashtirish (Zanit qilish)
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'bills' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rooms.filter(r => r.status === 'OCCUPIED').map(room => (
                <div key={room.id} className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-white text-base">№{room.number} – {room.name}</h4>
                      <p className="text-xs text-slate-400">Mehmon: {room.customer?.name}</p>
                    </div>
                    <span className="font-mono font-bold text-turquoise-300 text-xl">{formatUZS(calcRoomTotal(room.id))}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button onClick={() => handlePrintCurrentRoomBill(room)} className="flex-1 py-2 rounded-xl bg-navy-800 text-white text-xs font-bold">Chek Chop Etish</button>
                    <button onClick={() => handleOpenPayment(room)} className="flex-1 py-2 rounded-xl bg-emerald-600 text-white text-xs font-bold">To'lov & Bo'shatish</button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="glass-card rounded-2xl p-6 border border-white/10 max-w-lg mx-auto space-y-4 text-xs">
              <h3 className="font-bold text-white text-base">Sozlamalar</h3>
              <div>
                <label className="text-slate-300 block mb-1">Restoran Nomi:</label>
                <input type="text" value={settings.name} onChange={(e) => setSettings({...settings, name: e.target.value})} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Xizmat Haqi (%):</label>
                <input type="number" value={settings.serviceChargePercent} onChange={(e) => setSettings({...settings, serviceChargePercent: Number(e.target.value)})} className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-mono" />
              </div>
              <button onClick={handleResetDemoData} className="w-full py-2.5 rounded-xl bg-red-950/60 text-red-300 border border-red-500/40 font-bold">
                Namunaviy Ma'lumotlarni Qayta Yuklash
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {bookingModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-4 bg-navy-900 text-xs">
            <h3 className="font-bold text-white text-base">Xonani Band Qilish</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              const target = rooms.find(r => r.id === (bookingModal.targetRoomId || rooms[0].id));
              handleCreateReservation({
                roomId: target.id,
                roomNumber: target.number,
                roomName: target.name,
                customerName: e.target.customerName.value,
                phone: e.target.phone.value,
                date: '2026-11-11',
                time: e.target.time.value,
                guests: Number(e.target.guests.value),
                deposit: 200000
              });
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Mijoz Ismi:</label>
                <input name="customerName" required placeholder="Alisher Qodirov" className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Telefon:</label>
                <input name="phone" required defaultValue="+998 " className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-mono" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-slate-300 block mb-1">Vaqt:</label>
                  <input name="time" defaultValue="19:00" className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white" />
                </div>
                <div>
                  <label className="text-slate-300 block mb-1">Mehmonlar:</label>
                  <input name="guests" type="number" defaultValue="4" className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-bold" />
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setBookingModal({ isOpen: false, targetRoomId: '' })} className="flex-1 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-turquoise-500 text-navy-950 font-bold shadow-glow-cyan">Band qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Check In Modal */}
      {checkInModal.isOpen && checkInModal.room && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-4 bg-navy-900 text-xs">
            <h3 className="font-bold text-white text-base">Xonani Ochish (№{checkInModal.room.number})</h3>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleCheckInGuest(checkInModal.room.id, {
                name: e.target.name.value,
                phone: e.target.phone.value,
                guests: e.target.guests.value
              });
            }} className="space-y-3">
              <div>
                <label className="text-slate-300 block mb-1">Mijoz Ismi:</label>
                <input name="name" required placeholder="Bobur" className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Telefon:</label>
                <input name="phone" defaultValue="+998 " className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white" />
              </div>
              <div>
                <label className="text-slate-300 block mb-1">Mehmonlar:</label>
                <input name="guests" type="number" defaultValue={checkInModal.room.seats} className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-bold" />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setCheckInModal({ isOpen: false, room: null })} className="flex-1 py-2 rounded-xl bg-navy-800 text-slate-300 font-semibold">Bekor qilish</button>
                <button type="submit" className="flex-1 py-2 rounded-xl bg-emerald-600 text-white font-bold">Xonani ZANIT qilish</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {paymentModal.isOpen && paymentModal.room && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl glass-card border border-emerald-500/40 p-6 space-y-4 bg-navy-900 text-xs">
            <h3 className="font-bold text-white text-base">To'lov & Xonani Bo'shatish</h3>
            <div className="p-3 rounded-xl bg-navy-950 space-y-1">
              <div className="flex justify-between text-slate-300"><span>Taomlar summasi:</span><span>{formatUZS(calcRoomSubtotal(paymentModal.room.id))}</span></div>
              <div className="flex justify-between text-slate-300"><span>Xizmat haqi ({settings.serviceChargePercent}%):</span><span>+{formatUZS(calcRoomService(paymentModal.room.id))}</span></div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white text-sm"><span>JAMI TO'LOV:</span><span className="text-turquoise-300 text-base">{formatUZS(calcRoomTotal(paymentModal.room.id))}</span></div>
            </div>
            <div className="flex gap-2 pt-2">
              <button onClick={() => setPaymentModal({ isOpen: false, room: null })} className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-semibold">Bekor qilish</button>
              <button onClick={() => handleConfirmPayment(paymentModal.room, "Naqd")} className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white font-bold">To'landi & Bo'shatish</button>
            </div>
          </div>
        </div>
      )}

      {/* Printable Receipt Modal */}
      {receiptModal.isOpen && receiptModal.billData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 p-6 space-y-4 my-8 font-mono text-xs">
            <div className="no-print flex justify-between items-center pb-2 border-b">
              <span className="font-bold">Rasmiy Fiskal Chek</span>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="px-3 py-1 bg-navy-900 text-white rounded text-xs font-bold">Chop Etish</button>
                <button onClick={() => setReceiptModal({ isOpen: false, billData: null })} className="text-slate-500 font-bold">X</button>
              </div>
            </div>
            <div id="printable-receipt-area" className="space-y-3">
              <div className="text-center border-b pb-2">
                <h3 className="font-extrabold text-base font-display">FISH HOUSE</h3>
                <p className="text-[10px] text-slate-600">Dengiz ko'chasi 7-uy &bull; +998 71 200-88-99</p>
              </div>
              <div className="border-b pb-2 space-y-1 text-[11px]">
                <div className="flex justify-between"><span>Chek: <strong>{receiptModal.billData.id}</strong></span><span>{receiptModal.billData.date}</span></div>
                <div className="flex justify-between"><span>Xona: <strong>№{receiptModal.billData.roomNumber}</strong></span><span>{receiptModal.billData.time}</span></div>
                <div className="flex justify-between"><span>Mijoz: {receiptModal.billData.customerName}</span></div>
              </div>
              <div className="border-b pb-2 space-y-1">
                {receiptModal.billData.items.map((it, idx) => (
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
    </div>
  );
}

