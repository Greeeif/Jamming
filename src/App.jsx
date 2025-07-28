import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SpotifyAuth from './SpotifyAuth'
import SpotifyCallback from './SpotifyCallback'
import Playlist from './Playlist'
import UserPlaylists from './UserPlaylists'
import SearchBar from './SearchBar'
import SearchResults from './SearchResults' // ✅ ADD THIS IMPORT

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

  // ✅ ADD THESE MISSING STATE VARIABLES
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

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
    setSearchResults([]); // Clear search results on logout
  };

  // ✅ ADD THESE MISSING HANDLER FUNCTIONS
  const handleTracksFound = (tracks) => {
    setSearchResults(tracks);
    setIsSearching(false);
  };

  const handleTrackSelect = (track) => {
    console.log('Selected track:', track);
    // You can add logic here to add tracks to playlist, etc.
  };

  return (
    <>
      <h1>Let's Jam</h1>

      {/* Show logout button only if authenticated */}
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
        {/* Show form and playlist component only if authenticated */}
        {isAuthenticated ? (
          <>
            <div style={{ marginBottom: '20px' }}>
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
            {/* Form inputs BEFORE the Playlist component */}
            <div style={{ marginBottom: '20px' }}>
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
            </div>

            {/* Playlist component */}
            <Playlist
              name={playlistData.name}
              description={playlistData.description}
              user_id={authData.userID}
              accessToken={authData.accessToken}
            />

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