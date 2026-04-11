// components/MissionSuccess/MissionDocuments.tsx

import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { FileData } from '@/app/types/mission';

interface MissionDocumentsProps {
  files: FileData[];
}

export const MissionDocuments: React.FC<MissionDocumentsProps> = ({ files }) => (
  <div className="bg-gray-50 border-2 border-gray-300 rounded-xl p-3 print:p-2 print:border">
    <h5 className="font-bold text-gray-800 mb-2 flex items-center gap-1 text-sm print:text-xs">
      <span className="text-base print:text-sm">📎</span> Documents
    </h5>
    <ul className="space-y-1.5">
      {files.map((file, idx) => (
        <li key={idx} className="flex items-center gap-1.5 text-xs bg-white p-1.5 rounded border border-gray-200">
          <CheckCircle2 className="w-3 h-3 text-green-500 flex-shrink-0" />
          <span className="truncate flex-1 text-gray-700">{file.name}</span>
        </li>
      ))}
    </ul>
  </div>
);