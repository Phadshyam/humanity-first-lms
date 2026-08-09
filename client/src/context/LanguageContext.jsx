import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

const translations = {
  YOUR_SPACE: {
    en: 'YOUR SPACE',
    hi: 'आपका स्थान',
    mr: 'तुमचा स्पेस'
  },
  OVERVIEW: {
    en: 'Overview',
    hi: 'अवलोकन',
    mr: 'पुनरावलोकन'
  },
  MY_LEARNING: {
    en: 'My learning',
    hi: 'मेरी पढ़ाई',
    mr: 'माझे शिकणे'
  },
  COMMUNITY: {
    en: 'Community',
    hi: 'समुदाय',
    mr: 'समुदाय'
  },
  CERTIFICATE: {
    en: 'Certificate',
    hi: 'प्रमाणपत्र',
    mr: 'प्रमाणपत्र'
  },
  MANAGE: {
    en: 'MANAGE',
    hi: 'प्रबंधन',
    mr: 'व्यवस्थापन'
  },
  ADMIN_PANEL: {
    en: 'Admin panel',
    hi: 'एडमिन पैनल',
    mr: 'प्रशासक पॅनेल'
  },
  LOGOUT: {
    en: 'Log out',
    hi: 'लॉग आउट',
    mr: 'लॉग आउट'
  },
  LANGUAGE_NAME: {
    en: 'English',
    hi: 'हिंदी',
    mr: 'मराठी'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(localStorage.getItem('appLanguage') || 'en');

  const setLanguage = (lang) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
  };

  // Translation lookup helper function
  const t = (key) => {
    if (!translations[key]) {
      return key;
    }
    return translations[key][language] || translations[key]['en'];
  };

  // Cycle language: en -> hi -> mr -> en
  const cycleLanguage = () => {
    if (language === 'en') setLanguage('hi');
    else if (language === 'hi') setLanguage('mr');
    else setLanguage('en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, cycleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
