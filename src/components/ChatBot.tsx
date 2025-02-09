
import { MessageCircle, X, Minimize2, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { useChatMessages } from "@/hooks/useChatMessages";

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const { messages, suggestedQuestions, isLoading, sendMessage } = useChatMessages();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage("");
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setMessage(question);
    sendMessage(question);
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
            <h3 className="font-semibold text-gray-800">Hedge Assistant</h3>
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
              <MessageList
                messages={messages}
                suggestedQuestions={suggestedQuestions}
                onSuggestedQuestionClick={handleSuggestedQuestionClick}
                isLoading={isLoading}
              />
              
              <MessageInput
                message={message}
                onChange={setMessage}
                onSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
