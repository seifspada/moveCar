import React from 'react';

interface CommentSectionProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const CommentSection: React.FC<CommentSectionProps> = ({ value, onChange }) => (
  <div className="border-2 border-orange-200 rounded-xl p-6 mb-6 bg-gradient-to-br from-orange-50 to-white">
    <h2 className="text-lg font-bold text-orange-700 mb-4">Commentaire</h2>
    <textarea
      name="commentaire"
      value={value}
      onChange={onChange}
      placeholder="Instructions complémentaires, consignes particulières..."
      rows={4}
      maxLength={500}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
    />
    <p className="text-xs text-gray-500 mt-2 text-right">
      {value.length}/500 caractères
    </p>
  </div>
);
