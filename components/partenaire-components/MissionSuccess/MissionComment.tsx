// components/MissionSuccess/MissionComment.tsx

import React from 'react';

interface MissionCommentProps {
  commentaire: string;
}

export const MissionComment: React.FC<MissionCommentProps> = ({ commentaire }) => (
  <div className="bg-amber-50 border-l-4 border-amber-500 p-2 rounded-lg print:border print:p-1.5">
    <p className="text-xs font-semibold text-amber-800 uppercase mb-1 flex items-center gap-1">
      <span>💬</span> Commentaire
    </p>
    <p className="text-gray-700 text-xs italic line-clamp-3">{commentaire}</p>
  </div>
);