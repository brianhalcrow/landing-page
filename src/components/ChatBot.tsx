
import { MessageCircle, X, Minimize2, Maximize2, Send } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  content: string;
  role: 'user' | 'assistant';
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const logApiCall = async (endpoint: string, requestBody: any, response: any, status: string, startTime: number) => {
    const duration = Date.now() - startTime;
    try {
      // Add more context about vector search results
      let enrichedResponse = response;
      if (endpoint === 'vector-operations') {
        enrichedResponse = {
          documentsFound: response?.length || 0,
          searchResults: response?.map((r: any) => ({
            similarity: (r.similarity * 100).toFixed(2) + '%',
            content: r.content.substring(0, 100) + '...'
          }))
        };
      }
      
      await supabase
        .from('api_logs')
        .insert({
          endpoint,
          request_body: requestBody,
          response: enrichedResponse,
          status,
          duration_ms: duration
        });
    } catch (error) {
      console.error('Error logging API call:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message.trim();
    setMessage("");
    
    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSuggestedQuestions([]); // Clear previous suggestions
    
    setIsLoading(true);
    const startTime = Date.now();

    try {
      // First, search for relevant documents
      const vectorSearchRequestBody = {
        action: 'search',
        query: userMessage,
        match_threshold: 0.7,
        match_count: 3
      };

      const { data: vectorSearchData, error: searchError } = await supabase.functions.invoke('vector-operations', {
        body: vectorSearchRequestBody
      });

      if (searchError) throw searchError;

      await logApiCall(
        'vector-operations',
        vectorSearchRequestBody,
        vectorSearchData,
        'success',
        startTime
      );

      // Extract relevant context from search results
      const context = vectorSearchData
        ?.map((result: any) => result.content)
        .join('\n\n');

      console.log('Found context from documents:', context ? 'Yes' : 'No');
      
      // Use chat endpoint with context
      const chatRequestBody = { 
        message: userMessage,
        context: context || '',
        previousMessages: messages.slice(-4) // Include last 4 messages for context
      };

      const { data: chatData, error: chatError } = await supabase.functions.invoke('chat', {
        body: chatRequestBody,
      });

      if (chatError) throw chatError;

      await logApiCall(
        'chat',
        chatRequestBody,
        chatData,
        'success',
        startTime
      );

      // Add assistant's response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: chatData.reply }]);
      
      // Set suggested questions if available
      if (chatData.suggestedQuestions && Array.isArray(chatData.suggestedQuestions)) {
        setSuggestedQuestions(chatData.suggestedQuestions);
      }

    } catch (error) {
      console.error('Error sending message:', error);
      
      await logApiCall(
        'chat',
        { message: userMessage },
        { error: error.message },
        'error',
        startTime
      );

      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestionClick = (question: string) => {
    setMessage(question);
    handleSubmit(new Event('submit') as any);
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
              <div className="flex-1 p-4 space-y-4 overflow-y-auto h-[480px] bg-gray-50">
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
                            onClick={() => handleSuggestedQuestionClick(question)}
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
              
              <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
                <div className="flex gap-2 items-center">
                  <Input
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
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
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBot;
