'use client';

import { useState } from 'react';
import { CheckCircle, Camera, Video, Car, Gauge, RotateCcw } from 'lucide-react';
import { CameraMode } from './CameraMode';
import NiveauCarburant from './CarburantLevel';
import ValidationButtons from './ValidationButtom';
import ToggleCondition from './ToggleCondition';
import { Mission } from '@/app/data/missions';

interface PhotoData {
  dataUrl: string;
}

interface VideoData {
  blob: Blob;
  url: string;
}

interface EtatDesLieuxData {
  dateDepart: string;
  heureDepart: string;
  immatriculation: string;
  kilometres: string;
  niveauCarburant: number;
  photoTableauBord: PhotoData | null;
  photoImmatriculation: PhotoData | null;
  videoExterieur: VideoData | null;
  videoInterieur: VideoData | null;
}

interface EtatDesLieuxProps {
  mission: Mission;
  onValidate: () => void;
}

type CameraModeType = null | 'tableau-bord' | 'immatriculation' | 'video-exterieur' | 'video-interieur';

export default function EtatDesLieux({ mission, onValidate }: EtatDesLieuxProps) {
  const [data, setData] = useState<EtatDesLieuxData>({
    dateDepart: new Date().toISOString().split('T')[0],
    heureDepart: new Date().toTimeString().slice(0, 5),
    immatriculation: mission.immatriculation || '',
    kilometres: '',
    niveauCarburant: 50,
    photoTableauBord: null,
    photoImmatriculation: null,
    videoExterieur: null,
    videoInterieur: null
  });

  const [cameraMode, setCameraMode] = useState<CameraModeType>(null);
  const [isValidating, setIsValidating] = useState(false);
  const [conditionsAccepted, setConditionsAccepted] = useState(false);

  // Gestion des captures photo
  const handlePhotoCapture = (dataUrl: string) => {
    if (cameraMode === 'tableau-bord') {
      setData(prev => ({
        ...prev,
        photoTableauBord: { dataUrl }
      }));
    } else if (cameraMode === 'immatriculation') {
      setData(prev => ({
        ...prev,
        photoImmatriculation: { dataUrl }
      }));
    }
  };

  // Gestion des captures vidéo
  const handleVideoCapture = (videoBlob: Blob) => {
    const url = URL.createObjectURL(videoBlob);
    
    if (cameraMode === 'video-exterieur') {
      setData(prev => ({
        ...prev,
        videoExterieur: { blob: videoBlob, url }
      }));
    } else if (cameraMode === 'video-interieur') {
      setData(prev => ({
        ...prev,
        videoInterieur: { blob: videoBlob, url }
      }));
    }
  };

  const handleValidation = () => {
    if (!data.immatriculation || !data.kilometres) {
      alert('⚠️ Veuillez remplir tous les champs obligatoires');
      return;
    }
    
    if (!data.photoTableauBord || !data.photoImmatriculation) {
      alert('⚠️ Veuillez prendre toutes les photos requises');
      return;
    }
    
    if (!data.videoExterieur || !data.videoInterieur) {
      alert('⚠️ Veuillez enregistrer toutes les vidéos requises');
      return;
    }

    if (!conditionsAccepted) {
      alert('⚠️ Veuillez accepter les conditions avant de continuer');
      return;
    }

    setIsValidating(true);
    
    setTimeout(() => {
      setIsValidating(false);
      console.log('État des lieux validé - Données:', data);
      onValidate(); // Appeler la fonction de validation du parent
    }, 1500);
  };

  const isFormComplete = data.immatriculation && data.kilometres && 
                         data.photoTableauBord && data.photoImmatriculation &&
                         data.videoExterieur && data.videoInterieur &&
                         conditionsAccepted;

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-600 to-orange-500 text-white px-8 py-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Car className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">État des lieux</h1>
                <p className="text-orange-100 text-sm mt-1">Prise en charge du véhicule</p>
              </div>
            </div>
          </div>

          {/* Contenu principal */}
          <div className="p-8 space-y-8">
            {/* Informations de départ */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Informations de départ
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2 md:pt-5">
                    <Car className="w-5 h-5 text-slate-800" />
                    <label className="text-xs text-slate-800 uppercase font-medium">
                      Immatriculation *
                    </label>
                  </div>
                  <input
                    type="text"
                    value={data.immatriculation}
                    readOnly
                    placeholder="AB-123-CD"
                    className="w-full px-3 py-2 bg-slate-100 border border-orange-600 rounded-full
                               text-slate-900 font-mono text-sm uppercase
                               cursor-not-allowed"
                  />
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2 md:pt-5">
                    <Gauge className="w-5 h-5 text-slate-500" />
                    <label className="text-xs text-slate-500 uppercase font-medium">
                      Nombre de kilomètres *
                    </label>
                  </div>
                  <input
                    type="number"
                    value={data.kilometres}
                    onChange={(e) => setData(prev => ({ ...prev, kilometres: e.target.value }))}
                    placeholder="0"
                    className="w-full px-3 py-2 bg-white border border-orange-600 rounded-full text-slate-900 text-sm focus:outline-none focus:ring-0 focus:border-orange-600"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            <NiveauCarburant
              value={data.niveauCarburant}
              onChange={(newValue) => setData(prev => ({ ...prev, niveauCarburant: newValue }))}
            />

            <div className="border-t border-slate-200"></div>

            {/* Photos */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Photos requises
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Photo tableau de bord */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 md:pt-5">Tableau de bord (véhicule en marche)</h3>
                  {!data.photoTableauBord ? (
                    <button
                      onClick={() => setCameraMode('tableau-bord')}
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                    >
                      <Camera className="w-12 h-12 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700 font-medium">
                        Prendre une photo
                      </span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Photo capturée</span>
                      </div>
                      <div className="relative group">
                        <img
                          src={data.photoTableauBord.dataUrl}
                          alt="Tableau de bord"
                          className="w-full h-40 object-cover rounded-lg border-2 border-green-400"
                        />
                        <button
                          onClick={() => setData(prev => ({ ...prev, photoTableauBord: null }))}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reprendre
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Photo immatriculation */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3 md:pt-5">Immatriculation du véhicule</h3>
                  {!data.photoImmatriculation ? (
                    <button
                      onClick={() => setCameraMode('immatriculation')}
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                    >
                      <Camera className="w-12 h-12 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700 font-medium">
                        Prendre une photo
                      </span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Photo capturée</span>
                      </div>
                      <div className="relative group">
                        <img
                          src={data.photoImmatriculation.dataUrl}
                          alt="Immatriculation"
                          className="w-full h-40 object-cover rounded-lg border-2 border-green-400"
                        />
                        <button
                          onClick={() => setData(prev => ({ ...prev, photoImmatriculation: null }))}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reprendre
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-slate-200"></div>

            {/* Vidéos */}
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
                Vidéos requises
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Vidéo extérieur */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 md:pt-5">Extérieur du véhicule</h3>
                  <p className="text-xs text-slate-600 mb-3">Pare-brise et toit compris</p>
                  {!data.videoExterieur ? (
                    <button
                      onClick={() => setCameraMode('video-exterieur')}
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                    >
                      <Video className="w-12 h-12 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700 font-medium">
                        Enregistrer une vidéo
                      </span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Vidéo enregistrée</span>
                      </div>
                      <div className="relative group">
                        <video
                          src={data.videoExterieur.url}
                          controls
                          className="w-full h-40 object-cover rounded-lg border-2 border-green-400 bg-black"
                        />
                        <button
                          onClick={() => {
                            if (data.videoExterieur) URL.revokeObjectURL(data.videoExterieur.url);
                            setData(prev => ({ ...prev, videoExterieur: null }));
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reprendre
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Vidéo intérieur */}
                <div>
                  <h3 className="font-semibold text-slate-900 mb-2 md:pt-5">Intérieur du véhicule</h3>
                  <p className="text-xs text-slate-600 mb-3">Câble, kit crevaison, kit sécurité, roue de secours</p>
                  {!data.videoInterieur ? (
                    <button
                      onClick={() => setCameraMode('video-interieur')}
                      className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-orange-400 rounded-full cursor-pointer bg-white hover:bg-orange-50 transition-all duration-200"
                    >
                      <Video className="w-12 h-12 text-orange-600" />
                      <span className="mt-2 text-sm text-orange-700 font-medium">
                        Enregistrer une vidéo
                      </span>
                    </button>
                  ) : (
                    <div>
                      <div className="flex items-center gap-2 text-green-600 mb-3">
                        <CheckCircle className="w-5 h-5" />
                        <span className="text-sm font-medium">Vidéo enregistrée</span>
                      </div>
                      <div className="relative group">
                        <video
                          src={data.videoInterieur.url}
                          controls
                          className="w-full h-40 object-cover rounded-lg border-2 border-green-400 bg-black"
                        />
                        <button
                          onClick={() => {
                            if (data.videoInterieur) URL.revokeObjectURL(data.videoInterieur.url);
                            setData(prev => ({ ...prev, videoInterieur: null }));
                          }}
                          className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 text-orange-600 hover:text-orange-700 font-medium border-2 border-orange-400 rounded-lg hover:bg-orange-50 transition"
                        >
                          <RotateCcw className="w-4 h-4" />
                          Reprendre
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>


            <div className="border-t border-slate-200"></div>

         

              <ToggleCondition
              accepted={conditionsAccepted}
              onToggle={setConditionsAccepted}
              title="J'ai lu et compris les instructions"
              description="En activant cette option, vous confirmez avoir pris connaissance de toutes les instructions de mission et vous engagez à les respecter."
            />
           

            {/* Boutons de validation */}
            <ValidationButtons
              conditionsAccepted={conditionsAccepted}
              isValidating={isValidating}
              onValidate={handleValidation}
              validationText="Suivant"
              warningText="⚠️ Veuillez compléter tous les champs et prendre toutes les photos/vidéos
"
            />
          </div>
        </div>
      </div>

      {/* Composants Camera */}
      <CameraMode
        isOpen={cameraMode === 'tableau-bord'}
        onClose={() => setCameraMode(null)}
        onCapture={handlePhotoCapture}
        title="Tableau de bord"
        instruction="📸 Photographiez le tableau de bord avec le véhicule en marche"
        tip="💡 Assurez-vous que le compteur kilométrique et la jauge de carburant sont visibles"
        mode="photo"
      />

      <CameraMode
        isOpen={cameraMode === 'immatriculation'}
        onClose={() => setCameraMode(null)}
        onCapture={handlePhotoCapture}
        title="Immatriculation"
        instruction="📸 Photographiez la plaque d'immatriculation"
        tip="💡 Vérifiez que le numéro est lisible et sans reflet"
        mode="photo"
      />

      <CameraMode
        isOpen={cameraMode === 'video-exterieur'}
        onClose={() => setCameraMode(null)}
        onVideoCapture={handleVideoCapture}
        title="Vidéo extérieur"
        instruction="🎥 Filmez l'extérieur du véhicule (pare-brise et toit compris)"
        tip="💡 Faites le tour complet du véhicule lentement"
        mode="video"
      />

      <CameraMode
        isOpen={cameraMode === 'video-interieur'}
        onClose={() => setCameraMode(null)}
        onVideoCapture={handleVideoCapture}
        title="Vidéo intérieur"
        instruction="🎥 Filmez l'intérieur et les équipements"
        tip="💡 Montrez : câble de recharge, kit crevaison, kit sécurité, roue de secours"
        mode="video"
      />
    </div>
  );
}
