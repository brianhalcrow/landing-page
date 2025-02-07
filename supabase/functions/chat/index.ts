import "https://deno.land/x/xhr@0.3.1/mod.ts";
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, previousMessages } = await req.json();

    // Initialize OpenAI
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const configuration = new Configuration({ apiKey: openaiApiKey });
    const openai = new OpenAIApi(configuration);

    // Prepare conversation history
    const messages = [
      {
        role: 'system',
        content: `You are a helpful assistant specializing in hedging strategies and financial documentation. 
                 Use the following context from relevant documents to inform your responses, but maintain a natural conversational tone: 
                 
                 ${context}`
      },
      // Add previous messages for context
      ...(previousMessages?.map((msg: any) => ({
        role: msg.role,
        content: msg.content
      })) || []),
      // Add the current message
      { role: 'user', content: message }
    ];

    console.log('Sending request to OpenAI with messages:', messages);

    const completion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const reply = completion.data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    console.log('Generated reply:', reply);

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in chat function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});