
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { DocumentProcessor } from './document-processor.ts';
import { BATCH_SIZE, corsHeaders } from './config.ts';
import type { ProcessingResult } from './types.ts';

serve(async (req) => {
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

    console.log('Initializing document processor...');
    const processor = new DocumentProcessor(supabaseUrl, supabaseKey, openaiKey);

    const documents = await processor.fetchDocuments();

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
    const results: ProcessingResult[] = [];

    // Process in batches
    for (let i = 0; i < documents.length; i += BATCH_SIZE) {
      const batch = documents.slice(i, i + BATCH_SIZE);
      const batchNumber = Math.floor(i/BATCH_SIZE) + 1;
      const totalBatches = Math.ceil(documents.length/BATCH_SIZE);
      
      console.log(`Processing batch ${batchNumber}/${totalBatches}`);
      
      const batchPromises = batch.map(doc => 
        processor.processDocument(doc, batchNumber, totalBatches)
      );

      // Wait for all documents in the batch to complete
      const batchResults = await Promise.all(batchPromises);
      results.push(...batchResults);

      // Add a small delay between batches
      if (i + BATCH_SIZE < documents.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
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
