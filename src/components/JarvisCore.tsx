import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface JarvisCoreProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const JarvisCore = ({ isListening, isSpeaking }: JarvisCoreProps) => {
  const sphereRef = useRef<THREE.Mesh>(null);
  const particlesRef = useRef<THREE.Points>(null);

  useFrame((state) => {
    if (sphereRef.current) {
      sphereRef.current.rotation.x = state.clock.getElapsedTime() * 0.1;
      sphereRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      
      const scale = isListening ? 1.2 : isSpeaking ? 1.3 : 1;
      sphereRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.getElapsedTime() * 0.05;
    }
  });

  // Create particles
  const particleCount = 1000;
  const positions = new Float32Array(particleCount * 3);
  
  for (let i = 0; i < particleCount; i++) {
    const radius = 3 + Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
  }

  return (
    <group>
      {/* Main sphere */}
      <Sphere ref={sphereRef} args={[1, 64, 64]}>
        <MeshDistortMaterial
          color="#00d9ff"
          attach="material"
          distort={isListening ? 0.6 : isSpeaking ? 0.8 : 0.4}
          speed={2}
          roughness={0.2}
          metalness={0.8}
          emissive="#00d9ff"
          emissiveIntensity={isListening ? 0.5 : isSpeaking ? 0.7 : 0.3}
        />
      </Sphere>

      {/* Particle system */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={particleCount}
            array={positions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.02}
          color="#00ffea"
          transparent
          opacity={0.6}
          sizeAttenuation
        />
      </points>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2, 0.02, 16, 100]} />
        <meshBasicMaterial color="#00d9ff" transparent opacity={0.4} />
      </mesh>

      {/* Inner glow */}
      <Sphere args={[1.1, 32, 32]}>
        <meshBasicMaterial
          color="#00d9ff"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Ambient light */}
      <pointLight position={[0, 0, 0]} intensity={1} color="#00d9ff" />
      <ambientLight intensity={0.2} />
    </group>
  );
};
