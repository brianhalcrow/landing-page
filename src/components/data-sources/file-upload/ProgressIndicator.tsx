
import { Progress } from "@/components/ui/progress";

interface ProgressIndicatorProps {
  progress: number;
  fileName?: string;
}

export const ProgressIndicator = ({ progress, fileName }: ProgressIndicatorProps) => {
  const getProgressMessage = (progress: number) => {
    if (progress < 50) return `Processing file${fileName ? `: ${fileName}` : '...'}`;
    if (progress < 75) return "Generating embedding...";
    return "Saving document...";
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
