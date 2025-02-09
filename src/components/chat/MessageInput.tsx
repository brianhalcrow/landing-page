
import { Send } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface MessageInputProps {
  message: string;
  onChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export const MessageInput = ({ message, onChange, onSubmit, isLoading }: MessageInputProps) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t bg-white">
      <div className="flex gap-2 items-center">
        <Input
          value={message}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ask about your documents or hedging strategies..."
          className="flex-1 bg-gray-50 border-gray-200"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon"
          className="h-10 w-10 rounded-full bg-blue-500 hover:bg-blue-600 text-white"
          disabled={isLoading}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </form>
  );
};
