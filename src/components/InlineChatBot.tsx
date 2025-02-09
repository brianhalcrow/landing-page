
import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { MessageList } from "./chat/MessageList";
import { MessageInput } from "./chat/MessageInput";
import { useChatMessages } from "@/hooks/useChatMessages";

const InlineChatBot = () => {
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
    <div className="w-full border rounded-lg shadow-sm bg-white">
      <div className="flex items-center justify-between p-4 border-b">
        <h3 className="font-semibold text-gray-800">Chat Assistant</h3>
        <MessageCircle className="h-5 w-5 text-gray-500" />
      </div>
      
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
    </div>
  );
};

export default InlineChatBot;
