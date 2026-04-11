import { CheckCircle2 } from 'lucide-react';
import { PartenaireFormData } from '@/app/hooks/usePartenaireForm';

type Props = {
  formData: PartenaireFormData;
  formatDateLocale: (dateStr: string) => string;
  formatDateShort: (dateStr: string) => string;
};

export default function SuccessView({ formData, formatDateLocale, formatDateShort }: Props) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-green-600 to-green-500 text-white p-6">
            <h2 className="text-2xl font-semibold flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              Demande de contact envoyée avec succès
            </h2>
          </div>

          <div className="p-8">
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>

              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Votre demande de premier contact a été envoyée !
              </h3>

              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Nous avons bien reçu votre demande de contact. Notre équipe commerciale vous
                contactera pour votre{' '}
                {formData.typeRdv === 'TELEPHONIQUE'
                  ? 'rendez-vous téléphonique'
                  : 'rendez-vous physique'}{' '}
                prévu le <strong>{formatDateShort(formData.dateRdv)}</strong> à{' '}
                <strong>{formData.creneau}</strong>.
              </p>

              {/* Prochaines étapes */}
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h4 className="font-semibold text-orange-900 mb-3">Prochaines étapes :</h4>
                <ul className="text-left text-gray-700 space-y-2">
                  {[
                    `Confirmation de votre rendez-vous par email à ${formData.email}`,
                    'Étude personnalisée de vos besoins en transport',
                    "Proposition d'une solution adaptée à votre entreprise",
                  ].map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">{idx + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Récapitulatif */}
              <div className="bg-gray-50 rounded-lg p-6 mb-8 max-w-2xl mx-auto">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Récapitulatif de votre demande :
                </h4>
                <div className="text-left text-sm text-gray-600 space-y-2">
                  <p><strong>Nom :</strong> {formData.nom}</p>
                  <p><strong>Entité :</strong> {formData.entite}</p>
                  <p><strong>Email :</strong> {formData.email}</p>
                  <p><strong>Téléphone :</strong> {formData.telephone}</p>
                  {formData.nombreDeplacements && (
                    <p><strong>Déplacements/mois :</strong> {formData.nombreDeplacements}</p>
                  )}
                  {formData.nombreAgences && (
                    <p><strong>Nombre d'agences :</strong> {formData.nombreAgences}</p>
                  )}
                  <p>
                    <strong>Type de RDV :</strong>{' '}
                    {formData.typeRdv === 'TELEPHONIQUE' ? 'Téléphonique' : 'Physique'}
                  </p>
                  <p><strong>Date :</strong> {formatDateLocale(formData.dateRdv)}</p>
                  {formData.creneau && (
                    <p><strong>Créneau :</strong> {formData.creneau}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => window.location.reload()}
                className="px-10 py-4 bg-gradient-to-r from-orange-600 to-orange-800 text-white rounded-full font-semibold hover:from-orange-700 hover:to-orange-900 transition-colors"
              >
                Retour à l'accueil
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}