// components/compte-adherent/forms/TelephoneForm.tsx

interface TelephoneFormProps {
  currentTelephone: string;
  onClose: () => void;
}

export default function TelephoneForm({ currentTelephone, onClose }: TelephoneFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Téléphone modifié');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Numéro de téléphone
        </label>
        <input
          type="tel"
          defaultValue={currentTelephone}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="06 12 34 56 78"
          required
        />
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition"
        >
          Valider
        </button>
      </div>
    </form>
  );
}
