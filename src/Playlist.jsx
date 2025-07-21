import React, { useState } from "react";

const Playlist = ({ name, description, user_id, accessToken }) => {
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
        setMessage('');
        setMessageType('');

        try {
            const response = await fetch(`https://api.spotify.com/v1/users/${user_id}/playlists`, {
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

            if (response.ok) {
                const playlist = await response.json();
                console.log('Playlist Created:', playlist);
                setMessage(`Playlist "${playlist.name}" created successfully!`);
                setMessageType('success');
            } else {
                const errorData = await response.json();
                console.error('Failed to create playlist:', errorData);
                setMessage(`Failed to create playlist: ${errorData.error?.message || 'Unknown error'}`);
                setMessageType('error');
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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '300px' }}>
            <button 
                onClick={createPlaylist} 
                disabled={isCreating}
                style={{
                    padding: '10px 15px',
                    backgroundColor: isCreating ? '#ccc' : '#1db954',
                    color: 'white',
                    border: 'none',
                    borderRadius: '20px',
                    cursor: isCreating ? 'not-allowed' : 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                }}
            >
                {isCreating ? 'Creating...' : 'Create Playlist'}
            </button>
            
            {message && (
                <div 
                    style={{
                        padding: '8px 12px',
                        borderRadius: '4px',
                        fontSize: '12px',
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