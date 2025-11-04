// MirrorWitness 3D 2025-11-04

import { useState, useEffect, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stars } from '@react-three/drei'
import { Earth, Drone, WitnessRing, GoldenTrail, HeatMap } from '../components/Globe'
import { ConnectButton } from '@mysten/dapp-kit'

function Scene({ dronePos, witnesses, completedTrail, showHeatMap }) {
  const trail = dronePos.trail || []
  
  const heatZones = [
    { position: [1.5, 0.5, 0.5], stake: 0.8 },
    { position: [-1.2, 0.8, -0.3], stake: 0.6 },
    { position: [0.3, -1.5, 1.0], stake: 0.9 },
  ]

  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade />
      
      <Earth />
      
      <Drone position={dronePos.current} trail={trail} />
      
      {witnesses.map((w, i) => (
        <WitnessRing
          key={i}
          position={w.position}
          witnessId={w.id}
          active={w.status === 'verified'}
        />
      ))}
      
      {completedTrail.length > 0 && <GoldenTrail points={completedTrail} />}
      
      {showHeatMap && <HeatMap zones={heatZones} />}
      
      <OrbitControls
        enableZoom={true}
        enablePan={true}
        minDistance={3}
        maxDistance={10}
      />
    </>
  )
}

export default function GlobePage() {
  const [dronePos, setDronePos] = useState({
    current: [2.2, 0.5, 0.3],
    trail: []
  })
  const [witnesses, setWitnesses] = useState([
    { id: 1, position: [2.21, 0.51, 0.31], status: 'pending' },
    { id: 2, position: [2.19, 0.49, 0.29], status: 'pending' },
    { id: 3, position: [2.22, 0.48, 0.32], status: 'pending' }
  ])
  const [completedTrail, setCompletedTrail] = useState([])
  const [showHeatMap, setShowHeatMap] = useState(false)
  const [taskStatus, setTaskStatus] = useState('idle')

  useEffect(() => {
    const interval = setInterval(() => {
      setDronePos(prev => {
        const newPos = [
          prev.current[0] + (Math.random() - 0.5) * 0.02,
          prev.current[1] + (Math.random() - 0.5) * 0.02,
          prev.current[2] + (Math.random() - 0.5) * 0.02
        ]
        const newTrail = [...prev.trail, newPos].slice(-20)
        return { current: newPos, trail: newTrail }
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (taskStatus === 'running') {
      setTimeout(() => {
        setWitnesses(prev => prev.map((w, i) => i === 0 ? { ...w, status: 'verified' } : w))
      }, 2000)
      setTimeout(() => {
        setWitnesses(prev => prev.map((w, i) => i === 1 ? { ...w, status: 'verified' } : w))
      }, 4000)
      setTimeout(() => {
        setWitnesses(prev => prev.map((w, i) => i === 2 ? { ...w, status: 'verified' } : w))
        setTaskStatus('completed')
        setCompletedTrail(dronePos.trail)
      }, 6000)
    }
  }, [taskStatus])

  const startTask = () => {
    setTaskStatus('running')
    setWitnesses(w => w.map(x => ({ ...x, status: 'pending' })))
    setCompletedTrail([])
  }

  const replayTask = () => {
    setDronePos({ current: completedTrail[0] || [2.2, 0.5, 0.3], trail: [] })
    let i = 0
    const replay = setInterval(() => {
      if (i >= completedTrail.length) {
        clearInterval(replay)
        return
      }
      setDronePos({ current: completedTrail[i], trail: completedTrail.slice(0, i) })
      i++
    }, 100)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/80 to-transparent">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-blue-500">
              ProofOfTask 3D
            </h1>
            <p className="text-sm text-gray-400">Live Global Witness Network</p>
          </div>
          <ConnectButton />
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="w-full h-screen">
        <Canvas camera={{ position: [5, 3, 5], fov: 60 }}>
          <Suspense fallback={null}>
            <Scene
              dronePos={dronePos}
              witnesses={witnesses}
              completedTrail={completedTrail}
              showHeatMap={showHeatMap}
            />
          </Suspense>
        </Canvas>
      </div>

      {/* Controls Panel */}
      <div className="absolute bottom-0 left-0 right-0 z-10 p-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-4">
          {/* Status Card */}
          <div className="bg-gray-900/90 backdrop-blur rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold mb-2">Task Status</h3>
            <div className="space-y-2">
              {witnesses.map(w => (
                <div key={w.id} className="flex items-center gap-2 text-sm">
                  <div className={`w-3 h-3 rounded-full ${
                    w.status === 'verified' ? 'bg-green-500' :
                    w.status === 'pending' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`} />
                  <span>Witness {w.id}</span>
                </div>
              ))}
            </div>
            {taskStatus === 'completed' && (
              <div className="mt-3 p-2 bg-green-900/50 rounded text-green-300 text-sm">
                ✓ 10 TASK minted!
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="bg-gray-900/90 backdrop-blur rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold mb-2">Controls</h3>
            <div className="space-y-2">
              <button
                onClick={startTask}
                disabled={taskStatus === 'running'}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-700 px-4 py-2 rounded text-sm"
              >
                {taskStatus === 'running' ? 'Running...' : 'Start Task'}
              </button>
              {completedTrail.length > 0 && (
                <button
                  onClick={replayTask}
                  className="w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm"
                >
                  🔄 Replay Proof
                </button>
              )}
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showHeatMap}
                  onChange={(e) => setShowHeatMap(e.target.checked)}
                  className="rounded"
                />
                Staking Heat-Map
              </label>
            </div>
          </div>

          {/* Witness Radar */}
          <div className="bg-gray-900/90 backdrop-blur rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold mb-2">Witness Radar</h3>
            <div className="space-y-1 text-xs">
              {witnesses.map(w => (
                <div key={w.id} className="flex justify-between">
                  <span>Witness {w.id}</span>
                  <span className="text-gray-400">
                    {(Math.random() * 100 + 50).toFixed(0)}m / -{(Math.random() * 40 + 60).toFixed(0)}dBm
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ZK Proof */}
          <div className="bg-gray-900/90 backdrop-blur rounded-lg p-4 border border-gray-700">
            <h3 className="font-bold mb-2">Nautilus ZK</h3>
            {taskStatus === 'completed' && (
              <div className="text-xs space-y-1 text-green-400">
                <div>✓ Altitude &lt; 120m</div>
                <div>✓ Location verified</div>
                <div>✓ Time sealed</div>
                <div className="text-gray-400 mt-2">Proof: 0xab3f...</div>
              </div>
            )}
            {taskStatus !== 'completed' && (
              <div className="text-xs text-gray-500">
                Waiting for task completion...
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
