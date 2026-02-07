import React, { useState } from 'react'
import ModelViewer from './components/ModelViewer'
import './App.css'

function App() {
  // You can change this to your model path
  // For now, using a placeholder - replace with your actual GLTF file path
  const [modelPath, setModelPath] = useState('/models/color_logo.gltf')
  const [autoRotate, setAutoRotate] = useState(false)
  const [showGrid, setShowGrid] = useState(true)
  const [background, setBackground] = useState('purple')

  const backgroundOptions = {
    purple: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    midnight: 'linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)',
    sunrise: 'linear-gradient(135deg, #ff512f 0%, #f09819 100%)',
    ocean: 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)',
    forest: 'linear-gradient(135deg, #134e5e 0%, #71b280 100%)',
    slate: 'linear-gradient(135deg, #3a3d40 0%, #181719 100%)',
    white: '#ffffff',
  }

  const appStyle = {
    backgroundColor: 'black',
  }

  return (
    <div className="app" style={appStyle}>
      <div className="header">
        <h1>3D Model Viewer</h1>
        <div className="controls-info">
          <span>🖱️ Left Click + Drag: Rotate</span>
          <span>🖱️ Right Click + Drag: Pan</span>
          <span>🔍 Scroll: Zoom</span>
        </div>
        <div className="controls-actions">
          <button
            type="button"
            className={`toggle-button ${autoRotate ? 'is-on' : ''}`}
            onClick={() => setAutoRotate((prev) => !prev)}
          >
            Auto Rotate: {autoRotate ? 'On' : 'Off'}
          </button>
          <button
            type="button"
            className={`toggle-button ${showGrid ? 'is-on' : ''}`}
            onClick={() => setShowGrid((prev) => !prev)}
          >
            Grid: {showGrid ? 'On' : 'Off'}
          </button>
          <label className="select-label">
            Background
            <select
              className="select-input"
              value={background}
              onChange={(event) => setBackground(event.target.value)}
            >
              <option value="purple">Purple</option>
              <option value="midnight">Midnight</option>
              <option value="sunrise">Sunrise</option>
              <option value="ocean">Ocean</option>
              <option value="forest">Forest</option>
              <option value="slate">Slate</option>
              <option value="white">White</option>
            </select>
          </label>
        </div>
      </div>
      
      <ModelViewer
        modelPath={modelPath}
        autoRotate={autoRotate}
        showGrid={showGrid}
        background={background}
        backgroundOptions={backgroundOptions}
      />
      
      <div className="footer">
        <p>AEROMINE R&D</p>
      </div>
    </div>
  )
}

export default App
