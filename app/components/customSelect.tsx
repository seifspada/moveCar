import { useState } from "react";
import { ChevronDown } from "lucide-react";

// Define a type for the option
type Option = {
  label: string;
  value: string | number;
};

// Define props for your component
type CustomSelectProps = {
  options: Option[];
  value: string | number | null;
  onChange: (value: string | number) => void;
  placeholder?: string;
  className?: string;
};

export default function CustomSelect({ 
  options, 
  value, 
  onChange,
  placeholder = "Sélectionner",
  className = ""
}: CustomSelectProps) {
  const [open, setOpen] = useState(false);

  // Find the label of the currently selected value
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = selectedOption ? selectedOption.label : placeholder;

  return (
    <div className={`relative w-full placeholder-gray-700 ${className}`}>
      {/* Bouton principal */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between pl-4 pr-4 py-3 rounded-full border border-gray-300 bg-white text-black focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition placeholder-gray-700"
      >
        <span className={!selectedOption ? "text-gray-700" : ""}>
          {displayText}
        </span>
        <ChevronDown className={`w-5 h-5 text-orange-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {/* Liste déroulante */}
      {open && (
        <>
          {/* Overlay pour fermer en cliquant à l'extérieur */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setOpen(false)}
          />
          
          <ul className="absolute w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto z-50">
            {options.map((opt) => (
              <li
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`px-4 py-2 cursor-pointer hover:bg-orange-100 text-black ${
                  opt.value === value ? 'bg-orange-50 font-medium' : ''
                }`}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}