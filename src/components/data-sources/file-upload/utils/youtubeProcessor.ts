
import { supabase } from "@/integrations/supabase/client";

const YOUTUBE_URL_REGEX = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/;

export const validateYoutubeUrl = (url: string): boolean => {
  return YOUTUBE_URL_REGEX.test(url);
};

export const processYoutubeUrl = async (url: string) => {
  if (!validateYoutubeUrl(url)) {
    throw new Error('Invalid YouTube URL format');
  }

  try {
    const { data, error } = await supabase.functions.invoke('youtube-transcribe', {
      body: { url }
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error processing YouTube URL:', error);
    throw new Error('Failed to process YouTube video');
  }
};
