import React from 'react';

interface FormActionsProps {
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = ({
  isSubmitting,
  onSubmit,
  onCancel
}) => (
  <div className="flex justify-end gap-4">
    <button
      type="button"
      onClick={onCancel}
      className="px-8 py-3 border-2 border-gray-300 rounded-full text-gray-700 font-semibold hover:bg-gray-50 transition-all"
      disabled={isSubmitting}
    >
      Retour
    </button>

    <button
      type="button"
      onClick={onSubmit}
      disabled={isSubmitting}
      className="px-20 py-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-full font-semibold hover:from-orange-600 hover:to-orange-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
    >
      {isSubmitting ? (
        <>
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          Création en cours...
        </>
      ) : (
        'Créer la mission'
      )}
    </button>
  </div>
);