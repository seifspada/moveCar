'use client';

import React from "react"

interface AuthInputProps {
  id: string;
  name: string;
  type: string;
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  required?: boolean;
  autoComplete?: string;
}

export function AuthInput({
  id,
  name,
  type,
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  required = true,
  autoComplete = "off",
}: AuthInputProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-500 transition-all text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
        placeholder={placeholder}
      />
    </div>
  );
}
