// MirrorWitness AR 2025-11-04

import * as BABYLON from '@babylonjs/core'
import '@babylonjs/loaders'

export class ProofOfTaskScene {
  constructor(canvas) {
    this.canvas = canvas
    this.engine = new BABYLON.Engine(canvas, true, { preserveDrawingBuffer: true, stencil: true })
    this.scene = new BABYLON.Scene(this.engine)
    this.mode = 'globe' // globe, ar, replay
    
    this.setupScene()
    this.createAssets()
    this.setupControls()
    
    this.engine.runRenderLoop(() => {
      this.scene.render()
    })
    
    window.addEventListener('resize', () => {
      this.engine.resize()
    })
  }

  setupScene() {
    // Camera
    this.camera = new BABYLON.ArcRotateCamera(
      'camera',
      Math.PI / 2,
      Math.PI / 3,
      15,
      BABYLON.Vector3.Zero(),
      this.scene
    )
    this.camera.attachControl(this.canvas, true)
    this.camera.lowerRadiusLimit = 5
    this.camera.upperRadiusLimit = 30
    this.camera.panningSensibility = 0

    // Lights
    const hemi = new BABYLON.HemisphericLight('hemi', new BABYLON.Vector3(0, 1, 0), this.scene)
    hemi.intensity = 0.6
    
    const point = new BABYLON.PointLight('point', new BABYLON.Vector3(10, 10, 10), this.scene)
    point.intensity = 0.8

    // Starry skybox
    this.createStarfield()
    this.createAurora()
  }

  createStarfield() {
    const starfield = BABYLON.MeshBuilder.CreateSphere('starfield', { diameter: 200 }, this.scene)
    const starMat = new BABYLON.StandardMaterial('starMat', this.scene)
    starMat.emissiveColor = new BABYLON.Color3(0.05, 0.05, 0.15)
    starMat.backFaceCulling = false
    
    // Procedural stars
    const positions = starfield.getVerticesData(BABYLON.VertexBuffer.PositionKind)
    const colors = []
    for (let i = 0; i < positions.length / 3; i++) {
      const brightness = Math.random() > 0.95 ? 1 : 0
      colors.push(brightness, brightness, brightness, 1)
    }
    starfield.setVerticesData(BABYLON.VertexBuffer.ColorKind, colors)
    starMat.emissiveColor = BABYLON.Color3.White()
    starfield.material = starMat
  }

  createAurora() {
    // Animated aurora borealis effect
    const aurora = BABYLON.MeshBuilder.CreatePlane('aurora', { width: 50, height: 20 }, this.scene)
    aurora.position.y = 10
    aurora.position.z = -30
    aurora.rotation.x = Math.PI / 6
    
    const auroraMat = new BABYLON.StandardMaterial('auroraMat', this.scene)
    auroraMat.diffuseColor = new BABYLON.Color3(0, 0.8, 0.6)
    auroraMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0.3)
    auroraMat.alpha = 0.3
    aurora.material = auroraMat
    
    this.scene.registerBeforeRender(() => {
      aurora.rotation.z = Math.sin(Date.now() / 2000) * 0.1
      auroraMat.alpha = 0.2 + Math.sin(Date.now() / 1000) * 0.1
    })
  }

  createAssets() {
    // Earth globe
    this.earth = BABYLON.MeshBuilder.CreateSphere('earth', { diameter: 5 }, this.scene)
    const earthMat = new BABYLON.StandardMaterial('earthMat', this.scene)
    earthMat.diffuseColor = new BABYLON.Color3(0.1, 0.3, 0.5)
    earthMat.specularColor = new BABYLON.Color3(0.1, 0.1, 0.1)
    earthMat.emissiveColor = new BABYLON.Color3(0.05, 0.1, 0.15)
    this.earth.material = earthMat
    
    // Rotate earth slowly
    this.scene.registerBeforeRender(() => {
      this.earth.rotation.y += 0.001
    })

    // Reflective water plane
    this.water = BABYLON.MeshBuilder.CreateGround('water', { width: 100, height: 100 }, this.scene)
    this.water.position.y = -3
    const waterMat = new BABYLON.StandardMaterial('waterMat', this.scene)
    waterMat.diffuseColor = new BABYLON.Color3(0.1, 0.2, 0.4)
    waterMat.specularColor = new BABYLON.Color3(0.8, 0.8, 1)
    waterMat.alpha = 0.6
    this.water.material = waterMat

    // Drone (procedural quadcopter)
    this.drone = this.createDrone()
    
    // Witnesses (glowing obelisks)
    this.witnesses = []
    const witnessPositions = [
      new BABYLON.Vector3(5.5, 0, 0.8),
      new BABYLON.Vector3(4.8, 0, -1.2),
      new BABYLON.Vector3(5.8, 0, 0.3)
    ]
    
    witnessPositions.forEach((pos, i) => {
      const witness = this.createWitnessObelisk(pos, i)
      this.witnesses.push(witness)
    })

    // Golden trail (particle system)
    this.goldenTrail = this.createGoldenTrail()
    this.goldenTrail.stop()
  }

  createDrone() {
    // Procedural quadcopter model
    const drone = new BABYLON.TransformNode('drone', this.scene)
    
    // Body
    const body = BABYLON.MeshBuilder.CreateBox('droneBody', { width: 0.3, height: 0.1, depth: 0.3 }, this.scene)
    body.parent = drone
    const bodyMat = new BABYLON.StandardMaterial('bodyMat', this.scene)
    bodyMat.diffuseColor = new BABYLON.Color3(0, 1, 0.5)
    bodyMat.emissiveColor = new BABYLON.Color3(0, 0.5, 0.25)
    body.material = bodyMat
    
    // Rotors
    const rotorPositions = [
      [-0.2, 0.05, -0.2],
      [0.2, 0.05, -0.2],
      [-0.2, 0.05, 0.2],
      [0.2, 0.05, 0.2]
    ]
    
    this.rotors = []
    rotorPositions.forEach(pos => {
      const rotor = BABYLON.MeshBuilder.CreateCylinder('rotor', { 
        diameter: 0.15, 
        height: 0.02 
      }, this.scene)
      rotor.position = new BABYLON.Vector3(...pos)
      rotor.parent = drone
      const rotorMat = new BABYLON.StandardMaterial('rotorMat', this.scene)
      rotorMat.diffuseColor = new BABYLON.Color3(0.2, 0.2, 0.2)
      rotor.material = rotorMat
      this.rotors.push(rotor)
    })
    
    // Glow effect
    const glow = BABYLON.MeshBuilder.CreateSphere('droneGlow', { diameter: 0.5 }, this.scene)
    glow.parent = drone
    const glowMat = new BABYLON.StandardMaterial('glowMat', this.scene)
    glowMat.emissiveColor = new BABYLON.Color3(0, 1, 0.5)
    glowMat.alpha = 0.3
    glow.material = glowMat
    
    drone.position = new BABYLON.Vector3(5.5, 1.2, 0.6)
    
    // Animate rotors and drone hover
    this.scene.registerBeforeRender(() => {
      this.rotors.forEach(rotor => {
        rotor.rotation.y += 0.3
      })
      drone.position.y = 1.2 + Math.sin(Date.now() / 500) * 0.05
    })
    
    return drone
  }

  createWitnessObelisk(position, id) {
    const witness = new BABYLON.TransformNode('witness' + id, this.scene)
    witness.position = position
    
    // Obelisk pillar
    const pillar = BABYLON.MeshBuilder.CreateCylinder('pillar', {
      diameterTop: 0.1,
      diameterBottom: 0.2,
      height: 1.5
    }, this.scene)
    pillar.parent = witness
    pillar.position.y = 0.75
    
    const pillarMat = new BABYLON.StandardMaterial('pillarMat' + id, this.scene)
    pillarMat.diffuseColor = new BABYLON.Color3(1, 0, 0)
    pillarMat.emissiveColor = new BABYLON.Color3(0.5, 0, 0)
    pillar.material = pillarMat
    
    // Pulsing energy ring
    const ring = BABYLON.MeshBuilder.CreateTorus('ring', {
      diameter: 0.6,
      thickness: 0.05,
      tessellation: 32
    }, this.scene)
    ring.parent = witness
    ring.position.y = 1.5
    ring.rotation.x = Math.PI / 2
    
    const ringMat = new BABYLON.StandardMaterial('ringMat' + id, this.scene)
    ringMat.emissiveColor = new BABYLON.Color3(1, 0, 0)
    ringMat.alpha = 0.7
    ring.material = ringMat
    
    // Pulse animation
    this.scene.registerBeforeRender(() => {
      const scale = 1 + Math.sin(Date.now() / 300 + id) * 0.15
      ring.scaling = new BABYLON.Vector3(scale, scale, scale)
      ringMat.alpha = 0.5 + Math.sin(Date.now() / 300 + id) * 0.2
    })
    
    witness.userData = { id, verified: false }
    return witness
  }

  createGoldenTrail() {
    const particleSystem = new BABYLON.ParticleSystem('goldenTrail', 2000, this.scene)
    
    particleSystem.particleTexture = new BABYLON.Texture('', this.scene)
    particleSystem.emitter = this.drone
    
    particleSystem.color1 = new BABYLON.Color4(1, 0.84, 0, 1)
    particleSystem.color2 = new BABYLON.Color4(1, 0.65, 0, 1)
    particleSystem.colorDead = new BABYLON.Color4(1, 0.5, 0, 0)
    
    particleSystem.minSize = 0.05
    particleSystem.maxSize = 0.15
    
    particleSystem.minLifeTime = 8
    particleSystem.maxLifeTime = 10
    
    particleSystem.emitRate = 100
    
    particleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD
    
    particleSystem.gravity = new BABYLON.Vector3(0, -0.1, 0)
    
    particleSystem.direction1 = new BABYLON.Vector3(-0.1, 0, -0.1)
    particleSystem.direction2 = new BABYLON.Vector3(0.1, 0, 0.1)
    
    particleSystem.minEmitPower = 0.2
    particleSystem.maxEmitPower = 0.4
    
    return particleSystem
  }

  setupControls() {
    // Hotkeys
    window.addEventListener('keydown', (e) => {
      switch(e.key.toLowerCase()) {
        case 'g':
          this.switchMode('globe')
          break
        case 'a':
          this.switchMode('ar')
          break
        case 'r':
          this.switchMode('replay')
          break
        case 's':
          this.showStakePanel()
          break
        case ' ':
          this.cycleMode()
          break
      }
    })
  }

  switchMode(mode) {
    this.mode = mode
    console.log('Switched to mode:', mode)
    
    if (mode === 'replay') {
      this.startReplay()
    } else if (mode === 'ar') {
      this.startAR()
    }
  }

  cycleMode() {
    const modes = ['globe', 'ar', 'replay']
    const current = modes.indexOf(this.mode)
    const next = (current + 1) % modes.length
    this.switchMode(modes[next])
  }

  startReplay() {
    this.goldenTrail.start()
    setTimeout(() => {
      this.goldenTrail.stop()
    }, 10000)
  }

  async startAR() {
    if (navigator.xr && await navigator.xr.isSessionSupported('immersive-ar')) {
      console.log('WebXR AR supported')
      // WebXR AR implementation would go here
    } else {
      console.log('WebXR not supported, using 8thwall fallback')
      // 8thwall fallback would go here
    }
  }

  verifyWitness(witnessId) {
    if (this.witnesses[witnessId]) {
      this.witnesses[witnessId].userData.verified = true
      const pillar = this.witnesses[witnessId].getChildMeshes()[0]
      pillar.material.emissiveColor = new BABYLON.Color3(0, 1, 0)
    }
  }

  showStakePanel() {
    console.log('Show stake panel')
  }

  dispose() {
    this.scene.dispose()
    this.engine.dispose()
  }
}
