import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SpotifyAuth from './SpotifyAuth'
import SpotifyCallback from './SpotifyCallback'
import Playlist from './Playlist'

function App() {
  const urlParams = new URLSearchParams(window.location.search);
  const isCallback = urlParams.has('code');
  const [authData, setAuthData] = useState({
    accessToken: null,
    userID: null,
  });
  const [playlistData, setPlaylistData] = useState({
    name: '',
    description: ''
  });

  useEffect(() => {
    const accessToken = localStorage.getItem('access_token');
    const userID = localStorage.getItem('spotify_user_id');

    if (accessToken && userID) {
      setAuthData({
        accessToken,
        userID
      })
    }
  }, []);
  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('spotify_user_id');
    localStorage.removeItem('spotify_user_info');
    localStorage.removeItem('code_verifier');
    setIsAuthenticated(false);
    setAuthData({ accessToken: null, userId: null, userInfo: null });
  };


  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
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
      <div className="card">
        <Playlist
          name={playlistData.name}
          description={playlistData.description}
          user_id={authData.userID}
          accessToken={authData.accessToken}>
          Create playlist
        </Playlist>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
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
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <div>
        {isCallback ? <SpotifyCallback /> : <SpotifyAuth />}
      </div>
    </>
  )
}

export default App