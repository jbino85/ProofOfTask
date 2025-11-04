// MirrorWitness AR 2025-11-04 - Test

import { useEffect, useRef } from 'react'
import * as BABYLON from '@babylonjs/core'

export default function TestPage() {
  const canvasRef = useRef(null)

  useEffect(() => {
    if (!canvasRef.current) return

    try {
      const engine = new BABYLON.Engine(canvasRef.current, true)
      const scene = new BABYLON.Scene(engine)

      const camera = new BABYLON.ArcRotateCamera('camera', 0, 0, 10, BABYLON.Vector3.Zero(), scene)
      camera.attachControl(canvasRef.current, true)

      const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene)

      const sphere = BABYLON.MeshBuilder.CreateSphere('sphere', { diameter: 2 }, scene)

      engine.runRenderLoop(() => {
        scene.render()
      })

      window.addEventListener('resize', () => {
        engine.resize()
      })

      console.log('Babylon.js initialized successfully!')

      return () => {
        scene.dispose()
        engine.dispose()
      }
    } catch (error) {
      console.error('Babylon.js error:', error)
    }
  }, [])

  return (
    <div className="w-full h-screen bg-black">
      <canvas ref={canvasRef} className="w-full h-full" />
      <div className="absolute top-4 left-4 text-white">
        <h1>Babylon.js Test</h1>
        <p>You should see a sphere</p>
      </div>
    </div>
  )
}
