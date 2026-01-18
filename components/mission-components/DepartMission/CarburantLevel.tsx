'use client';

import { useCallback } from 'react';
import { Fuel } from 'lucide-react';

interface NiveauCarburantProps {
  value: number;
  onChange?: (value: number) => void;
  step?: number; // Pas optionnel par défaut 5
}

export default function NiveauCarburant({ value, onChange, step = 5 }: NiveauCarburantProps) {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(parseInt(e.target.value));
  }, [onChange]);

  const handleIncrement = useCallback(() => {
    onChange?.(Math.min(100, value + step));
  }, [onChange, value, step]);

  const handleDecrement = useCallback(() => {
    onChange?.(Math.max(0, value - step));
  }, [onChange, value, step]);

  return (
    <div>
      <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
        <div className="w-1 h-6 bg-orange-600 rounded-full"></div>
        Niveau de carburant
      </h2>
      
      <div className="bg-slate-50 rounded-lg p-6 border border-slate-200">
        <div className="flex flex-col items-center">
          {/* Jauge SVG avec aiguille */}
          <div className="relative" style={{ width: '250px', height: '150px' }}>
            <svg 
              viewBox="0 0 200 120" 
              className="w-full h-full"
              style={{ overflow: 'visible' }}
            >
              {/* Arc de fond (gris) */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="20"
                strokeLinecap="round"
              />
              
              {/* Arc coloré selon le niveau */}
              <path
                d="M 20 100 A 80 80 0 0 1 180 100"
                fill="none"
                stroke={value < 20 ? "#ef4444" : value < 50 ? "#f59e0b" : "#10b981"}
                strokeWidth="20"
                strokeLinecap="round"
                strokeDasharray={`${(value / 100) * 251.2} 251.2`}
                style={{ transition: 'all 0.3s ease' }}
              />
              
              {/* Graduations */}
              {[0, 25, 50, 75, 100].map((mark) => {
                const angle = -180 + (mark / 100) * 180;
                const radians = (angle * Math.PI) / 180;
                const x1 = 100 + 75 * Math.cos(radians);
                const y1 = 100 + 75 * Math.sin(radians);
                const x2 = 100 + 65 * Math.cos(radians);
                const y2 = 100 + 65 * Math.sin(radians);
                
                return (
                  <line
                    key={mark}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    stroke="#64748b"
                    strokeWidth="2"
                  />
                );
              })}
              
              {/* Aiguille avec offset */}
              <g
                style={{
                  transform: `rotate(${-180 + 90 + (value / 100) * 180}deg)`,
                  transformOrigin: '100px 100px',
                  transition: 'transform 0.5s ease-out'
                }}
              >
                <polygon points="100,100 98,40 100,35 102,40" fill="#1e293b" />
                <circle cx="100" cy="100" r="6" fill="#1e293b" />
                <circle cx="100" cy="100" r="3" fill="#64748b" />
              </g>
              
              {/* Labels */}
              <text x="20" y="115" fontSize="10" fill="#64748b" textAnchor="middle">0</text>
              <text x="100" y="35" fontSize="10" fill="#64748b" textAnchor="middle">50</text>
              <text x="180" y="115" fontSize="10" fill="#64748b" textAnchor="middle">100</text>
            </svg>
            
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <Fuel className="w-5 h-5 text-slate-600" />
            </div>
          </div>
          
          {/* Contrôles: valeur + boutons +/- */}
          <div className="text-center mt-4 mb-6">
            <div className="flex items-center gap-4 mb-2">
              <button
                onClick={handleDecrement}
                disabled={value <= 0}
                className="p-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed rounded-full w-12 h-12 flex items-center justify-center text-slate-600 font-bold text-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                aria-label="Diminuer"
              >
                −
              </button>
              <span className="text-3xl font-bold text-orange-600 min-w-[4rem]">{value}%</span>
              <button
                onClick={handleIncrement}
                disabled={value >= 100}
                className="p-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:cursor-not-allowed rounded-full w-12 h-12 flex items-center justify-center text-slate-600 font-bold text-lg transition-all duration-200 shadow-sm hover:shadow-md disabled:shadow-none"
                aria-label="Augmenter"
              >
                +
              </button>
            </div>
            <p className="text-sm text-slate-600">Niveau actuel</p>
          </div>
          
         
        </div>
      </div>
    </div>
  );
}
