import React from 'react';

interface ToggleConditionProps {
  accepted: boolean;
  onToggle: (value: boolean) => void;
  title: string;
  description: string;
}

const ToggleCondition: React.FC<ToggleConditionProps> = ({ 
  accepted, 
  onToggle,
  title,
  description
}) => {
  const handleToggle = () => {
    onToggle(!accepted);
  };

  return (
    <div className="bg-slate-50 rounded-xl p-6">
      <div className="flex items-start gap-4">
       <button
  onClick={handleToggle}
  className={`relative inline-flex border-2 h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out focus:outline-none ${
    accepted ? 'bg-orange-600 border-orange-600' : 'bg-slate-300 border-slate-300'
  }`}
  role="switch"
  aria-checked={accepted}
>

          <span
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
              accepted ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        
        <div className="flex-1">
          <label 
            className="text-base font-semibold text-slate-900 cursor-pointer" 
            onClick={handleToggle}
          >
            {title}
          </label>
          <p className="text-sm text-slate-600 mt-1">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ToggleCondition;