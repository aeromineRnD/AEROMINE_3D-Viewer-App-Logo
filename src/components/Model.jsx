import React, { useEffect, useRef } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

function Model({ modelPath, autoRotate }) {
  const groupRef = useRef()
  
  // Load the GLTF model
  // useGLTF handles loading the .gltf file and all associated assets (textures, bins, etc.)
  const gltf = useGLTF(modelPath)

  // Center and scale the model when it loads
  useEffect(() => {
    if (gltf && gltf.scene && groupRef.current) {
      const box = new THREE.Box3().setFromObject(gltf.scene)
      const size = box.getSize(new THREE.Vector3())

      // Scale the model to fit nicely in view
      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 2 / maxDim // Fit model in a 2-unit space
      gltf.scene.scale.setScalar(scale)

      // Recompute bounds after scaling, then center on grid and sit on ground (y=0)
      const scaledBox = new THREE.Box3().setFromObject(gltf.scene)
      const center = scaledBox.getCenter(new THREE.Vector3())
      const min = scaledBox.min
      gltf.scene.position.set(-center.x, -min.y, -center.z)

      console.log('Model loaded successfully:', {
        size: size,
        scale: scale,
        center: center
      })
    }
  }, [gltf])

  // Optional: Add a subtle rotation animation
  // Comment this out if you don't want auto-rotation
  useFrame((_, delta) => {
    if (groupRef.current && autoRotate) {
      groupRef.current.rotation.y += delta * 0.5
    }
  })

  if (!gltf || !gltf.scene) {
    return null
  }

  return (
    <group ref={groupRef}>
      <primitive object={gltf.scene} />
    </group>
  )
}

// Preload the model for better performance
// This will start loading the model as soon as possible
export function preloadModel(path) {
  useGLTF.preload(path)
}

export default Model
