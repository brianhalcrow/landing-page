
export const BATCH_SIZE = 5;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createErrorResponse = (error: Error, status = 500) => {
  const errorMessage = error.message || 'An unknown error occurred';
  console.error('Error details:', errorMessage);
  
  return new Response(
    JSON.stringify({ 
      error: errorMessage,
      details: 'If this error persists, try reducing the size of your document or processing it in smaller parts.'
    }),
    { 
      status: status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
};

export const validateRequestBody = async (req: Request) => {
  try {
    if (!req.body) {
      throw new Error('Request body is empty');
    }

    const text = await req.text();
    if (!text) {
      throw new Error('Request body is empty');
    }

    try {
      const body = JSON.parse(text);
      console.log('Parsed request body:', JSON.stringify(body, null, 2));
      
      if (!body.action) {
        throw new Error('Action is required');
      }

      // Validate metadata if present
      if (body.metadata) {
        if (typeof body.metadata !== 'object') {
          throw new Error('Metadata must be an object');
        }
        
        // Ensure metadata is properly formatted
        body.metadata = {
          ...body.metadata,
          status: body.metadata.status || 'processing',
          uploadedAt: body.metadata.uploadedAt || new Date().toISOString()
        };
      }

      return body;
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      throw new Error('Invalid JSON in request body');
    }
  } catch (e) {
    console.error('Error validating request body:', e);
    throw e;
  }
};

