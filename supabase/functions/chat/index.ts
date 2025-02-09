
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

    // Enhanced system prompt for better responses
    const systemPrompt = `You are an expert financial advisor specializing in currency risk management and hedging strategies. Your knowledge spans:
- Foreign exchange market dynamics and currency pairs
- Hedging instruments (forwards, futures, options, swaps)
- Risk assessment and exposure calculation
- Market analysis and economic factors affecting currency movements
- Regulatory compliance and documentation requirements
- Treasury operations and hedge accounting

Approach each question by:
1. Understanding the specific risk context
2. Explaining concepts in clear, professional language
3. Providing practical examples when relevant
4. Referencing specific parts of the provided documentation
5. Suggesting actionable next steps or considerations

Format your responses with clear sections:
- 📋 Context: Brief summary of the user's situation/question
- 💡 Explanation: Clear, detailed explanation of the concept or solution
- 📊 Example: Practical example or case study when relevant
- 📑 Reference: Relevant quotes from provided documentation
- ⚡ Action Steps: Suggested next steps or considerations

Always maintain a professional yet approachable tone, and ensure advice aligns with standard risk management practices.

Use the following context from relevant documents to inform your responses, but maintain a natural conversational tone:

${context || "No specific document context available."}`;

    // Prepare conversation history
    const messages = [
      {
        role: 'system',
        content: systemPrompt
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
      temperature: 0.5, // Lower temperature for more consistent responses
      max_tokens: 800,  // Increased for more comprehensive answers
    });

    const reply = completion.data.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    
    // Generate suggested follow-up questions based on the response
    const followUpPrompt = `Based on the previous response, generate 2-3 relevant follow-up questions that the user might want to ask. Format them as a JSON array of strings. Keep them concise and directly related to the topic discussed.`;
    
    const followUpCompletion = await openai.createChatCompletion({
      model: "gpt-4o-mini",
      messages: [
        ...messages,
        { role: 'assistant', content: reply },
        { role: 'user', content: followUpPrompt }
      ],
      temperature: 0.3,
      max_tokens: 150,
    });

    let suggestedQuestions = [];
    try {
      const followUpContent = followUpCompletion.data.choices[0]?.message?.content || "[]";
      suggestedQuestions = JSON.parse(followUpContent);
    } catch (error) {
      console.error('Error parsing suggested questions:', error);
      suggestedQuestions = [];
    }

    console.log('Generated reply and suggestions:', { reply, suggestedQuestions });

    return new Response(
      JSON.stringify({ reply, suggestedQuestions }),
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
