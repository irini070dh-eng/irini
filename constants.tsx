
import { MenuItem, TranslationSet, Language } from './types';

export const LANGUAGES: { code: Language; name: string; flag: string }[] = [
  { code: 'nl', name: 'Nederlands', flag: '🇳🇱' },
  { code: 'el', name: 'Ελληνικά', flag: '🇬🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'ar', name: 'العربية', flag: '🇦🇪' },
  { code: 'bg', name: 'Български', flag: '🇧🇬' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
];

const adminCommon = {
  adminDashboard: "Admin Dashboard",
  activeOrders: "Actieve Bestellingen",
  orderStatus: {
    pending: "In Afwachting",
    preparing: "Bereiden",
    ready: "Klaar",
    delivery: "Onderweg",
    completed: "Voltooid",
    cancelled: "Geannuleerd"
  },
  paymentStatus: {
    unpaid: "Onbetaald",
    pending: "Bezig",
    paid: "Betaald",
    failed: "Mislukt",
    refunded: "Terugbetaald"
  },
  printReceipt: "Bon Printen",
  deliveryAddress: "Bezorgadres",
  finishOrder: "Bestelling Afronden",
  // Checkout translations NL
  checkoutTitle: "Afrekenen",
  deliveryDetails: "Bezorggegevens",
  paymentMethod: "Betaalmethode",
  orderSummary: "Besteloverzicht",
  subtotal: "Subtotaal",
  deliveryFee: "Bezorgkosten",
  totalToPay: "Te betalen",
  payNow: "Nu Betalen",
  processing: "Bezig met verwerken...",
  paymentSuccess: "Betaling geslaagd!",
  paymentFailed: "Betaling mislukt",
  tryAgain: "Probeer opnieuw",
  backToMenu: "Terug naar menu",
  orderConfirmed: "Bestelling bevestigd!",
  orderNumber: "Bestelnummer",
  estimatedTime: "Geschatte tijd",
  trackOrder: "Volg bestelling",
  pickupAddress: "Ophaaladres",
  deliveryOption: "Bezorgen",
  pickupOption: "Afhalen",
  idealPayment: "iDEAL",
  cardPayment: "Creditcard",
  cashPayment: "Contant bij bezorging",
  invalidPostalCode: "Ongeldige postcode",
  denHaagOnly: "We bezorgen alleen in Den Haag",
  requiredField: "Dit veld is verplicht",
  invalidEmail: "Ongeldig e-mailadres",
  invalidPhone: "Ongeldig telefoonnummer",
  minOrderAmount: "Minimale bestelling: €15",
  freeDeliveryFrom: "Gratis bezorging vanaf €35"
};

const plAdmin = {
  adminDashboard: "Panel Administratora",
  activeOrders: "Aktywne Zamówienia",
  orderStatus: {
    pending: "Oczekujące",
    preparing: "W kuchni",
    ready: "Gotowe",
    delivery: "W dostawie",
    completed: "Zakończone",
    cancelled: "Anulowane"
  },
  paymentStatus: {
    unpaid: "Nieopłacone",
    pending: "Przetwarzanie",
    paid: "Opłacone",
    failed: "Nieudane",
    refunded: "Zwrócone"
  },
  printReceipt: "Drukuj Paragon",
  deliveryAddress: "Adres Dostawy",
  finishOrder: "Zakończ Zamówienie",
  // Checkout translations PL
  checkoutTitle: "Zamówienie",
  deliveryDetails: "Dane dostawy",
  paymentMethod: "Metoda płatności",
  orderSummary: "Podsumowanie",
  subtotal: "Produkty",
  deliveryFee: "Dostawa",
  totalToPay: "Do zapłaty",
  payNow: "Zapłać teraz",
  processing: "Przetwarzanie...",
  paymentSuccess: "Płatność udana!",
  paymentFailed: "Płatność nieudana",
  tryAgain: "Spróbuj ponownie",
  backToMenu: "Powrót do menu",
  orderConfirmed: "Zamówienie potwierdzone!",
  orderNumber: "Numer zamówienia",
  estimatedTime: "Szacowany czas",
  trackOrder: "Śledź zamówienie",
  pickupAddress: "Adres odbioru",
  deliveryOption: "Dostawa",
  pickupOption: "Odbiór osobisty",
  idealPayment: "iDEAL",
  cardPayment: "Karta płatnicza",
  cashPayment: "Gotówka przy odbiorze",
  invalidPostalCode: "Nieprawidłowy kod pocztowy",
  denHaagOnly: "Dostarczamy tylko w Den Haag",
  requiredField: "To pole jest wymagane",
  invalidEmail: "Nieprawidłowy adres e-mail",
  invalidPhone: "Nieprawidłowy numer telefonu",
  minOrderAmount: "Minimalne zamówienie: €15",
  freeDeliveryFrom: "Darmowa dostawa od €35"
};

export const TRANSLATIONS: Record<Language, TranslationSet> = {
  nl: {
    ...adminCommon,
    heroTitle: "Authentieke Griekse Smaak",
    heroSub: "Van onze familie tot aan uw tafel. Ervaar het beste van Griekenland bij Greek Irini in Den Haag.",
    orderNow: "Bestel Nu",
    ourMenu: "Menu",
    aboutUs: "Over Ons",
    contact: "Contact",
    cart: "Mandje",
    total: "Totaal",
    addToCart: "Toevoegen",
    categories: { 
      mains: "Hoofdgerechten", 
      starters_cold: "Koude Mezes", 
      starters_warm: "Warme Mezes", 
      salads: "Salades", 
      desserts: "Desserts" 
    },
    emptyCart: "Je mandje is leeg",
    checkout: "Afrekenen",
    authenticTitle: "Autentieke Smaken",
    authenticDesc: "Laat u verrassen door de authentieke smaken van Greek Irini en geniet van een stukje Griekenland in Den Haag.",
    bestsellers: "Bestsellers",
    familyBusiness: "Familiebedrijf",
    freshIngredients: "Verse Producten",
    reviews: "Klantbeoordelingen",
    contactTitle: "Contact opnemen",
    contactSubtitle: "Vragen? Wij staan voor u klaar.",
    formName: "Naam",
    formEmail: "Email",
    formMessage: "Bericht",
    formSubmit: "Versturen",
    location: "Locatie",
    openingHours: "Openingstijden",
    writeReview: "Schrijf een review",
    googleRating: "Google Waardering",
    aboutHeroTitle: "Een Erfenis van Smaak",
    aboutHeroSub: "Het verhaal van Greek Irini begon aan de kusten van de Egeïsche Zee en bloeit nu in het hart van Den Haag.",
    ourStoryTitle: "Onze Reis",
    ourStoryText: "Greek Irini is meer dan een restaurant; het is een stukje Griekse ziel in de Weimarstraat. Opgericht met een visie om de oprechte gastvrijheid (Philoxenia) naar Nederland te brengen.",
    philosophyTitle: "Onze Filosofie",
    philosophySub: "De Drie Pijlers van Irini",
    philosophyText: "Wij geloven dat eten een cultuur is. Onze olijfolie komt rechtstreeks van onze eigen boomgaarden.",
    philosophyPillar1Title: "De Bodem",
    philosophyPillar1Text: "De puurste olijfolie uit eigen boomgaarden.",
    philosophyPillar2Title: "De Haard",
    philosophyPillar2Text: "Traditionele technieken ontmoeten moderne precisie.",
    philosophyPillar3Title: "De Tafel",
    philosophyPillar3Text: "Philoxenia - de kunst van gastvrijheid.",
    teamTitle: "De Irini Familie",
    teamSub: "De mensen achter de passie.",
    founderLabel: "Oprichter & Ziel",
    chefLabel: "Executive Chef",
    serviceLabel: "Gastheer"
  },
  pl: {
    ...plAdmin,
    heroTitle: "Autentyczny Grecki Smak",
    heroSub: "Od naszej rodziny na Twój stół. Doświadcz najlepszych smaków Grecji w Hadze u Greek Irini.",
    orderNow: "Zamów Teraz",
    ourMenu: "Menu",
    aboutUs: "O Nas",
    contact: "Kontakt",
    cart: "Koszyk",
    total: "Suma",
    addToCart: "Dodaj",
    categories: { 
      mains: "Dania Główne", 
      starters_cold: "Zimne Przystawki", 
      starters_warm: "Ciepłe Przystawki", 
      salads: "Sałatki", 
      desserts: "Desery" 
    },
    emptyCart: "Koszyk jest pusty",
    checkout: "Płać i Zamów",
    authenticTitle: "Autentyczne Smaki",
    authenticDesc: "Daj się zaskoczyć autentycznym smakom Greek Irini i rozkoszuj się kawałkiem Grecji w Hadze.",
    bestsellers: "Bestsellery",
    familyBusiness: "Rodzinny Biznes",
    freshIngredients: "Świeże Produkty",
    reviews: "Opinie",
    contactTitle: "Skontaktuj się",
    contactSubtitle: "Masz pytania? Chętnie pomożemy.",
    formName: "Imię",
    formEmail: "E-mail",
    formMessage: "Wiadomość",
    formSubmit: "Wyślij",
    location: "Lokalizacja",
    openingHours: "Godziny Otwarcia",
    writeReview: "Zostaw opinię",
    googleRating: "Ocena Google",
    aboutHeroTitle: "Dziedzictwo Smaku",
    aboutHeroSub: "Historia Greek Irini zaczęła się na wybrzeżach Morza Egejskiego, a dziś rozkwita w sercu Hagi.",
    ourStoryTitle: "Nasza Podróż",
    ourStoryText: "Greek Irini to więcej niż restauracja; to kawałek greckiej duszy przy Weimarstraat. Założona z wizją przeniesienia szczerej gościnności (Philoxenia) do Holandii.",
    philosophyTitle: "Nasza Filozofia",
    philosophySub: "Trzy Filary Irini",
    philosophyText: "Wierzymy, że jedzenie to kultura. Nasza oliwa pochodzi prosto z naszych własnych gajów.",
    philosophyPillar1Title: "Ziemia",
    philosophyPillar1Text: "Najczystsza oliwa z własnych gajów.",
    philosophyPillar2Title: "Ogień",
    philosophyPillar2Text: "Tradycyjne techniki połączone z nowoczesną precyzją.",
    philosophyPillar3Title: "Stół",
    philosophyPillar3Text: "Philoxenia - sztuka czynienia przyjaciela.",
    teamTitle: "Rodzina Irini",
    teamSub: "Ludzie, którzy tworzą pasję.",
    founderLabel: "Założycielka",
    chefLabel: "Szef Kuchni",
    serviceLabel: "Manager"
  },
  el: { ...adminCommon, heroTitle: "Αυθεντική Ελληνική Γεύση", categories: { mains: "Κυρίως Πιάτα", starters_cold: "Κρύα Ορεκτικά", starters_warm: "Ζεστά Ορεκτικά", salads: "Σαλάτες", desserts: "Επιδόρπια" } } as any,
  tr: { ...adminCommon, heroTitle: "Otantik Yunan Lezzeti", categories: { mains: "Ana Yemekler", starters_cold: "Soğuk Başlangıçlar", starters_warm: "Sıcak Başlangıçlar", salads: "Salatalar", desserts: "Tatlılar" } } as any,
  ar: { ...adminCommon, heroTitle: "النكهة اليونانية الأصيلة", categories: { mains: "الأطباق الرئيسية", starters_cold: "مقبلات باردة", starters_warm: "مقبلات ساخنة", salads: "سلطات", desserts: "حلويات" } } as any,
  bg: { ...adminCommon, heroTitle: "Автентичен Гръцки Вкус", categories: { mains: "Основни ястия", starters_cold: "Студени предястия", starters_warm: "Топли предястия", salads: "Салати", desserts: "Десерти" } } as any,
};

export const MENU_ITEMS: MenuItem[] = [
  // --- MAINS ---
  {
    id: 'm1', category: 'mains', price: 26.00,
    image: '/Lamskoteletten.png',
    names: { pl: 'Kotlety jagnięce', nl: 'Lamskoteletten', el: 'Παιδάκια', tr: 'Kuzu Pirzola', ar: 'ريش غنم', bg: 'Агнешки котлети' },
    descriptions: { pl: 'Soczyste kotlety z grilla z greckimi ziołami.', nl: 'Gegrilde lamskoteletten met Griekse kruiden.', el: 'Ψητά παϊδάκια με ελληνικά μυρωδικά.', tr: 'Yunan otları ile ızgara kuzu pirzola.', ar: 'ريش غنم مشوية بالأعشاب اليونانية.', bg: 'Агнешки котлети на скара.' }
  },
  {
    id: 'm2', category: 'mains', price: 24.00,
    image: '/mix.png',
    names: { pl: 'Mix Grill', nl: 'Mix Grill', el: 'Μιξ Γκριλ', tr: 'Karışık Izgara', ar: 'مشاوي مشكلة', bg: 'Микс Грил' },
    descriptions: { pl: 'Różnorodność najlepszych mięs z grilla.', nl: 'Variëteit aan de beste gegrilde vleessoorten.', el: 'Ποικιλία από τα καλύτερα ψητά κρέατα.', tr: 'En iyi ızgara etlerin çeşitliliği.', ar: 'تشكيلة من أفضل اللحوم المشوية.', bg: 'Разнообразие от naj-dobrite меса на скара.' }
  },
  {
    id: 'm3', category: 'mains', price: 9.00,
    image: '/Pita Gyros.png',
    names: { pl: 'Pita Gyros', nl: 'Pita Gyros', el: 'Πίτα Γύρος', tr: 'Pita Gyros', ar: 'بيتا جيروس', bg: 'Пита Гирос' },
    descriptions: { pl: 'Klasyczna pita z gyrosem, pomidorem i cebulą.', nl: 'Klassieke pita met gyros, tomaat en ui.', el: 'Κλασική πίτα με γύρο, ντομάτα και κρεμμύδι.', tr: 'Domates ve soğanlı klasik pita gyros.', ar: 'بيتا كلاسيكية مع جيروس وطماطم وبصل.', bg: 'Класическа пита с гирос, домати и лук.' }
  },
  {
    id: 'm4', category: 'mains', price: 20.00,
    image: '/Souvlaki Schotel.png',
    names: { pl: 'Souvlaki Dish', nl: 'Souvlaki Schotel', el: 'Πιάτο Σουβλάκι', tr: 'Souvlaki Tabağı', ar: 'طبق سوفلاكي', bg: 'Сувлаки плато' },
    descriptions: { pl: 'Szaszłyki z grilla podawane z frytkami i pitą.', nl: 'Gegrilde spiesen geserveerd met friet en pita.', el: 'Καλαμάκια στα κάρβουνα με πατάτες και πίτα.', tr: 'Patates kızartması ve pita ile servis edilen ızgara şişler.', ar: 'أسياخ مشوية تقدم مع البطاطس والبيتا.', bg: 'Шишчета на скара, поднесени с пържени картофи и пита.' }
  },
  {
    id: 'm5', category: 'mains', price: 18.00,
    image: '/Mussakka.png',
    names: { pl: 'Moussaka', nl: 'Moussaka', el: 'Μουσακάς', tr: 'Musakka', ar: 'مسقعة', bg: 'Мусака' },
    descriptions: { pl: 'Tradycyjna zapiekanka z bakłażanem i mięsem.', nl: 'Traditionele ovenschotel met aubergine en gehakt.', el: 'Παραδοσιακός μουσακάς με μελιτζάνες.', tr: 'Patlıcanlı geleneksel musakka.', ar: 'مسقعة تقليدية بالباذنجان واللحم.', bg: 'Традиционна мусака с патладжан и кайма.' }
  },
  {
    id: 'm6', category: 'mains', price: 20.00,
    image: '/mix.png',
    names: { pl: 'Bifteki Dish', nl: 'Bifteki Schotel', el: 'Μπιφτέκι', tr: 'Bifteki Tabağı', ar: 'طبق بيفتيكي', bg: 'Бифтеки плато' },
    descriptions: { pl: 'Greckie mielone nadziewane fetą.', nl: 'Grieks gehakt gevuld met feta.', el: 'Μπιφτέκι γεμιστό με φέτα.', tr: 'Feta peyniri ile doldurulmuş Yunan köftesi.', ar: 'كفتة يونانية محشوة بجبنة الفيتا.', bg: 'Гръцко кюфте, пълнено с фета.' }
  },
  {
    id: 'm7', category: 'mains', price: 25.00,
    image: '/Mix Seafood.png',
    names: { pl: 'Mix owoców morza', nl: 'Mix Zeevruchten', el: 'Ποικιλία Θαλασσινών', tr: 'Karışık Deniz Ürünleri', ar: 'فواكه بحر مشكلة', bg: 'Микс морски дарове' },
    descriptions: { pl: 'Świeże owoce morza prosto z grilla.', nl: 'Verse zeevruchten rechtstreeks van de grill.', el: 'Φρέσκα θαλασσινά στη σχάρα.', tr: 'Izgaradan taze deniz ürünleri.', ar: 'فواكه بحر طازجة من المشواة.', bg: 'Пресни морски дарове директно от скарата.' }
  },
  {
    id: 'm8', category: 'mains', price: 25.00,
    image: '/Ribeye Steak.png',
    names: { pl: 'Stek antrykotu', nl: 'Entrecote Steak', el: 'Σπαλομπριζόλα', tr: 'Antrikot Biftek', ar: 'ستيك أنتريكوت', bg: 'Стек Антрекот' },
    descriptions: { pl: 'Soczysty stek z antrykotu sezonowany greckimi ziołami.', nl: 'Sappige entrecote steak gekruid met Griekse kruiden.', el: 'Ζουμερή σπαλομπριζόλα με ελληνικά βότανα.', tr: 'Yunan otları ile tatlandırılmış sulu antrikot biftek.', ar: 'ستيك أنتريكوت سوسي متبل بالأعشاب اليونانية.', bg: 'Сочен стек от антрекот, овкусен с гръцки билки.' }
  },
  {
    id: 'm9', category: 'mains', price: 18.00,
    image: '/Gyros Schotel.png',
    names: { pl: 'Gyros Dish', nl: 'Gyros Schotel', el: 'Πιάτο Γύρος', tr: 'Gyros Tabağı', ar: 'طبق جيروس', bg: 'Плато Гирос' },
    descriptions: { pl: 'Porcja gyrosu podawana z dodatkami.', nl: 'Gyros portie geserveerd met bijgerechten.', el: 'Μερίδα γύρος με συνοδευτικά.', tr: 'Garnitürlerle servis edilen gyros porsiyonu.', ar: 'وجبة جيروس تقدم مع أطباق جانبية.', bg: 'Порция гирос, поднесена с гарнитури.' }
  },

  // --- COLD STARTERS ---
  {
    id: 'sc1', category: 'starters_cold', price: 6.00,
    image: '/Tzatziki.png',
    names: { pl: 'Tzatziki', nl: 'Tzatziki', el: 'Τζατζίκι', tr: 'Cacık', ar: 'تزاتزيكي', bg: 'Дзадзики' },
    descriptions: { pl: 'Jogurt grecki, ogórek, czosnek.', nl: 'Griekse yoghurt met knoflook en komkommer.', el: 'Γιαούρτι με σκόρδο και αγγούρι.', tr: 'Sarımsaklı ve salatalıklı yoğurt.', ar: 'زبادي يوناني بالثوم والخيار.', bg: 'Гръцко кисело мляко с чесън и краставица.' }
  },
  {
    id: 'sc2', category: 'starters_cold', price: 16.00,
    image: '/mix.png',
    names: { pl: 'Mix zimnych przystawek', nl: 'Mix Koude Voorgerechten', el: 'Ποικιλία Κρύων Ορεκτικών', tr: 'Karışık Soğuk Meze', ar: 'مقبلات باردة مشكلة', bg: 'Микс студени предястия' },
    descriptions: { pl: 'Wybór tradycyjnych greckich mezes.', nl: 'Selectie van traditionele Griekse mezes.', el: 'Επιλογή παραδοσιακών ελληνικών μεζέδων.', tr: 'Geleneksel Yunan mezeleri seçkisi.', ar: 'تشكيلة من المزة اليونانية التقليدية.', bg: 'Селекция от традиционни гръцки мезета.' }
  },
  {
    id: 'sc3', category: 'starters_cold', price: 5.00,
    image: '/Tzatziki.png',
    names: { pl: 'Feta', nl: 'Feta', el: 'Φέτα', tr: 'Feta Peyniri', ar: 'فيتا', bg: 'Фета' },
    descriptions: { pl: 'Oryginalna grecka feta z oliwą i oregano.', nl: 'Originele Griekse feta met olijfolie en oregano.', el: 'Αυθεντική φέτα με ελαιόλαδο και ρίγανη.', tr: 'Zeytinyağı ve kekikli orijinal Yunan fetası.', ar: 'جبنة فيتا يونانية أصلية بزيت الزيتون والزعتر.', bg: 'Оригинална гръцка фета със зехтин и риган.' }
  },
  {
    id: 'sc4', category: 'starters_cold', price: 4.00,
    image: '/Griekse Salad.png',
    names: { pl: 'Oliwki', nl: 'Olijven', el: 'Ελιές', tr: 'Zeytin', ar: 'زيتون', bg: 'Маслини' },
    descriptions: { pl: 'Greckie oliwki Kalamata.', nl: 'Griekse Kalamata olijven.', el: 'Ελληνικές ελιές Καλαμών.', tr: 'Yunan Kalamata zeytini.', ar: 'زيتون كالاماتا يوناني.', bg: 'Гръцки маслини Каламата.' }
  },
  {
    id: 'sc5', category: 'starters_cold', price: 12.00,
    image: '/Tzatziki.png',
    names: { pl: 'Trio (potrójny zestaw)', nl: 'Trio Dips', el: 'Τρίο Αλοιφών', tr: 'Üçlü Sos Seti', ar: 'مجموعة تريو', bg: 'Трио дипове' },
    descriptions: { pl: 'Zestaw trzech tradycyjnych past greckich.', nl: 'Set van drie traditionele Griekse dips.', el: 'Σετ από τρεις παραδοσιακές αλοιφές.', tr: 'Üç geleneksel Yunan ezmesi seti.', ar: 'مجموعة من ثلاث غموس يونانية تقليدية.', bg: 'Сет от три традиционни гръцки разядки.' }
  },
  {
    id: 'sc6', category: 'starters_cold', price: 6.00,
    image: '/Tarama.png',
    names: { pl: 'Tarama', nl: 'Tarama', el: 'Ταραμάς', tr: 'Tarama', ar: 'تاراما', bg: 'Тарама' },
    descriptions: { pl: 'Pasta z ikry rybiej.', nl: 'Dip van viskuit.', el: 'Αλοιφή από ταραμά.', tr: 'Balık yumurtası ezmesi.', ar: 'غموس بيض السمك.', bg: 'Разядка от хайвер.' }
  },

  // --- WARM STARTERS ---
  {
    id: 'sw1', category: 'starters_warm', price: 12.00,
    image: '/Papoutsaki.png',
    names: { pl: 'Papoutsaki', nl: 'Papoutsaki', el: 'Παπουτσάκι', tr: 'Papoutsaki', ar: 'بابوتساكي', bg: 'Папуцаки' },
    descriptions: { pl: 'Faszerowany bakłażan z beszamelem.', nl: 'Gevulde aubergine met bechamelsaus.', el: 'Μελιτζάνα γεμιστή με μπεσαμέλ.', tr: 'Beşamel soslu dolma patlıcan.', ar: 'باذنجان محشو بالبشاميل.', bg: 'Пълнен патладжан с бешамел.' }
  },
  {
    id: 'sw2', category: 'starters_warm', price: 18.00,
    image: '/Calamares.png',
    names: { pl: 'Kalmary', nl: 'Calamari', el: 'Καλαμαράκια', tr: 'Kalamar', ar: 'كاليماري', bg: 'Калмари' },
    descriptions: { pl: 'Smażone krążki kalmarów.', nl: 'Gefrituurde inktvisringen.', el: 'Τηγανητά καλαμαράκια.', tr: 'Kızarmış kalamar halkaları.', ar: 'حلقات كاليماري مقلية.', bg: 'Пържени кръгчета калмар.' }
  },
  {
    id: 'sw3', category: 'starters_warm', price: 12.00,
    image: '/Feta Sxaras.png',
    names: { pl: 'Feta Sxaras', nl: 'Gegrilde Feta', el: 'Φέτα Σχάρας', tr: 'Izgara Feta', ar: 'فيتا مشوية', bg: 'Фета на скара' },
    descriptions: { pl: 'Grillowana feta z pomidorem i papryką.', nl: 'Gegrilde feta met tomaat en paprika.', el: 'Φέτα στη σχάρα με ντομάτα και πιπεριά.', tr: 'Domates ve biberli ızgara feta.', ar: 'فيتا مشوية مع طماطم وفلفل.', bg: 'Фета на скара с домати и чушки.' }
  },
  {
    id: 'sw4', category: 'starters_warm', price: 3.00,
    image: '/Griekse Salad.png',
    names: { pl: 'Kafteres', nl: 'Kafteres', el: 'Καυτερές Πιπεριές', tr: 'Acı Biber', ar: 'فلفل حار', bg: 'Люти чушки' },
    descriptions: { pl: 'Pikantne grillowane papryczki.', nl: 'Pittige gegrilde pepers.', el: 'Καυτερές πιπεριές στη σχάρα.', tr: 'Baharatlı ızgara biberler.', ar: 'فلفل مشوي حار.', bg: 'Пикантни чушки на скара.' }
  },
  {
    id: 'sw5', category: 'starters_warm', price: 12.00,
    image: '/Kolokeftedes - Courgette.png',
    names: { pl: 'Kolokithokeftedes', nl: 'Zucchini Koekjes', el: 'Κολοκυθοκεφτέδες', tr: 'Kabak Mücveri', ar: 'أقراص الكوسة', bg: 'Тиκвени кюфтета' },
    descriptions: { pl: 'Greckie placki z cukinii i fety.', nl: 'Griekse courgettekoekjes met feta.', el: 'Κολοκυθοκεφτέδες με φέτα.', tr: 'Feta peynirli Yunan kabak mücveri.', ar: 'أقراص كوسة يونانية بجبنة الفيتا.', bg: 'Гръцки кюфтета от тиквички с фета.' }
  },
  {
    id: 'sw6', category: 'starters_warm', price: 16.00,
    image: '/mix.png',
    names: { pl: 'Mix ciepłych przystawek', nl: 'Mix Warme Voorgerechten', el: 'Ποικιλία Ζεστών Ορεκτικών', tr: 'Karışık Sıcak Meze', ar: 'مقبلات ساخنة مشكلة', bg: 'Микс топли предястия' },
    descriptions: { pl: 'Wybór najpopularniejszych gorących przystawek.', nl: 'Selectie van de populairste warme voorgerechten.', el: 'Επιλογή από τα πιο δημοφιλή ζεστά ορεκτικά.', tr: 'En popüler sıcak mezelerin seçkisi.', ar: 'تشكيلة من أشهر المقبلات الساخنة.', bg: 'Селекция от най-популярните топли предястия.' }
  },
  {
    id: 'sw7', category: 'starters_warm', price: 5.00,
    image: '/Skordopsomo.png',
    names: { pl: 'Skordopsomo', nl: 'Knoflookbrood', el: 'Σκορδόψωμο', tr: 'Sarımsaklı Ekmek', ar: 'خبza بالثوم', bg: 'Чеснов хляб' },
    descriptions: { pl: 'Chrupiący chleb czosnkowy z greckimi ziołami.', nl: 'Knapperig knoflookbrood met Griekse kruiden.', el: 'Τραγανό σκορδόψωμο με ελληνικά βότανα.', tr: 'Yunan otları ile çıtır sarımsaklı ekmek.', ar: 'خبز بالثوم مقرمش بالأعشاب اليونانية.', bg: 'Хрупкав чеснов хляб с гръцки билки.' }
  },
  {
    id: 'sw8', category: 'starters_warm', price: 16.00,
    image: '/Saganaki Garnalen.png',
    names: { pl: 'Krewetki Saganaki', nl: 'Garnalen Saganaki', el: 'Γαρίδες Σαγανάκι', tr: 'Karides Saganaki', ar: 'جمبري ساجاناكي', bg: 'Скариди Саганаки' },
    descriptions: { pl: 'Krewetki duszone w sosie pomidorowym z fetą.', nl: 'Garnalen gestoofd in tomatensaus met feta.', el: 'Γαρίδες σε σάλτσα ντομάτας με φέτα.', tr: 'Domates sosunda feta peynirli karides.', ar: 'جمبري مطهو في صلصة الطماطم مع الفيتا.', bg: 'Скариди, задушени в доматен сос с фета.' }
  },
  {
    id: 'sw9', category: 'starters_warm', price: 12.00,
    image: '/Mix Seafood.png',
    names: { pl: 'Ośmiornica', nl: 'Octopus', el: 'Χταπόδι', tr: 'Ahtapot', ar: 'أخطبوط', bg: 'Октопод' },
    descriptions: { pl: 'Grillowana ośmiornica podawana z octem i oliwą.', nl: 'Gegrilde octopus geserveerd met azijn en olie.', el: 'Χταπόδι στη σχάρα με ξύδι και λάδι.', tr: 'Sirke ve yağ ile servis edilen ızgara ahtapot.', ar: 'أخطبوط مشوي يقدم مع الخل والزيت.', bg: 'Октопод на скара, поднесен с оцет и зехтин.' }
  },

  // --- SALADS ---
  {
    id: 'sl1', category: 'salads', price: 14.00,
    image: '/Griekse Salad.png',
    names: { pl: 'Sałatka grecka', nl: 'Griekse Salade', el: 'Χωριάτικη Σαλάτα', tr: 'Yunan Salatası', ar: 'سلطة يونانية', bg: 'Гръцка салата' },
    descriptions: { pl: 'Pomidor, ogórek, cebula, feta i oliwki.', nl: 'Tomaat, komkommer, ui, feta en olijven.', el: 'Ντομάτα, αγγούρι, κρεμμύδι, φέτα και ελιές.', tr: 'Domates, salatalık, soğan, feta ve zeytin.', ar: 'طماطم وخيار وبصل وفيتا وزيتون.', bg: 'Домати, краставици, лук, фета и маслини.' }
  },
  {
    id: 'sl2', category: 'salads', price: 10.00,
    image: '/Salade Irini.png',
    names: { pl: 'Sałatka zielona', nl: 'Groene Salade', el: 'Πράσινη Σαλάτα', tr: 'Yeşil Salata', ar: 'سلطة خضراء', bg: 'Зелена салата' },
    descriptions: { pl: 'Mieszanka świeżych zielonych sałat z dressingiem.', nl: 'Mix van verse groene salades met dressing.', el: 'Ανάμεικτη πράσινη σαλάτα με ντρίσινγκ.', tr: 'Soslu taze yeşil salata karışımı.', ar: 'مزيج من السلطات الخضراء الطازجة مع التتبيلة.', bg: 'Микс от пресни зелени салати с дресинг.' }
  },
  {
    id: 'sl3', category: 'salads', price: 10.00,
    image: '/Koolsalad.png',
    names: { pl: 'Surówka z kapusty', nl: 'Koolsalade', el: 'Λαχανοσαλάτα', tr: 'Lahana Salatası', ar: 'سلطة ملفوف', bg: 'Зелева салата' },
    descriptions: { pl: 'Świeża, chrupiąca kapusta w greckim stylu.', nl: 'Verse, knapperige koolsalade in Griekse stijl.', el: 'Φρέσκια, τραγανή λαχανοσαλάτα.', tr: 'Yunan usulü taze çıtır lahana salatası.', ar: 'سلطة ملفوف طازجة ومقرمشة على الطريقة اليونانية.', bg: 'Прясна хрупкава зелева салата в гръцки стил.' }
  },
  {
    id: 'sl4', category: 'salads', price: 13.50,
    image: '/Salade Irini.png',
    names: { pl: 'Sałatka Irini', nl: 'Irini Salade', el: 'Σαλάτα Ειρήνη', tr: 'Irini Salatası', ar: 'سلطة إيريني', bg: 'Салата Ирини' },
    descriptions: { pl: 'Autorska sałatka z unikalnym dressingiem Irini.', nl: 'Handtekening salade met unieke Irini dressing.', el: 'Η σπεσιαλιτέ σαλάτα μας με ντρίσινγκ Ειρήνη.', tr: 'Eşsiz Irini soslu imza salata.', ar: 'سلطة مميزة مع تتبيلة إيريني الفريدة.', bg: 'Авторска салата с уникален дресинг Ирини.' }
  },

  // --- DESSERTS ---
  {
    id: 'd1', category: 'desserts', price: 7.00,
    image: '/Sokolatopita.png',
    names: { pl: 'Sokolatopita', nl: 'Chocoladetaart', el: 'Σοκολατόπιτα', tr: 'Çikolatalı Kek', ar: 'كعكة الشوكولاتة', bg: 'Шоколадов кейк' },
    descriptions: { pl: 'Tradycyjne greckie ciasto czekoladowe.', nl: 'Traditionele Griekse chocoladetaart.', el: 'Παραδοσιακή ελληνική σοκολατόπιτα.', tr: 'Geleneksel Yunan çikolatalı keki.', ar: 'كعكة شوكولاتة يونانية تقليدية.', bg: 'Традиционен гръцки шоколадов кейк.' }
  },
  {
    id: 'd2', category: 'desserts', price: 7.00,
    image: '/Portokalopita.png',
    names: { pl: 'Portokalopita', nl: 'Sinaasappeltaart', el: 'Πορτοκαλόπιτα', tr: 'Portakallı Kek', ar: 'كعكة البرتقال', bg: 'Портокалов кейк' },
    descriptions: { pl: 'Wilgotne ciasto pomarańczowe z ciasta filo.', nl: 'Vochtige sinaasappeltaart gemaakt van filo deeg.', el: 'Ζουμερή πορτοκαλόπιτα με φύλλο.', tr: 'Filo hamurundan nemli portakallı kek.', ar: 'كعكة برتقال رطبة مصنوعة من عجينة الفيلو.', bg: 'Портокалов кейк от фини кори.' }
  },
  {
    id: 'd3', category: 'desserts', price: 7.00,
    image: '/Griekse Baklava.png',
    names: { pl: 'Sernik', nl: 'Cheesecake', el: 'Τσιζκέικ', tr: 'Cheesecake', ar: 'تشيز كيك', bg: 'Чийзкейк' },
    descriptions: { pl: 'Kremowy sernik z owocową nutą.', nl: 'Romige cheesecake met een fruitige touch.', el: 'Κρεμώδες τσιζκέικ με φρουτώδη νότα.', tr: 'Meyve dokunuşlu kremsi cheesecake.', ar: 'تشيز كيك كريمي مع لمسة فاكهية.', bg: 'Кремообразен чийзкейк с плодов нюанс.' }
  },
  {
    id: 'd4', category: 'desserts', price: 7.00,
    image: '/Griekse Baklava.png',
    names: { pl: 'Grecka baklawa', nl: 'Griekse Baklava', el: 'Μπακλαβάς', tr: 'Baklava', ar: 'بقلاوة يونانية', bg: 'Гръцка баклава' },
    descriptions: { pl: 'Warstwy ciasta filo z miodem i orzechami.', nl: 'Lagen filo deeg met honing en noten.', el: 'Στρώσεις φύλλου με μέλι και καρύδια.', tr: 'Bal ve fındıklı filo hamuru katmanları.', ar: 'طبقات من عجينة الفيلو بالعسل والمكسرات.', bg: 'Гръцка баклава.' }
  },
];
