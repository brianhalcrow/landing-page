
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';
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
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const openaiKey = Deno.env.get('OPENAI_API_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    if (!openaiKey) {
      throw new Error('Missing OpenAI API key');
    }

    console.log('Initializing OpenAI and Supabase clients...');

    const openai = new OpenAIApi(new Configuration({
      apiKey: openaiKey
    }));

    const supabase = createClient(supabaseUrl, supabaseKey);
    const BATCH_SIZE = 5;
    const MAX_RETRIES = 3;

    console.log('Fetching documents that need recategorization...');

    // Query documents with missing metadata or need retry
    const { data: documents, error: fetchError } = await supabase
      .from('documents')
      .select('id, content, metadata')
      .or(
        'metadata_category.is.null,' +
        'metadata_section.is.null,' +
        'metadata_difficulty.is.null,' +
        "metadata->>'category'.is.null," +
        "metadata->>'section'.is.null," +
        "metadata->>'difficulty'.is.null"
      )
      .or('metadata->retry_count.is.null,metadata->retry_count.lt.3')
      .order('id')
      .limit(50);

    if (fetchError) {
      console.error('Error fetching documents:', fetchError);
      throw fetchError;
    }

    if (!documents || documents.length === 0) {
      console.log('No documents found that need categorization');
      return new Response(
        JSON.stringify({ 
          message: 'No documents to recategorize',
          results: [] 
        }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${documents.length} documents to process`);
    const results = [];

    // Process in batches
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i/BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(documents.length/BATCH_SIZE);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches}`);
      
      const batchPromises = batch.map(async (doc) => {
        try {
          console.log(`Processing document ${doc.id}`);
          
          if (!doc.content || doc.content.trim().length === 0) {
            console.log(`Document ${doc.id} has no content, marking as uncategorized`);
            const metadata = {
              ...(doc.metadata || {}),
              category: 'uncategorized',
              section: 'general',
              difficulty: 'beginner',
              recategorized_at: new Date().toISOString(),
              retry_count: (doc.metadata?.retry_count || 0) + 1
            };

            const { error: updateError } = await supabase
              .from('documents')
              .update({
                metadata,
                metadata_category: 'uncategorized',
                metadata_section: 'general',
                metadata_difficulty: 'beginner'
              })
              .eq('id', doc.id);

            if (updateError) {
              throw updateError;
            }

            return {
              id: doc.id,
              success: true,
              analysis: { category: 'uncategorized', section: 'general', difficulty: 'beginner' },
              progressMessage: `Marked empty document ${doc.id} as uncategorized`
            };
          }

          const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: `You are a financial document analyzer specializing in forex and trading documents. 
                Analyze the given text and return ONLY a JSON object with these exact fields:
                {
                  "category": one of ["forex", "trading", "risk_management", "market_analysis", "technical_analysis", "uncategorized"],
                  "section": one of ["theory", "practice", "case_study", "reference", "general"],
                  "difficulty": one of ["beginner", "intermediate", "advanced", "expert"]
                }`
              },
              {
                role: "user",
                content: doc.content.slice(0, 2000)
              }
            ],
            temperature: 0.1
          });

          const analysisText = response.data?.choices?.[0]?.message?.content.trim();
          console.log(`Raw analysis for doc ${doc.id}:`, analysisText);
          
          let analysis;
          try {
            analysis = JSON.parse(analysisText);
            
            // Strict validation of the analysis object
            const validCategories = ["forex", "trading", "risk_management", "market_analysis", "technical_analysis", "uncategorized"];
            const validSections = ["theory", "practice", "case_study", "reference", "general"];
            const validDifficulties = ["beginner", "intermediate", "advanced", "expert"];

            if (!analysis.category || !validCategories.includes(analysis.category) ||
                !analysis.section || !validSections.includes(analysis.section) ||
                !analysis.difficulty || !validDifficulties.includes(analysis.difficulty)) {
              throw new Error('Invalid fields in analysis');
            }

          } catch (parseError) {
            console.error(`Error parsing/validating analysis for doc ${doc.id}:`, parseError);
            
            // Update retry count even on error
            const metadata = {
              ...(doc.metadata || {}),
              retry_count: (doc.metadata?.retry_count || 0) + 1
            };

            await supabase
              .from('documents')
              .update({ metadata })
              .eq('id', doc.id);

            throw parseError;
          }
          
          const metadata = {
            ...(doc.metadata || {}),
            category: analysis.category,
            section: analysis.section,
            difficulty: analysis.difficulty,
            recategorized_at: new Date().toISOString(),
            retry_count: (doc.metadata?.retry_count || 0) + 1
          };

          // Update document with new metadata
          const { error: updateError } = await supabase
            .from('documents')
            .update({
              metadata,
              metadata_category: analysis.category,
              metadata_section: analysis.section,
              metadata_difficulty: analysis.difficulty
            })
            .eq('id', doc.id);

          if (updateError) {
            console.error(`Error updating document ${doc.id}:`, updateError);
            throw updateError;
          }

          const progressMessage = `Processed document ${doc.id} (Batch ${batchNumber}/${totalBatches})`;
          console.log(progressMessage);
          
          return {
            id: doc.id,
            success: true,
            analysis,
            progressMessage
          };

        } catch (error) {
          console.error(`Error processing document ${doc.id}:`, error);
          return {
            id: doc.id,
            success: false,
            error: error.message,
            progressMessage: `Failed to process document ${doc.id}`
          };
        }
      });

      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add a longer delay between batches to avoid rate limiting
      if (i + BATCH_SIZE < documents.length) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    const successful = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`Processing complete. ${successful} successful, ${failed} failed`);

    return new Response(
      JSON.stringify({
        message: `Processed ${results.length} documents (${successful} successful, ${failed} failed)`,
        results,
        lastProgressMessage: results[results.length - 1]?.progressMessage || ''
      }), 
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in recategorize-documents function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack 
      }), 
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
