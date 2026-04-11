// components/compte-adherent/LegalDocuments.tsx
import { Shield, FileText } from 'lucide-react';

export default function LegalDocuments() {
  return (
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
  );
}
