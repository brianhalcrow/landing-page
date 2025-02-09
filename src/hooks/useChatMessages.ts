
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface Message {
  content: string;
  role: 'user' | 'assistant';
}

export const useChatMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const logApiCall = async (endpoint: string, requestBody: any, response: any, status: string, startTime: number) => {
    const duration = Date.now() - startTime;
    try {
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

  const sendMessage = async (userMessage: string) => {
    if (!userMessage.trim()) return;
    
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setSuggestedQuestions([]); // Clear previous suggestions
    setIsLoading(true);
    const startTime = Date.now();

    try {
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

      const context = vectorSearchData
        ?.map((result: any) => result.content)
        .join('\n\n');

      console.log('Found context from documents:', context ? 'Yes' : 'No');
      
      const chatRequestBody = { 
        message: userMessage,
        context: context || '',
        previousMessages: messages.slice(-4)
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

      setMessages(prev => [...prev, { role: 'assistant', content: chatData.reply }]);
      
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

  return {
    messages,
    suggestedQuestions,
    isLoading,
    sendMessage,
  };
};
