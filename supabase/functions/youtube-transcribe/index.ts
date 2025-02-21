
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { url } = await req.json()

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Fetch captions using YouTube API
    const transcript = await fetchTranscript(videoId)
    
    // Process and store the transcript
    const { data, error } = await supabase
      .from('documents')
      .insert({
        content: transcript,
        metadata: {
          source: 'youtube',
          video_id: videoId,
          url: url,
          type: 'transcript'
        }
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})

function extractVideoId(url: string): string | null {
  const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i
  const match = url.match(regex)
  return match ? match[1] : null
}

async function fetchTranscript(videoId: string): Promise<string> {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  if (!apiKey) {
    throw new Error('YouTube API key not configured')
  }

  // Fetch captions using YouTube Data API
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch video captions')
  }

  // Process and return the transcript
  const data = await response.json()
  // Implementation depends on the specific requirements and YouTube API response format
  // You'll need to process the captions and return them as text

  return "Transcript content" // Placeholder
}
