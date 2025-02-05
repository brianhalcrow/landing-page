// Modify the body to match Llama model expectations
const command = new InvokeModelCommand({
  modelId: 'arn:aws:bedrock:us-east-1:897729103708:imported-model/dj1b82d4nlp2',
  contentType: 'application/json',
  accept: 'application/json',
  body: JSON.stringify({
    // Adjust these parameters based on Llama model specifics
    prompt: message,
    max_tokens: 256,
    temperature: 0.7,
    top_p: 0.9,
    stop_sequences: ["\n"],
    stream: false
  })
});

// Enhanced error handling and logging
try {
  console.log('Sending request to DeepSeek Llama model');
  const response = await bedrockClient.send(command);
  
  if (!response.body) {
    throw new Error('Empty response from Bedrock');
  }

  // Parse the response
  const responseBody = new TextDecoder().decode(response.body);
  console.log('Raw response body:', responseBody);

  const result = JSON.parse(responseBody);
  
  // Flexible response parsing for Llama models
  const reply = 
    result.generation || 
    result.output || 
    result.text || 
    "I apologize, but I couldn't generate a response.";

  return new Response(
    JSON.stringify({ reply }),
    { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    }
  );

} catch (bedrockError) {
  console.error('Detailed Bedrock API error:', {
    name: bedrockError.name,
    message: bedrockError.message,
    code: bedrockError.code,
    stack: bedrockError.stack
  });

  return new Response(
    JSON.stringify({ 
      error: 'Model Invocation Error',
      details: bedrockError.message
    }),
    { 
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
