
import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { MissionListItem } from '@/app/data/missions';
import ToggleCondition from './ToggleCondition';
import ValidationButtons from './ValidationButtom';

interface InstructionMissionProps {
  mission: MissionListItem;
  onValidate?: () => void;
}

export default function InstructionMission({ mission, onValidate }: InstructionMissionProps) {
  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const instructions = `1. Vérifier l'état général du véhicule avant le départ (carrosserie, pneus, feux)
2. Contrôler le niveau de carburant et le noter
3. Prendre des photos du véhicule (4 angles + compteur kilométrique)
4. Vérifier la présence de tous les documents (carte grise, assurance, contrôle technique)
5. Signaler immédiatement tout dommage ou anomalie constatée
6. Respecter le code de la route et les limitations de vitesse
7. En cas de problème, contacter le responsable avant toute décision`;

  const handleValidation = async () => {
    setIsValidating(true);
    // Simuler une validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsValidating(false);
    
    if (onValidate) {
      onValidate();
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Carte blanche principale */}
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          
        

          {/* Contenu principal */}
          <div className="p-8 space-y-8">
            
            {/* Instructions */}
            <div>
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
                <h2 className="text-xl font-bold text-slate-900">Instructions à suivre</h2>
              </div>
              
              <div className="bg-orange-50 rounded-xl p-5 border border-orange-200">
                <pre className="text-sm text-slate-800 whitespace-pre-wrap font-sans leading-relaxed">
                  {instructions}
                </pre>
                <div className="bg-orange-50 rounded-xl p-5 pt-8">


                
                <ToggleCondition
              accepted={conditionsAccepted}
              onToggle={setConditionsAccepted}
              title="J'ai lu et compris les instructions"
              description="En activant cette option, vous confirmez avoir pris connaissance de toutes les instructions de mission et vous engagez à les respecter."
            />
            </div>
              </div>
               {/* Toggle de conditions */}
            
            </div>

          
            {/* Divider */}
            <div className="border-t border-slate-200"></div>

          

            {/* Boutons de validation */}
            <ValidationButtons
              conditionsAccepted={conditionsAccepted}
              isValidating={isValidating}
              onValidate={handleValidation}
              validationText="Suivant"
              warningText="⚠️ Veuillez confirmer avoir lu les instructions"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
