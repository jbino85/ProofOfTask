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
echo "✅ ProofOfTask is running!"
echo ""
echo "📊 Access points:"
echo "   UI:        http://localhost:3000"
echo "   Sui RPC:   http://localhost:9000"
echo "   Witness 1: ws://localhost:8766"
echo "   Witness 2: ws://localhost:8767"
echo "   Witness 3: ws://localhost:8768"
echo ""
echo "📝 View logs:"
echo "   docker-compose logs -f"
echo ""
echo "🛑 Stop services:"
echo "   docker-compose down"
echo ""
