'use client';

import React from 'react';
import { Check, Shield, FileText, UserCheck, Truck } from 'lucide-react';

interface StepperStartMissionProps {
  currentStep: number;
}
export default function StepperStartMission({ currentStep }: StepperStartMissionProps) {

  const steps = [
    { id: 1, label: 'Vérification', icon: Shield },
    { id: 2, label: 'Instructions', icon: FileText },
    { id: 3, label: 'Reconnaissance adhérent', icon: UserCheck },
    { id: 4, label: 'Prise en charge', icon: Truck }
  ];

  return (
    <div className="w-full max-w-2xl mx-auto px-8 py-8 pt-35 pb-20 sm:gap-4">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const StepIcon = step.icon;
          
          return (
            <React.Fragment key={step.id}>
              {/* Cercle de l'étape */}
              <div className="flex flex-col items-center relative">
                <div
                  className={`w-14 h-14 rounded-full flex items-center justify-center border-2 transition-all duration-300 shadow-lg ${
                    step.id < currentStep
                      ? 'bg-green-500 border-green-500'
                      : step.id === currentStep
                      ? 'bg-orange-600 border-orange-600 ring-4 ring-orange-200'
                      : 'bg-white border-gray-300'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-7 h-7 text-white" />
                  ) : (
                    <StepIcon
                      className={`w-6 h-6 ${
                        step.id === currentStep
                          ? 'text-white'
                          : 'text-orange-500'
                      }`}
                    />
                  )}
                </div>

                {/* Label de l'étape */}
                <span
                  className={`mt-3 text-sm font-semibold text-center absolute top-16 whitespace-nowrap ${
                    step.id <= currentStep ? 'text-orange-500' : 'text-white'
                  }`}
                >
                  {step.label}
                </span>

                {/* Numéro de l'étape (optionnel) */}
                <span
                  className={`mt-1 text-xs font-medium absolute -bottom-6 ${
                    step.id <= currentStep ? 'text-orange-500' : 'text-white'
                  }`}
                >
                  Étape {step.id}/4
                </span>
              </div>

              {/* Ligne de connexion */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-1 mx-2 rounded-full overflow-hidden bg-gray-200">
                  <div
                    className={`h-full transition-all duration-500 ease-in-out ${
                      step.id < currentStep
                        ? 'bg-green-500 w-full'
                        : step.id === currentStep
                        ? 'bg-orange-600 w-1/2'
                        : 'bg-transparent w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}