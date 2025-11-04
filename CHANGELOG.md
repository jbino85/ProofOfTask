# Changelog

# MirrorWitness AR 2025-11-04

## [0.3.0] - 2025-11-04 - AR + Babylon.js Immersive

### Added

**Augmented Reality:**
- WebXR AR mode with immersive-ar session support
- 8thwall fallback for devices without WebXR
- Point phone → hold 3s → drone lands on desk/table
- Witnesses appear as floating holograms in real world
- QR scanner for LoRa box → 3D model overlay + pre-order
- Privacy-first: no camera data stored, session ends on disconnect

**Babylon.js 7 Fullscreen Scene:**
- Replaced React-Three-Fiber with Babylon.js
- Starry night skybox with procedural stars
- Animated aurora borealis effect
- Reflective water ground plane
- Procedural quadcopter drone with spinning rotors
- 3 glowing obelisks (witnesses) with pulsing energy rings
- Golden particle trail that burns out after 10 seconds

**Immersive UI (Babylon GUI):**
- HUD overlay: TASK/SUI/Witnesses stats
- Auto-hide bottom panel after 3 seconds
- Hotkeys: G=Globe, A=AR, R=Replay, S=Stake, Space=Cycle
- Floating panels for Stake Boost, Witness Radar, Nautilus ZK
- All UI in-engine (no HTML clutter)

**Mobile-First:**
- Touch controls: pinch zoom, drag rotate
- 60 FPS on Android Chrome (WebGL2)
- QR scanner built-in (html5-qrcode)
- All assets < 1.2 MB (procedural + compressed GLB)

**Protocol Integration:**
- Stake Boost panel: slider 10-10,000 SUI
- Witness Radar: 3D spinning dish with beam locks
- Replay Proof: Babylon animation from Walrus blob
- Nautilus ZK: Floating crystal "Max alt: 117m ✓"

### Changed
- Main route (/) now shows immersive Babylon.js scene
- Dashboard moved to /dashboard (legacy)
- Removed /globe route
- Removed React-Three-Fiber dependencies
- Updated run.sh with AR instructions

### Performance
- GLB models < 1.2 MB
- 60 FPS target on mobile
- WebGL2 optimizations
- Procedural geometry for most assets

---

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
