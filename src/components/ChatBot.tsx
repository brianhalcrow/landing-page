import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle message submission here
    setMessage("");
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full h-12 w-12 p-0 bg-white hover:bg-gray-50 border shadow-lg"
        >
          <MessageCircle className="h-6 w-6 text-gray-600" />
        </Button>
      ) : (
        <div
          className={cn(
            "bg-white rounded-lg shadow-lg w-[400px]",
            "transition-all duration-200 ease-in-out",
            isMinimized ? "h-12" : "h-[600px]"
          )}
        >
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="font-semibold text-gray-800">Chat Assistant</h3>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-gray-100"
                onClick={() => setIsMinimized(!isMinimized)}
              >
                {isMinimized ? (
                  <Maximize2 className="h-4 w-4" />
                ) : (
                  <Minimize2 className="h-4 w-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-gray-100"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {!isMinimized && (
            <>
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[480px] bg-gray-50">
                <div className="text-gray-600">
                  How can I help you today?
                </div>
                {/* Chat messages will go here */}
              </div>
              
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex gap-2 items-center">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 bg-gray-50 border-gray-200"
                  />
                  <Button 
                    type="submit" 
                    size="icon"
                    className="h-10 w-10 rounded-full bg-gray-200 hover:bg-gray-300"
                  >
                    <Send className="h-4 w-4 text-gray-600" />
                  </Button>
                </div>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;