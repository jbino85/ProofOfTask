// MirrorWitness AR 2025-11-04

import { useEffect, useRef, useState } from 'react'
import { ProofOfTaskScene } from '../babylon/Scene'
import { HUDManager } from '../babylon/HUD'
import { Html5Qrcode } from 'html5-qrcode'

export default function ImmersivePage() {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const hudRef = useRef(null)
  const [showQR, setShowQR] = useState(false)
  const [qrData, setQrData] = useState(null)

  useEffect(() => {
    if (canvasRef.current && !sceneRef.current) {
      // Initialize Babylon.js scene
      sceneRef.current = new ProofOfTaskScene(canvasRef.current)
      hudRef.current = new HUDManager(sceneRef.current.scene)
      
      // Simulate task progression
      setTimeout(() => {
        sceneRef.current.verifyWitness(0)
        hudRef.current.verifyWitness(0)
      }, 3000)
      
      setTimeout(() => {
        sceneRef.current.verifyWitness(1)
        hudRef.current.verifyWitness(1)
      }, 5000)
      
      setTimeout(() => {
        sceneRef.current.verifyWitness(2)
        hudRef.current.verifyWitness(2)
        hudRef.current.showNautilusProof()
        sceneRef.current.goldenTrail.start()
      }, 7000)

      // Add custom event listeners for panels
      window.addEventListener('showStakePanel', () => {
        hudRef.current.createStakeBoostPanel()
      })

      window.addEventListener('showRadarPanel', () => {
        hudRef.current.createRadarPanel()
      })
    }

    return () => {
      if (sceneRef.current) {
        sceneRef.current.dispose()
        sceneRef.current = null
      }
      if (hudRef.current) {
        hudRef.current.dispose()
        hudRef.current = null
      }
    }
  }, [])

  const startQRScanner = async () => {
    setShowQR(true)
    try {
      const html5QrCode = new Html5Qrcode('qr-reader')
      await html5QrCode.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 }
        },
        (decodedText) => {
          setQrData(decodedText)
          html5QrCode.stop()
          setShowQR(false)
          
          // Show LoRa preorder if QR matches
          if (decodedText.includes('order.pot.network')) {
            showLoRaAR()
          }
        }
      )
    } catch (err) {
      console.error('QR scanner error:', err)
      setShowQR(false)
    }
  }

  const showLoRaAR = () => {
    // In production, this would show 3D model overlay via WebXR
    alert('LoRa Node Pre-order: $19.99\n\nESP32-SX1262 with your pre-flashed keypair\nShips in 2 weeks worldwide')
  }

  const handleARMode = async () => {
    if (sceneRef.current) {
      const supported = navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')
      if (supported) {
        sceneRef.current.switchMode('ar')
        alert('Point your phone at a flat surface\nHold for 3 seconds\nDrone will land on your table')
      } else {
        alert('AR not supported on this device.\n\nRequires:\n- Android/iOS with ARCore/ARKit\n- Chrome/Safari browser')
      }
    }
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      {/* Babylon.js Canvas */}
      <canvas
        ref={canvasRef}
        className="w-full h-full touch-none"
        style={{ outline: 'none' }}
      />

      {/* Floating Action Buttons */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <button
          onClick={handleARMode}
          className="bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg backdrop-blur"
          title="AR Mode (A)"
        >
          📱 AR
        </button>
        
        <button
          onClick={startQRScanner}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg backdrop-blur"
          title="QR Scanner"
        >
          📷 QR
        </button>
        
        <button
          onClick={() => window.dispatchEvent(new Event('showStakePanel'))}
          className="bg-green-600 hover:bg-green-700 text-white p-3 rounded-full shadow-lg backdrop-blur"
          title="Stake Boost (S)"
        >
          💰 STAKE
        </button>
        
        <button
          onClick={() => window.dispatchEvent(new Event('showRadarPanel'))}
          className="bg-red-600 hover:bg-red-700 text-white p-3 rounded-full shadow-lg backdrop-blur"
          title="Witness Radar"
        >
          📡 RADAR
        </button>

        <button
          onClick={() => sceneRef.current?.switchMode('replay')}
          className="bg-yellow-600 hover:bg-yellow-700 text-white p-3 rounded-full shadow-lg backdrop-blur"
          title="Replay (R)"
        >
          🔄 REPLAY
        </button>
      </div>

      {/* QR Scanner Modal */}
      {showQR && (
        <div className="absolute inset-0 z-30 bg-black/90 flex items-center justify-center">
          <div className="bg-gray-900 rounded-lg p-6 max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-white">Scan QR Code</h2>
              <button
                onClick={() => setShowQR(false)}
                className="text-white hover:text-red-500"
              >
                ✕
              </button>
            </div>
            <div id="qr-reader" className="w-full" />
            <p className="mt-4 text-sm text-gray-400 text-center">
              Point at LoRa box QR for 3D preview
            </p>
          </div>
        </div>
      )}

      {/* Mobile Instructions Overlay */}
      <div className="absolute bottom-20 left-0 right-0 z-10 pointer-events-none">
        <div className="text-center text-white/60 text-sm space-y-1">
          <div>🖱️ Drag to rotate • 🤏 Pinch to zoom</div>
          <div>⌨️ G: Globe | A: AR | R: Replay | S: Stake</div>
        </div>
      </div>
    </div>
  )
}
