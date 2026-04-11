import React from 'react';

interface ValidationModalProps {
  show: boolean;
  errorMessage: string | null;
  missingFields: string[];
  onClose: () => void;
}

export const ValidationModal: React.FC<ValidationModalProps> = ({
  show,
  errorMessage,
  missingFields,
  onClose
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
        <h3 className="text-2xl font-bold text-gray-900 mb-4 flex items-center gap-2">
          {errorMessage ? (
            <>
              <span className="text-3xl">❌</span> Erreur
            </>
          ) : missingFields.length === 0 ? (
            <>
              <span className="text-3xl">✅</span> Formulaire validé
            </>
          ) : (
            <>
              <span className="text-3xl">⚠️</span> Champs manquants
            </>
          )}
        </h3>

        {errorMessage ? (
          <div className="bg-red-50 p-6 rounded-xl border-2 border-red-200 mb-6">
            <div className="text-red-700 text-sm font-semibold whitespace-pre-line text-left">
              {errorMessage}
            </div>
          </div>
        ) : missingFields.length === 0 ? (
          <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
            <p className="text-green-600 text-lg font-semibold">Demande soumise avec succès!</p>
          </div>
        ) : (
          <>
            <p className="text-gray-700 mb-4 font-medium">
              Veuillez corriger les éléments suivants :
            </p>
            <ul className="list-none mb-6 space-y-2 max-h-60 overflow-y-auto bg-gray-50 p-4 rounded-lg">
              {missingFields.map((field, idx) => (
                <li
                  key={idx}
                  className={`text-sm p-2 rounded flex items-start gap-2 ${
                    field.includes('date') || field.includes('heure') || field.includes('Erreur')
                      ? 'bg-red-100 text-red-700 font-semibold border border-red-300'
                      : 'bg-white text-gray-700 border border-gray-200'
                  }`}
                >
                  <span className="flex-shrink-0">
                    {field.includes('date') || field.includes('heure') || field.includes('Erreur') 
                      ? '⚠️'  
                      : '•'}
                  </span>
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-full hover:from-orange-700 hover:to-orange-800 transition font-semibold shadow-md hover:shadow-lg"
        >
          {errorMessage ? 'Corriger' : 'Compris'}
        </button>
      </div>
    </div>
  );
};