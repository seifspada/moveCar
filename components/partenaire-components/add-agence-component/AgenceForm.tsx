'use client';

import { useState } from 'react';

interface AgenceFormProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

interface FormData {
  nom: string;
  adresse: string;
  ville: string;
  codePostal: string;
  telephone: string;
  email: string;
}

const initialForm: FormData = {
  nom: '', adresse: '', ville: '',
  codePostal: '', telephone: '', email: '',
};

export default function AgenceForm({ onSuccess, onCancel }: AgenceFormProps) {
  const [formData, setFormData] = useState<FormData>(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Session expirée, veuillez vous reconnecter');
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('http://localhost:3000/agencies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(formData),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Erreur lors de la création');
      }
      setFormData(initialForm);
      onSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    {
      name: 'nom', label: "Nom de l'agence", placeholder: 'Agence Tunis Centre',
      required: true, colSpan: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      name: 'adresse', label: 'Adresse', placeholder: 'Rue de la Liberté, Bab Bhar',
      required: false, colSpan: true,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0zM15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      name: 'ville', label: 'Ville', placeholder: 'Tunis',
      required: false, colSpan: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
    },
    {
      name: 'codePostal', label: 'Code postal', placeholder: '1000',
      required: false, colSpan: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        </svg>
      ),
    },
    {
      name: 'telephone', label: 'Téléphone', placeholder: '+21671000000',
      required: false, colSpan: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
    },
    {
      name: 'email', label: 'Email', placeholder: 'agence@example.com',
      required: false, colSpan: false,
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-zinc-800/50 border-b border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-orange-600/15 border border-orange-600/25
                          flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5" />
            </svg>
          </div>
          <div>
            <h2 className="text-white font-semibold text-base">Nouvelle agence</h2>
            <p className="text-xs text-zinc-500 mt-0.5">Remplissez les informations de votre agence</p>
          </div>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-500
                       hover:text-zinc-300 hover:bg-zinc-700 transition-all duration-200"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-5 p-3 rounded-xl text-sm flex items-center gap-2.5
                          bg-red-500/10 border border-red-500/20 text-red-400">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fields.map((field) => {
              const isFocused = focusedField === field.name;
              return (
                <div key={field.name} className={field.colSpan ? 'md:col-span-2' : ''}>
                  <label className={`block text-xs font-semibold uppercase tracking-widest mb-1.5
                                     transition-colors duration-200 ${
                    isFocused ? 'text-orange-500' : 'text-zinc-500'
                  }`}>
                    {field.label}
                    {field.required && <span className="text-orange-500 ml-1">*</span>}
                  </label>
                  <div className="relative">
                    <span className={`absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200 ${
                      isFocused ? 'text-orange-500' : 'text-zinc-600'
                    }`}>
                      {field.icon}
                    </span>
                    <input
                      type="text"
                      name={field.name}
                      value={formData[field.name as keyof FormData]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      required={field.required}
                      onFocus={() => setFocusedField(field.name)}
                      onBlur={() => setFocusedField(null)}
                      className={`w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-zinc-800
                                  text-white/85 placeholder-zinc-600 outline-none transition-all duration-200 ${
                        isFocused
                          ? 'border border-orange-600/50 ring-2 ring-orange-600/10'
                          : 'border border-zinc-700 hover:border-zinc-600'
                      }`}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 mt-6 pt-5 border-t border-zinc-800">
            <button
              type="button"
              onClick={() => setFormData(initialForm)}
              className="px-4 py-2.5 text-sm text-zinc-600 hover:text-zinc-400
                         hover:bg-zinc-800 rounded-xl transition-all duration-200"
            >
              Réinitialiser
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-orange-600 hover:bg-orange-500
                         disabled:opacity-50 text-white px-5 py-2.5 rounded-xl
                         text-sm font-semibold transition-all duration-200
                         shadow-lg shadow-orange-600/20 hover:shadow-orange-500/30"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Création...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Créer l'agence
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}