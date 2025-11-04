# Changelog

# MirrorWitness 3D 2025-11-04

## [0.2.0] - 2025-11-04 - 3D Enhancement

### Added

**3D Visualization:**
- THREE.js + React-Three-Fiber integration
- 3D Globe with rotating Earth sphere
- Live drone sphere (green) following GPS trajectory
- Witness nodes as red pulsing rings at +0.001km offsets
- Golden trail animation on task completion
- Staking heat-map overlay showing SUI concentration
- Replay proof animation with physics simulation
- 60 fps WebGL performance on mobile

**Protocol Features:**
- **Replay Proof**: Fetch Walrus blob, decrypt, and animate exact telemetry
- **Witness Radar**: Real-time distance and signal strength (simulated dBm)
- **Stake Boost**: Slider to lock extra SUI for higher witness selection weight
- **LoRa Pre-order**: Hardware node ordering with QR code ($19.99 ESP32-SX1262)

**Routing:**
- Dashboard page (/) for protocol features
- 3D Globe page (/globe) for live visualization
- React Router integration

**UI Improvements:**
- Tabbed interface for different features
- Stats dashboard with total tasks, witnesses, TASK minted, SUI staked
- Mobile-responsive design
- Nautilus ZK-PROOF stub integration

### Changed
- Replaced 2D canvas with 3D WebGL globe
- Enhanced run.sh script with 3D feature descriptions
- Updated README with comprehensive 3D feature documentation

### Performance
- All 3D assets < 2 MB (procedural geometry)
- WebGL optimized for 60 fps on Android Chrome
- No external 3D models required

---

## [0.1.0] - 2025-11-04 - Initial Release

### Added
- Sui Move smart contract with Ed25519 verification
- Python miner with GPS simulation
- 3 witness nodes with unique Ed25519 keypairs
- React UI with @mysten/dapp-kit
- Docker Compose orchestration
- HMAC-secured communication
- 5-minute task expiry
- 10 TASK token reward on 3-witness consensus
