// MirrorWitness 2025-11-04

import { useState, useEffect, useRef } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'

function DroneCanvas({ dronePos }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    const width = canvas.width
    const height = canvas.height

    ctx.fillStyle = '#0a0f1e'
    ctx.fillRect(0, 0, width, height)

    // Draw grid
    ctx.strokeStyle = '#1a2332'
    ctx.lineWidth = 1
    for (let i = 0; i < width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, height)
      ctx.stroke()
    }
    for (let i = 0; i < height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(width, i)
      ctx.stroke()
    }

    // Draw drone
    const x = (dronePos.x % width + width) % width
    const y = (dronePos.y % height + height) % height

    ctx.fillStyle = '#00ff88'
    ctx.beginPath()
    ctx.arc(x, y, 8, 0, Math.PI * 2)
    ctx.fill()

    // Draw trail
    ctx.strokeStyle = '#00ff8844'
    ctx.lineWidth = 2
    ctx.beginPath()
    ctx.arc(x, y, 20, 0, Math.PI * 2)
    ctx.stroke()
  }, [dronePos])

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={400}
      className="border border-gray-700 rounded-lg"
    />
  )
}

function WitnessBar({ witnessId, status }) {
  const colors = {
    pending: 'bg-gray-700',
    verified: 'bg-green-500',
    failed: 'bg-red-500'
  }

  return (
    <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
      <div className={`w-4 h-4 rounded-full ${colors[status]}`} />
      <span className="font-mono text-sm">Witness {witnessId}</span>
      <span className="ml-auto text-xs text-gray-400">
        {status === 'verified' ? '✓ Signed' : status === 'failed' ? '✗ Failed' : '⋯ Waiting'}
      </span>
    </div>
  )
}

function App() {
  const account = useCurrentAccount()
  const [dronePos, setDronePos] = useState({ x: 300, y: 200 })
  const [witnesses, setWitnesses] = useState([
    { id: 1, status: 'pending' },
    { id: 2, status: 'pending' },
    { id: 3, status: 'pending' }
  ])
  const [taskStatus, setTaskStatus] = useState('idle')
  const [reward, setReward] = useState(0)
  const [elapsed, setElapsed] = useState(0)

  useEffect(() => {
    // Simulate drone movement (8 seconds flight)
    const interval = setInterval(() => {
      setDronePos(prev => ({
        x: prev.x + Math.random() * 10 - 5,
        y: prev.y + Math.random() * 10 - 5
      }))
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    // Simulate witness responses
    if (taskStatus === 'running') {
      const timers = [
        setTimeout(() => {
          setWitnesses(prev => prev.map((w, i) => i === 0 ? { ...w, status: 'verified' } : w))
        }, 2000),
        setTimeout(() => {
          setWitnesses(prev => prev.map((w, i) => i === 1 ? { ...w, status: 'verified' } : w))
        }, 4000),
        setTimeout(() => {
          setWitnesses(prev => prev.map((w, i) => i === 2 ? { ...w, status: 'verified' } : w))
          setTaskStatus('completed')
          setReward(10)
        }, 6000),
      ]

      return () => timers.forEach(t => clearTimeout(t))
    }
  }, [taskStatus])

  useEffect(() => {
    if (taskStatus === 'running') {
      const timer = setInterval(() => setElapsed(e => e + 1), 1000)
      return () => clearInterval(timer)
    }
  }, [taskStatus])

  const startTask = () => {
    setTaskStatus('running')
    setWitnesses(w => w.map(x => ({ ...x, status: 'pending' })))
    setReward(0)
    setElapsed(0)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                ProofOfTask
              </span>
            </h1>
            <p className="text-gray-400">Sui-native Proof-of-Task MVP</p>
          </div>
          <ConnectButton />
        </div>

        {/* Main Content */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Drone Visualization */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Live Drone Feed</h2>
            <DroneCanvas dronePos={dronePos} />
            <div className="mt-4 flex justify-between text-sm text-gray-400">
              <span>Altitude: {(100 + Math.random() * 5).toFixed(1)}m</span>
              <span>Speed: {(15 + Math.random() * 3).toFixed(1)} km/h</span>
              <span>Time: {elapsed}s</span>
            </div>
          </div>

          {/* Witness Status */}
          <div className="bg-gray-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-xl font-bold mb-4">Witness Verification</h2>
            
            <div className="space-y-3 mb-6">
              {witnesses.map(w => (
                <WitnessBar key={w.id} witnessId={w.id} status={w.status} />
              ))}
            </div>

            {/* Status Banner */}
            {taskStatus === 'completed' && (
              <div className="bg-green-900 border border-green-500 rounded-lg p-4 mb-4">
                <p className="font-bold text-green-300">✓ Task Verified!</p>
                <p className="text-sm text-green-200">10 TASK minted to your wallet</p>
              </div>
            )}

            {taskStatus === 'running' && elapsed > 60 && witnesses.filter(w => w.status === 'verified').length < 3 && (
              <div className="bg-red-900 border border-red-500 rounded-lg p-4 mb-4">
                <p className="font-bold text-red-300">⚠ Timeout Warning</p>
                <p className="text-sm text-red-200">Less than 3 witnesses in 60s</p>
              </div>
            )}

            {/* Controls */}
            <div className="space-y-3">
              <button
                onClick={startTask}
                disabled={taskStatus === 'running' || !account}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:from-gray-600 disabled:to-gray-700 text-white font-bold py-3 px-6 rounded-lg transition-all"
              >
                {taskStatus === 'running' ? 'Task Running...' : 'Start New Task'}
              </button>

              {!account && (
                <p className="text-center text-sm text-yellow-400">
                  Connect wallet to start mining
                </p>
              )}

              <div className="bg-gray-900 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Earned:</span>
                  <span className="text-2xl font-bold text-green-400">{reward} TASK</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Footer */}
        <div className="mt-8 bg-yellow-900 border border-yellow-600 rounded-lg p-4">
          <p className="text-yellow-200 text-sm">
            ⚠️ <strong>MVP ONLY - NOT PRODUCTION</strong> - Localhost witnesses for demo only. 
            Phase 2 will include real GPS + LoRa + Nautilus zk proofs.
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
