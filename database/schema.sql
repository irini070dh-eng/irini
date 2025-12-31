-- =====================================================
-- GREEK IRINI RESTAURANT - COMPLETE DATABASE SCHEMA
-- =====================================================
-- Generated: 2025-12-30
-- Database: PostgreSQL (Supabase)
-- Purpose: Full database schema for Greek Irini restaurant application
-- =====================================================

-- Drop existing tables if they exist (careful in production!)
-- DROP TABLE IF EXISTS order_items CASCADE;
-- DROP TABLE IF EXISTS orders CASCADE;
-- DROP TABLE IF EXISTS reservations CASCADE;
-- DROP TABLE IF EXISTS menu_items CASCADE;
-- DROP TABLE IF EXISTS drivers CASCADE;
-- DROP TABLE IF EXISTS restaurant_settings CASCADE;

-- =====================================================
-- 1. RESERVATIONS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS reservations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  number_of_guests INTEGER NOT NULL CHECK (number_of_guests > 0 AND number_of_guests <= 20),
  special_requests TEXT,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'rejected', 'cancelled')),
  admin_notes TEXT,
  confirmation_sent_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for reservations
CREATE INDEX IF NOT EXISTS idx_reservations_date ON reservations(date);
CREATE INDEX IF NOT EXISTS idx_reservations_status ON reservations(status);
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(customer_email);
CREATE INDEX IF NOT EXISTS idx_reservations_date_time ON reservations(date, time);

-- RLS Policies for reservations
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Anyone can create reservations (public form)
CREATE POLICY "Anyone can create reservations" ON reservations
  FOR INSERT
  WITH CHECK (true);

-- Service role can read all reservations (admin panel)
CREATE POLICY "Service role can read all reservations" ON reservations
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Service role can update reservations (admin panel)
CREATE POLICY "Service role can update reservations" ON reservations
  FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- =====================================================
-- 2. MENU ITEMS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Names in all languages
  name_nl VARCHAR(255) NOT NULL,
  name_el VARCHAR(255),
  name_tr VARCHAR(255),
  name_ar VARCHAR(255),
  name_bg VARCHAR(255),
  name_pl VARCHAR(255),
  -- Descriptions in all languages
  description_nl TEXT,
  description_el TEXT,
  description_tr TEXT,
  description_ar TEXT,
  description_bg TEXT,
  description_pl TEXT,
  -- Menu item details
  price DECIMAL(10, 2) NOT NULL CHECK (price >= 0),
  category VARCHAR(100) NOT NULL CHECK (category IN ('mains', 'starters_cold', 'starters_warm', 'salads', 'desserts', 'drinks', 'sides')),
  image_url TEXT,
  -- Availability and features
  is_available BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  is_new BOOLEAN DEFAULT false,
  is_vegetarian BOOLEAN DEFAULT false,
  is_vegan BOOLEAN DEFAULT false,
  is_gluten_free BOOLEAN DEFAULT false,
  spicy_level INTEGER DEFAULT 0 CHECK (spicy_level >= 0 AND spicy_level <= 3),
  -- Additional details
  allergens TEXT[], -- Array of allergens
  preparation_time INTEGER, -- in minutes
  calories INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for menu_items
CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(is_available);
CREATE INDEX IF NOT EXISTS idx_menu_items_popular ON menu_items(is_popular);

-- RLS Policies for menu_items
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;

-- Anyone can read available menu items (public menu)
CREATE POLICY "Anyone can read available menu items" ON menu_items
  FOR SELECT
  USING (is_available = true OR auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- Only authenticated users can modify menu items (admin panel)
CREATE POLICY "Authenticated users can modify menu items" ON menu_items
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =====================================================
-- 3. ORDERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  -- Customer information
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  customer_address TEXT,
  customer_postal_code VARCHAR(20),
  customer_city VARCHAR(100),
  customer_notes TEXT,
  -- Order details
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  delivery_fee DECIMAL(10, 2) DEFAULT 0 CHECK (delivery_fee >= 0),
  total DECIMAL(10, 2) NOT NULL CHECK (total >= 0),
  -- Order status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'preparing', 'ready', 'delivery', 'completed', 'cancelled')),
  -- Payment information
  payment_method VARCHAR(20) CHECK (payment_method IN ('ideal', 'card', 'bancontact', 'cash')),
  payment_status VARCHAR(20) DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'pending', 'paid', 'failed', 'refunded')),
  payment_transaction_id VARCHAR(255),
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_amount DECIMAL(10, 2),
  -- Delivery information
  delivery_type VARCHAR(20) NOT NULL CHECK (delivery_type IN ('delivery', 'pickup')),
  estimated_ready_time TIMESTAMP WITH TIME ZONE,
  estimated_delivery_time VARCHAR(50),
  delivery_distance DECIMAL(10, 2),
  -- Driver assignment
  assigned_driver_id UUID,
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for orders
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_driver ON orders(assigned_driver_id);

-- RLS Policies for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Anyone can create orders (public checkout)
CREATE POLICY "Anyone can create orders" ON orders
  FOR INSERT
  WITH CHECK (true);

-- Service role can read all orders (admin panel)
CREATE POLICY "Service role can read all orders" ON orders
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- Service role can update orders (admin panel)
CREATE POLICY "Service role can update orders" ON orders
  FOR UPDATE
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- =====================================================
-- 4. ORDER ITEMS TABLE (items within each order)
-- =====================================================
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id UUID REFERENCES menu_items(id) ON DELETE SET NULL,
  -- Item details (snapshot at time of order)
  item_name VARCHAR(255) NOT NULL,
  item_price DECIMAL(10, 2) NOT NULL CHECK (item_price >= 0),
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  subtotal DECIMAL(10, 2) NOT NULL CHECK (subtotal >= 0),
  -- Special notes for this item
  special_instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for order_items
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_menu_item_id ON order_items(menu_item_id);

-- RLS Policies for order_items
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Same policies as orders table
CREATE POLICY "Anyone can create order items" ON order_items
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Service role can read all order items" ON order_items
  FOR SELECT
  USING (auth.role() = 'service_role' OR auth.role() = 'authenticated');

-- =====================================================
-- 5. DRIVERS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS drivers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'busy', 'offline')),
  active_deliveries INTEGER DEFAULT 0 CHECK (active_deliveries >= 0),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for drivers
CREATE INDEX IF NOT EXISTS idx_drivers_status ON drivers(status);

-- RLS Policies for drivers
ALTER TABLE drivers ENABLE ROW LEVEL SECURITY;

-- Only authenticated users can access drivers (admin only)
CREATE POLICY "Authenticated users can manage drivers" ON drivers
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =====================================================
-- 6. STAFF NOTES TABLE (notes for orders)
-- =====================================================
CREATE TABLE IF NOT EXISTS staff_notes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for staff_notes
CREATE INDEX IF NOT EXISTS idx_staff_notes_order_id ON staff_notes(order_id);

-- RLS Policies for staff_notes
ALTER TABLE staff_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can manage staff notes" ON staff_notes
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =====================================================
-- 7. RESTAURANT SETTINGS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS restaurant_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- RLS Policies for restaurant_settings
ALTER TABLE restaurant_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can read settings (for opening hours, etc.)
CREATE POLICY "Anyone can read settings" ON restaurant_settings
  FOR SELECT
  USING (true);

-- Only authenticated users can modify settings
CREATE POLICY "Authenticated users can modify settings" ON restaurant_settings
  FOR ALL
  USING (auth.role() = 'authenticated' OR auth.role() = 'service_role');

-- =====================================================
-- FUNCTIONS AND TRIGGERS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
CREATE TRIGGER update_reservations_updated_at BEFORE UPDATE ON reservations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_menu_items_updated_at BEFORE UPDATE ON menu_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_drivers_updated_at BEFORE UPDATE ON drivers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_restaurant_settings_updated_at BEFORE UPDATE ON restaurant_settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- SAMPLE DATA (Optional - comment out in production)
-- =====================================================

-- Sample menu items
INSERT INTO menu_items (name_nl, name_pl, name_el, description_nl, description_pl, price, category, is_available, is_popular) VALUES
('Griekse Salade', 'Grecka Sałatka', 'Χωριάτικη Σαλάτα', 'Verse groenten met feta kaas, olijven en Griekse kruiden', 'Świeże warzywa z serem feta, oliwkami i greckimi ziołami', 8.50, 'salads', true, true),
('Moussaka', 'Musaka', 'Μουσακάς', 'Traditionele Griekse ovenschotel met aubergine en gehakt', 'Tradycyjna grecka zapiekanka z bakłażanem i mięsem mielonym', 15.90, 'mains', true, true),
('Souvlaki', 'Souvlaki', 'Σουβλάκι', 'Gegrilde vleesspiesen met pita en tzatziki', 'Grillowane szaszłyki z pitą i tzatziki', 13.50, 'mains', true, true),
('Taramasalata', 'Taramasalata', 'Ταραμοσαλάτα', 'Romige visroesalade', 'Kremowa sałatka z kawiotrów', 6.50, 'starters_cold', true, false),
('Dolmades', 'Dolmades', 'Ντολμάδες', 'Gevulde wijnbladeren met rijst', 'Nadziewane liście winogron z ryżem', 7.50, 'starters_warm', true, false),
('Baklava', 'Baklawa', 'Μπακλαβάς', 'Zoet Grieks dessert met honing en noten', 'Słodki grecki deser z miodem i orzechami', 5.50, 'desserts', true, true),
('Tzatziki', 'Tzatziki', 'Τζατζίκι', 'Yoghurt met komkommer en knoflook', 'Jogurt z ogórkiem i czosnkiem', 4.50, 'starters_cold', true, false),
('Gyros', 'Gyros', 'Γύρος', 'Gegrild vlees met pita, groenten en saus', 'Grillowane mięso z pitą, warzywami i sosem', 12.90, 'mains', true, true)
ON CONFLICT DO NOTHING;

-- Sample reservation
INSERT INTO reservations (customer_name, customer_email, customer_phone, date, time, number_of_guests, status) VALUES
('Jan Kowalski', 'jan@example.com', '+31612345678', CURRENT_DATE + INTERVAL '3 days', '19:00', 4, 'pending')
ON CONFLICT DO NOTHING;

-- Sample driver
INSERT INTO drivers (name, phone, status) VALUES
('Piotr Nowak', '+31623456789', 'available')
ON CONFLICT DO NOTHING;

-- Sample restaurant settings
INSERT INTO restaurant_settings (setting_key, setting_value) VALUES
('general', '{"name": "Greek Irini", "address": "Weimarstraat 174", "postalCode": "2562 HD", "city": "Den Haag", "phone": "0615869325", "email": "irini070dh@gmail.com"}'::jsonb),
('delivery_config', '{"minOrderAmount": 15.00, "freeDeliveryFrom": 35.00, "deliveryFee": 3.50, "estimatedDeliveryMinutes": 45, "estimatedPickupMinutes": 25}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- =====================================================
-- VIEWS FOR EASIER QUERYING
-- =====================================================

-- View: Active orders with items
CREATE OR REPLACE VIEW active_orders_with_items AS
SELECT 
  o.*,
  json_agg(
    json_build_object(
      'id', oi.id,
      'item_name', oi.item_name,
      'quantity', oi.quantity,
      'item_price', oi.item_price,
      'subtotal', oi.subtotal
    )
  ) AS items
FROM orders o
LEFT JOIN order_items oi ON o.id = oi.order_id
WHERE o.status NOT IN ('completed', 'cancelled')
GROUP BY o.id;

-- View: Today's reservations
CREATE OR REPLACE VIEW todays_reservations AS
SELECT * FROM reservations
WHERE date = CURRENT_DATE
ORDER BY time;

-- View: Pending reservations
CREATE OR REPLACE VIEW pending_reservations AS
SELECT * FROM reservations
WHERE status = 'pending'
AND date >= CURRENT_DATE
ORDER BY date, time;

-- =====================================================
-- GRANT PERMISSIONS (if needed)
-- =====================================================

-- Grant usage on schema
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- Grant permissions on tables
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT SELECT, INSERT ON ALL TABLES IN SCHEMA public TO anon;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;

-- Grant permissions on sequences
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;

-- =====================================================
-- COMPLETION MESSAGE
-- =====================================================
DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE '📊 Tables created: reservations, menu_items, orders, order_items, drivers, staff_notes, restaurant_settings';
  RAISE NOTICE '🔒 Row Level Security enabled on all tables';
  RAISE NOTICE '📝 Sample data inserted (optional)';
  RAISE NOTICE '🎯 Ready to use with application!';
END $$;
