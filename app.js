// FISH HOUSE - Main React Application Component

const { useState, useEffect, useMemo, useRef } = React;

// --- AUDIO SERVICE (Web Audio API Synthesizer) ---
const AudioService = {
  ctx: null,
  enabled: true,
  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  },
  playTone(freq, duration, type = 'sine', gainVal = 0.1) {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      if (this.ctx.state === 'suspended') this.ctx.resume();
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  playSuccess() {
    this.playTone(523.25, 0.12, 'triangle', 0.12);
    setTimeout(() => this.playTone(659.25, 0.12, 'triangle', 0.14), 100);
    setTimeout(() => this.playTone(783.99, 0.25, 'triangle', 0.15), 200);
  },
  playClick() {
    this.playTone(850, 0.04, 'sine', 0.05);
  },
  playOrder() {
    this.playTone(440, 0.1, 'sine', 0.1);
    setTimeout(() => this.playTone(880, 0.2, 'sine', 0.12), 90);
  },
  playCash() {
    this.playTone(650, 0.08, 'square', 0.08);
    setTimeout(() => this.playTone(950, 0.1, 'triangle', 0.12), 80);
    setTimeout(() => this.playTone(1300, 0.25, 'sine', 0.14), 160);
  }
};

// --- CURRENCY & FORMATTING HELPERS ---
function formatUZS(amount) {
  if (isNaN(amount) || amount === null || amount === undefined) return '0 UZS';
  return Number(amount).toLocaleString('uz-UZ').replace(/,/g, ' ') + ' UZS';
}

function getStatusBadge(status) {
  switch (status) {
    case 'OCCUPIED':
      return {
        text: 'ZANIT',
        className: 'bg-red-600 text-white font-extrabold shadow-glow-red animate-pulse border border-red-400/50',
        dot: 'bg-white',
        border: 'border-red-500/40'
      };
    case 'RESERVED':
      return {
        text: 'BAND QILINGAN',
        className: 'bg-amber-500/90 text-navy-950 font-bold border border-amber-300',
        dot: 'bg-navy-950',
        border: 'border-amber-500/40'
      };
    case 'AVAILABLE':
    default:
      return {
        text: "BO'SH",
        className: 'bg-emerald-500/90 text-navy-950 font-bold border border-emerald-300',
        dot: 'bg-navy-950',
        border: 'border-emerald-500/40'
      };
  }
}

// --- ICON COMPONENTS (Razor sharp SVG icons) ---
const Icons = {
  Fish: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6.5 12c.94-3.46 4.94-6 8.5-6 3.56 0 6.06 2.54 7 6-.94 3.46-3.44 6-7 6-3.56 0-7.56-2.54-8.5-6Z"/>
      <path d="M18 12c-.5 0-1-.5-1-1s.5-1 1-1 1 .5 1 1-.5 1-1 1Z"/>
      <path d="m2 16 4.5-4L2 8"/>
      <path d="M11 6v12"/>
    </svg>
  ),
  LayoutDashboard: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="7" height="9" x="3" y="3" rx="1"/>
      <rect width="7" height="5" x="14" y="3" rx="1"/>
      <rect width="7" height="9" x="14" y="12" rx="1"/>
      <rect width="7" height="5" x="3" y="16" rx="1"/>
    </svg>
  ),
  DoorClosed: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14"/>
      <path d="M2 20h20"/>
      <path d="M14 12v.01"/>
    </svg>
  ),
  Utensils: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 2v6a3 3 0 0 1-3 3 3 3 0 0 1-3-3V2"/>
      <path d="M15 11v11"/>
      <path d="M5 2v4a3 3 0 0 0 3 3h2"/>
      <path d="M7 2v20"/>
    </svg>
  ),
  Calendar: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
      <line x1="16" x2="16" y1="2" y2="6"/>
      <line x1="8" x2="8" y1="2" y2="6"/>
      <line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  ),
  Clock: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  Receipt: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1Z"/>
      <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
      <path d="M12 6v2"/>
      <path d="M12 16v2"/>
    </svg>
  ),
  BarChart3: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 3v18h18"/>
      <path d="M18 17V9"/>
      <path d="M13 17V5"/>
      <path d="M8 17v-3"/>
    </svg>
  ),
  Settings: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  ),
  Search: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8"/>
      <line x1="21" x2="16.65" y1="21" y2="16.65"/>
    </svg>
  ),
  Plus: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" x2="12" y1="5" y2="19"/>
      <line x1="5" x2="19" y1="12" y2="12"/>
    </svg>
  ),
  Minus: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" x2="19" y1="12" y2="12"/>
    </svg>
  ),
  Trash2: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18"/>
      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>
      <line x1="10" x2="10" y1="11" y2="17"/>
      <line x1="14" x2="14" y1="11" y2="17"/>
    </svg>
  ),
  Printer: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 6 2 18 2 18 9"/>
      <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
      <rect width="12" height="8" x="6" y="14"/>
    </svg>
  ),
  Check: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  ),
  X: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" x2="6" y1="6" y2="18"/>
      <line x1="6" x2="18" y1="6" y2="18"/>
    </svg>
  ),
  Users: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
      <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  Phone: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  ),
  ChefHat: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6Z"/>
      <line x1="6" x2="18" y1="17" y2="17"/>
    </svg>
  ),
  Wallet: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2"/>
      <line x1="2" x2="22" y1="10" y2="10"/>
    </svg>
  ),
  Sparkles: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
    </svg>
  ),
  Volume2: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    </svg>
  ),
  VolumeX: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="22" x2="16" y1="9" y2="15"/>
      <line x1="16" x2="22" y1="9" y2="15"/>
    </svg>
  ),
  ArrowLeft: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" x2="5" y1="12" y2="12"/>
      <polyline points="12 19 5 12 12 5"/>
    </svg>
  ),
  TrendingUp: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
      <polyline points="16 7 22 7 22 13"/>
    </svg>
  ),
  Menu: ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="4" x2="20" y1="12" y2="12"/>
      <line x1="4" x2="20" y1="6" y2="6"/>
      <line x1="4" x2="20" y1="18" y2="18"/>
    </svg>
  )
};

// --- APP COMPONENT ---
function App() {
  // Load initial data from LocalStorage or seed data
  const initialData = useMemo(() => {
    try {
      const saved = localStorage.getItem('FISH_HOUSE_APP_STATE_V1');
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return window.FISH_HOUSE_DATA || {};
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

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard'); // dashboard, rooms, room-detail, menu, reservations, orders, bills, reports, settings
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

  // Toast Notification
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    if (type === 'success') AudioService.playSuccess();
    else if (type === 'order') AudioService.playOrder();
    setTimeout(() => setToast(prev => ({ ...prev, show: false })), 3500);
  };

  // Sync AudioService enabled state
  useEffect(() => {
    AudioService.enabled = soundEnabled;
  }, [soundEnabled]);

  // Persist State to LocalStorage
  useEffect(() => {
    try {
      const stateToSave = {
        rooms,
        dishes,
        roomOrders,
        reservations,
        salesHistory,
        restaurant: settings
      };
      localStorage.setItem('FISH_HOUSE_APP_STATE_V1', JSON.stringify(stateToSave));
    } catch(e) {}
  }, [rooms, dishes, roomOrders, reservations, salesHistory, settings]);

  // Calculations Helpers
  const calcRoomSubtotal = (roomId) => {
    const orders = roomOrders[roomId] || [];
    return orders.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calcRoomService = (roomId) => {
    const sub = calcRoomSubtotal(roomId);
    return Math.round(sub * ((settings.serviceChargePercent || 10) / 100));
  };

  const calcRoomTotal = (roomId) => {
    return calcRoomSubtotal(roomId) + calcRoomService(roomId);
  };

  const getRoomItemCount = (roomId) => {
    const orders = roomOrders[roomId] || [];
    return orders.reduce((cnt, item) => cnt + item.quantity, 0);
  };

  // Metrics for Dashboard
  const metrics = useMemo(() => {
    const totalRooms = rooms.length;
    const availableRooms = rooms.filter(r => r.status === 'AVAILABLE').length;
    const occupiedRooms = rooms.filter(r => r.status === 'OCCUPIED').length;
    const reservedRooms = rooms.filter(r => r.status === 'RESERVED').length;

    // Today's revenue: completed bills today + current active occupied rooms subtotal
    const todayBills = salesHistory.filter(b => b.date === '2026-11-11');
    const pastRevenueToday = todayBills.reduce((acc, curr) => acc + curr.total, 0);
    const liveRevenue = rooms
      .filter(r => r.status === 'OCCUPIED')
      .reduce((acc, r) => acc + calcRoomTotal(r.id), 0);
    const todayRevenue = pastRevenueToday + liveRevenue;

    // Total orders count
    let totalFoodOrders = 0;
    Object.values(roomOrders).forEach(orders => {
      totalFoodOrders += orders.reduce((acc, o) => acc + o.quantity, 0);
    });

    return {
      totalRooms,
      availableRooms,
      occupiedRooms,
      reservedRooms,
      todayRevenue,
      totalFoodOrders
    };
  }, [rooms, roomOrders, salesHistory, settings]);

  // --- ROOM HANDLERS ---
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
        if (newStatus === 'AVAILABLE') {
          updatedCustomer = null;
        } else if (newStatus === 'OCCUPIED' && !r.customer) {
          updatedCustomer = {
            name: "Yangi Mehmon",
            phone: "+998 -- --- -- --",
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

  // Check-In Guest Handler
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
    showToast(`Xona muvaffaqiyatli ochildi va ZANIT holatiga o'tkazildi!`, 'success');
  };

  // --- ORDER HANDLERS ---
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
      status: 'pending' // pending -> preparing -> completed
    };

    setRoomOrders(prev => {
      const currentList = prev[roomId] ? [...prev[roomId]] : [];
      // check if existing item can be incremented
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

    // If room was AVAILABLE, automatically turn to OCCUPIED
    const targetRoom = rooms.find(r => r.id === roomId);
    if (targetRoom && targetRoom.status === 'AVAILABLE') {
      handleUpdateRoomStatus(roomId, 'OCCUPIED');
    }

    setOrderModal({ isOpen: false, dish: null, targetRoomId: '' });
    showToast(`${dish.name} (${quantity} dona) xonaga qo'shildi!`, 'order');
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
    showToast("Taom buyurtmadan olib tashlandi", 'info');
  };

  const handleUpdateOrderStatus = (roomId, orderItemId, newStatus) => {
    AudioService.playClick();
    setRoomOrders(prev => {
      const list = prev[roomId] || [];
      const updated = list.map(item => item.id === orderItemId ? { ...item, status: newStatus } : item);
      return { ...prev, [roomId]: updated };
    });
    showToast(`Buyurtma holati: ${newStatus === 'completed' ? 'Yetkazildi' : newStatus === 'preparing' ? 'Tayyorlanmoqda' : 'Kutilmoqda'}`);
  };

  // --- RESERVATION HANDLERS ---
  const handleCreateReservation = (reservationData) => {
    const newRes = {
      id: 'res-' + Date.now(),
      ...reservationData,
      status: 'confirmed',
      createdAt: new Date().toLocaleString('uz-UZ')
    };

    setReservations(prev => [newRes, ...prev]);

    // Change room status to RESERVED
    setRooms(prev => prev.map(r => {
      if (r.id === reservationData.roomId) {
        return {
          ...r,
          status: 'RESERVED',
          reservation: newRes
        };
      }
      return r;
    }));

    setBookingModal({ isOpen: false, targetRoomId: '' });
    showToast(`Xona ${reservationData.roomNumber} muvaffaqiyatli band qilindi!`, 'success');
  };

  const handleSeatReservation = (reservation) => {
    AudioService.playSuccess();
    // Mark room OCCUPIED and transfer customer info
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

    // Update reservation status
    setReservations(prev => prev.map(res => res.id === reservation.id ? { ...res, status: 'seated' } : res));
    showToast(`Mehmon ${reservation.customerName} xonaga joylashtirildi! Xona: ZANIT`, 'success');
  };

  const handleCancelReservation = (reservationId, roomId) => {
    AudioService.playClick();
    setReservations(prev => prev.map(res => res.id === reservationId ? { ...res, status: 'cancelled' } : res));
    setRooms(prev => prev.map(r => {
      if (r.id === roomId && r.status === 'RESERVED') {
        return { ...r, status: 'AVAILABLE', reservation: null };
      }
      return r;
    }));
    showToast("Band qilish bekor qilindi va xona bo'shatildi", 'info');
  };

  // --- PAYMENT & BILL CHECKOUT HANDLERS ---
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

    // Add to sales history
    setSalesHistory(prev => [newBill, ...prev]);

    // Clear room orders
    setRoomOrders(prev => {
      const copy = { ...prev };
      delete copy[room.id];
      return copy;
    });

    // Make room AVAILABLE
    setRooms(prev => prev.map(r => {
      if (r.id === room.id) {
        return {
          ...r,
          status: 'AVAILABLE',
          customer: null,
          reservation: null
        };
      }
      return r;
    }));

    setPaymentModal({ isOpen: false, room: null });
    // Open receipt modal for printing
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

  // Reset to default seed data
  const handleResetDemoData = () => {
    if (window.confirm("Barcha ma'lumotlarni boshlang'ich holatga qaytarmoqchimisiz?")) {
      localStorage.removeItem('FISH_HOUSE_APP_STATE_V1');
      if (window.FISH_HOUSE_DATA) {
        setRooms(window.FISH_HOUSE_DATA.rooms);
        setDishes(window.FISH_HOUSE_DATA.dishes);
        setRoomOrders(window.FISH_HOUSE_DATA.roomOrders);
        setReservations(window.FISH_HOUSE_DATA.reservations);
        setSalesHistory(window.FISH_HOUSE_DATA.salesHistory);
        setSettings(window.FISH_HOUSE_DATA.restaurant);
      }
      showToast("Barcha namunaviy ma'lumotlar qayta tiklandi!", 'success');
    }
  };

  const selectedRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  return (
    <div className="flex h-screen overflow-hidden bg-navy-950 text-slate-100">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-5 py-3.5 rounded-xl shadow-glass border border-turquoise-500/40 bg-navy-900/95 text-white backdrop-blur-md animate-bounce">
          <div className="w-3 h-3 rounded-full bg-turquoise-400 animate-ping"></div>
          <span className="font-semibold text-sm">{toast.message}</span>
        </div>
      )}

      {/* Sidebar Navigation */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        metrics={metrics}
        restaurantName={settings.name}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        setSelectedRoomId={setSelectedRoomId}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Topbar 
          activeTab={activeTab} 
          setSidebarOpen={setSidebarOpen}
          soundEnabled={soundEnabled}
          setSoundEnabled={setSoundEnabled}
          occupiedCount={metrics.occupiedRooms}
          onQuickBook={() => setBookingModal({ isOpen: true, targetRoomId: '' })}
          restaurantName={settings.name}
        />

        {/* View Switcher Container */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-gradient-to-b from-navy-950 via-navy-900 to-navy-950">
          {activeTab === 'dashboard' && (
            <DashboardView 
              metrics={metrics} 
              rooms={rooms} 
              onSelectRoom={handleOpenRoomDetails}
              onCheckInGuest={(room) => setCheckInModal({ isOpen: true, room })}
              onOpenPayment={handleOpenPayment}
              onNavigate={setActiveTab}
              calcRoomTotal={calcRoomTotal}
              reservations={reservations}
              onSeatReservation={handleSeatReservation}
              salesHistory={salesHistory}
            />
          )}

          {activeTab === 'rooms' && (
            <DiningRoomsView 
              rooms={rooms}
              onSelectRoom={handleOpenRoomDetails}
              onAddFood={(roomId) => setOrderModal({ isOpen: true, dish: dishes[0], targetRoomId: roomId })}
              onOpenPayment={handleOpenPayment}
              onCheckInGuest={(room) => setCheckInModal({ isOpen: true, room })}
              onBookRoom={(roomId) => setBookingModal({ isOpen: true, targetRoomId: roomId })}
              onUpdateStatus={handleUpdateRoomStatus}
              calcRoomTotal={calcRoomTotal}
              getRoomItemCount={getRoomItemCount}
              onAddNewRoom={() => setRoomModal({ isOpen: true, isEdit: false, roomData: null })}
              onEditRoom={(room) => setRoomModal({ isOpen: true, isEdit: true, roomData: room })}
              onDeleteRoom={(roomId) => {
                if (window.confirm("Rostdan ham bu xonani o'chirmoqchimisiz?")) {
                  setRooms(prev => prev.filter(r => r.id !== roomId));
                  showToast("Xona o'chirildi");
                }
              }}
            />
          )}

          {activeTab === 'room-detail' && selectedRoom && (
            <RoomDetailsView 
              room={selectedRoom}
              orders={roomOrders[selectedRoom.id] || []}
              dishes={dishes}
              onBack={() => setActiveTab('rooms')}
              onUpdateStatus={(status) => handleUpdateRoomStatus(selectedRoom.id, status)}
              onAddFood={(dish, qty, notes) => handleAddFoodToRoom(selectedRoom.id, dish, qty, notes)}
              onUpdateQty={(orderId, delta) => handleUpdateOrderItemQty(selectedRoom.id, orderId, delta)}
              onRemoveItem={(orderId) => handleRemoveOrderItem(selectedRoom.id, orderId)}
              subtotal={calcRoomSubtotal(selectedRoom.id)}
              service={calcRoomService(selectedRoom.id)}
              total={calcRoomTotal(selectedRoom.id)}
              servicePercent={settings.serviceChargePercent}
              onPrintBill={() => handlePrintCurrentRoomBill(selectedRoom)}
              onCheckout={() => handleOpenPayment(selectedRoom)}
              onUpdateCustomer={(customerData) => {
                setRooms(prev => prev.map(r => r.id === selectedRoom.id ? { ...r, customer: customerData } : r));
                showToast("Mijoz ma'lumotlari yangilandi");
              }}
            />
          )}

          {activeTab === 'menu' && (
            <FoodMenuView 
              dishes={dishes}
              rooms={rooms}
              onOrderDish={(dish) => setOrderModal({ isOpen: true, dish, targetRoomId: rooms.find(r => r.status === 'OCCUPIED')?.id || rooms[0]?.id || '' })}
            />
          )}

          {activeTab === 'reservations' && (
            <ReservationsView 
              reservations={reservations}
              rooms={rooms}
              onNewReservation={() => setBookingModal({ isOpen: true, targetRoomId: '' })}
              onSeatReservation={handleSeatReservation}
              onCancelReservation={handleCancelReservation}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersView 
              roomOrders={roomOrders}
              rooms={rooms}
              dishes={dishes}
              onUpdateStatus={handleUpdateOrderStatus}
              onAddFoodClick={() => setOrderModal({ isOpen: true, dish: dishes[0], targetRoomId: rooms[0]?.id || '' })}
            />
          )}

          {activeTab === 'bills' && (
            <RoomBillsView 
              rooms={rooms.filter(r => r.status === 'OCCUPIED')}
              roomOrders={roomOrders}
              calcRoomSubtotal={calcRoomSubtotal}
              calcRoomService={calcRoomService}
              calcRoomTotal={calcRoomTotal}
              servicePercent={settings.serviceChargePercent}
              onPrintBill={handlePrintCurrentRoomBill}
              onCheckout={handleOpenPayment}
              salesHistory={salesHistory}
            />
          )}

          {activeTab === 'reports' && (
            <ReportsView 
              salesHistory={salesHistory}
              rooms={rooms}
              roomOrders={roomOrders}
              dishes={dishes}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsView 
              settings={settings}
              setSettings={setSettings}
              onResetDemoData={handleResetDemoData}
              showToast={showToast}
            />
          )}
        </main>
      </div>

      {/* MODALS */}
      {orderModal.isOpen && (
        <OrderFoodModal 
          dish={orderModal.dish}
          rooms={rooms}
          initialRoomId={orderModal.targetRoomId}
          onClose={() => setOrderModal({ isOpen: false, dish: null, targetRoomId: '' })}
          onConfirm={(roomId, dish, qty, notes) => handleAddFoodToRoom(roomId, dish, qty, notes)}
        />
      )}

      {bookingModal.isOpen && (
        <BookingModal 
          rooms={rooms}
          preselectedRoomId={bookingModal.targetRoomId}
          onClose={() => setBookingModal({ isOpen: false, targetRoomId: '' })}
          onConfirm={handleCreateReservation}
        />
      )}

      {checkInModal.isOpen && checkInModal.room && (
        <CheckInModal 
          room={checkInModal.room}
          onClose={() => setCheckInModal({ isOpen: false, room: null })}
          onConfirm={(guestData) => handleCheckInGuest(checkInModal.room.id, guestData)}
        />
      )}

      {paymentModal.isOpen && paymentModal.room && (
        <PaymentModal 
          room={paymentModal.room}
          subtotal={calcRoomSubtotal(paymentModal.room.id)}
          service={calcRoomService(paymentModal.room.id)}
          total={calcRoomTotal(paymentModal.room.id)}
          servicePercent={settings.serviceChargePercent}
          items={roomOrders[paymentModal.room.id] || []}
          onClose={() => setPaymentModal({ isOpen: false, room: null })}
          onConfirm={(method) => handleConfirmPayment(paymentModal.room, method)}
        />
      )}

      {receiptModal.isOpen && receiptModal.billData && (
        <ReceiptModal 
          bill={receiptModal.billData}
          restaurant={settings}
          onClose={() => setReceiptModal({ isOpen: false, billData: null })}
        />
      )}

      {roomModal.isOpen && (
        <RoomModal 
          isEdit={roomModal.isEdit}
          initialData={roomModal.roomData}
          onClose={() => setRoomModal({ isOpen: false, isEdit: false, roomData: null })}
          onSave={(roomData) => {
            if (roomModal.isEdit) {
              setRooms(prev => prev.map(r => r.id === roomData.id ? { ...r, ...roomData } : r));
              showToast("Xona ma'lumotlari yangilandi");
            } else {
              const newRoom = {
                id: 'r' + (rooms.length + 101),
                status: 'AVAILABLE',
                customer: null,
                ...roomData
              };
              setRooms(prev => [...prev, newRoom]);
              showToast("Yangi xona muvaffaqiyatli qo'shildi!");
            }
            setRoomModal({ isOpen: false, isEdit: false, roomData: null });
          }}
        />
      )}
    </div>
  );
}

// --- TOPBAR COMPONENT ---
function Topbar({ activeTab, setSidebarOpen, soundEnabled, setSoundEnabled, occupiedCount, onQuickBook, restaurantName }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPageTitle = () => {
    switch(activeTab) {
      case 'dashboard': return 'Boshqaruv Paneli & Statistika';
      case 'rooms': return 'Xonalar va Kabinetlar';
      case 'room-detail': return 'Xona Tafsilotlari & Hisob';
      case 'menu': return 'Baliq Taomlari Menyusi';
      case 'reservations': return 'Band Qilingan Xonalar';
      case 'orders': return 'Oshxona & Buyurtmalar Nazorati';
      case 'bills': return 'Umumiy Hisob-Kitob & Cheklar';
      case 'reports': return 'Hisobotlar va Tahlillar';
      case 'settings': return 'Tizim Sozlamalari';
      default: return restaurantName;
    }
  };

  return (
    <header className="h-16 px-4 sm:px-8 border-b border-white/10 bg-navy-900/90 backdrop-blur-md flex items-center justify-between z-20">
      <div className="flex items-center space-x-3">
        <button 
          onClick={() => setSidebarOpen(prev => !prev)}
          className="lg:hidden p-2 rounded-lg bg-navy-800 text-slate-300 hover:text-white"
        >
          <Icons.Menu className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-white tracking-wide flex items-center gap-2">
            <span>{getPageTitle()}</span>
          </h1>
          <p className="text-xs text-slate-400 hidden sm:block">FISH HOUSE Restaurant POS & Management System</p>
        </div>
      </div>

      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Active Occupied Indicator */}
        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-red-950/80 border border-red-500/40 text-red-400 text-xs font-semibold">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
          <span>{occupiedCount} ta xona ZANIT</span>
        </div>

        {/* Live Clock */}
        <div className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-navy-850 border border-white/5 text-xs text-turquoise-300 font-mono">
          <Icons.Clock className="w-4 h-4 text-turquoise-400" />
          <span>{time}</span>
        </div>

        {/* Audio Toggle */}
        <button 
          onClick={() => {
            setSoundEnabled(!soundEnabled);
            AudioService.playClick();
          }}
          title={soundEnabled ? "Ovozni o'chirish" : "Ovozni yoqish"}
          className={`p-2 rounded-lg border transition-colors ${soundEnabled ? 'bg-turquoise-500/10 border-turquoise-500/40 text-turquoise-400' : 'bg-navy-800 border-white/10 text-slate-400'}`}
        >
          {soundEnabled ? <Icons.Volume2 className="w-4 h-4" /> : <Icons.VolumeX className="w-4 h-4" />}
        </button>

        {/* Quick Booking Button */}
        <button 
          onClick={onQuickBook}
          className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-xs sm:text-sm shadow-glow-cyan transition-all transform active:scale-95"
        >
          <Icons.Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Stol Band Qilish</span>
          <span className="sm:hidden">Band</span>
        </button>
      </div>
    </header>
  );
}

// --- SIDEBAR COMPONENT ---
function Sidebar({ activeTab, setActiveTab, metrics, restaurantName, sidebarOpen, setSidebarOpen, setSelectedRoomId }) {
  const navItems = [
    { id: 'dashboard', label: 'Boshqaruv Paneli', icon: Icons.LayoutDashboard },
    { id: 'rooms', label: 'Xonalar va Kabinetlar', icon: Icons.DoorClosed, badge: metrics.occupiedRooms, badgeColor: 'bg-red-500 text-white' },
    { id: 'menu', label: 'Baliq Taomlari', icon: Icons.Fish },
    { id: 'reservations', label: 'Band Qilinganlar', icon: Icons.Calendar, badge: metrics.reservedRooms, badgeColor: 'bg-amber-500 text-navy-950' },
    { id: 'orders', label: 'Oshxona Buyurtmalari', icon: Icons.ChefHat },
    { id: 'bills', label: 'Umumiy Hisob-Kitob', icon: Icons.Receipt },
    { id: 'reports', label: 'Hisobotlar', icon: Icons.BarChart3 },
    { id: 'settings', label: 'Sozlamalar', icon: Icons.Settings }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div 
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-30 lg:hidden"
        />
      )}

      <aside className={`fixed lg:static top-0 bottom-0 left-0 w-64 bg-navy-900 border-r border-white/10 z-40 flex flex-col transition-transform duration-300 ease-in-out ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        {/* Brand Header */}
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
          <button 
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 overflow-y-auto px-4 py-5 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold tracking-wider text-slate-400 uppercase">
            Asosiy Menyular
          </div>
          {navItems.map(item => {
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

        {/* Room Status Indicator Box in Sidebar */}
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

        {/* Cashier / Staff Badge */}
        <div className="p-4 border-t border-white/10 bg-navy-950/60 flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-turquoise-500 to-ocean-600 flex items-center justify-center text-navy-950 font-bold text-sm">
            FH
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">Administrator</p>
            <p className="text-[11px] text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
              Onlayn Tizim
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}

// --- DASHBOARD VIEW ---
function DashboardView({ metrics, rooms, onSelectRoom, onCheckInGuest, onOpenPayment, onNavigate, calcRoomTotal, reservations, onSeatReservation, salesHistory }) {
  const statCards = [
    {
      title: "Jami Xonalar",
      value: metrics.totalRooms,
      subtext: "Restoran kabinetlari",
      icon: Icons.DoorClosed,
      gradient: "from-blue-600/30 to-ocean-800/40",
      border: "border-blue-500/30",
      textColor: "text-blue-400"
    },
    {
      title: "Bo'sh Xonalar",
      value: metrics.availableRooms,
      subtext: "Mijozlarni qabul qiladi",
      icon: Icons.Check,
      gradient: "from-emerald-600/30 to-teal-800/40",
      border: "border-emerald-500/40",
      textColor: "text-emerald-400"
    },
    {
      title: "Band Xonalar (ZANIT)",
      value: metrics.occupiedRooms,
      subtext: "Ayni damda xizmatda",
      icon: Icons.Users,
      gradient: "from-red-600/30 to-rose-900/40",
      border: "border-red-500/50",
      textColor: "text-red-400",
      highlight: true
    },
    {
      title: "Rezervatsiyalar",
      value: metrics.reservedRooms,
      subtext: "Oldindan band qilingan",
      icon: Icons.Calendar,
      gradient: "from-amber-600/30 to-orange-800/40",
      border: "border-amber-500/40",
      textColor: "text-amber-400"
    },
    {
      title: "Bugungi Tushum",
      value: formatUZS(metrics.todayRevenue),
      subtext: "Kassa + Faol xonalar hisobi",
      icon: Icons.TrendingUp,
      gradient: "from-cyan-600/30 to-teal-800/40",
      border: "border-cyan-500/40",
      textColor: "text-cyan-300",
      isMoney: true
    },
    {
      title: "Jami Buyurtmalar",
      value: `${metrics.totalFoodOrders} ta taom`,
      subtext: "Oshxona faolligi",
      icon: Icons.Utensils,
      gradient: "from-indigo-600/30 to-purple-800/40",
      border: "border-indigo-500/40",
      textColor: "text-indigo-400"
    }
  ];

  const occupiedRoomsList = rooms.filter(r => r.status === 'OCCUPIED');
  const pendingReservations = reservations.filter(res => res.status === 'confirmed');

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-navy-900 via-navy-850 to-ocean-950 border border-white/10 p-6 sm:p-8 shadow-glass">
        <div className="absolute top-0 right-0 w-96 h-96 bg-turquoise-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-turquoise-500/10 border border-turquoise-500/30 text-turquoise-300 text-xs font-semibold mb-3">
              <Icons.Sparkles className="w-3.5 h-3.5" />
              <span>FISH HOUSE Premium Platform</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-white">
              Xush kelibsiz, Boshqaruvchimiz!
            </h2>
            <p className="text-slate-300 text-sm max-w-xl mt-1">
              Restorandagi barcha xonalar, baliq taomlari buyurtmalari, band qilishlar va avtomatik hisob-kitoblar to'liq nazorat ostida.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button 
              onClick={() => onNavigate('rooms')}
              className="px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-semibold text-sm border border-white/10 transition-all"
            >
              Barcha Xonalar ({rooms.length})
            </button>
            <button 
              onClick={() => onNavigate('menu')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-sm shadow-glow-cyan transition-all"
            >
              Taomlar Menyusi
            </button>
          </div>
        </div>
      </div>

      {/* 6 Key Statistic Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {statCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div 
              key={idx}
              className={`relative overflow-hidden rounded-2xl glass-card p-5 border ${card.border} bg-gradient-to-br ${card.gradient} transition-all hover:scale-[1.02] shadow-glass`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-300">{card.title}</p>
                  <p className={`text-2xl lg:text-3xl font-display font-extrabold mt-2 ${card.textColor}`}>
                    {card.value}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">{card.subtext}</p>
                </div>
                <div className={`p-3 rounded-xl bg-navy-900/80 border border-white/10 ${card.textColor}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Live Room Status Grid (Interactive Quick Board) */}
      <div className="glass-card rounded-2xl p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/10 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icons.DoorClosed className="w-5 h-5 text-turquoise-400" />
              <span>Tezkor Xonalar Holati (Jonli Monitor)</span>
            </h3>
            <p className="text-xs text-slate-400">Xona ustiga bosib uning buyurtmasi va hisobiga o'tishingiz mumkin</p>
          </div>
          <div className="flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Bo'sh ({metrics.availableRooms})
            </span>
            <span className="flex items-center gap-1.5 text-red-400 font-extrabold">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
              ZANIT ({metrics.occupiedRooms})
            </span>
            <span className="flex items-center gap-1.5 text-amber-400">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              Band ({metrics.reservedRooms})
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {rooms.map(room => {
            const isOccupied = room.status === 'OCCUPIED';
            const isReserved = room.status === 'RESERVED';
            const bill = isOccupied ? calcRoomTotal(room.id) : 0;
            return (
              <button
                key={room.id}
                onClick={() => onSelectRoom(room.id)}
                className={`relative p-3 rounded-xl border text-left transition-all hover:scale-105 ${
                  isOccupied 
                    ? 'bg-red-950/70 border-red-500/60 shadow-glow-red' 
                    : isReserved 
                    ? 'bg-amber-950/50 border-amber-500/40' 
                    : 'bg-navy-850/80 border-emerald-500/40 hover:border-turquoise-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-300">№{room.number}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    isOccupied ? 'bg-red-500 animate-pulse' : isReserved ? 'bg-amber-400' : 'bg-emerald-400'
                  }`}></span>
                </div>
                <p className="text-xs font-bold text-white truncate">{room.name}</p>
                <div className="mt-2 text-[10px]">
                  {isOccupied ? (
                    <span className="font-extrabold text-red-400 block truncate">ZANIT</span>
                  ) : isReserved ? (
                    <span className="text-amber-300 block truncate">Band ({room.reservation?.time || 'Kechki'})</span>
                  ) : (
                    <span className="text-emerald-300 block truncate">Bo'sh ({room.seats} o'rin)</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Two Column Layout: Occupied Rooms Bill Table & Upcoming Reservations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Currently Occupied Rooms with Active Bills */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-red-500 animate-ping"></span>
              <h3 className="text-lg font-bold text-white">Faol Zanit Xonalar va Hisoblar</h3>
            </div>
            <button 
              onClick={() => onNavigate('bills')} 
              className="text-xs text-turquoise-400 hover:text-turquoise-300 font-semibold"
            >
              Barcha hisoblar &rarr;
            </button>
          </div>

          {occupiedRoomsList.length === 0 ? (
            <div className="py-12 text-center text-slate-400">
              <Icons.DoorClosed className="w-12 h-12 mx-auto text-slate-600 mb-2" />
              <p>Hozirda barcha xonalar bo'sh.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-xs text-slate-400 uppercase">
                    <th className="pb-3 font-semibold">Xona</th>
                    <th className="pb-3 font-semibold">Mehmon</th>
                    <th className="pb-3 font-semibold">Kirgan vaqti</th>
                    <th className="pb-3 font-semibold">Umumiy Hisob</th>
                    <th className="pb-3 font-semibold text-right">Amallar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {occupiedRoomsList.map(room => {
                    const total = calcRoomTotal(room.id);
                    return (
                      <tr key={room.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-3">
                          <div className="flex items-center space-x-2.5">
                            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-xs">
                              ZANIT
                            </span>
                            <div>
                              <p className="font-bold text-white text-sm">№{room.number} – {room.name}</p>
                              <p className="text-[11px] text-slate-400">{room.type}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3">
                          <p className="font-semibold text-slate-200">{room.customer?.name || 'Mijoz'}</p>
                          <p className="text-xs text-slate-400">{room.customer?.phone || '-'}</p>
                        </td>
                        <td className="py-3 text-xs text-slate-300">
                          {room.customer?.checkInTime || 'Bugun'}
                        </td>
                        <td className="py-3">
                          <span className="font-extrabold text-turquoise-300 font-mono text-base">
                            {formatUZS(total)}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => onSelectRoom(room.id)}
                              className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-navy-750 text-xs font-semibold text-slate-200 border border-white/10"
                            >
                              Hisob
                            </button>
                            <button
                              onClick={() => onOpenPayment(room)}
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-sm"
                            >
                              Yopish
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right 1 Col: Upcoming Reservations */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Icons.Calendar className="w-5 h-5 text-amber-400" />
              <span>Yaqin Rezervatsiyalar</span>
            </h3>
            <button 
              onClick={() => onNavigate('reservations')} 
              className="text-xs text-amber-400 hover:text-amber-300 font-semibold"
            >
              Hammasi &rarr;
            </button>
          </div>

          {pendingReservations.length === 0 ? (
            <div className="py-10 text-center text-slate-400 text-sm">
              Faol rezervatsiyalar mavjud emas.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingReservations.slice(0, 3).map(res => (
                <div key={res.id} className="p-3.5 rounded-xl bg-navy-850/90 border border-amber-500/20 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-bold text-white text-sm">{res.customerName}</p>
                      <p className="text-xs text-amber-300 font-medium">Xona №{res.roomNumber} ({res.roomName})</p>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30 text-amber-300 font-mono text-xs font-bold">
                      {res.time}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                    <span>{res.guests} kishi &bull; {res.phone}</span>
                    <button
                      onClick={() => onSeatReservation(res)}
                      className="px-2.5 py-1 rounded bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-bold text-xs"
                    >
                      Joylashtirish
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- DINING ROOMS VIEW ---
function DiningRoomsView({ rooms, onSelectRoom, onAddFood, onOpenPayment, onCheckInGuest, onBookRoom, onUpdateStatus, calcRoomTotal, getRoomItemCount, onAddNewRoom, onEditRoom, onDeleteRoom }) {
  const [filter, setFilter] = useState('ALL'); // ALL, AVAILABLE, OCCUPIED, RESERVED
  const [search, setSearch] = useState('');
  const [capacityFilter, setCapacityFilter] = useState('ALL');

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      // Status filter
      if (filter !== 'ALL' && room.status !== filter) return false;
      // Search filter
      if (search.trim()) {
        const query = search.toLowerCase();
        const matchNumber = room.number.toLowerCase().includes(query);
        const matchName = room.name.toLowerCase().includes(query);
        const matchCustomer = room.customer?.name.toLowerCase().includes(query);
        if (!matchNumber && !matchName && !matchCustomer) return false;
      }
      // Capacity filter
      if (capacityFilter === 'SMALL' && room.seats > 6) return false;
      if (capacityFilter === 'MEDIUM' && (room.seats <= 6 || room.seats > 12)) return false;
      if (capacityFilter === 'LARGE' && room.seats <= 12) return false;

      return true;
    });
  }, [rooms, filter, search, capacityFilter]);

  return (
    <div className="space-y-6">
      {/* Controls Bar: Search, Filters, Add Room */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Icons.Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Xona raqami yoki nomini izlash..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-turquoise-400 transition-colors"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'ALL' ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300 hover:text-white border border-white/5'
            }`}
          >
            Barchasi ({rooms.length})
          </button>
          <button
            onClick={() => setFilter('AVAILABLE')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'AVAILABLE' ? 'bg-emerald-500 text-navy-950 shadow-md' : 'bg-navy-850 text-emerald-400 hover:bg-navy-800 border border-emerald-500/30'
            }`}
          >
            Bo'sh ({rooms.filter(r => r.status === 'AVAILABLE').length})
          </button>
          <button
            onClick={() => setFilter('OCCUPIED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all ${
              filter === 'OCCUPIED' ? 'bg-red-600 text-white shadow-glow-red animate-pulse' : 'bg-navy-850 text-red-400 hover:bg-navy-800 border border-red-500/40'
            }`}
          >
            ZANIT ({rooms.filter(r => r.status === 'OCCUPIED').length})
          </button>
          <button
            onClick={() => setFilter('RESERVED')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
              filter === 'RESERVED' ? 'bg-amber-500 text-navy-950 shadow-md' : 'bg-navy-850 text-amber-400 hover:bg-navy-800 border border-amber-500/30'
            }`}
          >
            Band ({rooms.filter(r => r.status === 'RESERVED').length})
          </button>

          {/* Add Room Button */}
          <button
            onClick={onAddNewRoom}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-ocean-600 hover:from-cyan-400 hover:to-ocean-500 text-navy-950 font-bold text-xs shadow-glow-cyan ml-auto"
          >
            <Icons.Plus className="w-4 h-4" />
            <span>Yangi Xona</span>
          </button>
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredRooms.map(room => {
          const isOccupied = room.status === 'OCCUPIED';
          const isReserved = room.status === 'RESERVED';
          const isAvailable = room.status === 'AVAILABLE';
          const totalBill = isOccupied ? calcRoomTotal(room.id) : 0;
          const itemCount = isOccupied ? getRoomItemCount(room.id) : 0;

          return (
            <div 
              key={room.id}
              className={`rounded-2xl overflow-hidden glass-card glass-card-hover border flex flex-col justify-between ${
                isOccupied 
                  ? 'border-red-500/60 shadow-glow-red/40 bg-gradient-to-b from-navy-900 to-red-950/20' 
                  : isReserved 
                  ? 'border-amber-500/50' 
                  : 'border-emerald-500/40'
              }`}
            >
              {/* Room Card Image with Badges */}
              <div className="relative h-48 w-full overflow-hidden group">
                <img 
                  src={room.photo} 
                  alt={room.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/50"></div>

                {/* Top Left: Room Number & Type */}
                <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                  <span className="px-2.5 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md border border-white/20 text-white font-mono font-bold text-xs">
                    №{room.number}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-navy-900/80 backdrop-blur-md text-turquoise-300 text-xs font-semibold">
                    {room.type}
                  </span>
                </div>

                {/* Top Right: Status Badge (IMPORTANT: ZANIT in prominent bold red) */}
                <div className="absolute top-3 right-3">
                  {isOccupied && (
                    <div className="px-3 py-1.5 rounded-lg shimmer-badge text-white font-extrabold text-xs tracking-wider shadow-glow-red flex items-center gap-1.5 border border-red-300">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
                      <span>ZANIT</span>
                    </div>
                  )}
                  {isAvailable && (
                    <div className="px-3 py-1 rounded-lg bg-emerald-500 text-navy-950 font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-navy-950"></span>
                      <span>BO'SH</span>
                    </div>
                  )}
                  {isReserved && (
                    <div className="px-3 py-1 rounded-lg bg-amber-500 text-navy-950 font-extrabold text-xs tracking-wider flex items-center gap-1.5 shadow-md">
                      <span className="w-2 h-2 rounded-full bg-navy-950"></span>
                      <span>BAND QILINGAN</span>
                    </div>
                  )}
                </div>

                {/* Bottom of Image: Seats Capacity */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-white">
                  <span className="flex items-center gap-1.5 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-md">
                    <Icons.Users className="w-3.5 h-3.5 text-turquoise-300" />
                    <span>{room.seats} o'rinli ({room.capacityText})</span>
                  </span>
                  <span className="text-[11px] text-slate-300">{room.floor}</span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-display font-bold text-base text-white group-hover:text-turquoise-300 transition-colors">
                    {room.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-1">{room.description}</p>
                </div>

                {/* Status Specific Info */}
                {isOccupied && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-300 font-medium truncate">
                        Mehmon: <strong className="text-white">{room.customer?.name || 'Mijoz'}</strong>
                      </span>
                      <span className="text-red-400 font-bold">{room.customer?.checkInTime}</span>
                    </div>
                    <div className="flex items-center justify-between pt-1 border-t border-red-500/20 text-xs">
                      <span className="text-slate-400">{itemCount} xil taom</span>
                      <span className="text-turquoise-300 font-bold font-mono text-sm">
                        {formatUZS(totalBill)}
                      </span>
                    </div>
                  </div>
                )}

                {isReserved && (
                  <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/30 space-y-1 text-xs">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Mijoz: <strong className="text-white">{room.reservation?.name}</strong></span>
                      <span className="text-amber-400 font-bold">{room.reservation?.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-400">{room.reservation?.guests} kishi &bull; {room.reservation?.phone}</p>
                  </div>
                )}

                {isAvailable && (
                  <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-500/20 text-xs text-emerald-300 flex items-center justify-between">
                    <span>Xona ozoda va tayyor</span>
                    <span className="font-bold">Mavjud</span>
                  </div>
                )}

                {/* Amenities Badges */}
                <div className="flex flex-wrap gap-1">
                  {room.amenities.slice(0, 3).map((amenity, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-navy-800 text-slate-300">
                      {amenity}
                    </span>
                  ))}
                  {room.amenities.length > 3 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-navy-800 text-slate-400">
                      +{room.amenities.length - 3}
                    </span>
                  )}
                </div>

                {/* Card Action Buttons */}
                <div className="pt-2 border-t border-white/10 flex items-center gap-2">
                  <button
                    onClick={() => onSelectRoom(room.id)}
                    className="flex-1 py-2 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-semibold text-xs border border-white/10 transition-colors text-center"
                  >
                    Tafsilotlar
                  </button>

                  {isOccupied && (
                    <button
                      onClick={() => onOpenPayment(room)}
                      className="flex-1 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors text-center shadow-md"
                    >
                      Hisob & Yopish
                    </button>
                  )}

                  {isAvailable && (
                    <button
                      onClick={() => onCheckInGuest(room)}
                      className="flex-1 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-xs transition-colors text-center shadow-glow-cyan"
                    >
                      Xonani Ochish
                    </button>
                  )}

                  {isReserved && (
                    <button
                      onClick={() => onCheckInGuest(room)}
                      className="flex-1 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-navy-950 font-bold text-xs transition-colors text-center shadow-md"
                    >
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
  );
}

// --- ROOM DETAILS VIEW ---
function RoomDetailsView({ room, orders, dishes, onBack, onUpdateStatus, onAddFood, onUpdateQty, onRemoveItem, subtotal, service, total, servicePercent, onPrintBill, onCheckout, onUpdateCustomer }) {
  const [selectedDishId, setSelectedDishId] = useState(dishes[0]?.id || '');
  const [dishQty, setDishQty] = useState(1);
  const [dishNotes, setDishNotes] = useState('');
  const [isEditingCustomer, setIsEditingCustomer] = useState(false);
  const [customerForm, setCustomerForm] = useState(room.customer || {
    name: 'Yangi Mehmon',
    phone: '+998 ',
    guests: room.seats,
    waiter: 'Sardor Saidov',
    notes: ''
  });

  const isOccupied = room.status === 'OCCUPIED';

  const handleQuickAdd = (e) => {
    e.preventDefault();
    const dish = dishes.find(d => d.id === selectedDishId);
    if (!dish) return;
    onAddFood(dish, dishQty, dishNotes);
    setDishQty(1);
    setDishNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-navy-850 hover:bg-navy-800 text-slate-300 hover:text-white border border-white/10 text-xs font-semibold transition-colors w-fit"
        >
          <Icons.ArrowLeft className="w-4 h-4" />
          <span>Xonalar ro'yxatiga qaytish</span>
        </button>

        {/* Room Status Selector Buttons */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 mr-2 font-medium">Holatni o'zgartirish:</span>
          <button
            onClick={() => onUpdateStatus('AVAILABLE')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              room.status === 'AVAILABLE' ? 'bg-emerald-500 text-navy-950 shadow-md' : 'bg-navy-850 text-emerald-400 border border-emerald-500/30'
            }`}
          >
            BO'SH
          </button>
          <button
            onClick={() => onUpdateStatus('OCCUPIED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all ${
              room.status === 'OCCUPIED' ? 'bg-red-600 text-white shadow-glow-red animate-pulse' : 'bg-navy-850 text-red-400 border border-red-500/30'
            }`}
          >
            ZANIT
          </button>
          <button
            onClick={() => onUpdateStatus('RESERVED')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              room.status === 'RESERVED' ? 'bg-amber-500 text-navy-950 shadow-md' : 'bg-navy-850 text-amber-400 border border-amber-500/30'
            }`}
          >
            BAND QILINGAN
          </button>
        </div>
      </div>

      {/* Hero Banner for Selected Room */}
      <div className="relative rounded-2xl overflow-hidden glass-card border border-white/10 shadow-glass">
        <div className="h-56 sm:h-72 w-full relative">
          <img src={room.photo} alt={room.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-transparent"></div>
          
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <span className="px-3 py-1 rounded-lg bg-navy-900/90 text-white font-mono font-bold text-sm border border-white/20">
                  XONA №{room.number}
                </span>
                <span className="px-3 py-1 rounded-lg bg-ocean-700/80 text-cyan-200 text-xs font-semibold">
                  {room.type}
                </span>
                {isOccupied && (
                  <span className="px-3 py-1 rounded-lg shimmer-badge text-white font-extrabold text-xs tracking-wider shadow-glow-red">
                    ZANIT
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-display font-extrabold text-white">
                {room.name}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mt-1">
                {room.description}
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-navy-900/80 border border-white/10 text-slate-300">
                {room.seats} o'rin ({room.capacityText})
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-navy-900/80 border border-white/10 text-slate-300">
                {room.floor}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Details Grid: Customer Info & Orders + Total Bill */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Details & Add Dish */}
        <div className="space-y-6">
          {/* Customer Info Card */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Icons.Users className="w-5 h-5 text-turquoise-400" />
                <span>Mijoz Ma'lumotlari</span>
              </h3>
              <button
                onClick={() => setIsEditingCustomer(!isEditingCustomer)}
                className="text-xs text-turquoise-400 hover:text-turquoise-300 font-semibold"
              >
                {isEditingCustomer ? 'Yopish' : 'Tahrirlash'}
              </button>
            </div>

            {isEditingCustomer ? (
              <div className="space-y-3 pt-2 text-xs">
                <div>
                  <label className="text-slate-400 block mb-1">Mijoz Ismi:</label>
                  <input
                    type="text"
                    value={customerForm.name}
                    onChange={(e) => setCustomerForm({ ...customerForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Telefon Raqami:</label>
                  <input
                    type="text"
                    value={customerForm.phone}
                    onChange={(e) => setCustomerForm({ ...customerForm, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-slate-400 block mb-1">Mehmonlar soni:</label>
                    <input
                      type="number"
                      value={customerForm.guests}
                      onChange={(e) => setCustomerForm({ ...customerForm, guests: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 block mb-1">Ofitsiant:</label>
                    <input
                      type="text"
                      value={customerForm.waiter}
                      onChange={(e) => setCustomerForm({ ...customerForm, waiter: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg bg-navy-900 border border-white/10 text-white"
                    />
                  </div>
                </div>
                <button
                  onClick={() => {
                    onUpdateCustomer(customerForm);
                    setIsEditingCustomer(false);
                  }}
                  className="w-full py-2 rounded-lg bg-turquoise-500 text-navy-950 font-bold text-xs"
                >
                  Saqlash
                </button>
              </div>
            ) : room.customer ? (
              <div className="space-y-2.5 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Mijoz:</span>
                  <span className="font-bold text-white">{room.customer.name}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Telefon:</span>
                  <span className="font-mono text-slate-200">{room.customer.phone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Mehmonlar:</span>
                  <span className="font-bold text-slate-200">{room.customer.guests} kishi</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-slate-400">Kirgan vaqti:</span>
                  <span className="text-amber-300 font-bold">{room.customer.checkInTime}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-400">Biriktirilgan Ofitsiant:</span>
                  <span className="font-semibold text-turquoise-300">{room.customer.waiter}</span>
                </div>
                {room.customer.notes && (
                  <div className="p-2.5 rounded-lg bg-navy-900/60 border border-white/5 text-[11px] text-slate-300">
                    <strong className="text-amber-400 block mb-0.5">Izoh:</strong>
                    {room.customer.notes}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-6 text-center text-slate-400 text-xs">
                <p>Hozirda bu xonada mijoz yo'q.</p>
                <button
                  onClick={() => onUpdateStatus('OCCUPIED')}
                  className="mt-3 px-3 py-1.5 rounded-lg bg-turquoise-500 text-navy-950 font-bold text-xs"
                >
                  Mijozni qabul qilish
                </button>
              </div>
            )}
          </div>

          {/* Quick Add Food Form inside Room Details */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Icons.Plus className="w-5 h-5 text-turquoise-400" />
              <span>Xonaga Taom Qo'shish</span>
            </h3>

            <form onSubmit={handleQuickAdd} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Baliq Taomini tanlang:</label>
                <select
                  value={selectedDishId}
                  onChange={(e) => setSelectedDishId(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white focus:outline-none focus:border-turquoise-400"
                >
                  {dishes.map(dish => (
                    <option key={dish.id} value={dish.id}>
                      {dish.name} &bull; {formatUZS(dish.price)} ({dish.weight})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-1/3">
                  <label className="text-slate-400 block mb-1">Miqdori:</label>
                  <input
                    type="number"
                    min="1"
                    max="50"
                    value={dishQty}
                    onChange={(e) => setDishQty(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white font-bold text-center"
                  />
                </div>
                <div className="w-2/3">
                  <label className="text-slate-400 block mb-1">Pishirish izohi (ixtiyoriy):</label>
                  <input
                    type="text"
                    value={dishNotes}
                    onChange={(e) => setDishNotes(e.target.value)}
                    placeholder="Masalan: achchiq qilinmasin"
                    className="w-full px-3 py-2 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-sm shadow-glow-cyan transition-all"
              >
                + Xona Buyurtmasiga Qo'shish
              </button>
            </form>
          </div>
        </div>

        {/* Right 2 Columns: Ordered Food Table & Bill Calculation */}
        <div className="lg:col-span-2 space-y-6">
          {/* Ordered Food Items List */}
          <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <Icons.Utensils className="w-5 h-5 text-turquoise-400" />
                <span>Buyurtma qilingan taomlar ({orders.length})</span>
              </h3>
              <span className="text-xs text-slate-400">
                {orders.reduce((sum, o) => sum + o.quantity, 0)} ta jami porsiya
              </span>
            </div>

            {orders.length === 0 ? (
              <div className="py-12 text-center text-slate-400 space-y-2">
                <Icons.Utensils className="w-10 h-10 mx-auto text-slate-600" />
                <p>Bu xonaga hali taom buyurtma qilinmagan.</p>
                <p className="text-xs text-slate-500">Chap tarafdagi shakldan yangi baliq taomlarini qo'shing.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs text-slate-400 uppercase">
                      <th className="pb-3 font-semibold">Taom</th>
                      <th className="pb-3 font-semibold text-center">Narx</th>
                      <th className="pb-3 font-semibold text-center">Soni</th>
                      <th className="pb-3 font-semibold text-right">Summa</th>
                      <th className="pb-3 font-semibold text-right">O'chirish</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.map(order => {
                      const itemSubtotal = order.price * order.quantity;
                      return (
                        <tr key={order.id} className="hover:bg-white/[0.02] transition-colors">
                          <td className="py-3">
                            <p className="font-bold text-white text-sm">{order.name}</p>
                            <p className="text-[11px] text-slate-400">
                              {order.weight} &bull; Vaqt: {order.time}
                              {order.notes && <span className="text-amber-400 ml-2">({order.notes})</span>}
                            </p>
                          </td>
                          <td className="py-3 text-center text-slate-300 font-mono text-xs">
                            {formatUZS(order.price)}
                          </td>
                          <td className="py-3 text-center">
                            <div className="inline-flex items-center space-x-2 bg-navy-900 border border-white/10 rounded-lg p-1">
                              <button
                                onClick={() => onUpdateQty(order.id, -1)}
                                className="w-6 h-6 rounded flex items-center justify-center bg-navy-800 text-slate-300 hover:text-white"
                              >
                                -
                              </button>
                              <span className="w-6 text-center font-bold text-white text-xs">
                                {order.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQty(order.id, 1)}
                                className="w-6 h-6 rounded flex items-center justify-center bg-navy-800 text-slate-300 hover:text-white"
                              >
                                +
                              </button>
                            </div>
                          </td>
                          <td className="py-3 text-right font-mono font-bold text-turquoise-300 text-sm">
                            {formatUZS(itemSubtotal)}
                          </td>
                          <td className="py-3 text-right">
                            <button
                              onClick={() => onRemoveItem(order.id)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-950/40 transition-colors"
                              title="Olib tashlash"
                            >
                              <Icons.Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ROOM BILL - UMUMIY HISOB CARD (CRITICAL FEATURE) */}
          <div className="glass-card rounded-2xl p-6 border border-turquoise-500/30 bg-gradient-to-br from-navy-900 via-navy-850 to-ocean-950/60 shadow-glass space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <h3 className="font-display font-extrabold text-xl text-white flex items-center gap-2">
                  <Icons.Receipt className="w-6 h-6 text-turquoise-400" />
                  <span>XONA HISOBI (UMUMIY TO'LOV)</span>
                </h3>
                <p className="text-xs text-slate-400">Har bir taom qo'shilganda yoki olib tashlanganda avtomatik hisoblanadi</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-turquoise-500/20 text-turquoise-300 font-mono text-xs font-bold border border-turquoise-400/30">
                Xizmat: {servicePercent}%
              </span>
            </div>

            {/* Bill Formula Breakdown */}
            <div className="space-y-2 text-sm pt-2">
              <div className="flex justify-between text-slate-300">
                <span>Taomlar summasi (Subtotal):</span>
                <span className="font-mono font-bold text-white">{formatUZS(subtotal)}</span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>Xizmat haqi ({servicePercent}%):</span>
                <span className="font-mono text-slate-200">+{formatUZS(service)}</span>
              </div>
              <div className="pt-3 border-t border-white/15 flex justify-between items-baseline">
                <span className="text-base font-extrabold text-white tracking-wide">
                  JAMI TO'LOV (TOTAL BILL):
                </span>
                <span className="text-2xl sm:text-3xl font-display font-extrabold text-turquoise-300 font-mono tracking-tight drop-shadow-md">
                  {formatUZS(total)}
                </span>
              </div>
            </div>

            {/* Bill Actions: Print Bill & Close Room */}
            <div className="pt-4 flex flex-col sm:flex-row items-center gap-3">
              <button
                onClick={onPrintBill}
                disabled={orders.length === 0}
                className={`flex-1 w-full py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border transition-all ${
                  orders.length === 0 
                    ? 'bg-navy-850 text-slate-500 border-white/5 cursor-not-allowed' 
                    : 'bg-navy-800 hover:bg-navy-750 text-white border-white/20 hover:border-turquoise-400'
                }`}
              >
                <Icons.Printer className="w-5 h-5 text-turquoise-400" />
                <span>Chekni Chop Etish (Print Bill)</span>
              </button>

              <button
                onClick={onCheckout}
                disabled={orders.length === 0}
                className={`flex-1 w-full py-3 rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 transition-all ${
                  orders.length === 0 
                    ? 'bg-emerald-950/40 text-emerald-700 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white shadow-lg shadow-emerald-900/40 active:scale-95'
                }`}
              >
                <Icons.Check className="w-5 h-5" />
                <span>To'lovni Qabul Qilish va Bo'shatish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- FOOD MENU VIEW ---
function FoodMenuView({ dishes, rooms, onOrderDish }) {
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [search, setSearch] = useState('');

  const categories = [
    { id: 'ALL', name: 'Barcha Taomlar' },
    { id: 'fried', name: 'Qovurilgan Baliqlar' },
    { id: 'grilled', name: 'Gril Baliqlar' },
    { id: 'soup', name: 'Baliq Sho\'rvalar' },
    { id: 'seafood', name: 'Dengiz Mahsulotlari' },
    { id: 'special', name: 'Maxsus Taomlar' }
  ];

  const filteredDishes = useMemo(() => {
    return dishes.filter(dish => {
      if (selectedCategory !== 'ALL' && dish.category !== selectedCategory) return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        return dish.name.toLowerCase().includes(query) || dish.description.toLowerCase().includes(query);
      }
      return true;
    });
  }, [dishes, selectedCategory, search]);

  return (
    <div className="space-y-6">
      {/* Category Tabs & Search Bar */}
      <div className="glass-card rounded-2xl p-5 border border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Icons.Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Baliq taomini qidirish (sudak, sazan, forel, uxa)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white placeholder-slate-400 text-sm focus:outline-none focus:border-turquoise-400"
            />
          </div>
          <span className="text-xs text-slate-400 self-center sm:self-auto">
            Jami: <strong className="text-turquoise-300 font-bold">{filteredDishes.length}</strong> xil baliq taomlari
          </span>
        </div>

        {/* Categories Bar */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat.id 
                  ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' 
                  : 'bg-navy-850 text-slate-300 hover:text-white border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredDishes.map(dish => (
          <div 
            key={dish.id} 
            className="rounded-2xl overflow-hidden glass-card glass-card-hover border border-white/10 flex flex-col justify-between group"
          >
            {/* Dish Image */}
            <div className="relative h-48 w-full overflow-hidden">
              <img 
                src={dish.image} 
                alt={dish.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-transparent to-black/40"></div>

              {/* Badges on Image */}
              <div className="absolute top-3 left-3 flex items-center space-x-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-navy-950/80 backdrop-blur-md text-turquoise-300 text-xs font-bold border border-white/10">
                  {dish.weight}
                </span>
                {dish.popular && (
                  <span className="px-2.5 py-1 rounded-lg bg-gold-500 text-navy-950 text-xs font-extrabold shadow-sm">
                    ★ Hit Taom
                  </span>
                )}
              </div>

              <div className="absolute top-3 right-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-500/90 text-navy-950 text-xs font-bold">
                  Mavjud
                </span>
              </div>

              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs text-slate-300">
                <span className="bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded">
                  {dish.categoryName}
                </span>
                <span className="text-[11px] text-slate-400">
                  {dish.cookTime}
                </span>
              </div>
            </div>

            {/* Dish Information */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-display font-bold text-base text-white group-hover:text-turquoise-300 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {dish.description}
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-400 block">Narxi</span>
                  <span className="text-lg font-extrabold text-turquoise-300 font-mono">
                    {formatUZS(dish.price)}
                  </span>
                </div>

                <button
                  onClick={() => onOrderDish(dish)}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-xs shadow-glow-cyan transition-all transform active:scale-95 flex items-center gap-1.5"
                >
                  <Icons.Plus className="w-4 h-4" />
                  <span>Xonaga Buyurtma</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- RESERVATIONS VIEW ---
function ReservationsView({ reservations, rooms, onNewReservation, onSeatReservation, onCancelReservation }) {
  const [filter, setFilter] = useState('ALL'); // ALL, confirmed, seated, cancelled

  const filtered = useMemo(() => {
    if (filter === 'ALL') return reservations;
    return reservations.filter(r => r.status === filter);
  }, [reservations, filter]);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilter('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filter === 'ALL' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-850 text-slate-300'}`}
          >
            Barchasi ({reservations.length})
          </button>
          <button
            onClick={() => setFilter('confirmed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filter === 'confirmed' ? 'bg-amber-500 text-navy-950' : 'bg-navy-850 text-amber-400'}`}
          >
            Kutilmoqda ({reservations.filter(r => r.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setFilter('seated')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filter === 'seated' ? 'bg-emerald-500 text-navy-950' : 'bg-navy-850 text-emerald-400'}`}
          >
            Joylashtirilgan ({reservations.filter(r => r.status === 'seated').length})
          </button>
        </div>

        <button
          onClick={onNewReservation}
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-xs shadow-glow-cyan"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Yangi Stol Band Qilish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(res => {
          const isPending = res.status === 'confirmed';
          return (
            <div key={res.id} className="rounded-2xl p-5 glass-card border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="px-2.5 py-1 rounded bg-navy-900 border border-white/10 text-white font-mono font-bold text-xs">
                      XONA №{res.roomNumber}
                    </span>
                    <h3 className="font-display font-bold text-lg text-white mt-2">{res.customerName}</h3>
                    <p className="text-xs text-turquoise-400 font-semibold">{res.roomName}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    res.status === 'confirmed' ? 'bg-amber-500 text-navy-950' : res.status === 'seated' ? 'bg-emerald-500 text-navy-950' : 'bg-slate-700 text-slate-300'
                  }`}>
                    {res.status === 'confirmed' ? 'KUTILMOQDA' : res.status === 'seated' ? 'JOYLASHTIRILDI' : 'BEKOR QILINGAN'}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-navy-900/60 border border-white/5 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Sana & Vaqt:</span>
                    <span className="font-bold text-amber-300">{res.displayDate || res.date} &bull; {res.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Telefon:</span>
                    <span className="font-mono text-slate-200">{res.phone}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Mehmonlar soni:</span>
                    <span className="font-bold text-white">{res.guests} kishi</span>
                  </div>
                  {res.deposit > 0 && (
                    <div className="flex justify-between pt-1 border-t border-white/5">
                      <span className="text-slate-400">Zakalat (Deposit):</span>
                      <span className="font-bold text-emerald-400">{formatUZS(res.deposit)}</span>
                    </div>
                  )}
                  {res.notes && (
                    <div className="pt-1 text-[11px] text-slate-300 border-t border-white/5">
                      <span className="text-amber-400 font-semibold block">Izoh:</span>
                      {res.notes}
                    </div>
                  )}
                </div>
              </div>

              {isPending && (
                <div className="pt-2 flex items-center space-x-2">
                  <button
                    onClick={() => onSeatReservation(res)}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-bold text-xs shadow-md text-center"
                  >
                    Xonaga Joylashtirish (Zanit qilish)
                  </button>
                  <button
                    onClick={() => onCancelReservation(res.id, res.roomId)}
                    className="px-3 py-2.5 rounded-xl bg-navy-850 hover:bg-red-950/40 text-slate-400 hover:text-red-400 border border-white/10 text-xs font-semibold"
                  >
                    Bekor qilish
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// --- ORDERS MANAGEMENT VIEW (Kitchen / Waiter View) ---
function OrdersView({ roomOrders, rooms, dishes, onUpdateStatus, onAddFoodClick }) {
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Flatten all active orders
  const allOrders = useMemo(() => {
    const list = [];
    Object.entries(roomOrders).forEach(([roomId, orders]) => {
      const room = rooms.find(r => r.id === roomId);
      orders.forEach(order => {
        list.push({
          ...order,
          roomId,
          roomNumber: room ? room.number : '?',
          roomName: room ? room.name : 'Noma\'lum xona'
        });
      });
    });
    return list;
  }, [roomOrders, rooms]);

  const filteredOrders = useMemo(() => {
    if (filterStatus === 'ALL') return allOrders;
    return allOrders.filter(o => o.status === filterStatus);
  }, [allOrders, filterStatus]);

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl p-5 border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setFilterStatus('ALL')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filterStatus === 'ALL' ? 'bg-turquoise-500 text-navy-950' : 'bg-navy-850 text-slate-300'}`}
          >
            Barchasi ({allOrders.length})
          </button>
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filterStatus === 'pending' ? 'bg-amber-500 text-navy-950' : 'bg-navy-850 text-amber-400'}`}
          >
            Kutilmoqda ({allOrders.filter(o => o.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilterStatus('preparing')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filterStatus === 'preparing' ? 'bg-blue-500 text-white' : 'bg-navy-850 text-blue-400'}`}
          >
            Tayyorlanmoqda ({allOrders.filter(o => o.status === 'preparing').length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold ${filterStatus === 'completed' ? 'bg-emerald-500 text-navy-950' : 'bg-navy-850 text-emerald-400'}`}
          >
            Yetkazildi ({allOrders.filter(o => o.status === 'completed').length})
          </button>
        </div>

        <button
          onClick={onAddFoodClick}
          className="flex items-center justify-center space-x-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 hover:to-ocean-500 text-navy-950 font-bold text-xs shadow-glow-cyan"
        >
          <Icons.Plus className="w-4 h-4" />
          <span>Yangi Buyurtma Qo'shish</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredOrders.map(order => (
          <div key={order.id} className="p-4 rounded-2xl glass-card border border-white/10 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <span className="px-2.5 py-1 rounded bg-navy-900 border border-white/10 text-turquoise-300 font-mono font-bold text-xs">
                  XONA №{order.roomNumber}
                </span>
                <p className="text-xs text-slate-400 mt-1">{order.roomName}</p>
              </div>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${
                order.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                order.status === 'preparing' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                {order.status === 'completed' ? 'Yetkazildi' : order.status === 'preparing' ? 'Tayyorlanmoqda' : 'Kutilmoqda'}
              </span>
            </div>

            <div className="pt-2 border-t border-white/5 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white text-sm">{order.name}</h4>
                <p className="text-xs text-slate-400">Soni: <strong className="text-white">{order.quantity} ta</strong> &bull; {order.weight}</p>
                {order.notes && <p className="text-[11px] text-amber-400 mt-1 font-medium">Izoh: {order.notes}</p>}
              </div>
              <span className="font-mono font-bold text-turquoise-300 text-sm">
                {formatUZS(order.price * order.quantity)}
              </span>
            </div>

            {/* Quick Status Progression Buttons */}
            <div className="pt-2 border-t border-white/5 flex items-center gap-1.5 text-xs">
              <button
                onClick={() => onUpdateStatus(order.roomId, order.id, 'pending')}
                className={`flex-1 py-1.5 rounded-lg font-semibold ${order.status === 'pending' ? 'bg-amber-500 text-navy-950 font-bold' : 'bg-navy-900 text-slate-400 hover:text-white'}`}
              >
                Kutilmoqda
              </button>
              <button
                onClick={() => onUpdateStatus(order.roomId, order.id, 'preparing')}
                className={`flex-1 py-1.5 rounded-lg font-semibold ${order.status === 'preparing' ? 'bg-blue-600 text-white font-bold' : 'bg-navy-900 text-slate-400 hover:text-white'}`}
              >
                Pishirilmoqda
              </button>
              <button
                onClick={() => onUpdateStatus(order.roomId, order.id, 'completed')}
                className={`flex-1 py-1.5 rounded-lg font-semibold ${order.status === 'completed' ? 'bg-emerald-600 text-white font-bold' : 'bg-navy-900 text-slate-400 hover:text-white'}`}
              >
                Yetkazildi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- ROOM BILLS (UMUMIY HISOB-KITOB) VIEW ---
function RoomBillsView({ rooms, roomOrders, calcRoomSubtotal, calcRoomService, calcRoomTotal, servicePercent, onPrintBill, onCheckout, salesHistory }) {
  const [activeTabSub, setActiveTabSub] = useState('ACTIVE'); // ACTIVE, HISTORY

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-2 border-b border-white/10">
        <button
          onClick={() => setActiveTabSub('ACTIVE')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTabSub === 'ACTIVE' ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300'
          }`}
        >
          Faol Xonalar Hisobi ({rooms.length})
        </button>
        <button
          onClick={() => setActiveTabSub('HISTORY')}
          className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTabSub === 'HISTORY' ? 'bg-turquoise-500 text-navy-950 shadow-glow-cyan' : 'bg-navy-850 text-slate-300'
          }`}
        >
          Yopilgan Cheklar Tarixi ({salesHistory.length})
        </button>
      </div>

      {activeTabSub === 'ACTIVE' ? (
        rooms.length === 0 ? (
          <div className="glass-card rounded-2xl p-12 text-center text-slate-400">
            <Icons.Receipt className="w-12 h-12 mx-auto text-slate-600 mb-2" />
            <p className="text-base font-semibold">Hozirda hisob-kitob qilinadigan faol xonalar yo'q.</p>
            <p className="text-xs text-slate-500 mt-1">Xonalarga taom buyurtma qilinganda ularning umumiy hisobi bu yerda aks etadi.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {rooms.map(room => {
              const orders = roomOrders[room.id] || [];
              const sub = calcRoomSubtotal(room.id);
              const serv = calcRoomService(room.id);
              const tot = calcRoomTotal(room.id);

              return (
                <div key={room.id} className="rounded-2xl glass-card border border-white/10 p-6 space-y-4 shadow-glass flex flex-col justify-between">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between pb-3 border-b border-white/10">
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="px-2.5 py-0.5 rounded bg-red-600 text-white font-extrabold text-xs">
                            ZANIT
                          </span>
                          <span className="font-mono font-bold text-slate-300 text-sm">
                            Xona №{room.number}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-xl text-white mt-1">{room.name}</h3>
                        <p className="text-xs text-slate-400">Mijoz: <strong className="text-white">{room.customer?.name || 'Mijoz'}</strong> ({room.customer?.phone || ''})</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Jami To'lov</span>
                        <span className="text-xl sm:text-2xl font-display font-extrabold text-turquoise-300 font-mono">
                          {formatUZS(tot)}
                        </span>
                      </div>
                    </div>

                    {/* Ordered Items Breakdown */}
                    <div className="space-y-2 text-xs">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[10px]">Taomlar ro'yxati:</p>
                      {orders.length === 0 ? (
                        <p className="text-slate-500 italic">Buyurtma hali qo'shilmagan.</p>
                      ) : (
                        <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                          {orders.map(order => (
                            <div key={order.id} className="flex items-center justify-between py-1.5 px-2.5 rounded-lg bg-navy-900/60 border border-white/5">
                              <div>
                                <span className="font-bold text-white">{order.name}</span>
                                <span className="text-slate-400 ml-2">({order.quantity} × {formatUZS(order.price)})</span>
                              </div>
                              <span className="font-mono font-bold text-slate-200">
                                {formatUZS(order.price * order.quantity)}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Totals Summary */}
                    <div className="p-3.5 rounded-xl bg-navy-900/90 border border-white/10 space-y-1.5 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>Taomlar summasi:</span>
                        <span className="font-mono font-semibold">{formatUZS(sub)}</span>
                      </div>
                      <div className="flex justify-between text-slate-300">
                        <span>Xizmat haqi ({servicePercent}%):</span>
                        <span className="font-mono">+{formatUZS(serv)}</span>
                      </div>
                      <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                        <span className="font-bold text-white text-sm">UMUMIY HISOB:</span>
                        <span className="font-mono font-extrabold text-turquoise-300 text-lg">
                          {formatUZS(tot)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions: Print Receipt & Checkout */}
                  <div className="pt-2 flex items-center space-x-3">
                    <button
                      onClick={() => onPrintBill(room)}
                      className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-white font-bold text-xs border border-white/10 flex items-center justify-center gap-1.5"
                    >
                      <Icons.Printer className="w-4 h-4 text-turquoise-400" />
                      <span>Chekni Chop Etish</span>
                    </button>
                    <button
                      onClick={() => onCheckout(room)}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md flex items-center justify-center gap-1.5"
                    >
                      <Icons.Check className="w-4 h-4" />
                      <span>To'lov & Xonani Bo'shatish</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* History of Settled Bills */
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-lg">Yopilgan Cheklar Ro'yxati</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-white/10 text-xs text-slate-400 uppercase">
                  <th className="pb-3 font-semibold">Chek №</th>
                  <th className="pb-3 font-semibold">Xona</th>
                  <th className="pb-3 font-semibold">Mijoz</th>
                  <th className="pb-3 font-semibold">Sana & Vaqt</th>
                  <th className="pb-3 font-semibold">To'lov Turi</th>
                  <th className="pb-3 font-semibold text-right">Summa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {salesHistory.map(bill => (
                  <tr key={bill.id} className="hover:bg-white/[0.02]">
                    <td className="py-3 font-mono text-xs text-turquoise-300 font-bold">
                      #{bill.id}
                    </td>
                    <td className="py-3 font-semibold text-white">
                      №{bill.roomNumber} ({bill.roomName})
                    </td>
                    <td className="py-3 text-slate-300">
                      {bill.customerName}
                    </td>
                    <td className="py-3 text-xs text-slate-400">
                      {bill.date} &bull; {bill.time}
                    </td>
                    <td className="py-3 text-xs">
                      <span className="px-2 py-0.5 rounded bg-navy-800 border border-white/10 text-slate-200">
                        {bill.paymentMethod}
                      </span>
                    </td>
                    <td className="py-3 text-right font-mono font-bold text-white">
                      {formatUZS(bill.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// --- REPORTS AND STATISTICS VIEW ---
function ReportsView({ salesHistory, rooms, roomOrders, dishes }) {
  const [period, setPeriod] = useState('ALL'); // TODAY, WEEK, MONTH, ALL

  // Metrics
  const totalRevenue = useMemo(() => {
    return salesHistory.reduce((sum, b) => sum + b.total, 0);
  }, [salesHistory]);

  const avgCheck = useMemo(() => {
    if (salesHistory.length === 0) return 0;
    return Math.round(totalRevenue / salesHistory.length);
  }, [salesHistory, totalRevenue]);

  // Dish popularity ranking
  const popularDishes = useMemo(() => {
    const dishCount = {};
    salesHistory.forEach(bill => {
      bill.items.forEach(item => {
        dishCount[item.name] = (dishCount[item.name] || 0) + item.quantity;
      });
    });

    return Object.entries(dishCount)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }, [salesHistory]);

  return (
    <div className="space-y-6">
      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-cyan-950/40 to-navy-900">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Umumiy Tushum</p>
          <p className="text-2xl font-display font-extrabold text-turquoise-300 font-mono mt-2">
            {formatUZS(totalRevenue)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Barcha yopilgan hisoblar bo'yicha</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-blue-950/40 to-navy-900">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">O'rtacha Chek Miqdori</p>
          <p className="text-2xl font-display font-extrabold text-white font-mono mt-2">
            {formatUZS(avgCheck)}
          </p>
          <p className="text-xs text-slate-400 mt-1">Har bir stol o'rtacha hisobi</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-emerald-950/40 to-navy-900">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Xizmat Ko'rsatilgan Stollar</p>
          <p className="text-2xl font-display font-extrabold text-emerald-400 font-mono mt-2">
            {salesHistory.length} ta
          </p>
          <p className="text-xs text-slate-400 mt-1">Muvaffaqiyatli to'langan buyurtmalar</p>
        </div>

        <div className="glass-card rounded-2xl p-5 border border-white/10 bg-gradient-to-br from-red-950/40 to-navy-900">
          <p className="text-xs uppercase tracking-wider text-slate-400 font-semibold">Hozirgi Bandlik (Occupancy)</p>
          <p className="text-2xl font-display font-extrabold text-red-400 font-mono mt-2">
            {Math.round((rooms.filter(r => r.status === 'OCCUPIED').length / rooms.length) * 100)}%
          </p>
          <p className="text-xs text-slate-400 mt-1">{rooms.filter(r => r.status === 'OCCUPIED').length} ta xona band</p>
        </div>
      </div>

      {/* Two Column Layout: Visual Dish Sales Ranking & Room Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Popular Fish Dishes */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Icons.Fish className="w-5 h-5 text-turquoise-400" />
            <span>Eng Ko'p Sotilgan Baliq Taomlari</span>
          </h3>

          <div className="space-y-3">
            {popularDishes.length === 0 ? (
              <p className="text-slate-400 text-sm">Hali ma'lumotlar yo'q.</p>
            ) : (
              popularDishes.slice(0, 6).map((item, idx) => {
                const max = popularDishes[0]?.count || 1;
                const pct = Math.round((item.count / max) * 100);
                return (
                  <div key={idx} className="space-y-1 text-xs">
                    <div className="flex justify-between font-semibold">
                      <span className="text-white">#{idx + 1} {item.name}</span>
                      <span className="text-turquoise-300 font-mono">{item.count} porsiya</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-navy-900 overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-ocean-600 transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Room Performance Table */}
        <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-4">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <Icons.DoorClosed className="w-5 h-5 text-turquoise-400" />
            <span>Xonalar Bo'yicha Tushum Ko'rsatkichlari</span>
          </h3>

          <div className="space-y-3">
            {rooms.map(room => {
              const roomBills = salesHistory.filter(b => b.roomNumber === room.number);
              const roomRev = roomBills.reduce((s, b) => s + b.total, 0);
              return (
                <div key={room.id} className="flex items-center justify-between p-3 rounded-xl bg-navy-900/60 border border-white/5 text-xs">
                  <div>
                    <span className="font-bold text-white">№{room.number} – {room.name}</span>
                    <span className="text-slate-400 ml-2">({room.seats} o'rin, {room.type})</span>
                  </div>
                  <div className="text-right">
                    <span className="font-mono font-bold text-turquoise-300">{formatUZS(roomRev)}</span>
                    <span className="text-[10px] text-slate-400 block">{roomBills.length} marta xizmat</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- SETTINGS VIEW ---
function SettingsView({ settings, setSettings, onResetDemoData, showToast }) {
  const [form, setForm] = useState(settings);

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(form);
    showToast("Sozlamalar saqlandi!", 'success');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="glass-card rounded-2xl p-6 border border-white/10 space-y-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-white">Restoran Sozlamalari</h2>
          <p className="text-xs text-slate-400 mt-1">FISH HOUSE platformasi va chek parametrlari</p>
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Restoran Nomi:</label>
            <input 
              type="text" 
              value={form.name} 
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white font-bold"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Xizmat Haqi Foizi (% Service Charge):</label>
            <input 
              type="number" 
              value={form.serviceChargePercent} 
              onChange={(e) => setForm({ ...form, serviceChargePercent: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white font-mono font-bold"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Manzil:</label>
            <input 
              type="text" 
              value={form.address || ''} 
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Telefon Raqami:</label>
            <input 
              type="text" 
              value={form.phone || ''} 
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl bg-navy-900 border border-white/10 text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-bold text-sm shadow-glow-cyan"
          >
            Sozlamalarni Saqlash
          </button>
        </form>

        <div className="pt-6 border-t border-white/10 space-y-3">
          <h4 className="text-sm font-bold text-red-400">Namunaviy Ma'lumotlarni Qayta Tiklash</h4>
          <p className="text-xs text-slate-400">
            Agar test jarayonida barcha ma'lumotlarni boshlang'ich holatiga qaytarmoqchi bo'lsangiz quyidagi tugmani bosing:
          </p>
          <button
            onClick={onResetDemoData}
            className="px-4 py-2 rounded-xl bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-500/40 text-xs font-bold transition-colors"
          >
            Namunaviy Ma'lumotlarni Qayta Yuklash (Reset to Demo)
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ORDER FOOD MODAL ---
function OrderFoodModal({ dish, rooms, initialRoomId, onClose, onConfirm }) {
  const [targetRoomId, setTargetRoomId] = useState(initialRoomId || rooms[0]?.id || '');
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  if (!dish) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetRoomId) return;
    onConfirm(targetRoomId, dish, quantity, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-5 bg-navy-900 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Icons.Fish className="w-5 h-5 text-turquoise-400" />
            <h3 className="font-bold text-white text-base">Xonaga Buyurtma Berish</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Dish Summary */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-navy-850 border border-white/5">
          <img src={dish.image} alt={dish.name} className="w-16 h-16 rounded-lg object-cover" />
          <div className="min-w-0 flex-1">
            <h4 className="font-bold text-white text-sm truncate">{dish.name}</h4>
            <p className="text-xs text-slate-400">{dish.weight} &bull; {dish.categoryName}</p>
            <p className="font-mono font-bold text-turquoise-300 text-sm mt-0.5">{formatUZS(dish.price)}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Qaysi xonaga qo'shilsin?</label>
            <select
              value={targetRoomId}
              onChange={(e) => setTargetRoomId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white font-medium focus:border-turquoise-400"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Xona №{room.number} – {room.name} ({room.status === 'OCCUPIED' ? 'ZANIT' : room.status === 'RESERVED' ? 'BAND' : 'BO\'SH'})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-1/3">
              <label className="text-slate-300 font-semibold block mb-1">Miqdori:</label>
              <div className="flex items-center space-x-1">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-lg bg-navy-800 text-white font-bold"
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-12 h-8 text-center bg-navy-950 text-white font-bold rounded-lg border border-white/10"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-lg bg-navy-800 text-white font-bold"
                >
                  +
                </button>
              </div>
            </div>

            <div className="w-2/3">
              <label className="text-slate-300 font-semibold block mb-1">Jami summa:</label>
              <div className="h-8 flex items-center px-3 rounded-lg bg-navy-950 border border-white/10 font-mono font-bold text-turquoise-300 text-sm">
                {formatUZS(dish.price * quantity)}
              </div>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Oshxonaga maxsus izoh:</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masalan: limon ko'proq bo'lsin, sho'r qilinsin"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500"
            />
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 font-semibold text-xs"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-bold text-xs shadow-glow-cyan"
            >
              Buyurtmaga Qo'shish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- BOOKING MODAL (STOL BAND QILISH) ---
function BookingModal({ rooms, preselectedRoomId, onClose, onConfirm }) {
  const [roomId, setRoomId] = useState(preselectedRoomId || rooms.find(r => r.status === 'AVAILABLE')?.id || rooms[0]?.id || '');
  const [date, setDate] = useState('2026-11-11');
  const [time, setTime] = useState('19:00');
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [guests, setGuests] = useState(4);
  const [deposit, setDeposit] = useState(200000);
  const [notes, setNotes] = useState('');

  const targetRoom = rooms.find(r => r.id === roomId);
  const isOccupied = targetRoom?.status === 'OCCUPIED';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!customerName.trim()) {
      alert("Iltimos, mijoz ismini kiriting!");
      return;
    }
    if (isOccupied) {
      if (!window.confirm("Bu xona ayni damda ZANIT. Baribir oldindan band qilasizmi?")) return;
    }

    onConfirm({
      roomId,
      roomNumber: targetRoom ? targetRoom.number : '101',
      roomName: targetRoom ? targetRoom.name : 'Xona',
      customerName,
      phone,
      date,
      time,
      guests: Number(guests),
      deposit: Number(deposit),
      notes
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-5 bg-navy-900 shadow-glass max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <Icons.Calendar className="w-5 h-5 text-turquoise-400" />
            <h3 className="font-bold text-white text-base">Xonani Oldindan Band Qilish</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Xonani tanlang:</label>
            <select
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-navy-950 border border-white/10 text-white font-medium focus:border-turquoise-400"
            >
              {rooms.map(room => (
                <option key={room.id} value={room.id}>
                  Xona №{room.number} – {room.name} ({room.seats} o'rin, {room.status === 'OCCUPIED' ? 'ZANIT' : room.status === 'RESERVED' ? 'BAND' : 'BO\'SH'})
                </option>
              ))}
            </select>
            {isOccupied && (
              <p className="text-[11px] text-amber-400 mt-1">Eslatma: Bu xona ayni damda band, keyingi vaqtga bron qilinmoqda.</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Sana:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Kelish vaqti:</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              >
                {['12:00', '13:00', '14:00', '16:00', '18:00', '19:00', '20:00', '20:30', '21:00', '21:30', '22:00'].map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Mijozning To'liq Ismi *:</label>
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Alisher Qodirov"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Telefon Raqami *:</label>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Mehmonlar soni:</label>
              <input
                type="number"
                min="1"
                max={targetRoom?.seats || 30}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Zakalat / Prepayment (UZS):</label>
              <input
                type="number"
                step="50000"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Maxsus tilaklar / Tayyorgarlik:</label>
            <textarea
              rows="2"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Masalan: tug'ilgan kun, stol bayramona bezatilsin, mevalar qo'yilsin"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white placeholder-slate-500"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-turquoise-500 to-ocean-600 hover:from-turquoise-400 text-navy-950 font-bold shadow-glow-cyan"
            >
              Band Qilishni Tasdiqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- CHECK IN GUEST MODAL ---
function CheckInModal({ room, onClose, onConfirm }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('+998 ');
  const [guests, setGuests] = useState(room.seats);
  const [waiter, setWaiter] = useState('Sardor Saidov');
  const [notes, setNotes] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm({ name: name || 'Mehmon', phone, guests, waiter, notes });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-4 bg-navy-900 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-base">Xonani Ochish (Mijozni Qabul Qilish)</h3>
            <p className="text-xs text-turquoise-400">№{room.number} – {room.name}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-300 font-semibold block mb-1">Mijoz Ismi:</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masalan: Sardor Rahimov"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Telefon Raqami:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Mehmonlar soni:</label>
              <input
                type="number"
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Ofitsiant:</label>
              <input
                type="text"
                value={waiter}
                onChange={(e) => setWaiter(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              />
            </div>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
            >
              Xonani ZANIT qilish
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- PAYMENT & CLOSE BILL MODAL ---
function PaymentModal({ room, subtotal, service, total, servicePercent, items, onClose, onConfirm }) {
  const [method, setMethod] = useState('Naqd'); // Naqd, Karta (Uzcard/Humo), Click, Payme

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl glass-card border border-emerald-500/50 p-6 space-y-5 bg-navy-900 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div>
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Icons.Wallet className="w-5 h-5 text-emerald-400" />
              <span>To'lovni Qabul Qilish & Xonani Bo'shatish</span>
            </h3>
            <p className="text-xs text-slate-400">Xona №{room.number} ({room.name})</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        {/* Bill Breakdown Box */}
        <div className="p-4 rounded-xl bg-navy-950/80 border border-white/10 space-y-2 text-xs">
          <div className="flex justify-between text-slate-300">
            <span>Taomlar summasi ({items.length} xil):</span>
            <span className="font-mono font-bold text-white">{formatUZS(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Xizmat haqi ({servicePercent}%):</span>
            <span className="font-mono text-slate-200">+{formatUZS(service)}</span>
          </div>
          <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
            <span className="font-extrabold text-white text-sm uppercase">Jami To'lanishi kerak:</span>
            <span className="font-display font-extrabold text-turquoise-300 text-2xl font-mono">
              {formatUZS(total)}
            </span>
          </div>
        </div>

        {/* Payment Method Selector */}
        <div className="space-y-2 text-xs">
          <label className="text-slate-300 font-semibold block">To'lov usulini tanlang:</label>
          <div className="grid grid-cols-3 gap-2">
            {['Naqd', 'Karta (Uzcard/Humo)', 'Click / Payme'].map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setMethod(m)}
                className={`p-3 rounded-xl border text-center font-bold transition-all ${
                  method === m ? 'bg-emerald-600 border-emerald-400 text-white shadow-md' : 'bg-navy-850 border-white/10 text-slate-300 hover:bg-navy-800'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-3 flex items-center space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-navy-800 hover:bg-navy-750 text-slate-300 font-semibold text-xs"
          >
            Bekor qilish
          </button>
          <button
            onClick={() => onConfirm(method)}
            className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 text-white font-extrabold text-sm shadow-lg shadow-emerald-900/50"
          >
            To'lovni Tasdiqlash & Bo'shatish
          </button>
        </div>
      </div>
    </div>
  );
}

// --- PRINTABLE RECEIPT MODAL (AUTHENTIC THERMAL INVOICE) ---
function ReceiptModal({ bill, restaurant, onClose }) {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-sm rounded-2xl bg-white text-slate-900 shadow-2xl p-6 space-y-4 my-8">
        {/* Modal Controls (Hidden in Print) */}
        <div className="no-print flex items-center justify-between pb-3 border-b border-slate-200">
          <span className="font-bold text-xs text-slate-600">Restoran Rasmiy Cheki</span>
          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-navy-900 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-navy-800"
            >
              <Icons.Printer className="w-3.5 h-3.5" />
              <span>Chop Etish</span>
            </button>
            <button onClick={onClose} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
              <Icons.X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Thermal Receipt Area */}
        <div id="printable-receipt-area" className="font-mono text-xs text-slate-900 leading-relaxed">
          {/* Logo & Header */}
          <div className="text-center space-y-1 pb-3 border-b border-dashed border-slate-400">
            <h2 className="font-display font-extrabold text-xl tracking-wider text-black">
              FISH HOUSE
            </h2>
            <p className="text-[10px] uppercase font-bold text-slate-700">Premium Seafood Restaurant</p>
            <p className="text-[10px] text-slate-600">{restaurant.address || "Toshkent sh., Dengiz ko'chasi, 7"}</p>
            <p className="text-[10px] text-slate-600">Tel: {restaurant.phone || "+998 71 200-88-99"}</p>
          </div>

          {/* Meta Info */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-[11px]">
            <div className="flex justify-between">
              <span>Chek №: <strong>{bill.id}</strong></span>
              <span>Sana: {bill.date}</span>
            </div>
            <div className="flex justify-between">
              <span>Xona: <strong>№{bill.roomNumber} ({bill.roomName})</strong></span>
              <span>Vaqt: {bill.time}</span>
            </div>
            <div className="flex justify-between">
              <span>Mijoz: {bill.customerName}</span>
              <span>Ofitsiant: {bill.waiter || "Sardor S."}</span>
            </div>
          </div>

          {/* Items Table */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-2">
            <div className="flex justify-between text-[10px] font-bold uppercase text-slate-600">
              <span>Taom / Narx</span>
              <span>Jami</span>
            </div>
            {bill.items.map((item, i) => (
              <div key={i} className="flex justify-between text-[11px]">
                <div className="max-w-[70%]">
                  <span className="font-semibold">{item.name}</span>
                  <span className="block text-[10px] text-slate-600">{item.quantity} × {formatUZS(item.price)}</span>
                </div>
                <span className="font-bold">{formatUZS(item.quantity * item.price)}</span>
              </div>
            ))}
          </div>

          {/* Bill Totals */}
          <div className="py-2.5 border-b border-dashed border-slate-400 space-y-1 text-xs">
            <div className="flex justify-between">
              <span>Taomlar summasi:</span>
              <span>{formatUZS(bill.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Xizmat haqi ({restaurant.serviceChargePercent || 10}%):</span>
              <span>+{formatUZS(bill.serviceCharge)}</span>
            </div>
            <div className="pt-2 border-t border-slate-300 flex justify-between text-sm font-extrabold text-black">
              <span>JAMI TO'LOV:</span>
              <span className="text-base">{formatUZS(bill.total)}</span>
            </div>
            <div className="flex justify-between text-[10px] text-slate-600 pt-1">
              <span>To'lov usuli:</span>
              <span className="font-bold uppercase">{bill.paymentMethod}</span>
            </div>
          </div>

          {/* Footer & QR Code Simulation */}
          <div className="text-center pt-3 space-y-2">
            <div className="w-20 h-20 mx-auto bg-slate-100 border border-slate-300 flex items-center justify-center p-1">
              {/* QR Pattern visual simulation */}
              <div className="w-full h-full border border-black p-1 grid grid-cols-4 gap-0.5">
                {Array.from({ length: 16 }).map((_, idx) => (
                  <div key={idx} className={`${idx % 2 === 0 ? 'bg-black' : 'bg-transparent'} rounded-sm`}></div>
                ))}
              </div>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-black">
              Tashrifingiz uchun rahmat!
            </p>
            <p className="text-[9px] text-slate-500">
              FISH HOUSE jamoasi sizni yana mamnuniyat bilan kutib qoladi!
            </p>
          </div>
        </div>

        {/* Bottom Close Button (no-print) */}
        <div className="no-print pt-2">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs"
          >
            Yopish
          </button>
        </div>
      </div>
    </div>
  );
}

// --- ADD / EDIT ROOM MODAL ---
function RoomModal({ isEdit, initialData, onClose, onSave }) {
  const [form, setForm] = useState(initialData || {
    number: '',
    name: '',
    type: 'VIP',
    seats: 8,
    capacityText: '6-8 kishi',
    photo: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    amenities: ['Konditsioner', 'Smart TV', 'Wi-Fi'],
    floor: '1-qavat',
    description: 'Yangi shinam dengiz kabineti'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.number || !form.name) {
      alert("Iltimos, xona raqami va nomini to'ldiring!");
      return;
    }
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-2xl glass-card border border-turquoise-500/40 p-6 space-y-4 bg-navy-900 shadow-glass">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="font-bold text-white text-base">
            {isEdit ? "Xonani Tahrirlash" : "Yangi Xona Qo'shish"}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Xona Raqami *:</label>
              <input
                type="text"
                required
                value={form.number}
                onChange={(e) => setForm({ ...form, number: e.target.value })}
                placeholder="109"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-mono"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Xona Turi:</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              >
                <option value="VIP">VIP Hall</option>
                <option value="Kabinet">Kabinet</option>
                <option value="Lounge">Lounge</option>
                <option value="Banket Zali">Banket Zali</option>
                <option value="Oilaviy">Oilaviy</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Xona Nomi *:</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Zumrad Sohil VIP"
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-300 font-semibold block mb-1">O'rinlar soni:</label>
              <input
                type="number"
                min="2"
                max="50"
                value={form.seats}
                onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })}
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white font-bold"
              />
            </div>
            <div>
              <label className="text-slate-300 font-semibold block mb-1">Qavat:</label>
              <input
                type="text"
                value={form.floor}
                onChange={(e) => setForm({ ...form, floor: e.target.value })}
                placeholder="1-qavat"
                className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
              />
            </div>
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Foto Rasm URL manzili:</label>
            <input
              type="text"
              value={form.photo}
              onChange={(e) => setForm({ ...form, photo: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
            />
          </div>

          <div>
            <label className="text-slate-300 font-semibold block mb-1">Tavsif:</label>
            <textarea
              rows="2"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full px-3 py-2 rounded-xl bg-navy-950 border border-white/10 text-white"
            ></textarea>
          </div>

          <div className="pt-2 flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl bg-navy-800 text-slate-300 font-semibold"
            >
              Bekor qilish
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-turquoise-500 hover:bg-turquoise-400 text-navy-950 font-bold shadow-glow-cyan"
            >
              Saqlash
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Render Application to Root
const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

