import React, { createContext, useState, useContext, useEffect } from 'react';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('leafora_lang') || 'en');

  useEffect(() => {
    localStorage.setItem('leafora_lang', language);
  }, [language]);

  const t = (translations) => {
    if (!translations) return '';
    return translations[language] || translations['en'] || '';
  };

  const translations = {
    en: {
      menu: "Menu",
      searchPlaceholder: "Search our menu...",
      all: "All",
      addToCart: "Cart",
      orderNow: "Order Now",
      added: "Added ✅",
      ourMenu: "Our Menu",
      discover: "Discover our exquisite culinary creations, crafted with passion and the finest ingredients.",
      table: "Table",
      scanQR: "Scan QR for Table",
      categories: "Categories",
      noItems: "No menu items found matching your criteria.",
      clearFilters: "Clear filters",
      dayMenu: "Day Menu",
      nightMenu: "Night Menu",
      localMenu: "Local Menu",
      foreignMenu: "Premium Menu",
      vipMenu: "VIP Menu",
      language: "Language",
    },
    ta: {
      menu: "மெனு",
      searchPlaceholder: "எங்கள் மெனுவைத் தேடுங்கள்...",
      all: "அனைத்தும்",
      addToCart: "கூடை",
      orderNow: "இப்போதே ஆர்டர் செய்",
      added: "சேர்க்கப்பட்டது ✅",
      ourMenu: "எங்கள் மெனு",
      discover: "ஆர்வத்துடனும் மிகச்சிறந்த பொருட்களுடனும் வடிவமைக்கப்பட்ட எங்களின் நேர்த்தியான சமையல் படைப்புகளைக் கண்டறியவும்.",
      table: "அட்டவணை",
      scanQR: "அட்டவணைக்கு QR ஐ ஸ்கேன் செய்யவும்",
      categories: "வகைகள்",
      noItems: "உங்கள் அளவுகோல்களுடன் பொருந்தக்கூடிய மெனு உருப்படிகள் எதுவும் இல்லை.",
      clearFilters: "வடிகட்டிகளை அழி",
      dayMenu: "பகல் மெனு",
      nightMenu: "இரவு மெனு",
      localMenu: "உள்ளூர் மெனு",
      foreignMenu: "பிரீமியம் மெனு",
      vipMenu: "VIP மெனு",
      language: "மொழி",
    },
    si: {
      menu: "මෙනුව",
      searchPlaceholder: "අපගේ මෙනුව සොයන්න...",
      all: "සියල්ල",
      addToCart: "බාස්කට්",
      orderNow: "දැන් ඇණවුම් කරන්න",
      added: "එකතු කරන ලදී ✅",
      ourMenu: "අපගේ මෙනුව",
      discover: "උද්යෝගයෙන් සහ හොඳම අමුද්‍රව්‍ය වලින් සකස් කරන ලද අපගේ විශිෂ්ට සූපශාස්ත්‍ර නිර්මාණ සොයා ගන්න.",
      table: "මේසය",
      scanQR: "මේසය සඳහා QR පරිලෝකනය කරන්න",
      categories: "ප්‍රවර්ග",
      noItems: "ඔබේ නිර්ණායකවලට ගැලපෙන මෙනු අයිතම කිසිවක් හමු නොවීය.",
      clearFilters: "පෙරහන් ඉවත් කරන්න",
      dayMenu: "දිවා මෙනුව",
      nightMenu: "රාත්‍රී මෙනුව",
      localMenu: "දේශීය මෙනුව",
      foreignMenu: "ප්‍රිමියම් මෙනුව",
      vipMenu: "VIP මෙනුව",
      language: "භාෂාව",
    }
  };

  const getTranslation = (key) => {
    return translations[language][key] || translations['en'][key];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, getTranslation }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
