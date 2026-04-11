// components/compte-adherent/forms/RibForm.tsx

interface RibFormProps {
  currentRib: string;
  onClose: () => void;
}

export default function RibForm({ currentRib, onClose }: RibFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('RIB modifié');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          RIB / IBAN
        </label>
        <input
          type="text"
          defaultValue={currentRib}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          placeholder="FR76 1234 5678 9012 3456 7890 123"
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
