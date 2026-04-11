
import React from 'react';
import { X, Upload, CheckCircle2 } from 'lucide-react';
import { FileUpload } from '@/app/types/mission';

interface DocumentUploadProps {
  files: FileUpload[];
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveFile: (index: number) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({
  files,
  onFileChange,
  onRemoveFile
}) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold text-gray-800 mb-4">
      Documents administratifs{" "}
      <span className="text-orange-500 text-sm font-normal">(facultatif - max 3)</span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[0, 1, 2].map((index) => (
        <div key={index}>
          {files[index] ? (
            <div className="relative border-2 border-green-300 rounded-xl p-4 bg-green-50 hover:shadow-md transition-shadow">
              <button
                type="button"
                onClick={() => onRemoveFile(index)}
                className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-md z-10"
                aria-label="Supprimer le fichier"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-green-200 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                </div>
                <p className="text-sm font-medium text-gray-700 truncate px-2" title={files[index].name}>
                  {files[index].name}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {(files[index].size / 1024 / 1024).toFixed(2)} Mo
                </p>
              </div>
            </div>
          ) : (
            <label className="flex items-center justify-center w-full h-36 border-2 border-dashed border-orange-300 rounded-full cursor-pointer bg-orange-50/50 hover:border-orange-500 hover:bg-orange-50 transition-all group">
              <div className="text-center p-4">
                <Upload className="mx-auto h-10 w-10 text-orange-400 group-hover:text-orange-600 transition-colors" />
                <p className="mt-3 text-sm font-medium text-gray-600">
                  Document {index + 1}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  PDF, JPG, PNG • Max 10 Mo
                </p>
              </div>

              <input
                type="file"
                className="hidden"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={onFileChange}
              />
            </label>
          )}
        </div>
      ))}
    </div>

    {files.length > 0 && (
      <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm font-semibold text-blue-800 mb-2">
          📎 {files.length} document{files.length > 1 ? 's' : ''} sélectionné{files.length > 1 ? 's' : ''}
        </p>
        <ul className="text-xs text-blue-700 space-y-1">
          {files.map((file, idx) => (
            <li key={idx} className="flex items-center gap-2">
              <span>•</span>
              <span className="truncate">{file.name}</span>
              <span className="text-blue-500">({(file.size / 1024).toFixed(0)} Ko)</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
);
