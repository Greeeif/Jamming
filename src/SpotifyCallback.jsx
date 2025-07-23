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

        setStatus('Exchanging code for access token...');

        // Your existing token exchange code
        const response = await fetch("https://accounts.spotify.com/api/token", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            client_id: 'b6215e6ae38640a0a70c832d155200b0',
            grant_type: 'authorization_code',
            code,
            redirect_uri: 'https://jamming-teal.vercel.app/',
            code_verifier: codeVerifier,
          }),
        });

        const data = await response.json();

        if (data.access_token) {
          localStorage.setItem('access_token', data.access_token);

          setStatus('Getting user Info...');

          const userResponse = await fetch('https://api.spotify.com/v1/me', {
            headers: {
              'Authorization': `Bearer ${data.access_token}`
            }
          });

          if (userResponse.ok) {
            const userData = await userResponse.json();

            localStorage.setItem('spotify_user_id', userData.id);
            localStorage.setItem('spotify_user_info', JSON.stringify(userData));

            setStatus(`Login successful! Welcome ${userData.display_name || userData.id}!`);

          } else {
            setStatus('Token exchange failed: ' + (data.error_description || 'Unknown error'));
          }

        }
      } catch (error) {
        setStatus('Error: ' + error.message);
      }
    };

    handleCallback();
  }, []);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Spotify Authentication</h2>
      <p>{status}</p>
    </div>
  );
};

export default SpotifyCallback;
