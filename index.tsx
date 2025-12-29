
import React, { useState, useEffect, createContext, useContext } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { 
  Language, 
  CartItem, 
  Order, 
  OrderStatus, 
  PaymentStatus, 
  PaymentMethod, 
  DeliveryType, 
  CustomerInfo,
  MenuItem,
  RestaurantSettings,
  DELIVERY_CONFIG,
  DEFAULT_RESTAURANT_SETTINGS,
  StaffNote,
  Driver,
  DriverStatus
} from './types';
import { MENU_ITEMS } from './constants';
import { sendOrderConfirmationEmail } from './services/emailService';

// Contexts
interface LanguageContextType {
  language: Language;
  setLanguage: (l: Language) => void;
  isRTL: boolean;
}

export const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface CartContextType {
  cart: CartItem[];
  addToCart: (id: string) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  itemCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

interface OrdersContextType {
  orders: Order[];
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  updatePaymentStatus: (orderId: string, status: PaymentStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
  getPaidOrders: () => Order[];
  getActiveOrders: () => Order[];
  addStaffNote: (orderId: string, text: string, author: string) => void;
  assignDriver: (orderId: string, driverId: string | null) => void;
}

export const OrdersContext = createContext<OrdersContextType | undefined>(undefined);

interface DriversContextType {
  drivers: Driver[];
  addDriver: (name: string, phone: string) => void;
  updateDriverStatus: (driverId: string, status: DriverStatus) => void;
  removeDriver: (driverId: string) => void;
  getAvailableDrivers: () => Driver[];
}

export const DriversContext = createContext<DriversContextType | undefined>(undefined);

interface CreateOrderParams {
  customer: CustomerInfo;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryType: DeliveryType;
  paymentMethod: PaymentMethod;
  isPaid: boolean;
}

interface CheckoutContextType {
  createOrder: (params: CreateOrderParams) => Promise<string>;
  currentOrderId: string | null;
  setCurrentOrderId: (id: string | null) => void;
}

export const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

// Menu Management Context
interface MenuContextType {
  menuItems: MenuItem[];
  updateMenuItem: (id: string, updates: Partial<MenuItem>) => void;
  addMenuItem: (item: MenuItem) => void;
  deleteMenuItem: (id: string) => void;
  toggleAvailability: (id: string) => void;
  getAvailableItems: () => MenuItem[];
}

export const MenuContext = createContext<MenuContextType | undefined>(undefined);

// Settings Context
interface SettingsContextType {
  settings: RestaurantSettings;
  updateSettings: (updates: Partial<RestaurantSettings>) => void;
  resetSettings: () => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const Root = () => {
  const [language, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('lang');
    return (saved as Language) || 'nl';
  });

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('orders');
    if (!saved) return [];
    return JSON.parse(saved).map((o: any) => ({
      ...o, 
      createdAt: new Date(o.createdAt),
      updatedAt: o.updatedAt ? new Date(o.updatedAt) : new Date(o.createdAt),
      payment: o.payment || { method: 'cash', status: 'unpaid', amount: o.total },
      delivery: o.delivery || { type: 'delivery', fee: 0 },
      subtotal: o.subtotal || o.total,
      deliveryFee: o.deliveryFee || 0
    }));
  });

  const [currentOrderId, setCurrentOrderId] = useState<string | null>(null);

  // Menu Management State
  const [menuItems, setMenuItems] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem('menuItems');
    if (saved) {
      return JSON.parse(saved);
    }
    // Initialize with default menu items, adding isAvailable: true
    return MENU_ITEMS.map(item => ({ ...item, isAvailable: true }));
  });

  // Settings State
  const [settings, setSettings] = useState<RestaurantSettings>(() => {
    const saved = localStorage.getItem('restaurantSettings');
    return saved ? JSON.parse(saved) : DEFAULT_RESTAURANT_SETTINGS;
  });

  // Drivers State
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('drivers');
    if (!saved) {
      // Initialize with 3 default drivers
      return [
        { id: 'DRV-001', name: 'Nikos Papadopoulos', phone: '+31612345678', status: 'available', activeDeliveries: 0 },
        { id: 'DRV-002', name: 'Dimitris Kostas', phone: '+31687654321', status: 'available', activeDeliveries: 0 },
        { id: 'DRV-003', name: 'Yannis Stavros', phone: '+31698765432', status: 'offline', activeDeliveries: 0 }
      ];
    }
    return JSON.parse(saved);
  });

  useEffect(() => {
    localStorage.setItem('lang', language);
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('restaurantSettings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem('drivers', JSON.stringify(drivers));
  }, [drivers]);

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { id, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(0, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const clearCart = () => setCart([]);

  // Create order with full payment and delivery info
  const createOrder = async (params: CreateOrderParams): Promise<string> => {
    const orderId = `ORD-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const now = new Date();
    
    const newOrder: Order = {
      id: orderId,
      items: params.items.map(item => {
        const menuInfo = MENU_ITEMS.find(m => m.id === item.id);
        return {
          id: item.id,
          quantity: item.quantity,
          price: menuInfo?.price || 0,
          name: menuInfo?.names[language] || item.id
        };
      }),
      subtotal: params.subtotal,
      deliveryFee: params.deliveryFee,
      total: params.total,
      status: 'pending',
      payment: {
        method: params.paymentMethod,
        status: params.isPaid ? 'paid' : 'unpaid',
        amount: params.total,
        paidAt: params.isPaid ? now : undefined,
        transactionId: params.isPaid ? `TXN-${Date.now()}` : undefined
      },
      delivery: {
        type: params.deliveryType,
        fee: params.deliveryFee,
        estimatedTime: params.deliveryType === 'delivery' 
          ? `${DELIVERY_CONFIG.estimatedDeliveryMinutes} min`
          : `${DELIVERY_CONFIG.estimatedPickupMinutes} min`
      },
      createdAt: now,
      updatedAt: now,
      customer: params.customer,
      estimatedReadyTime: new Date(now.getTime() + 
        (params.deliveryType === 'delivery' 
          ? DELIVERY_CONFIG.estimatedDeliveryMinutes 
          : DELIVERY_CONFIG.estimatedPickupMinutes) * 60000
      )
    };

    setOrders(prev => [newOrder, ...prev]);
    clearCart();
    setCurrentOrderId(orderId);
    
    // Wysyłanie emaila z potwierdzeniem dla opłaconych zamówień
    if (params.isPaid || params.paymentMethod === 'cash') {
      try {
        const emailResult = await sendOrderConfirmationEmail(newOrder, language);
        console.log('📧 Email confirmation:', emailResult);
      } catch (error) {
        console.error('❌ Email sending failed:', error);
        // Nie blokujemy zamówienia jeśli email się nie wysłał
      }
    }
    
    return orderId;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { ...o, status, updatedAt: new Date() } 
        : o
    ));
  };

  const updatePaymentStatus = (orderId: string, status: PaymentStatus) => {
    setOrders(prev => prev.map(o => 
      o.id === orderId 
        ? { 
            ...o, 
            payment: { 
              ...o.payment, 
              status,
              paidAt: status === 'paid' ? new Date() : o.payment.paidAt
            },
            updatedAt: new Date() 
          } 
        : o
    ));
  };

  const getOrder = (orderId: string) => orders.find(o => o.id === orderId);

  const getPaidOrders = () => orders.filter(o => 
    o.payment.status === 'paid' || o.payment.method === 'cash'
  );

  const getActiveOrders = () => orders.filter(o => 
    !['completed', 'cancelled'].includes(o.status) &&
    (o.payment.status === 'paid' || o.payment.method === 'cash')
  );

  const addStaffNote = (orderId: string, text: string, author: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const newNote: StaffNote = {
          id: `NOTE-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          text,
          author,
          timestamp: new Date()
        };
        return {
          ...o,
          staffNotes: [...(o.staffNotes || []), newNote],
          updatedAt: new Date()
        };
      }
      return o;
    }));
  };

  const assignDriver = (orderId: string, driverId: string | null) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        // Update driver's active deliveries count
        if (o.assignedDriver && o.assignedDriver !== driverId) {
          // Remove from old driver
          setDrivers(d => d.map(driver => 
            driver.id === o.assignedDriver 
              ? { ...driver, activeDeliveries: Math.max(0, driver.activeDeliveries - 1) }
              : driver
          ));
        }
        if (driverId) {
          // Add to new driver
          setDrivers(d => d.map(driver => 
            driver.id === driverId 
              ? { ...driver, activeDeliveries: driver.activeDeliveries + 1, status: 'busy' as DriverStatus }
              : driver
          ));
        }
        return {
          ...o,
          assignedDriver: driverId || undefined,
          updatedAt: new Date()
        };
      }
      return o;
    }));
  };

  // Menu Management Functions
  const updateMenuItem = (id: string, updates: Partial<MenuItem>) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const addMenuItem = (item: MenuItem) => {
    setMenuItems(prev => [...prev, { ...item, isAvailable: true }]);
  };

  const deleteMenuItem = (id: string) => {
    setMenuItems(prev => prev.filter(item => item.id !== id));
  };

  const toggleAvailability = (id: string) => {
    setMenuItems(prev => prev.map(item => 
      item.id === id ? { ...item, isAvailable: !item.isAvailable } : item
    ));
  };

  const getAvailableItems = () => menuItems.filter(item => item.isAvailable !== false);

  // Settings Functions
  const updateSettings = (updates: Partial<RestaurantSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  // Driver Management Functions
  const addDriver = (name: string, phone: string) => {
    const newDriver: Driver = {
      id: `DRV-${Date.now().toString().slice(-6)}`,
      name,
      phone,
      status: 'available',
      activeDeliveries: 0
    };
    setDrivers(prev => [...prev, newDriver]);
  };

  const updateDriverStatus = (driverId: string, status: DriverStatus) => {
    setDrivers(prev => prev.map(d => 
      d.id === driverId ? { ...d, status } : d
    ));
  };

  const removeDriver = (driverId: string) => {
    setDrivers(prev => prev.filter(d => d.id !== driverId));
  };

  const getAvailableDrivers = () => {
    return drivers.filter(d => d.status !== 'offline');
  };

  const resetSettings = () => {
    setSettings(DEFAULT_RESTAURANT_SETTINGS);
  };

  const itemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <LanguageContext.Provider value={{ language, setLanguage: setLang, isRTL: language === 'ar' }}>
      <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, itemCount }}>
        <OrdersContext.Provider value={{ orders, updateOrderStatus, updatePaymentStatus, getOrder, getPaidOrders, getActiveOrders, addStaffNote, assignDriver }}>
          <DriversContext.Provider value={{ drivers, addDriver, updateDriverStatus, removeDriver, getAvailableDrivers }}>
            <CheckoutContext.Provider value={{ createOrder, currentOrderId, setCurrentOrderId }}>
              <MenuContext.Provider value={{ menuItems, updateMenuItem, addMenuItem, deleteMenuItem, toggleAvailability, getAvailableItems }}>
                <SettingsContext.Provider value={{ settings, updateSettings, resetSettings }}>
                  <App />
                </SettingsContext.Provider>
              </MenuContext.Provider>
            </CheckoutContext.Provider>
          </DriversContext.Provider>
        </OrdersContext.Provider>
      </CartContext.Provider>
    </LanguageContext.Provider>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
