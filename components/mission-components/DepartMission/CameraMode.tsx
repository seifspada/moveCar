'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Camera, X, Check, Video, StopCircle, Circle } from 'lucide-react';

interface CameraProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture?: (dataUrl: string) => void;
  onVideoCapture?: (videoBlob: Blob) => void;
  onRemoveCapture?: (index: number) => void;
  title?: string;
  instruction?: string;
  tip?: string;
  mode?: 'photo' | 'video'; // NOUVEAU : mode photo ou vidéo
  multiCapture?: boolean;
  captureCount?: number;
  currentCaptureIndex?: number;
}

export function CameraMode({ 
  isOpen, 
  onClose, 
  onCapture,
  onVideoCapture,
  onRemoveCapture,
  title = "Prendre une photo",
  instruction = "📸 Positionnez votre sujet au centre",
  tip = "💡 Conseil : Assurez-vous d'avoir un bon éclairage",
  mode = 'photo', // NOUVEAU
  multiCapture = false,
  captureCount = 2,
  currentCaptureIndex = 0
}: CameraProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  // NOUVEAU : États pour la vidéo
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordedChunks, setRecordedChunks] = useState<Blob[]>([]);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      setIsCameraReady(false);
      
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }

      let mediaStream: MediaStream | null = null;
      
      // Configuration différente selon le mode
      const constraints = mode === 'video' 
        ? {
            video: { 
              facingMode: 'environment',
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: true // Audio activé pour les vidéos
          }
        : {
            video: { 
              facingMode: { exact: 'environment' },
              width: { ideal: 1920 },
              height: { ideal: 1080 }
            },
            audio: false
          };
      
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        console.log('✓ Caméra activée en mode', mode);
      } catch (err1) {
        // Fallback sans exact facingMode
        const fallbackConstraints = {
          video: { 
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          },
          audio: mode === 'video'
        };
        mediaStream = await navigator.mediaDevices.getUserMedia(fallbackConstraints);
        console.log('✓ Caméra fallback activée');
      }

      if (!mediaStream) {
        throw new Error('Impossible d\'obtenir un flux vidéo');
      }
      
      setStream(mediaStream);
      
      // NOUVEAU : Initialiser MediaRecorder pour les vidéos
      if (mode === 'video') {
        const recorder = new MediaRecorder(mediaStream, {
          mimeType: 'video/webm;codecs=vp8,opus'
        });
        
        recorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            setRecordedChunks(prev => [...prev, event.data]);
          }
        };
        
        recorder.onstop = () => {
          const blob = new Blob(recordedChunks, { type: 'video/webm' });
          if (onVideoCapture) {
            onVideoCapture(blob);
          }
          setRecordedChunks([]);
        };
        
        setMediaRecorder(recorder);
      }
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
              .then(() => {
                console.log('✓ Vidéo en lecture');
                setIsCameraReady(true);
              })
              .catch((playError) => {
                console.error('Erreur de lecture vidéo:', playError);
                alert('Erreur lors de la lecture de la vidéo');
                stopCamera();
              });
          }
        };

        videoRef.current.onerror = (e) => {
          console.error('Erreur vidéo:', e);
          alert('Erreur lors du chargement de la caméra');
          stopCamera();
        };
      }
    } catch (error) {
      console.error('Erreur d\'accès à la caméra:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      alert(`Impossible d'accéder à la caméra: ${errorMessage}\n\nVérifiez:\n- Les permissions de la caméra\n- Que le site est en HTTPS\n- Qu'aucune autre app n'utilise la caméra`);
      onClose();
    }
  };

  const stopCamera = () => {
    console.log('🛑 Arrêt de la caméra');
    
    // Arrêter l'enregistrement si en cours
    if (isRecording && mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (stream) {
      stream.getTracks().forEach(track => {
        track.stop();
        console.log('Track arrêté:', track.label);
      });
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
      videoRef.current.onloadedmetadata = null;
      videoRef.current.onerror = null;
    }
    setIsCameraReady(false);
    setRecordingTime(0);
  };

  // NOUVEAU : Démarrer l'enregistrement vidéo
  const startRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'inactive') {
      setRecordedChunks([]);
      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      // Timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    }
  };

  // NOUVEAU : Arrêter l'enregistrement vidéo
  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      
      stopCamera();
      onClose();
    }
  };

  const capturePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
    
    if (multiCapture) {
      setCapturedPhotos(prev => [...prev, dataUrl]);
      if (onCapture) onCapture(dataUrl);
      
      if (currentCaptureIndex >= captureCount - 1) {
        stopCamera();
        onClose();
      }
    } else {
      if (onCapture) onCapture(dataUrl);
      stopCamera();
      onClose();
    }
  }, [onCapture, onClose, multiCapture, captureCount, currentCaptureIndex]);

  const handleRemovePhoto = (index: number) => {
    setCapturedPhotos(prev => prev.filter((_, i) => i !== index));
    if (onRemoveCapture) {
      onRemoveCapture(index);
    }
  };

  // Format du temps d'enregistrement
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  useEffect(() => {
    if (isOpen) {
      startCamera();
      setCapturedPhotos([]);
    } else {
      stopCamera();
      setCapturedPhotos([]);
    }

    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-black/90 backdrop-blur-sm px-4 py-3 flex items-center justify-between border-b border-white/10">
        <div className="flex items-center gap-3">
          {mode === 'video' ? (
            <Video className="w-5 h-5 text-orange-500" />
          ) : (
            <Camera className="w-5 h-5 text-orange-500" />
          )}
          <span className="text-white font-medium text-sm">{title}</span>
          {multiCapture && mode === 'photo' && (
            <span className="text-orange-400 text-xs bg-orange-500/20 px-2 py-1 rounded-full">
              {currentCaptureIndex + 1}/{captureCount}
            </span>
          )}
          {/* Timer d'enregistrement */}
          {isRecording && (
            <span className="text-red-500 text-sm font-mono bg-red-500/20 px-3 py-1 rounded-full flex items-center gap-2 animate-pulse">
              <Circle className="w-2 h-2 fill-red-500" />
              {formatTime(recordingTime)}
            </span>
          )}
        </div>
        <button
          onClick={() => {
            stopCamera();
            onClose();
          }}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition"
          disabled={isRecording}
        >
          <X className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Zone vidéo */}
      <div className="flex-1 relative bg-black overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={mode === 'photo'}
          className="w-full h-full object-cover"
          style={{ display: isCameraReady ? 'block' : 'none' }}
        />
        
        {/* Indicateur de chargement */}
        {!isCameraReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black">
            <div className="text-center text-white px-4">
              {mode === 'video' ? (
                <Video className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              ) : (
                <Camera className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              )}
              <p className="text-lg font-medium">Chargement de la caméra...</p>
              <p className="text-sm text-gray-400 mt-2">Veuillez autoriser l'accès</p>
              <div className="mt-4 p-3 bg-orange-600/20 rounded-lg border border-orange-500/30">
                <p className="text-xs text-orange-200">{instruction}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Guide visuel */}
        {isCameraReady && !isRecording && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <div className="text-center">
              <div className="bg-black/70 backdrop-blur-sm px-6 py-3 rounded-xl max-w-xs mx-auto">
                <p className="text-white text-sm font-medium">{instruction}</p>
              </div>
            </div>
          </div>
        )}

        {/* Miniatures des photos (mode photo multi-capture) */}
        {mode === 'photo' && multiCapture && capturedPhotos.length > 0 && (
          <div className="absolute top-4 left-4 flex gap-3 pointer-events-auto z-10">
            {capturedPhotos.map((photo, index) => (
              <button
                key={index}
                onClick={() => handleRemovePhoto(index)}
                className="relative w-24 h-24 rounded-lg overflow-hidden border-2 border-green-500 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500 hover:border-red-500 active:scale-95 transition-all"
              >
                <img 
                  src={photo} 
                  alt={`Capture ${index + 1}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center shadow-2xl group-hover:scale-125 group-hover:bg-red-600 transition-transform duration-200">
                    <X className="w-8 h-8 text-white stroke-[3]" />
                  </div>
                </div>
                <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-lg pointer-events-none border-2 border-white">
                  <Check className="w-3.5 h-3.5 text-white" />
                </div>
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-3 py-1 rounded-full text-xs text-slate-900 font-bold pointer-events-none shadow-md">
                  {index === 0 ? 'RECTO' : 'VERSO'}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Contrôles en bas */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="max-w-lg mx-auto space-y-4">
            {/* Conseil */}
            {isCameraReady && !isRecording && (
              <div className="bg-black/60 backdrop-blur-sm px-4 py-3 rounded-xl border border-white/10">
                <p className="text-white text-sm text-center leading-relaxed">{tip}</p>
              </div>
            )}
            
            {/* Boutons de contrôle */}
            <div className="text-center">
              {mode === 'photo' ? (
                // Bouton photo
                <>
                  <button
                    onClick={capturePhoto}
                    disabled={!isCameraReady}
                    className={`w-20 h-20 mx-auto rounded-full border-4 transition-all shadow-xl ${
                      isCameraReady 
                        ? 'bg-white border-orange-500 hover:bg-orange-50 hover:scale-105 active:scale-95 cursor-pointer' 
                        : 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
                    }`}
                  >
                    <Camera className={`w-10 h-10 mx-auto ${isCameraReady ? 'text-orange-600' : 'text-gray-400'}`} />
                  </button>
                  <p className="text-white text-center mt-3 text-sm font-medium">
                    {isCameraReady 
                      ? multiCapture 
                        ? `Capturer photo ${currentCaptureIndex + 1}/${captureCount}`
                        : 'Appuyez pour capturer'
                      : 'Chargement...'}
                  </p>
                </>
              ) : (
                // Boutons vidéo
                <>
                  {!isRecording ? (
                    <button
                      onClick={startRecording}
                      disabled={!isCameraReady}
                      className={`w-20 h-20 mx-auto rounded-full border-4 transition-all shadow-xl ${
                        isCameraReady 
                          ? 'bg-red-500 border-red-600 hover:bg-red-600 hover:scale-105 active:scale-95 cursor-pointer' 
                          : 'bg-gray-600 border-gray-500 cursor-not-allowed opacity-50'
                      }`}
                    >
                      <Circle className={`w-10 h-10 mx-auto ${isCameraReady ? 'text-white fill-white' : 'text-gray-400'}`} />
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-20 h-20 mx-auto rounded-full border-4 bg-red-500 border-red-600 hover:bg-red-600 hover:scale-105 active:scale-95 cursor-pointer transition-all shadow-xl animate-pulse"
                    >
                      <StopCircle className="w-10 h-10 mx-auto text-white fill-white" />
                    </button>
                  )}
                  <p className="text-white text-center mt-3 text-sm font-medium">
                    {!isCameraReady 
                      ? 'Chargement...'
                      : isRecording 
                      ? 'Appuyez pour arrêter'
                      : 'Appuyez pour enregistrer'}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}
