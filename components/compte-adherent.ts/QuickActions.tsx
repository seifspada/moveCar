// components/compte-adherent/QuickActions.tsx
import { Mail, MessageCircle } from 'lucide-react';

export default function QuickActions() {
  const handleContactMail = () => {
    window.location.href = 'mailto:contact@plateforme.com';
  };

  const handleContactWhatsApp = () => {
    window.open('https://wa.me/33612345678', '_blank');
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
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
  );
}
