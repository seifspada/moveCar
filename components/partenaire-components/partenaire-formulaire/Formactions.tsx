import { Loader2 } from 'lucide-react';

type Props = {
  isLoading: boolean;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
};

export default function FormActions({ isLoading, onCancel, onSubmit }: Props) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 pt-6">
      <button
        type="button"
        onClick={onCancel}
        disabled={isLoading}
        className="flex-1 bg-gray-200 text-gray-700 font-semibold py-3.5 px-6 rounded-full hover:bg-gray-300 transition-all duration-200 shadow hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Annuler
      </button>
      <button
        type="button"
        onClick={onSubmit}
        disabled={isLoading}
        className="flex-1 bg-orange-600 text-white font-semibold py-3.5 px-6 rounded-full hover:bg-green-600 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Envoi en cours...
          </>
        ) : (
          'Envoyer la demande'
        )}
      </button>
    </div>
  );
}