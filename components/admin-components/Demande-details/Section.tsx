'use client';

interface Props {
  title: string;
  children: React.ReactNode;
  accent?: 'orange' | 'blue' | 'violet';
}

const ACCENT_COLORS = {
  orange: 'border-orange-500',
  blue:   'border-blue-500',
  violet: 'border-violet-500',
};

export function Section({ title, children, accent = 'orange' }: Props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
      <div className={`border-l-4 ${ACCENT_COLORS[accent]} px-6 py-4 bg-slate-50`}>
        <h2 className="text-sm font-bold text-slate-700 uppercase tracking-widest">{title}</h2>
      </div>
      <div className="px-6 py-2">{children}</div>
    </div>
  );
}