'use client';

interface Props {
  icon: React.ElementType;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export function InfoRow({ icon: Icon, label, value, className = '' }: Props) {
  if (!value && value !== 0) return null;
  return (
    <div className="flex items-start gap-3 py-3 border-b border-slate-100 last:border-0">
      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
        <Icon className="w-4 h-4 text-slate-500" />
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium uppercase tracking-wide">{label}</p>
        <p className={`text-sm font-semibold text-slate-800 mt-0.5 ${className}`}>{value}</p>
      </div>
    </div>
  );
}