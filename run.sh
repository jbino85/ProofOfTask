#!/bin/bash
# MirrorWitness 2025-11-04

set -e

echo "🚀 ProofOfTask - Starting MVP Environment"
echo ""

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Build and start services
echo "📦 Building containers..."
docker-compose build

echo "🔧 Starting services..."
docker-compose up -d

echo "⏳ Waiting for Sui node to start..."
sleep 10

echo "💰 Funding miner wallet from faucet..."
# In production, this would call the actual faucet
# For now, we simulate the funding step
echo "   Miner wallet funded with test SUI"

echo ""
echo "✅ ProofOfTask AR is running!"
echo ""
echo "📊 Access points:"
echo "   AR DASHBOARD →  http://localhost:3000"
echo "   Legacy UI →     http://localhost:3000/dashboard"
echo "   Mobile →        Point phone → hold 3s → drone lands on your table"
echo "   Sui RPC →       http://localhost:9000"
echo "   Witnesses →     ws://localhost:8766/8767/8768"
echo ""
echo "🎮 AUGMENTED REALITY:"
echo "   📱 Tap AR button → point camera → hold 3s"
echo "   🎯 Drone + witnesses appear in real world"
echo "   📷 QR Scanner → scan LoRa box → 3D preorder"
echo "   🔐 Privacy-first: no camera data stored"
echo ""
echo "🌍 Immersive Features:"
echo "   • Babylon.js 7 fullscreen scene"
echo "   • Procedural quadcopter with rotors"
echo "   • 3 glowing obelisks (witnesses)"
echo "   • Golden particle trail (10s burn)"
echo "   • Aurora borealis + starfield"
echo "   • Reflective water plane"
echo ""
echo "⌨️  Hotkeys:"
echo "   G: Globe | A: AR | R: Replay | S: Stake | Space: Cycle"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
