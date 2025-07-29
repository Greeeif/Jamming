import React from "react";

const Tracklist = ({ tracks, onRemoveTrack, onClearAll }) => {
    if (tracks.length === 0) {
        return (
            <div style={{
                border: '1px dashed #ccc',
                borderRadius: '4px',
                padding: '20px',
                textAlign: 'center',
                color: '#666',
                backgroundColor: '#f9f9f9'
            }}>
                <h3 style={{ margin: '0 0 10px 0' }}>Your Playlist</h3>
                <p style={{ margin: 0 }}>No tracks selected yet. Search and click on tracks to add them to your playlist.</p>
            </div>
        );
    }

    return (
        <div style={{
            border: '1px solid #ddd',
            borderRadius: '4px',
            backgroundColor: '#fff'
        }}>
            {/* Header */}
            <div style={{
                padding: '15px',
                backgroundColor: '#f5f5f5',
                borderBottom: '1px solid #ddd',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}>
                <div>
                    <h3 style={{ margin: 0, fontSize: '16px' }}>Your Playlist</h3>
                    <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#666' }}>
                        {tracks.length} track{tracks.length !== 1 ? 's' : ''} selected
                    </p>
                </div>
                
                {tracks.length > 0 && (
                    <button
                        onClick={onClearAll}
                        style={{
                            padding: '6px 12px',
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        Clear All
                    </button>
                )}
            </div>

            {/* Track List */}
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {tracks.map((track, index) => (
                    <div
                        key={track.id}
                        style={{
                            padding: '12px 15px',
                            borderBottom: index < tracks.length - 1 ? '1px solid #eee' : 'none',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}
                    >
                        {/* Album artwork */}
                        {track.album.images[2] && (
                            <img
                                src={track.album.images[2].url}
                                alt={`${track.album.name} cover`}
                                style={{
                                    width: '40px',
                                    height: '40px',
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
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                            }}>
                                {track.artists.map(artist => artist.name).join(', ')}
                            </div>
                        </div>
                        
                        {/* Duration */}
                        <div style={{
                            color: '#666',
                            fontSize: '12px',
                            flexShrink: 0,
                            marginRight: '10px'
                        }}>
                            {Math.floor(track.duration_ms / 60000)}:{String(Math.floor((track.duration_ms % 60000) / 1000)).padStart(2, '0')}
                        </div>

                        {/* Remove button */}
                        <button
                            onClick={() => onRemoveTrack(track.id)}
                            style={{
                                padding: '4px 8px',
                                backgroundColor: '#ff6b6b',
                                color: 'white',
                                border: 'none',
                                borderRadius: '3px',
                                cursor: 'pointer',
                                fontSize: '12px',
                                flexShrink: 0
                            }}
                            title="Remove from playlist"
                        >
                            ✕
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Tracklist;