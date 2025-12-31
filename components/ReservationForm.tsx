import React, { useState, useContext } from 'react';
import { LanguageContext, ReservationsContext } from '../index';
import { TRANSLATIONS } from '../constants';

interface ReservationFormData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfGuests: number;
  specialRequests: string;
}

const ReservationForm: React.FC = () => {
  const langCtx = useContext(LanguageContext);
  const reservationsCtx = useContext(ReservationsContext);
  
  const language = langCtx?.language || 'nl';
  const t = TRANSLATIONS[language];
  
  const [formData, setFormData] = useState<ReservationFormData>({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    date: '',
    time: '',
    numberOfGuests: 2,
    specialRequests: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ReservationFormData, string>>>({});

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split('T')[0];
  
  // Get date 3 months from now for max date
  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 3);
  const maxDateStr = maxDate.toISOString().split('T')[0];

  // Available time slots
  const timeSlots = [
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00', '21:30'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ReservationFormData, string>> = {};
    
    if (!formData.customerName.trim()) {
      newErrors.customerName = t.requiredField || 'This field is required';
    }
    
    if (!formData.customerEmail.trim()) {
      newErrors.customerEmail = t.requiredField || 'This field is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.customerEmail)) {
      newErrors.customerEmail = t.invalidEmail || 'Invalid email address';
    }
    
    if (!formData.customerPhone.trim()) {
      newErrors.customerPhone = t.requiredField || 'This field is required';
    } else if (!/^[+]?[\d\s-]{9,}$/.test(formData.customerPhone)) {
      newErrors.customerPhone = t.invalidPhone || 'Invalid phone number';
    }
    
    if (!formData.date) {
      newErrors.date = t.requiredField || 'This field is required';
    }
    
    if (!formData.time) {
      newErrors.time = t.requiredField || 'This field is required';
    }
    
    if (formData.numberOfGuests < 1 || formData.numberOfGuests > 20) {
      newErrors.numberOfGuests = 'Number of guests must be between 1 and 20';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !reservationsCtx) return;
    
    setIsSubmitting(true);
    
    try {
      await reservationsCtx.createReservation({
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        date: formData.date,
        time: formData.time,
        numberOfGuests: formData.numberOfGuests,
        specialRequests: formData.specialRequests || undefined
      });
      
      setIsSubmitted(true);
      setFormData({
        customerName: '',
        customerEmail: '',
        customerPhone: '',
        date: '',
        time: '',
        numberOfGuests: 2,
        specialRequests: ''
      });
    } catch (error) {
      console.error('Failed to create reservation:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof ReservationFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-32 pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-3xl shadow-2xl p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-3xl font-serif font-bold text-gray-800 mb-4">
              {language === 'pl' ? 'Rezerwacja Wysłana!' : 'Reservering Verzonden!'}
            </h2>
            <p className="text-gray-600 mb-8">
              {language === 'pl' 
                ? 'Dziękujemy za rezerwację! Wkrótce otrzymasz potwierdzenie na podany adres email.'
                : 'Bedankt voor uw reservering! U ontvangt binnenkort een bevestiging per e-mail.'}
            </p>
            <button
              onClick={() => setIsSubmitted(false)}
              className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all"
            >
              {language === 'pl' ? 'Nowa Rezerwacja' : 'Nieuwe Reservering'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 pt-32 pb-20 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-gray-800 mb-4">
            {language === 'pl' ? 'Rezerwacja Stolika' : 'Reserveer een Tafel'}
          </h1>
          <p className="text-xl text-gray-600">
            {language === 'pl' 
              ? 'Zarezerwuj stolik w Greek Irini i ciesz się autentyczną grecką kuchnią'
              : 'Reserveer een tafel bij Greek Irini en geniet van authentieke Griekse gerechten'}
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.formName} *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) => handleInputChange('customerName', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.customerName ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                  placeholder={language === 'pl' ? 'Twoje imię i nazwisko' : 'Uw volledige naam'}
                />
                {errors.customerName && <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {t.formEmail} *
                </label>
                <input
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => handleInputChange('customerEmail', e.target.value)}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.customerEmail ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                  placeholder="email@example.com"
                />
                {errors.customerEmail && <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'pl' ? 'Telefon' : 'Telefoon'} *
              </label>
              <input
                type="tel"
                value={formData.customerPhone}
                onChange={(e) => handleInputChange('customerPhone', e.target.value)}
                className={`w-full px-4 py-3 rounded-xl border-2 ${errors.customerPhone ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                placeholder="+31 6 12345678"
              />
              {errors.customerPhone && <p className="mt-1 text-sm text-red-500">{errors.customerPhone}</p>}
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'pl' ? 'Data' : 'Datum'} *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  min={today}
                  max={maxDateStr}
                  title={language === 'pl' ? 'Wybierz datę rezerwacji' : 'Kies de reserveringsdatum'}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.date ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                />
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'pl' ? 'Godzina' : 'Tijd'} *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  title={language === 'pl' ? 'Wybierz godzinę' : 'Kies een tijd'}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.time ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                >
                  <option value="">{language === 'pl' ? 'Wybierz godzinę' : 'Kies een tijd'}</option>
                  {timeSlots.map(slot => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  {language === 'pl' ? 'Liczba osób' : 'Aantal gasten'} *
                </label>
                <select
                  value={formData.numberOfGuests}
                  onChange={(e) => handleInputChange('numberOfGuests', parseInt(e.target.value))}
                  title={language === 'pl' ? 'Wybierz liczbę gości' : 'Kies het aantal gasten'}
                  className={`w-full px-4 py-3 rounded-xl border-2 ${errors.numberOfGuests ? 'border-red-400' : 'border-gray-200'} focus:border-blue-500 focus:ring-0 transition-colors`}
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map(num => (
                    <option key={num} value={num}>
                      {num} {num === 1 ? (language === 'pl' ? 'osoba' : 'persoon') : (language === 'pl' ? 'osoby' : 'personen')}
                    </option>
                  ))}
                </select>
                {errors.numberOfGuests && <p className="mt-1 text-sm text-red-500">{errors.numberOfGuests}</p>}
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {language === 'pl' ? 'Specjalne życzenia (opcjonalnie)' : 'Speciale wensen (optioneel)'}
              </label>
              <textarea
                value={formData.specialRequests}
                onChange={(e) => handleInputChange('specialRequests', e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-0 transition-colors resize-none"
                placeholder={language === 'pl' 
                  ? 'Np. alergie pokarmowe, specjalne okazje, preferencje dotyczące stolika...'
                  : 'Bijv. voedselallergieën, speciale gelegenheden, tafelvoorkeuren...'}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{language === 'pl' ? 'Wysyłanie...' : 'Verzenden...'}</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>{language === 'pl' ? 'Zarezerwuj Stolik' : 'Reserveer Nu'}</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-1">
                  {language === 'pl' ? 'Ważna informacja' : 'Belangrijke informatie'}
                </h4>
                <p className="text-sm text-gray-600">
                  {language === 'pl' 
                    ? 'Po złożeniu rezerwacji otrzymasz potwierdzenie od naszego zespołu. Rezerwacja jest ważna dopiero po otrzymaniu potwierdzenia email.'
                    : 'Na het plaatsen van uw reservering ontvangt u een bevestiging van ons team. De reservering is pas geldig na ontvangst van de bevestigingsmail.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservationForm;
