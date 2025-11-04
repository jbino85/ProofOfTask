// MirrorWitness 3D 2025-11-04

import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import { Sphere, useTexture } from '@react-three/drei'
import * as THREE from 'three'

export function Earth() {
  const meshRef = useRef()
  
  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.001
    }
  })

  return (
    <Sphere ref={meshRef} args={[2, 64, 64]} position={[0, 0, 0]}>
      <meshStandardMaterial
        color="#1a4d7a"
        roughness={0.7}
        metalness={0.2}
      />
    </Sphere>
  )
}

export function Drone({ position, trail = [] }) {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.position.y += Math.sin(clock.elapsedTime * 2) * 0.002
    }
  })

  const trailPoints = useMemo(() => {
    if (trail.length < 2) return null
    const points = trail.map(p => new THREE.Vector3(p[0], p[1], p[2]))
    return new THREE.CatmullRomCurve3(points).getPoints(50)
  }, [trail])

  return (
    <>
      {/* Drone sphere */}
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#00ff88" emissive="#00ff88" emissiveIntensity={0.5} />
      </mesh>
      
      {/* Glow effect */}
      <mesh position={position}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.3} />
      </mesh>

      {/* Trail */}
      {trailPoints && (
        <line>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={trailPoints.length}
              array={new Float32Array(trailPoints.flatMap(p => [p.x, p.y, p.z]))}
              itemSize={3}
            />
          </bufferGeometry>
          <lineBasicMaterial color="#00ff88" linewidth={2} transparent opacity={0.6} />
        </line>
      )}
    </>
  )
}

export function GoldenTrail({ points }) {
  const trailPoints = useMemo(() => {
    if (points.length < 2) return null
    const pts = points.map(p => new THREE.Vector3(p[0], p[1], p[2]))
    return new THREE.CatmullRomCurve3(pts).getPoints(100)
  }, [points])

  if (!trailPoints) return null

  return (
    <line>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={trailPoints.length}
          array={new Float32Array(trailPoints.flatMap(p => [p.x, p.y, p.z]))}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial color="#ffd700" linewidth={3} />
    </line>
  )
}

export function WitnessRing({ position, witnessId, active = false }) {
  const meshRef = useRef()
  
  useFrame(({ clock }) => {
    if (meshRef.current && active) {
      const scale = 1 + Math.sin(clock.elapsedTime * 3) * 0.1
      meshRef.current.scale.set(scale, scale, scale)
    }
  })

  return (
    <>
      {/* Witness marker */}
      <mesh position={position}>
        <sphereGeometry args={[0.03, 16, 16]} />
        <meshStandardMaterial color={active ? "#ff0000" : "#ff6666"} />
      </mesh>
      
      {/* Pulsing ring */}
      <mesh ref={meshRef} position={position} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.08, 0.1, 32]} />
        <meshBasicMaterial
          color="#ff0000"
          transparent
          opacity={active ? 0.7 : 0.3}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Label */}
      <mesh position={[position[0], position[1] + 0.15, position[2]]}>
        <meshBasicMaterial color="#ffffff" transparent opacity={0.8} />
      </mesh>
    </>
  )
}

export function HeatMap({ zones }) {
  return (
    <>
      {zones.map((zone, i) => (
        <mesh key={i} position={zone.position}>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial
            color={`hsl(${30 - zone.stake * 30}, 100%, 50%)`}
            transparent
            opacity={0.4}
          />
        </mesh>
      ))}
    </>
  )
}
