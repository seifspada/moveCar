type Props = {
  show: boolean;
  missingFields: string[];
  onClose: () => void;
};

export default function FormModal({ show, missingFields, onClose }: Props) {
  if (!show) return null;

  const isSuccess = missingFields.length === 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          {isSuccess ? '✓ Formulaire validé' : '⚠ Champs manquants'}
        </h3>

        {isSuccess ? (
          <div className="bg-green-50 p-6 rounded-lg text-center border border-green-200">
            <p className="text-green-600 text-lg font-semibold mb-2">
              Votre demande a été soumise avec succès !
            </p>
            <p className="text-green-700 text-sm">
              Nous vous contacterons très prochainement.
            </p>
          </div>
        ) : (
          <>
            <p className="text-gray-700 mb-4">Veuillez remplir les champs suivants :</p>
            <ul className="list-disc list-inside text-red-600 mb-6 space-y-1">
              {missingFields.map((field, idx) => (
                <li key={idx}>{field}</li>
              ))}
            </ul>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full py-3 bg-orange-600 text-white rounded-full hover:bg-orange-700 transition font-semibold"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}