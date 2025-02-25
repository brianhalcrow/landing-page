
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Minimize2, Maximize2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FormSectionProps {
  title: string;
  section: string;
  isMinimized: boolean;
  onToggle: (section: string) => void;
  children: ReactNode;
}

export const FormSection = ({ 
  title, 
  section, 
  isMinimized, 
  onToggle, 
  children 
}: FormSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>{title}</CardTitle>
          <button 
            onClick={() => onToggle(section)} 
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent 
        className={cn(
          "transition-all duration-300", 
          isMinimized ? "h-0 overflow-hidden p-0" : ""
        )}
      >
        {children}
      </CardContent>
    </Card>
  );
};
