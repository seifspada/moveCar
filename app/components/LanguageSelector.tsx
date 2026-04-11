'use client';

import { useState } from 'react';

export default function LanguageSelector() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState('fr');

  const languages = [
    { code: 'fr', name: 'Français', flag: 'https://flagcdn.com/w40/fr.png' },
    { code: 'en', name: 'English', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'it', name: 'Italiano', flag: 'https://flagcdn.com/w40/it.png' },
    { code: 'es', name: 'Español', flag: 'https://flagcdn.com/w40/es.png' },
    { code: 'de', name: 'Deutsch', flag: 'https://flagcdn.com/w40/de.png' }
  ];

  const selectedLanguage = languages.find(lang => lang.code === selectedLang) || languages[0];

  const handleSelect = (code: string) => {
    setSelectedLang(code);
    setIsOpen(false);
  };

  return (
    <div className="relative flex justify-center md:justify-end lg:justify-start">
      {/* ✅ Bouton compact : drapeau + code 2 lettres */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-2 py-1.5                          /* MOBILE */
          md:px-3 md:py-2                      /* TABLETTE */
          lg:px-4 lg:py-2.5                    /* DESKTOP */
          bg-slate-700/50 hover:bg-slate-700
          rounded-lg shadow-sm
          transition-colors
          border border-slate-600
        "
      >
        <img 
          src={selectedLanguage.flag} 
          alt={selectedLanguage.name} 
          className="w-5 h-4 md:w-6 md:h-4 object-cover rounded" 
        />
        {/* ✅ Afficher juste le code en MAJUSCULES (FR, EN, etc.) */}
        <span className="font-semibold text-white text-xs md:text-sm uppercase">
          {selectedLanguage.code}
        </span>
        <svg
          className={`w-3 h-3 md:w-4 md:h-4 text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Menu déroulant */}
      {isOpen && (
        <div className="
          absolute top-full mt-2 w-48
          right-0 md:right-0 lg:left-0
          bg-white border border-gray-200 rounded-lg shadow-lg z-50
        ">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedLang === lang.code ? 'bg-orange-50' : ''
              }`}
            >
              <img src={lang.flag} alt={lang.name} className="w-6 h-4 object-cover rounded" />
              <span className={`font-medium ${selectedLang === lang.code ? 'text-orange-600' : 'text-gray-700'}`}>
                {lang.name}
              </span>
              {selectedLang === lang.code && (
                <svg className="w-5 h-5 ml-auto text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Overlay pour fermer le menu en cliquant à l'extérieur */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
