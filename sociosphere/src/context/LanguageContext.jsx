import React, { createContext, useContext, useState, useEffect } from "react";

export const LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇧🇷" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
];

export const TRANSLATIONS = {
  en: {
    home: "Home",
    dashboard: "Dashboard",
    events: "Events",
    communityHub: "Community Hub",
    emergency: "Emergency",
    reportIssue: "Report Issue",
    reportCrime: "Report Crime",
    profile: "Profile",
    settings: "Settings",
    announcements: "Announcements",
    maintenance: "Maintenance",
    sosEmergency: "SOS EMERGENCY",
    welcomeTitle: "A better neighbourhood starts with you",
    quickCivicActions: "Quick Civic Actions",
    oneTapUtilities: "One-tap resident utilities",
    notice: "Notice",
    urgent: "IMPORTANT",
    viewAll: "View all",
    currentWeather: "Current Weather",
    humidity: "Humidity",
    wind: "Wind",
    pressure: "Pressure",
    clouds: "Clouds",
    language: "Language",
    appearance: "Appearance",
    notifications: "Notifications",
    goodMorning: "Good morning",
    goodAfternoon: "Good afternoon",
    goodEvening: "Good evening",
    goodNight: "Good night",
    reportIssueDesc: "Pothole, leak, lights, garbage",
    reportCrimeDesc: "Security alert & guard dispatch",
    emergencyDesc: "Police, ambulance, fire helplines",
    communityHubDesc: "Resident polls, clubs, rides",
    maintenanceDesc: "Pay dues & view ledger",
    totalIssues: "Total issues",
    resolved: "Resolved",
    activeIssues: "Active issues",
    priorityAlerts: "Priority alerts",
    signOut: "Sign out",
  },
  hi: {
    home: "होम",
    dashboard: "डैशबोर्ड",
    events: "आयोजन",
    communityHub: "कम्युनिटी हब",
    emergency: "आपातकालीन",
    reportIssue: "समस्या रिपोर्ट करें",
    reportCrime: "अपराध रिपोर्ट करें",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    announcements: "घोषणाएं",
    maintenance: "रखरखाव",
    sosEmergency: "एसओएस आपातकाल",
    welcomeTitle: "एक बेहतर पड़ोस आपसे शुरू होता है",
    quickCivicActions: "त्वरित नागरिक कार्य",
    oneTapUtilities: "एक-टैप निवासी सुविधाएं",
    notice: "सूचना",
    urgent: "महत्वपूर्ण",
    viewAll: "सभी देखें",
    currentWeather: "वर्तमान मौसम",
    humidity: "आर्द्रता",
    wind: "हवा",
    pressure: "दबाव",
    clouds: "बादल",
    language: "भाषा",
    appearance: "दिखावट",
    notifications: "सूचनाएं",
    goodMorning: "शुभ प्रभात",
    goodAfternoon: "शुभ दोपहर",
    goodEvening: "शुभ संध्या",
    goodNight: "शुभ रात्रि",
    reportIssueDesc: "गड्ढे, रिसाव, लाइटें, कचरा",
    reportCrimeDesc: "सुरक्षा अलर्ट और गार्ड सहायता",
    emergencyDesc: "पुलिस, एम्बुलेंस, फायर हेल्पलाइन",
    communityHubDesc: "निवासी पोल, क्लब और समूह",
    maintenanceDesc: "बकाया भुगतान करें और बहीखाता देखें",
    totalIssues: "कुल समस्याएं",
    resolved: "समाधान हुआ",
    activeIssues: "सक्रिय समस्याएं",
    priorityAlerts: "प्राथमिकता अलर्ट",
    signOut: "साइन आउट",
  },
  pa: {
    home: "ਹੋਮ",
    dashboard: "ਡੈਸ਼ਬੋਰਡ",
    events: "ਸਮਾਗਮ",
    communityHub: "ਕਮਿਊਨਿਟੀ ਹੱਬ",
    emergency: "ਐਮਰਜੈਂਸੀ",
    reportIssue: "ਸਮੱਸਿਆ ਦਰਜ ਕਰੋ",
    reportCrime: "ਅਪਰਾਧ ਦਰਜ ਕਰੋ",
    profile: "ਪ੍ਰੋਫਾਈਲ",
    settings: "ਸੈਟਿੰਗਾਂ",
    announcements: "ਐਲਾਨ",
    maintenance: "ਸੰਭਾਲ",
    sosEmergency: "SOS ਐਮਰਜੈਂਸੀ",
    welcomeTitle: "ਇੱਕ ਬਿਹਤਰ ਗੁਆਂਢ ਤੁਹਾਡੇ ਤੋਂ ਸ਼ੁਰੂ ਹੁੰਦਾ ਹੈ",
    quickCivicActions: "ਤੁਰੰਤ ਨਾਗਰਿਕ ਕਾਰਵਾਈਆਂ",
    oneTapUtilities: "ਇੱਕ-ਟੈਪ ਨਿਵਾਸੀ ਸਹੂਲਤਾਂ",
    notice: "ਸੂਚਨਾ",
    urgent: "ਮਹੱਤਵਪੂਰਨ",
    viewAll: "ਸਾਰੇ ਦੇਖੋ",
    currentWeather: "ਮੌਜੂਦਾ ਮੌਸਮ",
    humidity: "ਨਮੀ",
    wind: "ਹਵਾ",
    pressure: "ਦਬਾਅ",
    clouds: "ਬੱਦਲ",
    language: "ਭਾਸ਼ਾ",
    appearance: "ਦਿੱਖ",
    notifications: "ਸੂਚਨਾਵਾਂ",
    goodMorning: "ਸ਼ੁਭ ਸਵੇਰ",
    goodAfternoon: "ਸ਼ੁਭ ਦੁਪਹਿਰ",
    goodEvening: "ਸ਼ੁਭ ਸ਼ਾਮ",
    goodNight: "ਸ਼ੁਭ ਰਾਤ",
    reportIssueDesc: "ਟੋਏ, ਲੀਕ, ਲਾਈਟਾਂ, ਕੂੜਾ",
    reportCrimeDesc: "ਸੁਰੱਖਿਆ ਚਿਤਾਵਨੀ ਅਤੇ ਗਾਰਡ ਮਦਦ",
    emergencyDesc: "ਪੁਲਿਸ, ਐਂਬੂਲੈਂਸ, ਫਾਇਰ ਹੈਲਪਲਾਈਨ",
    communityHubDesc: "ਨਿਵਾਸੀ ਪੋਲ, ਕਲੱਬ ਅਤੇ ਮੀਟਿੰਗਾਂ",
    maintenanceDesc: "ਬਕਾਇਆ ਭਰੋ ਅਤੇ ਰਿਕਾਰਡ ਦੇਖੋ",
    totalIssues: "ਕੁੱਲ ਮਾਮਲੇ",
    resolved: "ਹੱਲ ਕੀਤੇ",
    activeIssues: "ਸਰਗਰਮ ਮਾਮਲੇ",
    priorityAlerts: "ਤਰਜੀਹੀ ਅਲਰਟ",
    signOut: "ਸਾਈਨ ਆਊਟ",
  },
  es: {
    home: "Inicio",
    dashboard: "Panel",
    events: "Eventos",
    communityHub: "Comunidad",
    emergency: "Emergencia",
    reportIssue: "Reportar Problema",
    reportCrime: "Reportar Delito",
    profile: "Perfil",
    settings: "Configuración",
    announcements: "Anuncios",
    maintenance: "Mantenimiento",
    sosEmergency: "SOS EMERGENCIA",
    welcomeTitle: "Un mejor vecindario comienza contigo",
    quickCivicActions: "Acciones Cívicas Rápidas",
    oneTapUtilities: "Utilidades para residentes en un toque",
    notice: "Aviso",
    urgent: "IMPORTANTE",
    viewAll: "Ver todo",
    currentWeather: "Clima Actual",
    humidity: "Humedad",
    wind: "Viento",
    pressure: "Presión",
    clouds: "Nubes",
    language: "Idioma",
    appearance: "Apariencia",
    notifications: "Notificaciones",
    goodMorning: "Buenos días",
    goodAfternoon: "Buenas tardes",
    goodEvening: "Buenas noches",
    goodNight: "Buenas noches",
    reportIssueDesc: "Baches, fugas, luces, basura",
    reportCrimeDesc: "Alerta de seguridad y despacho de guardias",
    emergencyDesc: "Líneas de policía, ambulancia, bomberos",
    communityHubDesc: "Encuestas de residentes, clubes, viajes",
    maintenanceDesc: "Pagar cuotas y ver registro",
    totalIssues: "Total de problemas",
    resolved: "Resuelto",
    activeIssues: "Problemas activos",
    priorityAlerts: "Alertas prioritarias",
    signOut: "Cerrar sesión",
  },
  fr: {
    home: "Accueil",
    dashboard: "Tableau de bord",
    events: "Événements",
    communityHub: "Communauté",
    emergency: "Urgence",
    reportIssue: "Signaler un Problème",
    reportCrime: "Signaler un Crime",
    profile: "Profil",
    settings: "Paramètres",
    announcements: "Annonces",
    maintenance: "Maintenance",
    sosEmergency: "SOS URGENCE",
    welcomeTitle: "Un meilleur quartier commence avec vous",
    quickCivicActions: "Actions Civiques Rapides",
    oneTapUtilities: "Services résidents en un clic",
    notice: "Avis",
    urgent: "IMPORTANT",
    viewAll: "Voir tout",
    currentWeather: "Météo Actuelle",
    humidity: "Humidité",
    wind: "Vent",
    pressure: "Pression",
    clouds: "Nuages",
    language: "Langue",
    appearance: "Apparence",
    notifications: "Notifications",
    goodMorning: "Bonjour",
    goodAfternoon: "Bon après-midi",
    goodEvening: "Bonsoir",
    goodNight: "Bonne nuit",
    reportIssueDesc: "Nids-de-poule, fuites, lumières, déchets",
    reportCrimeDesc: "Alerte de sécurité et envoi de gardes",
    emergencyDesc: "Police, ambulance, pompiers",
    communityHubDesc: "Sondages des résidents, clubs",
    maintenanceDesc: "Payer les cotisations et voir le grand livre",
    totalIssues: "Total des problèmes",
    resolved: "Résolu",
    activeIssues: "Problèmes actifs",
    priorityAlerts: "Alertes prioritaires",
    signOut: "Déconnexion",
  },
  de: {
    home: "Startseite",
    dashboard: "Dashboard",
    events: "Veranstaltungen",
    communityHub: "Gemeinschaft",
    emergency: "Notfall",
    reportIssue: "Problem melden",
    reportCrime: "Straftat melden",
    profile: "Profil",
    settings: "Einstellungen",
    announcements: "Ankündigungen",
    maintenance: "Wartung",
    sosEmergency: "SOS NOTFALL",
    welcomeTitle: "Eine bessere Nachbarschaft beginnt mit dir",
    quickCivicActions: "Schnelle Bürgeraktionen",
    oneTapUtilities: "Ein-Klick-Bewohnerdienste",
    notice: "Hinweis",
    urgent: "WICHTIG",
    viewAll: "Alle anzeigen",
    currentWeather: "Aktuelles Wetter",
    humidity: "Luftfeuchtigkeit",
    wind: "Wind",
    pressure: "Luftdruck",
    clouds: "Bewölkung",
    language: "Sprache",
    appearance: "Erscheinungsbild",
    notifications: "Benachrichtigungen",
    goodMorning: "Guten Morgen",
    goodAfternoon: "Guten Tag",
    goodEvening: "Guten Abend",
    goodNight: "Gute Nacht",
    reportIssueDesc: "Schlaglöcher, Lecks, Lampen, Müll",
    reportCrimeDesc: "Sicherheitswarnung und Wachdienst",
    emergencyDesc: "Polizei, Krankenwagen, Feuerwehr",
    communityHubDesc: "Bewohnerumfragen, Clubs, Fahrten",
    maintenanceDesc: "Gebühren zahlen und Buch einsehen",
    totalIssues: "Gesamtprobleme",
    resolved: "Gelöst",
    activeIssues: "Aktive Probleme",
    priorityAlerts: "Prioritätswarnungen",
    signOut: "Abmelden",
  },
};

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [currentLanguage, setCurrentLanguage] = useState(() => {
    return localStorage.getItem("sociosphere_language") || "en";
  });

  // Apply Google Translate cookie and dispatch translation event
  const applyGoogleTranslate = (langCode) => {
    try {
      const hostname = window.location.hostname;
      const target = langCode === "en" ? "/en/en" : `/auto/${langCode}`;
      
      document.cookie = `googtrans=${target}; path=/;`;
      document.cookie = `googtrans=${target}; path=/; domain=${hostname};`;
      if (hostname.includes(".")) {
        const domainParts = hostname.split(".");
        if (domainParts.length > 1) {
          const rootDomain = "." + domainParts.slice(-2).join(".");
          document.cookie = `googtrans=${target}; path=/; domain=${rootDomain};`;
        }
      }

      // If Google Translate element exists in DOM, trigger its selector
      const select = document.querySelector(".goog-te-combo");
      if (select) {
        select.value = langCode;
        select.dispatchEvent(new Event("change"));
      }
    } catch {
      // Ignore in sandbox or restricted cookie environment
    }
  };

  const changeLanguage = (code) => {
    setCurrentLanguage(code);
    localStorage.setItem("sociosphere_language", code);
    applyGoogleTranslate(code);
  };

  useEffect(() => {
    applyGoogleTranslate(currentLanguage);
  }, [currentLanguage]);

  // Translation helper function
  const t = (key, fallback = "") => {
    const langDict = TRANSLATIONS[currentLanguage] || TRANSLATIONS.en;
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    const defaultDict = TRANSLATIONS.en;
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key];
    }
    return fallback || key;
  };

  const activeLanguageObj =
    LANGUAGES.find((l) => l.code === currentLanguage) || LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        language: currentLanguage,
        setLanguage: changeLanguage,
        changeLanguage,
        currentLanguageObj: activeLanguageObj,
        languages: LANGUAGES,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Graceful fallback if used outside LanguageProvider
    return {
      language: "en",
      setLanguage: () => {},
      changeLanguage: () => {},
      currentLanguageObj: LANGUAGES[0],
      languages: LANGUAGES,
      t: (key, fallback = "") => fallback || key,
    };
  }
  return context;
}

