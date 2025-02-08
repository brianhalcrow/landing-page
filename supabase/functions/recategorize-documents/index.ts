
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.3.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openai = new OpenAIApi(new Configuration({
      apiKey: Deno.env.get('OPENAI_API_KEY')
    }));

    const supabase = createClient(supabaseUrl, supabaseKey);
    const BATCH_SIZE = 5;

    // Get all documents that need recategorization
    const { data: documents, error } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .eq('metadata->category', 'uncategorized');

    if (error) throw error;
    if (!documents?.length) {
      return new Response(JSON.stringify({ message: 'No documents to recategorize' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${documents.length} documents to recategorize`);
    const results = [];

    // Process in batches
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${Math.floor(i/BATCH_SIZE) + 1}/${Math.ceil(documents.length/BATCH_SIZE)}`);
      
      const batchPromises = batch.map(async (doc) => {
        try {
          console.log(`Analyzing document ${doc.id}`);
          const response = await openai.createChatCompletion({
            model: "gpt-4o",
            messages: [
              {
                role: "system",
                content: `You are a financial document analyzer specializing in forex and trading documents. 
                Analyze the following text and categorize it. Your analysis should be extremely precise and technical.
                
                Categories:
                - forex: Documents about foreign exchange markets and currency trading
                - trading: General trading concepts and strategies
                - risk_management: Risk assessment and management in trading
                - market_analysis: Market analysis techniques and tools
                - technical_analysis: Technical analysis methods and indicators
                - uncategorized: Only if text doesn't fit other categories
                
                Sections:
                - theory: Theoretical concepts and foundations
                - practice: Practical applications and examples
                - case_study: Real world examples and case studies
                - reference: Reference materials and documentation
                - general: General information
                
                Difficulty levels (based on technical complexity and prerequisites):
                - beginner: Basic concepts, no prior knowledge needed
                - intermediate: Some trading knowledge required
                - advanced: Complex concepts, significant experience needed
                - expert: Very technical, requires deep domain expertise`
              },
              {
                role: "user",
                content: doc.content.slice(0, 2000) // Analyze first 2000 chars for efficiency
              }
            ],
            temperature: 0.1
          });

          const analysis = JSON.parse(response.data.choices[0].message.content);
          console.log(`Analysis result for doc ${doc.id}:`, analysis);

          // Update document metadata
          const { error: updateError } = await supabase
            .from('documents')
            .update({
              metadata: {
                ...doc.metadata,
                category: analysis.category,
                section: analysis.section,
                difficulty: analysis.difficulty,
                recategorized_at: new Date().toISOString()
              }
            })
            .eq('id', doc.id);

          if (updateError) throw updateError;

          return {
            id: doc.id,
            success: true,
            analysis
          };
        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
          return {
            id: doc.id,
            success: false,
            error: error.message
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);
      
      // Add delay between batches to avoid rate limits
      if (i + BATCH_SIZE < documents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return new Response(JSON.stringify({
      message: `Processed ${results.length} documents`,
      results
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error in recategorize-documents function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
