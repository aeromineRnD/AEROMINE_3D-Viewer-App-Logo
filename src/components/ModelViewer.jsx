import React, { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, PerspectiveCamera, useProgress } from '@react-three/drei'
import Model from './Model'

class ModelErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    if (this.props.onError) {
      this.props.onError(error)
    }
  }

  render() {
    if (this.state.hasError) {
      return null
    }

    return this.props.children
  }
}

function ModelViewer({ modelPath, autoRotate, showGrid, background, backgroundOptions }) {
  const [error, setError] = useState(null)
  const { active, progress } = useProgress()

  const handleError = (err) => {
    const message = err?.message || String(err)
    setError(message)
  }

  const backgroundColor = backgroundOptions?.[background] || '#667eea'

  return (
    <div className="viewer-container" style={{ background: backgroundColor }}>
      {error && (
        <div className="error">
          <h3>Error Loading Model</h3>
          <p>{error}</p>
          <p style={{ marginTop: '10px', fontSize: '14px' }}>
            Make sure your GLTF file and associated files (textures, bins) are in the /public/models/ folder
          </p>
        </div>
      )}
      
      <Canvas
        shadows
        gl={{ antialias: true }}
        dpr={[1, 2]} // Device pixel ratio for crisp rendering
      >
        {/* Camera setup */}
        <PerspectiveCamera makeDefault position={[0, 0, 5]} fov={50} />
        
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 10, 5]}
          intensity={1}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-10, -10, -5]} intensity={0.5} />
        
        {/* Environment for reflections - makes models look more realistic */}
        <Environment preset="studio" />
        
        {/* The 3D Model */}
        <ModelErrorBoundary onError={handleError}>
          <Suspense fallback={<LoadingIndicator />}>
            <Model modelPath={modelPath} autoRotate={autoRotate} />
          </Suspense>
        </ModelErrorBoundary>

        {/* OrbitControls for user interaction */}
        <OrbitControls
          enableDamping // Smooth camera movements
          dampingFactor={0.05}
          minDistance={1} // Minimum zoom
          maxDistance={20} // Maximum zoom
          maxPolarAngle={Math.PI / 1.5} // Prevent camera going below ground
        />
        
        {/* Grid helper - optional, you can remove this */}
        {showGrid && <gridHelper args={[10, 10]} />}
      </Canvas>
      
      {active && !error && (
        <div className="loading">Loading 3D Model... {Math.round(progress)}%</div>
      )}
    </div>
  )
}

// Simple loading indicator in 3D space
function LoadingIndicator() {
  return (
    <mesh>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="hotpink" wireframe />
    </mesh>
  )
}

export default ModelViewer
