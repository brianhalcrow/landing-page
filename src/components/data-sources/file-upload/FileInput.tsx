
import { useRef } from 'react';

interface FileInputProps {
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  loading: boolean;
}

export const FileInput = ({ onFileSelect, loading }: FileInputProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept=".txt,.zip"
        onChange={onFileSelect}
        disabled={loading}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100
          disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <p className="text-sm text-slate-500">
        Accepted formats: .txt files or .zip archives containing .txt files
      </p>
    </div>
  );
};

