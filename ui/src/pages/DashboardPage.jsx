// MirrorWitness 3D 2025-11-04

import { useState } from 'react'
import { ConnectButton, useCurrentAccount } from '@mysten/dapp-kit'
import { Link } from 'react-router-dom'

function StakeBoost() {
  const [stakeAmount, setStakeAmount] = useState(100)
  const weight = Math.log(stakeAmount + 1) * 10

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Stake Boost</h2>
      <p className="text-sm text-gray-400 mb-4">
        Lock extra SUI to increase witness selection weight
      </p>
      
      <div className="mb-4">
        <div className="flex justify-between mb-2">
          <span className="text-sm">Stake Amount</span>
          <span className="font-bold">{stakeAmount} SUI</span>
        </div>
        <input
          type="range"
          min="10"
          max="10000"
          value={stakeAmount}
          onChange={(e) => setStakeAmount(Number(e.target.value))}
          className="w-full"
        />
      </div>

      <div className="bg-gray-900 rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-400">Selection Weight</span>
          <span className="text-2xl font-bold text-green-400">{weight.toFixed(1)}x</span>
        </div>
        <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-blue-500"
            style={{ width: `${Math.min(weight * 2, 100)}%` }}
          />
        </div>
      </div>

      <button className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 px-4 py-3 rounded-lg font-bold">
        Lock {stakeAmount} SUI
      </button>
    </div>
  )
}

function WitnessRadar() {
  const witnesses = [
    { id: 1, distance: 127, signal: -72, location: 'SF Downtown' },
    { id: 2, distance: 243, signal: -85, location: 'Oakland' },
    { id: 3, distance: 89, signal: -65, location: 'Berkeley' },
    { id: 4, distance: 456, signal: -92, location: 'San Jose' },
  ]

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Witness Radar</h2>
      <p className="text-sm text-gray-400 mb-4">
        Real-time distance & signal strength to nearby witnesses
      </p>

      <div className="space-y-3">
        {witnesses.map(w => (
          <div key={w.id} className="bg-gray-900 rounded-lg p-3">
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-sm">Witness #{w.id}</span>
              <span className="text-xs text-gray-400">{w.location}</span>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-gray-400">📍</span>
                <span>{w.distance}m</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-gray-400">📶</span>
                <span>{w.signal}dBm</span>
              </div>
            </div>
            <div className="mt-2 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${w.signal > -75 ? 'bg-green-500' : w.signal > -85 ? 'bg-yellow-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(100, (100 + w.signal) * 1.5)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReplayProof() {
  const [loading, setLoading] = useState(false)
  const [proof, setProof] = useState(null)

  const fetchProof = async () => {
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 2000))
    setProof({
      cid: '0xab3f829c4d...',
      altitude_max: 118.3,
      distance: 2.4,
      duration: 8,
      witnesses: 3
    })
    setLoading(false)
  }

  return (
    <div className="bg-gray-800 rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Replay Proof</h2>
      <p className="text-sm text-gray-400 mb-4">
        Fetch Walrus blob → decrypt → animate exact telemetry
      </p>

      {!proof && (
        <button
          onClick={fetchProof}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 px-4 py-3 rounded-lg font-bold"
        >
          {loading ? 'Fetching from Walrus...' : 'Fetch Latest Proof'}
        </button>
      )}

      {proof && (
        <div className="space-y-3">
          <div className="bg-gray-900 rounded-lg p-4">
            <div className="text-xs text-gray-400 mb-2">Walrus CID</div>
            <div className="font-mono text-sm">{proof.cid}</div>
          </div>

          <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
            <div className="text-sm font-bold text-green-400 mb-2">
              Nautilus ZK-PROOF Verified ✓
            </div>
            <div className="space-y-1 text-xs">
              <div>• Altitude never exceeded 120m (max: {proof.altitude_max}m)</div>
              <div>• Distance traveled: {proof.distance}km</div>
              <div>• Duration: {proof.duration}s</div>
              <div>• Witnesses: {proof.witnesses}/3</div>
            </div>
          </div>

          <Link
            to="/globe"
            className="block w-full bg-yellow-600 hover:bg-yellow-700 px-4 py-3 rounded-lg font-bold text-center"
          >
            🎬 Watch in 3D Globe
          </Link>

          <button
            onClick={() => setProof(null)}
            className="w-full bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-lg text-sm"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  )
}

function LoRaPreorder() {
  return (
    <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-xl p-6 border border-purple-500">
      <h2 className="text-xl font-bold mb-2">LoRa Witness Node</h2>
      <p className="text-sm text-gray-300 mb-4">
        ESP32-SX1262 pre-flashed with your node key
      </p>

      <div className="bg-black/30 rounded-lg p-4 mb-4">
        <div className="text-3xl font-bold mb-2">$19.99</div>
        <div className="text-xs text-gray-300">
          • 868/915 MHz LoRa radio<br />
          • Pre-configured keypair<br />
          • Plug & earn witness rewards<br />
          • Ships worldwide in 2 weeks
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 flex items-center justify-center mb-4">
        <div className="text-center">
          <div className="text-6xl mb-2">⬜⬛⬜⬛⬜<br />⬛⬜⬛⬜⬛<br />⬜⬛⬜⬛⬜</div>
          <div className="text-xs text-gray-600 font-mono">QR: order.pot.network</div>
        </div>
      </div>

      <button className="w-full bg-white text-purple-900 font-bold px-4 py-3 rounded-lg hover:bg-gray-100">
        Pre-order Now
      </button>
    </div>
  )
}

export default function DashboardPage() {
  const account = useCurrentAccount()

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500">
                ProofOfTask Dashboard
              </span>
            </h1>
            <p className="text-gray-400">Protocol Features & Management</p>
          </div>
          <div className="flex items-center gap-4">
            <Link
              to="/globe"
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-bold"
            >
              🌍 3D Globe
            </Link>
            <ConnectButton />
          </div>
        </div>

        {/* Protocol Features Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <ReplayProof />
          <WitnessRadar />
          <StakeBoost />
          <LoRaPreorder />
        </div>

        {/* Stats Footer */}
        <div className="mt-8 grid md:grid-cols-4 gap-4">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Total Tasks</div>
            <div className="text-3xl font-bold">1,247</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">Active Witnesses</div>
            <div className="text-3xl font-bold">342</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">TASK Minted</div>
            <div className="text-3xl font-bold text-green-400">12,470</div>
          </div>
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-gray-400 text-sm">SUI Staked</div>
            <div className="text-3xl font-bold text-blue-400">89,234</div>
          </div>
        </div>
      </div>
    </div>
  )
}
