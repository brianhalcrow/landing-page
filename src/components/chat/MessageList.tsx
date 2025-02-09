
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/useChatMessages";

interface MessageListProps {
  messages: Message[];
  suggestedQuestions: string[];
  onSuggestedQuestionClick: (question: string) => void;
  isLoading: boolean;
}

export const MessageList = ({ 
  messages, 
  suggestedQuestions, 
  onSuggestedQuestionClick,
  isLoading 
}: MessageListProps) => {
  return (
    <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <div className="text-gray-600">
          How can I assist you with your hedging needs today? I can help you understand your documents and answer questions about hedging strategies.
        </div>
      ) : (
        <>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={cn(
                "p-3 rounded-lg max-w-[80%]",
                msg.role === 'user' 
                  ? "bg-blue-500 text-white ml-auto" 
                  : "bg-white border border-gray-200"
              )}
            >
              {msg.content}
            </div>
          ))}
          {suggestedQuestions.length > 0 && (
            <div className="space-y-2">
              <p className="text-sm text-gray-500">Suggested questions:</p>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => onSuggestedQuestionClick(question)}
                  className="block w-full text-left text-sm text-blue-600 hover:text-blue-700 hover:underline p-1"
                >
                  {question}
                </button>
              ))}
            </div>
          )}
        </>
      )}
      {isLoading && (
        <div className="text-gray-600 animate-pulse">
          Assistant is thinking...
        </div>
      )}
    </div>
  );
};
