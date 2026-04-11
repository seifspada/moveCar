import React from 'react';

type FormSectionProps = {
  title: string;
  icon?: React.ReactNode;
  variant?: 'orange' | 'gray';
  children: React.ReactNode;
};

export default function FormSection({
  title,
  icon,
  variant = 'orange',
  children,
}: FormSectionProps) {
  const isOrange = variant === 'orange';

  return (
    <div
      className={`rounded-xl p-6 border ${
        isOrange
          ? 'bg-orange-50 border-orange-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <h3
        className={`text-xl font-semibold mb-5 flex items-center gap-3 ${
          isOrange ? 'text-orange-900' : 'text-gray-900'
        }`}
      >
        {icon}
        {title}
      </h3>
      {children}
    </div>
  );
}