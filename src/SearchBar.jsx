import React, { useState, useEffect } from "react";

const SearchBar = ({ accessToken, onTracksFound }) => {
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);

    const searchSong = async () => {
        if (!search.trim() || !accessToken) return;
        
        setLoading(true);
        const cleanedUserInput = search.replaceAll(" ", "+");
        const url = `https://api.spotify.com/v1/search?q=${cleanedUserInput}&type=track`;
        
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            
            if (response.ok) {
                const data = await response.json();
                const foundTracks = data.tracks.items;
                
                // Pass results to parent component
                if (onTracksFound) {
                    onTracksFound(foundTracks);
                }
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
            // Pass empty array on error
            if (onTracksFound) {
                onTracksFound([]);
            }
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim() && accessToken) {
                searchSong();
            } else if (!search.trim()) {
                // Clear results when search is empty
                if (onTracksFound) {
                    onTracksFound([]);
                }
            }
        }, 1000);

        return () => clearTimeout(timer);
    }, [search, accessToken]);

    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search for songs..."
                style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px',
                    marginBottom: '10px'
                }}
            />
        </div>
    );
};

export default SearchBar;