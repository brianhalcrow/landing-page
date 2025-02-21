
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
    console.log('Processing YouTube URL:', url)

    // Extract video ID from URL
    const videoId = extractVideoId(url)
    if (!videoId) {
      throw new Error('Invalid YouTube URL')
    }
    console.log('Extracted video ID:', videoId)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // First, get video details
    const videoDetails = await fetchVideoDetails(videoId)
    console.log('Retrieved video details:', videoDetails.title)

    // Then fetch captions
    const transcript = await fetchTranscript(videoId)
    console.log('Retrieved transcript, length:', transcript.length)

    // Process and store the transcript with video metadata
    const { data, error } = await supabase
      .from('documents')
      .insert({
        content: transcript,
        metadata: {
          source: 'youtube',
          video_id: videoId,
          url: url,
          type: 'transcript',
          title: videoDetails.title,
          channel: videoDetails.channelTitle,
          description: videoDetails.description,
          publishedAt: videoDetails.publishedAt,
          duration: videoDetails.duration
        }
      })
      .select()
      .single()

    if (error) {
      console.error('Error storing transcript:', error)
      throw error
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error processing YouTube video:', error)
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

async function fetchVideoDetails(videoId: string) {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  if (!apiKey) {
    throw new Error('YouTube API key not configured')
  }

  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
  )
  
  if (!response.ok) {
    throw new Error('Failed to fetch video details')
  }

  const data = await response.json()
  if (!data.items || data.items.length === 0) {
    throw new Error('Video not found')
  }

  const item = data.items[0]
  return {
    title: item.snippet.title,
    description: item.snippet.description,
    channelTitle: item.snippet.channelTitle,
    publishedAt: item.snippet.publishedAt,
    duration: item.contentDetails.duration
  }
}

async function fetchTranscript(videoId: string): Promise<string> {
  const apiKey = Deno.env.get('YOUTUBE_API_KEY')
  if (!apiKey) {
    throw new Error('YouTube API key not configured')
  }

  // First, get available captions
  const captionsResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/captions?part=snippet&videoId=${videoId}&key=${apiKey}`
  )
  
  if (!captionsResponse.ok) {
    throw new Error('Failed to fetch video captions')
  }

  const captionsData = await captionsResponse.json()
  
  // Try to find English captions, preferring manual over auto-generated
  const captions = captionsData.items || []
  let captionId = null

  // First try to find manual English captions
  const manualEnglish = captions.find(c => 
    c.snippet.language === 'en' && !c.snippet.trackKind.includes('ASR')
  )

  // If no manual English captions, try auto-generated ones
  const autoEnglish = captions.find(c => 
    c.snippet.language === 'en' && c.snippet.trackKind.includes('ASR')
  )

  captionId = manualEnglish?.id || autoEnglish?.id

  if (!captionId) {
    throw new Error('No English captions available for this video')
  }

  // Fetch the actual caption track
  const trackResponse = await fetch(
    `https://www.googleapis.com/youtube/v3/captions/${captionId}?key=${apiKey}`
  )

  if (!trackResponse.ok) {
    throw new Error('Failed to fetch caption track')
  }

  const trackData = await trackResponse.text()
  
  // Process the caption data into plain text
  // Remove timestamps and formatting
  const cleanText = trackData
    .replace(/\[\d{2}:\d{2}\.\d{3}\]/g, '') // Remove timestamps
    .replace(/\n\n/g, '\n')                  // Normalize line breaks
    .trim()

  return cleanText
}
