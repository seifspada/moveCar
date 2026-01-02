
'use client';

import React from 'react';
import { Check } from 'lucide-react';
interface StepperProps {
  currentStep: number;
}
// Composant Stepper réutilisable
export default function Stepper({ currentStep }: StepperProps) {
  const steps = [
    { id: 1, label: 'Demande envoyée' },
    { id: 2, label: 'Demande acceptée' },
    { id: 3, label: 'Compte créé' }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-8 pt-20 pb-20 sm:gap-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            {/* Cercle de l'étape */}
            <div className="flex flex-col items-center relative">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                  step.id < currentStep
                    ? 'bg-green-500 border-green-500'
                    : step.id === currentStep
                    ? 'bg-orange-600 border-orange-600'
                    : 'bg-white border-gray-300'
                }`}
              >
                {step.id < currentStep ? (
                  <Check className="w-6 h-6 text-white" />
                ) : (
                  <span
                    className={`text-lg font-semibold ${
                      step.id === currentStep
                        ? 'text-white'
                        : 'text-gray-400'
                    }`}
                  >
                    {step.id}
                  </span>
                )}
              </div>
              
              {/* Label de l'étape */}
              <span
                className={`mt-2 text-xs font-medium text-center absolute top-14 whitespace-nowrap ${
                  step.id <= currentStep ? 'text-white' : 'text-gray-600'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Ligne de connexion */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4">
                <div
                  className={`h-full transition-all duration-300 ${
                    step.id < currentStep ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
