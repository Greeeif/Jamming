import React, { useState, useEffect } from "react";

const SearchBar = ({ accessToken, onTracksFound }) => {
    const [search, setSearch] = useState('');
    const [tracks, setTracks] = useState([]);
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
                setTracks(foundTracks);
                
                // Pass results to parent component if callback provided
                if (onTracksFound) {
                    onTracksFound(foundTracks);
                }
            }
        } catch (error) {
            console.error('Error fetching tracks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Debounced search effect
    useEffect(() => {
        const timer = setTimeout(() => {
            if (search.trim() && accessToken) {
                searchSong();
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [search, accessToken]);

    return (
        <div>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={loading ? "Searching..." : "Search for songs..."}
                disabled={loading}
            />
            
            {/* Optional: Display search results count */}
            {tracks.length > 0 && (
                <p>{tracks.length} tracks found</p>
            )}
        </div>
    );
};

export default SearchBar;