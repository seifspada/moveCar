// components/admin-components/Demande-details-adherent/DocumentViewer.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  X, ZoomIn, ZoomOut, RotateCw,
  Download, ExternalLink, FileText,
} from 'lucide-react';

type Props = {
  url:     string;
  label:   string;
  onClose: () => void;
};

function getFileType(url: string): 'pdf' | 'image' | 'unknown' {
  const clean = url.split('?')[0].toLowerCase();
  if (clean.endsWith('.pdf'))                          return 'pdf';
  if (/\.(png|jpe?g|webp|gif|bmp|svg)$/.test(clean)) return 'image';
  return 'unknown';
}

export function DocumentViewer({ url, label, onClose }: Props) {
  const [zoom,   setZoom]   = useState(1);
  const [rotate, setRotate] = useState(0);
  const fileType = getFileType(url);

  const handleKey = useCallback(
    (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); },
    [onClose],
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = '';
    };
  }, [handleKey]);

  useEffect(() => { setZoom(1); setRotate(0); }, [url]);

  function download() {
    const a = document.createElement('a');
    a.href     = url;
    a.download = label;
    a.target   = '_blank';
    a.click();
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-black/90 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* ── Topbar ── */}
      <div className="flex items-center justify-between px-4 py-2 bg-slate-900 border-b border-slate-700/60 shrink-0">

        {/* Titre */}
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-orange-400 shrink-0" />
          <span className="text-sm font-medium text-white truncate max-w-xs">{label}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {fileType === 'image' && (
            <>
              <ToolBtn onClick={() => setZoom((z) => Math.max(0.25, +(z - 0.25).toFixed(2)))} title="Zoom out">
                <ZoomOut className="w-4 h-4" />
              </ToolBtn>
              <span className="text-xs text-slate-400 w-10 text-center select-none">
                {Math.round(zoom * 100)}%
              </span>
              <ToolBtn onClick={() => setZoom((z) => Math.min(4, +(z + 0.25).toFixed(2)))} title="Zoom in">
                <ZoomIn className="w-4 h-4" />
              </ToolBtn>
              <ToolBtn onClick={() => setRotate((r) => (r + 90) % 360)} title="Rotation">
                <RotateCw className="w-4 h-4" />
              </ToolBtn>
              <div className="w-px h-5 bg-slate-700 mx-1" />
            </>
          )}
          <ToolBtn onClick={download} title="Télécharger">
            <Download className="w-4 h-4" />
          </ToolBtn>
          <ToolBtn
            onClick={() => window.open(url, '_blank', 'noopener,noreferrer')}
            title="Ouvrir dans un nouvel onglet"
          >
            <ExternalLink className="w-4 h-4" />
          </ToolBtn>
        </div>
      </div>

      {/* ── Corps ── */}
      <div className="flex-1 overflow-auto flex items-center justify-center p-4">

        {fileType === 'pdf' && (
          <iframe
            src={`${url}#toolbar=1&navpanes=0`}
            className="w-full h-full rounded-lg border border-slate-700"
            style={{ minHeight: '80vh' }}
            title={label}
          />
        )}

        {fileType === 'image' && (
          <div className="overflow-auto max-w-full max-h-full flex items-center justify-center">
            <img
              src={url}
              alt={label}
              draggable={false}
              className="rounded-lg shadow-2xl transition-transform duration-200 select-none"
              style={{
                transform:       `scale(${zoom}) rotate(${rotate}deg)`,
                transformOrigin: 'center center',
                maxWidth:        zoom <= 1 ? '100%' : 'none',
                maxHeight:       zoom <= 1 ? '80vh' : 'none',
              }}
            />
          </div>
        )}

        {fileType === 'unknown' && (
          <div className="text-center space-y-4">
            <FileText className="mx-auto w-16 h-16 text-slate-500" />
            <p className="text-slate-400 text-sm">
              Aperçu non disponible pour ce type de fichier.
            </p>
            <button
              onClick={download}
              className="inline-flex items-center gap-2 text-sm text-white bg-orange-500 hover:bg-orange-600 px-4 py-2 rounded-lg transition-colors"
            >
              <Download className="w-4 h-4" />
              Télécharger le fichier
            </button>
          </div>
        )}

      </div>

      {/* ── Bouton FERMER grand et visible — coin bas droite ── */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Fermer"
        title="Fermer (Échap)"
        className="
          fixed bottom-6 right-6 z-[110]
          flex items-center gap-2
          px-5 py-3
          bg-red-600 hover:bg-red-500 active:bg-red-700
          text-white font-semibold text-sm
          rounded-full
          shadow-[0_0_0_4px_rgba(239,68,68,0.25)]
          hover:shadow-[0_0_0_6px_rgba(239,68,68,0.35)]
          transition-all duration-200
        "
      >
        <X className="w-5 h-5" strokeWidth={2.5} />
        Fermer
      </button>
    </div>
  );
}

// ── Bouton icône ──
function ToolBtn({
  onClick, title, children,
}: {
  onClick:  () => void;
  title:    string;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
    >
      {children}
    </button>
  );
}