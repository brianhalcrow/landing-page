
export const BATCH_SIZE = 5;

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export const createErrorResponse = (error: Error, status = 500) => {
  return new Response(
    JSON.stringify({ 
      error: error.message,
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
    const body = await req.json();
    console.log('Request body:', JSON.stringify(body, null, 2));
    return body;
  } catch (e) {
    console.error('Error parsing request body:', e);
    throw new Error('Invalid JSON in request body');
  }
};
