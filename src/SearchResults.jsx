import React from "react";

const SearchResults = ({ tracks, onTrackSelect, loading }) => {
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '20px' }}>
                <p>Searching for tracks...</p>
            </div>
        );
    }

    if (tracks.length === 0) {
        return null; // Don't show anything when no results
    }

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            maxHeight: '400px',
            overflowY: 'auto',
            marginTop: '10px'
        }}>
            <div style={{
                padding: '10px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                fontWeight: 'bold'
            }}>
                {tracks.length} track{tracks.length !== 1 ? 's' : ''} found
            </div>
            
            {tracks.map((track) => (
                <div
                    key={track.id}
                    onClick={() => onTrackSelect && onTrackSelect(track)}
                    style={{
                        padding: '12px',
                        borderBottom: '1px solid #eee',
                        cursor: onTrackSelect ? 'pointer' : 'default',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        ':hover': {
                            backgroundColor: '#f9f9f9'
                        }
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f9f9f9'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                >
                    {/* Album artwork */}
                    {track.album.images[2] && (
                        <img
                            src={track.album.images[2].url}
                            alt={`${track.album.name} cover`}
                            style={{
                                width: '50px',
                                height: '50px',
                                borderRadius: '4px',
                                flexShrink: 0
                            }}
                        />
                    )}
                    
                    {/* Track info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontWeight: 'bold',
                            fontSize: '14px',
                            marginBottom: '4px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {track.name}
                        </div>
                        
                        <div style={{
                            color: '#666',
                            fontSize: '12px',
                            marginBottom: '2px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {track.artists.map(artist => artist.name).join(', ')}
                        </div>
                        
                        <div style={{
                            color: '#888',
                            fontSize: '11px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap'
                        }}>
                            {track.album.name} • {new Date(track.album.release_date).getFullYear()}
                        </div>
                    </div>
                    
                    {/* Duration */}
                    <div style={{
                        color: '#666',
                        fontSize: '12px',
                        flexShrink: 0
                    }}>
                        {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SearchResults;