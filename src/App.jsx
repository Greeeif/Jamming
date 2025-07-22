import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import SpotifyAuth from './SpotifyAuth'
import SpotifyCallback from './SpotifyCallback'
import Playlist from './Playlist'

function App() {
  const [count, setCount] = useState(0)

  // Add this line - you were missing it!
  const urlParams = new URLSearchParams(window.location.search);
  const isCallback = urlParams.has('code');
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  

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
      <div className="card">
          <Playlist>
            create playlist
          </Playlist>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
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