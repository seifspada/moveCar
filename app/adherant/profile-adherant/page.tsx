"use client";
import { useState } from 'react';
import { 
  User, 
  Mail, 
  LogOut, 
  Crown, 
  MessageCircle, 
  Phone,
  FileText,
  Shield,
  Settings,
  Lock,
  CreditCard,
  MapPin,
  AlertCircle,
  CheckCircle,
  Calendar,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import ProfileHeader from '@/components/mission-components/ProfileHeader';
import SidebarAdherant from '@/app/components/sideBarAdherant';

// Types
interface UserProfile {
  photo: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse: string;
  rib: string;
}

interface Document {
  nom: string;
  dateExpiration: Date;
  statut: 'valide' | 'bientot_expire' | 'expire';
}

export default function CompteAdherent() {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showRibModal, setShowRibModal] = useState(false);
  const [showAdresseModal, setShowAdresseModal] = useState(false);
  const [showTelephoneModal, setShowTelephoneModal] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev);
  const toggleDesktopMenu = () => setIsDesktopMenuOpen(prev => !prev);

  // Données utilisateur (à remplacer par de vraies données)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    photo: '/placeholder-avatar.jpg',
    nom: 'DUPONT',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '06 12 34 56 78',
    adresse: '12 rue des Lilas, 75001 Paris',
    rib: 'FR76 1234 5678 9012 3456 7890 123'
  });

  // Documents avec décompte de validité
  const calculateDaysRemaining = (expirationDate: Date): number => {
    const today = new Date();
    const diffTime = expirationDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDocumentStatus = (daysRemaining: number): 'valide' | 'bientot_expire' | 'expire' => {
    if (daysRemaining < 0) return 'expire';
    if (daysRemaining <= 30) return 'bientot_expire';
    return 'valide';
  };

  const [documents] = useState<Document[]>([
    {
      nom: 'KBIS',
      dateExpiration: new Date('2026-06-15'),
      statut: 'valide'
    },
    {
      nom: 'Assurance RC Pro',
      dateExpiration: new Date('2025-02-10'),
      statut: 'bientot_expire'
    },
    {
      nom: 'Assurance Circulation',
      dateExpiration: new Date('2026-01-15'),
      statut: 'expire'
    }
  ]);

  const handleLogout = () => {
    // Logique de déconnexion
    console.log('Déconnexion');
  };

  const handleContactMail = () => {
    window.location.href = 'mailto:contact@plateforme.com';
  };

  const handleContactWhatsApp = () => {
    window.open('https://wa.me/33612345678', '_blank');
  };

  return (

 

    <div className="min-h-screen bg-black min-w-full pb-20">
           <SidebarAdherant
        isMobileMenuOpen={isMobileMenuOpen}
        onMobileMenuToggle={toggleMobileMenu}
        isDesktopMenuOpen={isDesktopMenuOpen}
        onDesktopMenuToggle={toggleDesktopMenu}
      />

      <ProfileHeader
        isMobileMenuOpen={isMobileMenuOpen}
        isDesktopMenuOpen={isDesktopMenuOpen}
        toggleMobileMenu={toggleMobileMenu}
        toggleDesktopMenu={toggleDesktopMenu}
      />  
        
      <div className="max-w-6xl mx-auto space-y-6 pt-10 ">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
         
          {/* Actions rapides */}
          <div className="p-6 bg-black">
            <div className="flex flex-wrap gap-4 justify-center">
              
              
              <div className="flex gap-2">
                <button
                  onClick={handleContactMail}
                  className="flex items-center gap-2 bg-orange-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-orange-700 transition shadow-md"
                >
                  <Mail className="w-5 h-5" />
                  Email
                </button>
                
                <button
                  onClick={handleContactWhatsApp}
                  className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition shadow-md"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Documents - Décompte de validité */}
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
                            : `Valide - Expire le ${doc.dateExpiration.toLocaleDateString('fr-FR')}`
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

        {/* Documents légaux */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Shield className="w-6 h-6 text-orange-600" />
              Documents légaux
            </h3>
            
            <div className="space-y-3">
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group">
                <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                  Conditions Générales de mise en relation
                </span>
                <FileText className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
              
              <button className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group">
                <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                  Politique de confidentialité (RGPD)
                </span>
                <Shield className="w-5 h-5 text-gray-400 group-hover:text-orange-600" />
              </button>
            </div>
          </div>

          {/* Paramètres de compte */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-3">
              <Settings className="w-6 h-6 text-orange-600" />
              Paramètres de compte
            </h3>
            
            <div className="space-y-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Changer mot de passe
                </span>
              </button>
              
              <button
                onClick={() => setShowRibModal(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Modifier RIB
                </span>
              </button>
              
              <button
                onClick={() => setShowAdresseModal(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  Modifier adresse postale
                </span>
              </button>
              
              <button
                onClick={() => setShowTelephoneModal(true)}
                className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-orange-50 rounded-lg transition flex items-center justify-between group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Modifier téléphone
                </span>
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Modal - Changer mot de passe */}
      {showPasswordModal && (
        <Modal onClose={() => setShowPasswordModal(false)} title="Changer mot de passe">
          <PasswordChangeForm onClose={() => setShowPasswordModal(false)} />
        </Modal>
      )}

      {/* Modal - Modifier RIB */}
      {showRibModal && (
        <Modal onClose={() => setShowRibModal(false)} title="Modifier RIB">
          <RibForm currentRib={userProfile.rib} onClose={() => setShowRibModal(false)} />
        </Modal>
      )}

      {/* Modal - Modifier adresse */}
      {showAdresseModal && (
        <Modal onClose={() => setShowAdresseModal(false)} title="Modifier adresse postale">
          <AdresseForm currentAdresse={userProfile.adresse} onClose={() => setShowAdresseModal(false)} />
        </Modal>
      )}

      {/* Modal - Modifier téléphone */}
      {showTelephoneModal && (
        <Modal onClose={() => setShowTelephoneModal(false)} title="Modifier téléphone">
          <TelephoneForm currentTelephone={userProfile.telephone} onClose={() => setShowTelephoneModal(false)} />
        </Modal>
      )}
    </div>
  );
}

// Composant Modal réutilisable
function Modal({ children, onClose, title }: { children: React.ReactNode; onClose: () => void; title: string }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

// Formulaire changement de mot de passe
function PasswordChangeForm({ onClose }: { onClose: () => void }) {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logique de changement de mot de passe
    console.log('Mot de passe changé');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Mot de passe actuel
        </label>
        <div className="relative">
          <input
            type={showOldPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowOldPassword(!showOldPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showOldPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showNewPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowNewPassword(!showNewPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Confirmer nouveau mot de passe
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
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

// Formulaire RIB
function RibForm({ currentRib, onClose }: { currentRib: string; onClose: () => void }) {
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

// Formulaire Adresse
function AdresseForm({ currentAdresse, onClose }: { currentAdresse: string; onClose: () => void }) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Adresse modifiée');
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Adresse postale complète
        </label>
        <textarea
          defaultValue={currentAdresse}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
          rows={3}
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

// Formulaire Téléphone
function TelephoneForm({ currentTelephone, onClose }: { currentTelephone: string; onClose: () => void }) {
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