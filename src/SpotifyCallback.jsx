import { useState, useEffect } from "react";

const SpotifyCallback = () => {
  const [status, setStatus] = useState('Processing...');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the code from URL
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        
        if (!code) {
          setStatus('No authorization code found');
          return;
        }

        // Get the stored verifier
        const codeVerifier = localStorage.getItem('code_verifier');
        
        if (!codeVerifier) {
          setStatus('Code verifier not found');
          return;
        }

        // Your existing token exchange code
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: 'YOUR_CLIENT_ID',
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'https://jamming-kzm9x3gg0-greeifs-projects.vercel.app/',
            code_verifier: codeVerifier,
          }),
        });

        const data = await response.json();
        
        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);
          setStatus('Login successful! You can now use the Spotify API.');
        } else {
          setStatus('Token exchange failed');
        }

      } catch (error) {
        setStatus('Error: ' + error.message);
      }
    };

    handleCallback();
  }, []);

  return <div>{status}</div>;
};

export default SpotifyCallback;