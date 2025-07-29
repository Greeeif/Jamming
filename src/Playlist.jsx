import React, { useState } from "react";

const Playlist = ({ name, description, user_id, accessToken, tracks = [], onPlaylistCreated }) => {
    const [isCreating, setIsCreating] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success' or 'error'

    const createPlaylist = async () => {
        // Validate required props
        if (!name || !accessToken || !user_id) {
            setMessage('Missing required information: name, access token, or user ID');
            setMessageType('error');
            console.error('Missing required props');
            return;
        }

        setIsCreating(true);
        setMessage('Creating playlist...');
        setMessageType('');

        try {
            // Step 1: Create the playlist
            const playlistResponse = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    description: description || '',
                    public: false
                })
            });

            if (!playlistResponse.ok) {
                const errorData = await playlistResponse.json();
                console.error('Failed to create playlist:', errorData);
                setMessage(`Failed to create playlist: ${errorData.error?.message || 'Unknown error'}`);
                setMessageType('error');
                return;
            }

            const playlist = await playlistResponse.json();
            console.log('Playlist Created:', playlist);

            // Step 2: Add tracks to the playlist if any tracks are selected
            if (tracks.length > 0) {
                setMessage('Adding tracks to playlist...');
                
                // Extract track URIs
                const trackUris = tracks.map(track => track.uri);
                
                const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlist.id}/tracks`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        uris: trackUris
                    })
                });

                if (!addTracksResponse.ok) {
                    const errorData = await addTracksResponse.json();
                    console.error('Failed to add tracks:', errorData);
                    setMessage(`Playlist created but failed to add tracks: ${errorData.error?.message || 'Unknown error'}`);
                    setMessageType('error');
                    return;
                }

                setMessage(`Playlist "${playlist.name}" created successfully with ${tracks.length} track${tracks.length !== 1 ? 's' : ''}!`);
            } else {
                setMessage(`Empty playlist "${playlist.name}" created successfully!`);
            }

            setMessageType('success');

            // Call the callback to clear the form and tracklist
            if (onPlaylistCreated) {
                setTimeout(() => {
                    onPlaylistCreated();
                }, 1500); // Give user time to see success message
            }

        } catch (error) {
            console.error('Error creating playlist:', error);
            setMessage('Network error: Unable to create playlist. Please check your connection.');
            setMessageType('error');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
            {/* Show track count if there are tracks */}
            {tracks.length > 0 && (
                <div style={{
                    padding: '8px 12px',
                    backgroundColor: '#e8f5e8',
                    border: '1px solid #4caf50',
                    borderRadius: '4px',
                    fontSize: '12px',
                    color: '#2e7d32'
                }}>
                    Ready to create playlist with {tracks.length} track{tracks.length !== 1 ? 's' : ''}
                </div>
            )}

            <button 
                onClick={createPlaylist} 
                disabled={isCreating || !name.trim()}
                style={{
                    padding: '12px 20px',
                    backgroundColor: isCreating || !name.trim() ? '#ccc' : '#1db954',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: isCreating || !name.trim() ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
            >
                {isCreating ? 'Creating...' : `Create Playlist${tracks.length > 0 ? ` (${tracks.length} tracks)` : ''}`}
            </button>
            
            {!name.trim() && (
                <div style={{
                    fontSize: '12px',
                    color: '#666',
                    fontStyle: 'italic'
                }}>
                    Please enter a playlist name to create
                </div>
            )}
            
            {message && (
                <div 
                    style={{
                        padding: '10px 15px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        backgroundColor: messageType === 'success' ? '#d4edda' : '#f8d7da',
                        color: messageType === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${messageType === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                    }}
                >
                    {message}
                </div>
            )}
        </div>
    );
};

export default Playlist;