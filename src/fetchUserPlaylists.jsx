import React, { useState, useEffect } from "react";

const UserPlaylists = ({ accessToken }) => {

    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [playlists, setPlaylists] = useState([]);

    const fetchUserPlaylists = async () => {


        // api call to get user playlists
        try {
            const response = await fetch(`https://api.spotify.com/v1/me/playlists`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                }
            });
            if (response.ok) {
                const data = await response.json();
                setPlaylists(data.items);
            } else {
                setMessage('Failed to fetch playlists');
                setMessageType('error');
            }
        }
        catch (error) {
            console.error('Error fetching playlists:', error);
            setMessage('Network error: Unable to fetch playlists. Please check your connection.');
            setMessageType('error');
        };

    };
    useEffect(() => {
        if (accessToken) {
            fetchUserPlaylists();
        }
    }, [accessToken]);
    return (
    <div>
      <h2>Your Playlists</h2>
      
      {message && (
        <div style={{ color: messageType === 'error' ? 'red' : 'green' }}>
          {message}
        </div>
      )}

      {playlists.map(playlist => (
        <div key={playlist.id}>
          <h3>{playlist.name}</h3>
          <p>{playlist.description || 'No description'}</p>
        </div>
      ))}
    </div>
  );
};
