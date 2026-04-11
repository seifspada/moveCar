'use client';

import { useState } from 'react';
import { CheckCircle, User, CreditCard, Shield, RotateCcw, Camera } from 'lucide-react';
import { CameraMode } from './CameraMode';
import ValidationButtons from './ValidationButtom';
import ToggleCondition from './ToggleCondition';
import { Mission } from '@/app/types/mission';

interface PhotoData {
  dataUrl: string;
}

interface Photos {
  adherent: PhotoData | null;
  permisRecto: PhotoData | null;
  permisVerso: PhotoData | null;
}

interface ReconnaisanceAdherentProps {
  mission: Mission;
  onValidate?: () => void;
}
type CameraModeType = null | 'adherent' | 'permis';

export default function AdherentForm({ mission, onValidate }: ReconnaisanceAdherentProps) {
  const [photos, setPhotos] = useState<Photos>({
    adherent: null,
    permisRecto: null,
    permisVerso: null
  });

  const [conditionsAccepted, setConditionsAccepted] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [cameraMode, setCameraMode] = useState<CameraModeType>(null);
  const [permisPhotoIndex, setPermisPhotoIndex] = useState(0);

  const [adherentData] = useState({
    numeroPermis: 'FR-2024-ABC-12345',
    numeroAssurance: 'ASS-987654321'
  });

  const handleValidationForm = async () => {
    setIsValidating(true);
    // Simuler une validation
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsValidating(false);
    
    if (onValidate) {
      onValidate();
    }
  };

  // Gestion de la capture photo
  const handleCapture = (dataUrl: string) => {
    if (cameraMode === 'adherent') {
      setPhotos(prev => ({
        ...prev,
        adherent: { dataUrl }
      }));
    } else if (cameraMode === 'permis') {
      if (permisPhotoIndex === 0) {
        setPhotos(prev => ({
          ...prev,
          permisRecto: { dataUrl }
        }));
        setPermisPhotoIndex(1);
      } else {
        setPhotos(prev => ({
          ...prev,
          permisVerso: { dataUrl }
        }));
        setPermisPhotoIndex(0);
      }
    }
  };

  // NOUVEAU : Gestion de la suppression d'une photo dans la caméra
  const handleRemoveCapture = (index: number) => {
    if (cameraMode === 'permis') {
      if (index === 0) {
        // Supprimer le recto
        setPhotos(prev => ({
          ...prev,
          permisRecto: null
        }));
        // Si on supprime le recto, réinitialiser l'index
        if (permisPhotoIndex === 1) {
          setPermisPhotoIndex(0);
        }
      } else if (index === 1) {
        // Supprimer le verso
        setPhotos(prev => ({
          ...prev,
          permisVerso: null
        }));
        setPermisPhotoIndex(1); // Rester en mode verso
      }
    }
  };

  const handleValidation = () => {
    if (!conditionsAccepted) return;
    
    if (!photos.adherent || !photos.permisRecto || !photos.permisVerso) {
      alert('⚠️ Veuillez prendre toutes les photos avant de continuer');
      return;
    }

    setIsValidating(true);
    
    setTimeout(() => {
      setIsValidating(false);
      alert('✅ Validation réussie !');
    }, 1500);
  };

  const startPermisCapture = () => {
    setPermisPhotoIndex(0);
    setCameraMode('permis');
  };

  const resetPermisPhotos = () => {
    setPhotos(prev => ({
      ...prev,
      permisRecto: null,
      permisVerso: null
    }));
    setPermisPhotoIndex(0);
  };

  const resetAdherentPhoto = () => {
    setPhotos(prev => ({
      ...prev,
      adherent: null
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <User className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Photos de l'adhérent</h1>
                <p className="text-orange-100 text-sm mt-1">Validation requise avant le démarrage</p>
              </div>
            </div>
          </div>

          

          {/* Contenu principal */}
          <div className="p-8 space-y-8">

              {/* Informations */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-lg"></div>
                Informations de l'adhérent
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                    <label className="text-xs text-slate-500 uppercase font-medium">
                      Numéro de permis
                    </label>
                  </div>
                  <input
                    type="text"
                    value={adherentData.numeroPermis}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-full text-slate-900 font-mono text-sm cursor-not-allowed"
                  />
                </div>

                <div className="bg-slate-50 rounded-full p-4 border border-slate-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="w-5 h-5 text-slate-500" />
                    <label className="text-xs text-slate-500 uppercase font-medium">
                      Numéro d'assurance
                    </label>
                  </div>
                  <input
                    type="text"
                    value={adherentData.numeroAssurance}
                    readOnly
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-full text-slate-900 font-mono text-sm cursor-not-allowed"
                  />
                </div>
              </div>
            </div>

            {/* Photo Adhérent */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-lg"></div>
                Photo de l'adhérent
              </h2>
              
              <div>
                {!photos.adherent ? (
                  <button
                    onClick={() => setCameraMode('adherent')}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                  >
                    <Camera className="w-12 h-12 text-orange-600" />
                    <span className="mt-2 text-sm text-orange-700 font-medium">
                      Prendre une photo
                    </span>
                  </button>
                ) : (
                  <div>
                    <div className="flex items-center gap-2 text-green-600 mb-4">
                      <CheckCircle className="w-5 h-5" />
                      <span className="text-sm font-medium">Photo capturée</span>
                    </div>
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-full max-w-md aspect-square rounded-lg border-4 border-orange-200 shadow-lg overflow-hidden bg-slate-100">
                        <img
                          src={photos.adherent.dataUrl}
                          alt="Photo adhérent"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <button
                        onClick={resetAdherentPhoto}
                        className="flex items-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reprendre la photo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Photos Permis */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-lg"></div>
                Permis de conduire
              </h2>
              
              <div>
                {!photos.permisRecto && !photos.permisVerso ? (
                  <button
                    onClick={startPermisCapture}
                    className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                  >
                    <Camera className="w-12 h-12 text-orange-600" />
                    <span className="mt-2 text-sm text-orange-700 font-medium">
                      Prendre photos recto/verso
                    </span>
                  </button>
                ) : (
                  <div>
                    <div className="space-y-6">
                      {photos.permisRecto && (
                        <div>
                          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Recto
                          </h3>
                          <div className="w-full rounded-lg border-2 border-green-400 shadow-md overflow-hidden bg-slate-100 p-2">
                            <img
                              src={photos.permisRecto.dataUrl}
                              alt="Permis recto"
                              className="w-full h-auto rounded"
                            />
                          </div>
                        </div>
                      )}

                      {photos.permisVerso && (
                        <div>
                          <h3 className="text-sm font-medium text-slate-700 mb-3 flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            Verso
                          </h3>
                          <div className="w-full rounded-lg border-2 border-green-400 shadow-md overflow-hidden bg-slate-100 p-2">
                            <img
                              src={photos.permisVerso.dataUrl}
                              alt="Permis verso"
                              className="w-full h-auto rounded"
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {photos.permisRecto && photos.permisVerso && (
                      <button
                        onClick={resetPermisPhotos}
                        className="mt-6 w-full flex items-center justify-center gap-2 py-3 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reprendre les photos
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

          

           
          
            <ToggleCondition
              accepted={conditionsAccepted}
              onToggle={setConditionsAccepted}
              title="J'ai lu et compris les instructions"
              description="En activant cette option, vous confirmez avoir pris connaissance de toutes les instructions de mission et vous engagez à les respecter."
            />
               <ValidationButtons
                           conditionsAccepted={conditionsAccepted}
                           isValidating={isValidating}
                           onValidate={handleValidationForm}
                           validationText="Suivant"
                           warningText="⚠️ Veuillez confirmer avoir lu les instructions"
                         />
            
          </div>
        </div>
      </div>

      {/* Composant Camera pour Adhérent */}
      <CameraMode
        isOpen={cameraMode === 'adherent'}
        onClose={() => setCameraMode(null)}
        onCapture={handleCapture}
        title="Photo de l'adhérent"
        instruction="📸 Positionnez votre visage au centre"
        tip="💡 Conseil : Assurez-vous d'avoir un bon éclairage"
        multiCapture={false}
      />

      {/* Composant Camera pour Permis avec suppression */}
      <CameraMode
        isOpen={cameraMode === 'permis'}
        onClose={() => {
          setCameraMode(null);
          setPermisPhotoIndex(0);
        }}
        onCapture={handleCapture}
        onRemoveCapture={handleRemoveCapture} // NOUVEAU
        title="Permis de conduire"
        instruction={
          permisPhotoIndex === 0 
            ? "🪪 Photographiez le RECTO du permis" 
            : "🪪 Photographiez le VERSO du permis"
        }
        tip={
          permisPhotoIndex === 0
            ? "💡 Conseil : Vérifiez que le texte est lisible et sans reflet"
            : "💡 Conseil : Assurez-vous que toutes les informations sont visibles"
        }
        multiCapture={true}
        captureCount={2}
        currentCaptureIndex={permisPhotoIndex}
      />
    </div>
  );
}
