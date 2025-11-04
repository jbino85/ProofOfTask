// MirrorWitness AR 2025-11-04

import * as BABYLON from '@babylonjs/core'
import * as GUI from '@babylonjs/gui'

export class HUDManager {
  constructor(scene) {
    this.scene = scene
    this.advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI('UI', true, scene)
    this.autoHideTimer = null
    
    this.createHUD()
    this.createModeIndicator()
    this.setupAutoHide()
  }

  createHUD() {
    // Top HUD - Stats
    const topPanel = new GUI.StackPanel()
    topPanel.width = '100%'
    topPanel.height = '80px'
    topPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP
    topPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    topPanel.isVertical = false
    topPanel.background = 'rgba(0, 0, 0, 0.5)'
    this.advancedTexture.addControl(topPanel)
    
    const stats = [
      { label: 'TASK', value: '12,470', color: '#00ff88' },
      { label: 'SUI', value: '89,234', color: '#4a9eff' },
      { label: 'Witnesses', value: '342', color: '#ff6b6b' }
    ]
    
    stats.forEach(stat => {
      const statPanel = new GUI.StackPanel()
      statPanel.width = '200px'
      statPanel.isVertical = true
      statPanel.paddingTop = '10px'
      
      const label = new GUI.TextBlock()
      label.text = stat.label
      label.color = '#888'
      label.fontSize = 14
      label.height = '20px'
      
      const value = new GUI.TextBlock()
      value.text = stat.value
      value.color = stat.color
      value.fontSize = 24
      value.fontWeight = 'bold'
      value.height = '30px'
      
      statPanel.addControl(label)
      statPanel.addControl(value)
      topPanel.addControl(statPanel)
    })
    
    this.topPanel = topPanel

    // Bottom HUD - Controls
    const bottomPanel = new GUI.StackPanel()
    bottomPanel.width = '100%'
    bottomPanel.height = '100px'
    bottomPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_BOTTOM
    bottomPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    bottomPanel.background = 'rgba(0, 0, 0, 0.6)'
    this.advancedTexture.addControl(bottomPanel)
    
    const controlText = new GUI.TextBlock()
    controlText.text = 'G: Globe | A: AR | R: Replay | S: Stake | Space: Cycle'
    controlText.color = '#aaa'
    controlText.fontSize = 16
    controlText.paddingTop = '10px'
    bottomPanel.addControl(controlText)
    
    const modeText = new GUI.TextBlock()
    modeText.name = 'modeText'
    modeText.text = 'Mode: GLOBE'
    modeText.color = '#00ff88'
    modeText.fontSize = 20
    modeText.fontWeight = 'bold'
    modeText.paddingTop = '10px'
    bottomPanel.addControl(modeText)
    
    this.bottomPanel = bottomPanel
    this.modeText = modeText
  }

  createModeIndicator() {
    // Left panel - Witness status
    const leftPanel = new GUI.StackPanel()
    leftPanel.width = '250px'
    leftPanel.height = '300px'
    leftPanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    leftPanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
    leftPanel.background = 'rgba(0, 0, 0, 0.7)'
    leftPanel.paddingLeft = '20px'
    leftPanel.isVertical = true
    this.advancedTexture.addControl(leftPanel)
    
    const title = new GUI.TextBlock()
    title.text = 'WITNESSES'
    title.color = '#fff'
    title.fontSize = 18
    title.fontWeight = 'bold'
    title.height = '40px'
    leftPanel.addControl(title)
    
    this.witnessIndicators = []
    for (let i = 0; i < 3; i++) {
      const witnessPanel = new GUI.StackPanel()
      witnessPanel.height = '60px'
      witnessPanel.isVertical = false
      witnessPanel.paddingTop = '10px'
      
      const circle = new GUI.Ellipse()
      circle.width = '20px'
      circle.height = '20px'
      circle.color = '#ff0000'
      circle.background = '#660000'
      circle.thickness = 2
      
      const text = new GUI.TextBlock()
      text.text = `Witness ${i + 1}\n⌀ ${(Math.random() * 100 + 50).toFixed(0)}m`
      text.color = '#aaa'
      text.fontSize = 14
      text.width = '150px'
      text.paddingLeft = '10px'
      text.textHorizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT
      
      witnessPanel.addControl(circle)
      witnessPanel.addControl(text)
      leftPanel.addControl(witnessPanel)
      
      this.witnessIndicators.push({ circle, text })
    }
    
    this.leftPanel = leftPanel
  }

  createStakeBoostPanel() {
    const panel = new GUI.Rectangle()
    panel.width = '400px'
    panel.height = '300px'
    panel.cornerRadius = 10
    panel.color = '#00ff88'
    panel.thickness = 2
    panel.background = 'rgba(0, 0, 0, 0.9)'
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    
    const stack = new GUI.StackPanel()
    stack.isVertical = true
    stack.paddingTop = '20px'
    panel.addControl(stack)
    
    const title = new GUI.TextBlock()
    title.text = 'STAKE BOOST'
    title.color = '#00ff88'
    title.fontSize = 24
    title.fontWeight = 'bold'
    title.height = '40px'
    stack.addControl(title)
    
    const slider = new GUI.Slider()
    slider.minimum = 10
    slider.maximum = 10000
    slider.value = 100
    slider.height = '30px'
    slider.width = '300px'
    slider.color = '#00ff88'
    slider.background = '#333'
    slider.paddingTop = '30px'
    
    const valueText = new GUI.TextBlock()
    valueText.text = '100 SUI'
    valueText.color = '#fff'
    valueText.fontSize = 20
    valueText.height = '30px'
    valueText.paddingTop = '10px'
    
    slider.onValueChangedObservable.add((value) => {
      valueText.text = `${Math.floor(value)} SUI`
    })
    
    stack.addControl(slider)
    stack.addControl(valueText)
    
    const button = GUI.Button.CreateSimpleButton('stakeBtn', 'LOCK STAKE')
    button.width = '200px'
    button.height = '50px'
    button.color = '#000'
    button.background = '#00ff88'
    button.paddingTop = '30px'
    button.onPointerClickObservable.add(() => {
      this.advancedTexture.removeControl(panel)
    })
    stack.addControl(button)
    
    this.advancedTexture.addControl(panel)
  }

  createRadarPanel() {
    const panel = new GUI.Rectangle()
    panel.width = '400px'
    panel.height = '400px'
    panel.cornerRadius = 10
    panel.color = '#ff6b6b'
    panel.thickness = 2
    panel.background = 'rgba(0, 0, 0, 0.9)'
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    
    const stack = new GUI.StackPanel()
    stack.isVertical = true
    stack.paddingTop = '20px'
    panel.addControl(stack)
    
    const title = new GUI.TextBlock()
    title.text = 'WITNESS RADAR'
    title.color = '#ff6b6b'
    title.fontSize = 24
    title.fontWeight = 'bold'
    title.height = '40px'
    stack.addControl(title)
    
    const radarCircle = new GUI.Ellipse()
    radarCircle.width = '300px'
    radarCircle.height = '300px'
    radarCircle.color = '#ff6b6b'
    radarCircle.thickness = 2
    radarCircle.paddingTop = '20px'
    stack.addControl(radarCircle)
    
    this.advancedTexture.addControl(panel)
    
    setTimeout(() => {
      this.advancedTexture.removeControl(panel)
    }, 3000)
  }

  setupAutoHide() {
    this.resetAutoHide()
    
    // Reset timer on any interaction
    window.addEventListener('mousemove', () => this.resetAutoHide())
    window.addEventListener('touchstart', () => this.resetAutoHide())
    window.addEventListener('keydown', () => this.resetAutoHide())
  }

  resetAutoHide() {
    this.show()
    
    if (this.autoHideTimer) {
      clearTimeout(this.autoHideTimer)
    }
    
    this.autoHideTimer = setTimeout(() => {
      this.hide()
    }, 3000)
  }

  hide() {
    if (this.bottomPanel) {
      this.bottomPanel.alpha = 0
    }
  }

  show() {
    if (this.bottomPanel) {
      this.bottomPanel.alpha = 1
    }
  }

  updateMode(mode) {
    if (this.modeText) {
      this.modeText.text = `Mode: ${mode.toUpperCase()}`
      this.modeText.color = mode === 'ar' ? '#ff00ff' : mode === 'replay' ? '#ffd700' : '#00ff88'
    }
  }

  verifyWitness(id) {
    if (this.witnessIndicators[id]) {
      this.witnessIndicators[id].circle.background = '#00ff00'
      this.witnessIndicators[id].circle.color = '#00ff88'
      this.witnessIndicators[id].text.color = '#00ff88'
    }
  }

  showNautilusProof() {
    const panel = new GUI.Rectangle()
    panel.width = '350px'
    panel.height = '250px'
    panel.cornerRadius = 10
    panel.color = '#4a9eff'
    panel.thickness = 2
    panel.background = 'rgba(0, 20, 40, 0.95)'
    panel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_CENTER
    panel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER
    
    const stack = new GUI.StackPanel()
    stack.isVertical = true
    stack.paddingTop = '20px'
    panel.addControl(stack)
    
    const title = new GUI.TextBlock()
    title.text = 'NAUTILUS ZK-PROOF'
    title.color = '#4a9eff'
    title.fontSize = 20
    title.fontWeight = 'bold'
    title.height = '30px'
    stack.addControl(title)
    
    const proofs = [
      '✓ Max alt: 117m',
      '✓ Location verified',
      '✓ Time sealed',
      '✓ Witnesses: 3/3'
    ]
    
    proofs.forEach(proof => {
      const text = new GUI.TextBlock()
      text.text = proof
      text.color = '#00ff88'
      text.fontSize = 16
      text.height = '30px'
      text.paddingTop = '5px'
      stack.addControl(text)
    })
    
    const hash = new GUI.TextBlock()
    hash.text = 'Proof: 0xab3f829c4d...'
    hash.color = '#888'
    hash.fontSize = 12
    hash.height = '20px'
    hash.paddingTop = '15px'
    stack.addControl(hash)
    
    this.advancedTexture.addControl(panel)
    
    setTimeout(() => {
      this.advancedTexture.removeControl(panel)
    }, 5000)
  }

  dispose() {
    this.advancedTexture.dispose()
  }
}
