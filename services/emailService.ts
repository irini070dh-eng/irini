import emailjs from '@emailjs/browser';
import { Order, Language } from '../types';

// EmailJS Configuration
// Musisz skonfigurować te wartości na https://www.emailjs.com/
const EMAILJS_CONFIG = {
  serviceId: 'YOUR_SERVICE_ID', // Zamień na swój Service ID z EmailJS
  templateId: 'YOUR_TEMPLATE_ID', // Zamień na swój Template ID z EmailJS
  publicKey: 'YOUR_PUBLIC_KEY', // Zamień na swój Public Key z EmailJS
};

// Sprawdź czy EmailJS jest skonfigurowany
const isConfigured = () => {
  return !EMAILJS_CONFIG.serviceId.includes('YOUR_') && 
         !EMAILJS_CONFIG.templateId.includes('YOUR_') && 
         !EMAILJS_CONFIG.publicKey.includes('YOUR_');
};

// Formatowanie pozycji zamówienia do emaila
const formatOrderItems = (order: Order, language: Language): string => {
  return order.items.map(item => 
    `${item.quantity}x ${item.name} - €${(item.price * item.quantity).toFixed(2)}`
  ).join('\n');
};

// Formatowanie metody płatności
const formatPaymentMethod = (method: string, language: Language): string => {
  const methods: Record<string, Record<string, string>> = {
    ideal: { nl: 'iDEAL', pl: 'iDEAL' },
    card: { nl: 'Creditcard', pl: 'Karta płatnicza' },
    cash: { nl: 'Contant bij levering', pl: 'Gotówka przy odbiorze' },
    bancontact: { nl: 'Bancontact', pl: 'Bancontact' },
  };
  return methods[method]?.[language] || methods[method]?.nl || method;
};

// Formatowanie typu dostawy
const formatDeliveryType = (type: string, language: Language): string => {
  const types: Record<string, Record<string, string>> = {
    delivery: { nl: 'Bezorging', pl: 'Dostawa' },
    pickup: { nl: 'Afhalen', pl: 'Odbiór własny' },
  };
  return types[type]?.[language] || types[type]?.nl || type;
};

// Generowanie treści emaila
export const generateEmailContent = (order: Order, language: Language = 'nl') => {
  const isPolish = language === 'pl';
  
  const estimatedTime = order.delivery.type === 'pickup' 
    ? (isPolish ? '15-20 minut' : '15-20 minuten')
    : (isPolish ? '30-45 minut' : '30-45 minuten');

  return {
    // Dane odbiorcy
    to_email: order.customer.email,
    to_name: order.customer.name,
    
    // Nagłówek
    subject: isPolish 
      ? `Potwierdzenie zamówienia #${order.id}` 
      : `Orderbevestiging #${order.id}`,
    
    // Treść główna
    greeting: isPolish 
      ? `Dziękujemy za zamówienie, ${order.customer.name}!` 
      : `Bedankt voor je bestelling, ${order.customer.name}!`,
    
    order_id: order.id,
    
    // Pozycje zamówienia
    order_items: formatOrderItems(order, language),
    
    // Podsumowanie cen
    subtotal: `€${order.subtotal.toFixed(2)}`,
    delivery_fee: order.deliveryFee > 0 ? `€${order.deliveryFee.toFixed(2)}` : (isPolish ? 'Gratis' : 'Gratis'),
    total: `€${order.total.toFixed(2)}`,
    
    // Informacje o dostawie
    delivery_type: formatDeliveryType(order.delivery.type, language),
    delivery_label: isPolish ? 'Sposób dostawy' : 'Bezorgwijze',
    
    // Adres (tylko dla dostawy)
    address: order.delivery.type === 'delivery' 
      ? `${order.customer.address}, ${order.customer.postalCode} ${order.customer.city}`
      : (isPolish ? 'Odbiór w restauracji' : 'Afhalen bij het restaurant'),
    address_label: isPolish ? 'Adres' : 'Adres',
    
    // Płatność
    payment_method: formatPaymentMethod(order.payment.method, language),
    payment_label: isPolish ? 'Metoda płatności' : 'Betaalmethode',
    payment_status: order.payment.status === 'paid' 
      ? (isPolish ? 'Opłacone' : 'Betaald')
      : (isPolish ? 'Do zapłaty przy odbiorze' : 'Betalen bij levering'),
    
    // Szacowany czas
    estimated_time: estimatedTime,
    estimated_label: isPolish ? 'Szacowany czas' : 'Geschatte tijd',
    
    // Kontakt
    restaurant_name: 'Greek Irini',
    restaurant_address: 'Denneweg 10A, 2514 CG Den Haag',
    restaurant_phone: '+31 70 346 2789',
    
    // Stopka
    footer_text: isPolish 
      ? 'Dziękujemy za zamówienie w Greek Irini! W razie pytań prosimy o kontakt.'
      : 'Bedankt voor je bestelling bij Greek Irini! Neem bij vragen gerust contact met ons op.',
    
    // Uwagi klienta
    notes: order.customer.notes || (isPolish ? 'Brak uwag' : 'Geen opmerkingen'),
    notes_label: isPolish ? 'Uwagi' : 'Opmerkingen',
  };
};

// Wysyłanie emaila z potwierdzeniem
export const sendOrderConfirmationEmail = async (
  order: Order, 
  language: Language = 'nl'
): Promise<{ success: boolean; message: string }> => {
  
  // Sprawdź czy EmailJS jest skonfigurowany
  if (!isConfigured()) {
    console.log('📧 EmailJS nie skonfigurowany - symulacja wysyłki emaila');
    console.log('📧 Dane emaila:', generateEmailContent(order, language));
    
    // Symulacja sukcesu dla celów demonstracyjnych
    return {
      success: true,
      message: 'Email wysłany (tryb demo - skonfiguruj EmailJS dla prawdziwej wysyłki)',
    };
  }

  try {
    // Inicjalizacja EmailJS
    emailjs.init(EMAILJS_CONFIG.publicKey);
    
    const emailData = generateEmailContent(order, language);
    
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceId,
      EMAILJS_CONFIG.templateId,
      emailData
    );

    console.log('✅ Email wysłany pomyślnie:', response);
    
    return {
      success: true,
      message: language === 'pl' 
        ? 'Potwierdzenie wysłane na email!' 
        : 'Bevestiging verzonden naar je e-mail!',
    };
  } catch (error) {
    console.error('❌ Błąd wysyłania emaila:', error);
    
    return {
      success: false,
      message: language === 'pl'
        ? 'Nie udało się wysłać emaila. Zamówienie zostało przyjęte.'
        : 'E-mail kon niet worden verzonden. Je bestelling is geplaatst.',
    };
  }
};

// Eksport konfiguracji do ustawień admina
export const getEmailJSConfig = () => ({
  isConfigured: isConfigured(),
  config: EMAILJS_CONFIG,
});

export default {
  sendOrderConfirmationEmail,
  generateEmailContent,
  getEmailJSConfig,
};
