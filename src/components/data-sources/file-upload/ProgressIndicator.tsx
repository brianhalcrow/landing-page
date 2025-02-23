
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  fileName?: string;
}

export const ProgressIndicator = ({ progress, fileName }: ProgressIndicatorProps) => {
  const getProgressMessage = (progress: number) => {
    if (progress === 0) return `Preparing to process${fileName ? `: ${fileName}` : '...'}`;
    if (progress < 30) return "Extracting document content...";
    if (progress < 50) return "Converting document format...";
    if (progress < 75) return "Generating embeddings...";
    if (progress < 90) return "Saving to database...";
    return "Finalizing...";
  };

  return (
    <div className="space-y-2">
      <Progress value={progress} className="w-full" />
      <p className="text-sm text-slate-500">
        {getProgressMessage(progress)}
      </p>
    </div>
  );
};
