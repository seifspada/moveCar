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
    <div className="
  relative
  flex justify-center        /* 📱 mobile */
  md:justify-end             /* 📱 tablette → à droite */
  lg:justify-start           /* 💻 PC */
">
 <button
  onClick={() => setIsOpen(!isOpen)}
  className="
    flex items-center gap-1
    px-2 py-1 text-sm min-w-[100px]   /* MOBILE */

    md:px-4 md:py-2 md:text-base md:min-w-[180px]  /* TABLETTE */
    md:ml-auto md:-mr-10                        /* position tablette */

    lg:ml-0 lg:mr-0 lg:px-5 lg:py-3 lg:text-lg lg:min-w-[220px]  /* DESKTOP */

     hover:bg-orange-600
    rounded-lg shadow-sm
  "
>



        <img src={selectedLanguage.flag} alt={selectedLanguage.name} className="w-6 h-4 object-cover rounded" />
        <span className="font-medium text-white flex-1 text-left hover:text-black">{selectedLanguage.name}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
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
  md:ml-32
  bg-white border border-gray-200 rounded-lg shadow-lg z-50
">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg ${
                selectedLang === lang.code ? 'bg-blue-50' : ''
              }`}
            >
              <img src={lang.flag} alt={lang.name} className="w-6 h-4 object-cover rounded" />
              <span className={`font-medium ${selectedLang === lang.code ? 'text-blue-600' : 'text-gray-700'}`}>
                {lang.name}
              </span>
              {selectedLang === lang.code && (
                <svg className="w-5 h-5 ml-auto text-blue-600" fill="currentColor" viewBox="0 0 20 20">
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