# ProofOfTask

# MirrorWitness 2025-11-04

> **"Proof-of-Task turns any phone into a paid delivery witness — 3 green checks = 10 TASK minted"**

## ⚠️ MVP ONLY — NOT PRODUCTION

**This is a demonstration MVP running on localhost.** The witness nodes are simulated and run on the same machine. This is **NOT suitable for production use.**

### What This MVP Demonstrates

- ✅ Sui Move smart contract with Ed25519 signature verification
- ✅ Task staking with SHA3-256 payload hashing
- ✅ Walrus CID storage and commitment
- ✅ 3-witness consensus mechanism
- ✅ Automatic TASK token minting on verification
- ✅ Real-time UI with drone visualization
- ✅ HMAC-secured witness communication

### What's Missing for Production

- ❌ Real GPS hardware integration
- ❌ LoRa mesh networking between witnesses
- ❌ Nautilus ZK proofs for privacy
- ❌ Distributed witness network (currently localhost)
- ❌ Sybil resistance mechanisms
- ❌ Economic security model
- ❌ Production Walrus integration

**See [SECURITY.md](./SECURITY.md) for detailed security considerations.**

---

## Architecture

### 1. Move Smart Contract (`move/sources/proof_of_task.move`)

The core Sui Move contract implements:

```move
public struct Task {
    id: UID,
    staker: address,
    payload: vector<u8>,
    payload_hash: vector<u8>,
    walrus_cid: vector<u8>,
    witness_pubkeys: vector<vector<u8>>,
    witness_sigs: vector<vector<u8>>,
    expires: u64,
}
```

**Key Functions:**

- `stake_task(payload, walrus_cid, clock)` - Create new task with 5-minute expiry
- `witness_task(task, pubkey, sig, treasury, clock)` - Verify and sign task
  - Validates SHA3-256(payload) matches stored hash
  - Verifies Ed25519 signature
  - Prevents duplicate witnesses
  - Mints 10 TASK tokens when 3 witnesses confirm
- `commit_blob_cid(task, cid)` - Update Walrus CID

### 2. Python Miner (`python/miner.py`)

Simulates a delivery drone:

- Generates fake GPS data every 1 second
- Seals data with 5-minute validity window
- Uploads to Walrus (simulated)
- Broadcasts task to witnesses via WebSocket
- Includes HMAC authentication on all messages

### 3. Witness Nodes (`python/witness1.py`, `witness2.py`, `witness3.py`)

Each witness:

- Generates unique Ed25519 keypair on first run (stored in `~/.pot/witness_N.key`)
- Listens on dedicated WebSocket port (8766, 8767, 8768)
- Verifies HMAC on incoming tasks
- Decodes and re-hashes payload
- Signs payload with Ed25519
- Adds fake GPS offset (simulates different physical locations)
- Returns signature to contract

### 4. Immersive AR Dashboard (`ui/`)

Built with Babylon.js 7, React, Tailwind CSS, and `@mysten/dapp-kit`:

## **AUGMENTED REALITY PROOF-OF-TASK**

**Fullscreen Babylon.js Scene:**
- **Skybox** - Real-time starry night + aurora borealis animation
- **Earth Globe** - Rotating sphere with auto-spin
- **Procedural Drone** - Quadcopter with spinning rotors (green glow)
- **Witness Obelisks** - 3 glowing pillars with pulsing energy rings
- **Reflective Water** - Ground plane with specular highlights
- **Golden Trail** - Particle ribbon that burns out after 10 seconds

**AR Mode (Mobile):**
- **WebXR + 8thwall Fallback** - Point phone at flat surface
- **Hold 3 seconds** - Drone lands on your desk/table
- **Witnesses appear** - Floating holograms in real world
- **QR Scanner** - Point at LoRa box → 3D model pops up + pre-order button
- **Privacy-first** - No camera data stored, session ends on disconnect

**Immersive UI (Babylon GUI):**
- **HUD Overlay** - TASK: 12,470 | SUI: 89,234 | Witnesses: 342
- **Auto-hide** - Bottom controls fade after 3 seconds
- **Hotkeys** - G: Globe | A: AR | R: Replay | S: Stake | Space: Cycle
- **Witness Radar** - 3D radar dish spins, beams lock onto witnesses
- **Stake Boost** - Drag SUI coin into glowing obelisk, weight bar fills
- **Nautilus ZK** - Floating crystal shows "Max alt: 117m ✓"
- **Replay Proof** - Babylon animation replays exact GPS from Walrus blob

**Mobile-First:**
- Touch: pinch to zoom, drag to rotate, double-tap boost
- 60 FPS on Android Chrome (Babylon.js + WebGL2)
- All assets < 1.2 MB (procedural + compressed GLB)
- QR scanner built-in for LoRa hardware pre-order

### 5. Docker Compose

Full stack orchestration:

- `sui-node` - Local Sui node with faucet
- `witness1/2/3` - Three independent witness containers
- `miner` - Drone simulator and task broadcaster
- `ui` - React frontend on port 3000

---

## Quick Start

### Prerequisites

- Docker & Docker Compose
- 4GB+ RAM
- Ports 3000, 8766-8768, 9000 available

### Installation

```bash
# Clone or extract the repository
cd ProofOfTask

# Run the setup script
./run.sh
```

This will:

1. Build all Docker containers
2. Start Sui local node with faucet
3. Start 3 witness nodes
4. Start miner
5. Start UI server
6. Fund miner wallet

### Access

- **AR Dashboard**: http://localhost:3000
- **Legacy Dashboard**: http://localhost:3000/dashboard
- **Mobile**: Point phone → hold 3s → drone lands on your table
- **Sui RPC**: http://localhost:9000
- **Witnesses**: ws://localhost:8766, ws://localhost:8767, ws://localhost:8768

### Usage

**Immersive AR Experience:**
1. Open http://localhost:3000 (fullscreen Babylon.js scene)
2. **Desktop**: Drag to rotate, scroll to zoom, use hotkeys
3. **Mobile**: Pinch/drag to navigate, tap AR button
4. Auto-simulation: 3 witnesses verify over 8 seconds → golden trail appears

**Hotkeys:**
- `G` - Globe mode (default)
- `A` - AR mode (WebXR on mobile)
- `R` - Replay proof animation
- `S` - Show stake boost panel
- `Space` - Cycle modes

**AR Mode (Mobile Only):**
1. Tap 📱 AR button in top-right
2. Point camera at flat surface (floor/table)
3. Hold phone steady for 3 seconds
4. Drone and witnesses appear in real world
5. Watch live delivery proof in AR

**QR Scanner:**
1. Tap 📷 QR button
2. Point at LoRa box QR code
3. 3D model overlay appears
4. Tap "Pre-order" → $19.99 ESP32-SX1262 ships in 2 weeks

**Protocol Features (Floating Panels):**
- 💰 **Stake Boost**: Slider to lock SUI (10-10,000) for higher witness weight
- 📡 **Witness Radar**: Live distance & signal strength to 3 witnesses
- 🔄 **Replay Proof**: Fetch Walrus blob → animate exact telemetry
- 🔮 **Nautilus ZK**: Crystal displays "Max alt: 117m ✓"

### View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f miner
docker-compose logs -f witness1
```

### Stop Services

```bash
docker-compose down
```

---

## Development

### Deploy Move Contract Locally

```bash
cd move
sui client publish --gas-budget 100000000
```

### Run Miner Standalone

```bash
cd python
pip install -r requirements.txt
python miner.py
```

### Run Witness Standalone

```bash
python witness1.py  # Port 8766
python witness2.py  # Port 8767
python witness3.py  # Port 8768
```

### Run UI Development Server

```bash
cd ui
npm install
npm run dev
```

---

## Project Structure

```
ProofOfTask/
├── move/
│   ├── Move.toml
│   └── sources/
│       └── proof_of_task.move       # Sui smart contract
├── python/
│   ├── miner.py                     # Drone simulator & task broadcaster
│   ├── witness1.py                  # Witness node 1
│   ├── witness2.py                  # Witness node 2
│   ├── witness3.py                  # Witness node 3
│   ├── requirements.txt
│   ├── Dockerfile.miner
│   └── Dockerfile.witness
├── ui/
│   ├── src/
│   │   ├── App.jsx                  # Main React component
│   │   ├── main.jsx                 # Entry point
│   │   └── index.css                # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml               # Orchestration
├── run.sh                           # Setup script
├── README.md                        # This file
└── SECURITY.md                      # Security considerations
```

---

## Phase 2 Roadmap

The next phase will transform this MVP into a production-ready system:

### Hardware Integration

- [ ] Real GPS module integration (u-blox, etc.)
- [ ] LoRa radio for mesh networking
- [ ] Secure element for key storage
- [ ] Battery optimization

### Cryptography & Privacy

- [ ] Nautilus ZK proofs for location privacy
- [ ] BLS signature aggregation for efficiency
- [ ] Threshold signatures for witness coordination

### Network & Economics

- [ ] Distributed witness discovery (Kademlia DHT)
- [ ] Stake-weighted witness selection
- [ ] Slashing for dishonest witnesses
- [ ] Dynamic reward curves based on task difficulty

### Production Infrastructure

- [ ] Real Walrus blob storage integration
- [ ] Sui Mainnet deployment
- [ ] Mobile apps (iOS/Android)
- [ ] Witness reputation system

---

## Contributing

This is an MVP demonstration. For production development, please contact the maintainers first.

## License

MIT

## Support

For Sui grant inquiries or technical questions:

- GitHub Issues: [Your Repo URL]
- Discord: [Your Discord]
- Email: [Your Email]

---

**Built for Sui Grant Program 2025** 🚀
