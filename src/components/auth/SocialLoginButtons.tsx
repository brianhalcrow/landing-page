import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { generateRandomString, generateCodeChallenge } from "@/utils/authUtils";
import { toast } from "sonner";

const SocialLoginButtons = () => {
  const handleSocialAuth = async (provider: 'google' | 'azure') => {
    try {
      if (provider === 'azure') {
        const codeVerifier = generateRandomString(64);
        sessionStorage.setItem('pkce_verifier', codeVerifier);
        const codeChallenge = await generateCodeChallenge(codeVerifier);

        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
            queryParams: {
              response_type: 'code',
              scope: 'email profile openid',
              prompt: 'select_account',
              code_challenge: codeChallenge,
              code_challenge_method: 'S256',
            },
          },
        });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signInWithOAuth({
          provider,
          options: {
            redirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
      }
    } catch (error: any) {
      console.error('Auth error:', error);
      toast.error(error.message || 'Authentication failed. Please try again.');
    }
  };

  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        onClick={() => handleSocialAuth('google')}
        className="w-full"
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        Google
      </Button>
      
      <Button
        variant="outline"
        onClick={() => handleSocialAuth('azure')}
        className="w-full"
      >
        <svg className="h-5 w-5 mr-2" viewBox="0 0 23 23" xmlns="http://www.w3.org/2000/svg">
          <path fill="#f25022" d="M1 1h9v9H1z"/>
          <path fill="#00a4ef" d="M1 11h9v9H1z"/>
          <path fill="#7fba00" d="M11 1h9v9h-9z"/>
          <path fill="#ffb900" d="M11 11h9v9h-9z"/>
        </svg>
        Microsoft
      </Button>
    </div>
  );
};

export default SocialLoginButtons;