
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
    // Parse the request body
    const body = await req.json();
    console.log('Raw request body:', JSON.stringify(body, null, 2));
    
    if (!body.action) {
      throw new Error('Action is required');
    }

    // Validate file object for store action
    if (body.action === 'store') {
      if (!body.file || !body.file.content || !body.file.name) {
        throw new Error('File content and name are required for store action');
      }

      // Ensure metadata is a valid JSON object
      if (body.metadata) {
        if (typeof body.metadata !== 'object' || Array.isArray(body.metadata)) {
          throw new Error('Metadata must be a valid JSON object');
        }
        
        // Create a sanitized metadata object with required fields
        body.metadata = {
          fileName: body.metadata.fileName || body.file.name,
          fileType: body.metadata.fileType || 'text/plain',
          size: body.metadata.size || body.file.size || 0,
          status: body.metadata.status || 'processing',
          uploadedAt: body.metadata.uploadedAt || new Date().toISOString()
        };
      } else {
        // If no metadata provided, create default metadata
        body.metadata = {
          fileName: body.file.name,
          fileType: 'text/plain',
          size: body.file.size || 0,
          status: 'processing',
          uploadedAt: new Date().toISOString()
        };
      }
    }

    console.log('Validated request body:', JSON.stringify(body, null, 2));
    return body;
  } catch (e) {
    console.error('Error validating request body:', e);
    throw e;
  }
};
