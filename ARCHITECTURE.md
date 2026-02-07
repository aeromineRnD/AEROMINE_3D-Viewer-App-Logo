# 3D Model Viewer - Project Overview & Architecture

## What You've Got

A production-ready MVP for displaying 3D GLTF models in a web browser with full interactive controls.

---

## Architecture Breakdown

### **Tech Stack**
```
React 18 (UI Framework)
    ↓
React Three Fiber (React → Three.js bridge)
    ↓
Three.js (3D Engine)
    ↓
WebGL (Browser GPU rendering)
```

### **Why This Stack?**

1. **React** - Component-based, easy to extend
2. **React Three Fiber** - Declarative 3D (Three.js with React patterns)
3. **@react-three/drei** - Pre-built helpers (OrbitControls, loaders, etc.)
4. **Vite** - Lightning fast dev server and builds

---

## Project Structure Explained

```
3d-viewer-app/
│
├── public/                    # Static assets
│   └── models/                # Place your models (gltf) in this folder
│
├── src/
│   ├── components/
│   │   ├── ModelViewer.jsx   # 3D Canvas + Scene Setup
│   │   └── Model.jsx         # GLTF Loader Logic
│   │
│   ├── App.jsx               # Main App Component
│   ├── App.css               # Styling
│   ├── main.jsx              # React Entry Point
│   └── index.css             # Global Styles
│
├── package.json              # Dependencies
├── vite.config.js            # Build Configuration
└── index.html                # HTML Entry Point
```

---

## How It Works (Component Breakdown)

### **1. App.jsx** (The Orchestrator)
```javascript
- Manages state (model path)
- Renders header, viewer, footer
- Provides UI for controls info
```

### **2. ModelViewer.jsx** (The 3D Stage)
```javascript
- Creates the Canvas (3D rendering context)
- Sets up Camera (perspective view)
- Adds Lights (ambient + directional + point)
- Configures OrbitControls (user interaction)
- Handles loading states
```

**Key Concepts:**
- **Canvas**: React component that creates a Three.js scene
- **Camera**: Your viewport into the 3D world
- **Lights**: Illuminate the model (like a photo studio)
- **OrbitControls**: Handles mouse/touch interactions

### **3. Model.jsx** (The Asset Loader)
```javascript
- Loads GLTF file using useGLTF hook
- Auto-centers the model
- Auto-scales to fit viewport
- Handles errors gracefully
```

**Smart Features:**
```javascript
// Calculate bounding box
const box = new THREE.Box3().setFromObject(gltf.scene)

// Center the model
const center = box.getCenter(new THREE.Vector3())
gltf.scene.position.sub(center)

// Scale to fit
const size = box.getSize(new THREE.Vector3())
const maxDim = Math.max(size.x, size.y, size.z)
const scale = 2 / maxDim
gltf.scene.scale.setScalar(scale)
```

---

## Control Flow

```
User Action → OrbitControls → Camera Update → Re-render
                                  ↓
                            Model stays in place
                            Camera moves around it
```

**OrbitControls Parameters:**
- `enableDamping` - Smooth, inertial movement
- `dampingFactor` - How quickly movement stops (0.05 = gradual)
- `minDistance/maxDistance` - Zoom limits
- `maxPolarAngle` - Prevents camera from going "underground"

---

## Key React Three Fiber Concepts

### **Hooks**

1. **`useGLTF(path)`**
   - Loads GLTF files
   - Caches automatically (load once, use everywhere)
   - Returns: `{ scene, nodes, materials, animations }`

2. **`useFrame(callback)`**
   - Runs every frame (~60fps)
   - Perfect for animations
   - Example: `groupRef.current.rotation.y += 0.001`

3. **`useThree()`**
   - Access Three.js internals (camera, scene, gl)
   - Not used in MVP, but useful for advanced features

### **Components**

1. **`<Canvas>`**
   - Entry point to 3D world
   - Creates WebGL context
   - Manages render loop

2. **`<primitive object={obj} />`**
   - Renders existing Three.js objects
   - Used for loaded GLTF scenes

3. **`<mesh>`, `<boxGeometry>`, etc.**
   - Declarative 3D objects
   - React components that create Three.js objects

---

## Customization Guide

### **1. Change Lighting**

```javascript
// In ModelViewer.jsx

// Soft overall illumination
<ambientLight intensity={0.5} />

// Main light source (creates shadows)
<directionalLight 
  position={[10, 10, 5]} 
  intensity={1} 
  castShadow 
/>

// Fill light (reduces harsh shadows)
<pointLight position={[-10, -10, -5]} intensity={0.5} />
```

**Presets for different moods:**
```javascript
<Environment preset="sunset" />    // Warm, orange tones
<Environment preset="warehouse" /> // Industrial, neutral
<Environment preset="forest" />    // Natural, green tones
<Environment preset="studio" />    // Clean, professional (default)
```

### **2. Adjust Camera**

```javascript
<PerspectiveCamera 
  makeDefault 
  position={[0, 0, 5]}  // x, y, z coordinates
  fov={50}               // Field of view (35-75 typical)
/>
```

**Camera positions for different views:**
- Front: `[0, 0, 5]`
- Top: `[0, 5, 0]`
- Isometric: `[3, 3, 3]`
- Side: `[5, 0, 0]`

### **3. Add Background**

```javascript
// Solid color
<color attach="background" args={['#1a1a1a']} />

// Gradient (use Environment)
<Environment background preset="sunset" />
```

### **4. Enable Shadows**

```javascript
// In Canvas
<Canvas shadows>

// In lights
<directionalLight castShadow />

// On model (in Model.jsx)
gltf.scene.traverse((child) => {
  if (child.isMesh) {
    child.castShadow = true
    child.receiveShadow = true
  }
})
```

---

## Performance Optimization

### **Current Optimizations:**

1. **Device Pixel Ratio**: `dpr={[1, 2]}` - Balances quality/performance
2. **Anti-aliasing**: `gl={{ antialias: true }}` - Smooth edges
3. **Suspense**: Shows loading state while model loads
4. **Auto-caching**: GLTF files cached by useGLTF

### **Future Optimizations:**

```javascript
// Level of Detail (LOD)
import { Detailed } from '@react-three/drei'

// Progressive loading
import { useProgress } from '@react-three/drei'

// Lazy loading
const Model = lazy(() => import('./Model'))
```

## Understanding the Code Flow

```
User opens page
    ↓
main.jsx renders <App />
    ↓
App.jsx renders <ModelViewer modelPath="/models/x.gltf" />
    ↓
ModelViewer creates <Canvas> and sets up scene
    ↓
<Model> component loads GLTF file
    ↓
useGLTF hook fetches file from server
    ↓
Model auto-centers and scales
    ↓
Three.js renders to WebGL
    ↓
OrbitControls listens for mouse events
    ↓
User interacts → Camera updates → Re-render (60fps)
```

---

