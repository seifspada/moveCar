import { FileText, AlertCircle, CheckCircle } from 'lucide-react';
import { AdherentDocument, DocumentStatus } from '@/app/types/compte'; // ✅ Renommé

interface DocumentsSectionProps {
  documents: AdherentDocument[]; // ✅ Renommé
}

export default function DocumentsSection({ documents }: DocumentsSectionProps) {
  const calculateDaysRemaining = (expirationDate: Date | string): number => { // ✅ string aussi
    const expDate = new Date(expirationDate); // ✅ Normalisation
    const diffTime = expDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDocumentStatus = (daysRemaining: number): DocumentStatus => {
    if (daysRemaining < 0) return 'expire';
    if (daysRemaining <= 30) return 'bientot_expire';
    return 'valide';
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
        <FileText className="w-7 h-7 text-orange-600" />
        Validité des documents (6 mois)
      </h2>

      <div className="space-y-4">
        {documents.map((doc, idx) => {
          const daysRemaining = calculateDaysRemaining(doc.dateExpiration);
          const status = getDocumentStatus(daysRemaining);

          return (
            <div
              key={idx}
              className={`p-4 rounded-xl border-2 ${
                status === 'expire'
                  ? 'bg-red-50 border-red-300'
                  : status === 'bientot_expire'
                  ? 'bg-yellow-50 border-yellow-300'
                  : 'bg-green-50 border-green-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {status === 'expire' ? (
                    <AlertCircle className="w-6 h-6 text-red-600" />
                  ) : status === 'bientot_expire' ? (
                    <AlertCircle className="w-6 h-6 text-yellow-600" />
                  ) : (
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  )}

                  <div>
                    <h3 className="font-semibold text-gray-900">{doc.nom}</h3>
                    <p className={`text-sm ${
                      status === 'expire'
                        ? 'text-red-700'
                        : status === 'bientot_expire'
                        ? 'text-yellow-700'
                        : 'text-green-700'
                    }`}>
                      {status === 'expire'
                        ? `Expiré depuis ${Math.abs(daysRemaining)} jours`
                        : status === 'bientot_expire'
                        ? `Expire dans ${daysRemaining} jours`
                        : `Valide - Expire le ${new Date(doc.dateExpiration).toLocaleDateString('fr-FR')}` // ✅
                      }
                    </p>
                  </div>
                </div>

                {(status === 'expire' || status === 'bientot_expire') && (
                  <button className="bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-700 transition">
                    Renouveler
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
