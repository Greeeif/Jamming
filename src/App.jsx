import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SpotifyAuth from './SpotifyAuth'
import SpotifyCallback from './SpotifyCallback'
import Playlist from './Playlist'
import UserPlaylists from './UserPlaylists'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults'
import Tracklist from './Tracklist'

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isCallback = urlParams.has('code');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authData, setAuthData] = useState({
    accessToken: null,
    userID: null,
  });
  const [playlistData, setPlaylistData] = useState({
    name: '',
    description: ''
  });

  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedTracks, setSelectedTracks] = useState([]); // NEW: Track list for playlist

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userID = localStorage.getItem('spotify_user_id');

    if (accessToken && userID) {
      setAuthData({
        accessToken,
        userID
      });
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('spotify_user_id');
    localStorage.removeItem('spotify_user_info');
    localStorage.removeItem('code_verifier');
    setIsAuthenticated(false);
    setAuthData({ accessToken: null, userID: null });
    setSearchResults([]);
    setSelectedTracks([]); // Clear selected tracks on logout
  };

  const handleTracksFound = (tracks) => {
    setSearchResults(tracks);
    setIsSearching(false);
  };

  const handleTrackSelect = (track) => {
    console.log('Selected track:', track);
    // Check if track is already in the list
    const isAlreadySelected = selectedTracks.some(selectedTrack => selectedTrack.id === track.id);
    
    if (!isAlreadySelected) {
      setSelectedTracks(prev => [...prev, track]);
    } else {
      alert('This track is already in your playlist!');
    }
  };

  const removeTrack = (trackId) => {
    setSelectedTracks(prev => prev.filter(track => track.id !== trackId));
  };

  const clearTracklist = () => {
    setSelectedTracks([]);
  };

  return (
    <>
      <h1>Let's Jam</h1>

      {isAuthenticated && (
        <button
          onClick={handleLogout}
          style={{
            padding: '5px 15px',
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '15px',
            cursor: 'pointer',
            fontSize: '12px'
          }}
        >
          Logout
        </button>
      )}
      <div className="card">
        {isAuthenticated ? (
          <>
            {/* Search Section */}
            <div style={{ marginBottom: '20px' }}>
              <h3>Search for Songs</h3>
              <SearchBar
                accessToken={authData.accessToken}
                onTracksFound={handleTracksFound}
              />
              <SearchResults
                tracks={searchResults}
                onTrackSelect={handleTrackSelect}
                loading={isSearching}
              />
            </div>

            {/* Tracklist Section */}
            <div style={{ marginBottom: '20px' }}>
              <Tracklist 
                tracks={selectedTracks}
                onRemoveTrack={removeTrack}
                onClearAll={clearTracklist}
              />
            </div>

            {/* Playlist Creation Section */}
            <div style={{ marginBottom: '20px' }}>
              <h3>Create Playlist</h3>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Playlist Name *
                </label>
                <input
                  type="text"
                  placeholder="Enter playlist name"
                  value={playlistData.name}
                  onChange={(e) => setPlaylistData(prev => ({
                    ...prev,
                    name: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    fontSize: '14px'
                  }}
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
                  Description (optional)
                </label>
                <textarea
                  placeholder="Enter playlist description"
                  value={playlistData.description}
                  onChange={(e) => setPlaylistData(prev => ({
                    ...prev,
                    description: e.target.value
                  }))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ccc',
                    minHeight: '80px',
                    fontSize: '14px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <Playlist
                name={playlistData.name}
                description={playlistData.description}
                user_id={authData.userID}
                accessToken={authData.accessToken}
                tracks={selectedTracks} // Pass selected tracks to playlist
                onPlaylistCreated={() => {
                  // Clear the form and tracklist after successful creation
                  setPlaylistData({ name: '', description: '' });
                  setSelectedTracks([]);
                }}
              />
            </div>

            {/* Debug info */}
            <div style={{ marginTop: '20px', fontSize: '12px', color: '#666' }}>
              Debug: User ID: {authData.userID}, Has Token: {authData.accessToken ? 'Yes' : 'No'}
            </div>
            
            <div>
              <UserPlaylists accessToken={authData.accessToken} />
            </div>
          </>
        ) : (
          <p>Please authenticate with Spotify to create playlists.</p>
        )}
      </div>
      <div>
        {isCallback ? <SpotifyCallback /> : <SpotifyAuth />}
      </div>
    </>
  )
}

export default App