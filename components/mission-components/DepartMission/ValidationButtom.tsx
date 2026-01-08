import React from 'react';

interface ValidationButtonsProps {
  conditionsAccepted: boolean;
  isValidating: boolean;
  onValidate: () => void;
  validationText?: string;
  warningText?: string;
}

const ValidationButtons: React.FC<ValidationButtonsProps> = ({ 
  conditionsAccepted, 
  isValidating, 
  onValidate,
  validationText = 'Valider le départ',
  warningText = '⚠️ Veuillez accepter les conditions pour continuer'
}) => {
  const handleBack = () => {
    window.history.back();
  };

  return (
    <div>
      <div className="flex gap-3">
        <button
          onClick={handleBack}
          disabled={isValidating}
          className="flex-1 py-5 px-6 rounded-full font-semibold text-base transition-all duration-200 bg-white border-2 border-slate-300 text-slate-700 hover:border-orange-500 hover:text-orange-600 hover:shadow-md transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-300 disabled:hover:text-slate-700"
        >
          ← Retour
        </button>
        
        <button
          onClick={onValidate}
          disabled={!conditionsAccepted || isValidating}
          className={`flex-1 py-5 px-6 rounded-full font-bold text-lg transition-all duration-200 ${
            conditionsAccepted && !isValidating
              ? 'bg-gradient-to-r from-orange-600 to-orange-500 hover:from-green-600 hover:to-green-500 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
              : 'bg-slate-200 text-slate-400 cursor-not-allowed'
          }`}
        >
          {isValidating ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Validation en cours...
            </span>
          ) : (
            validationText
          )}
        </button>
      </div>
      
      {!conditionsAccepted && (
        <p className="text-center text-sm text-orange-600 font-medium mt-4">
          {warningText}
        </p>
      )}
    </div>
  );
};

export default ValidationButtons;