import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface FridayCoreProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const FridayCore = ({ isListening, isSpeaking }: FridayCoreProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const scale = isListening ? 1.2 : isSpeaking ? 1.3 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (ringsRef.current) {
      ringsRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      ringsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.2;
    }
  });

  // Create multiple rings with strings
  const rings = [];
  const numRings = 8;
  for (let i = 0; i < numRings; i++) {
    const radius = 1 + i * 0.3;
    const offset = (i * Math.PI * 2) / numRings;
    rings.push({ radius, offset, index: i });
  }

  return (
    <group ref={groupRef}>
      <group ref={ringsRef}>
        {rings.map(({ radius, offset, index }) => (
          <group key={index} rotation={[0, offset, 0]}>
            {/* Ring */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <torusGeometry args={[radius, 0.03, 16, 100]} />
              <meshBasicMaterial 
                color="#ff1493" 
                transparent 
                opacity={0.6 - index * 0.05} 
              />
            </mesh>
            
            {/* Connecting strings */}
            {Array.from({ length: 12 }).map((_, j) => {
              const angle = (j * Math.PI * 2) / 12;
              const x = Math.cos(angle) * radius;
              const z = Math.sin(angle) * radius;
              return (
                <mesh key={j} position={[x, 0, z]}>
                  <cylinderGeometry args={[0.01, 0.01, radius * 2, 8]} />
                  <meshBasicMaterial color="#ff69b4" transparent opacity={0.4} />
                </mesh>
              );
            })}
          </group>
        ))}
      </group>

      {/* Central glow */}
      <mesh>
        <sphereGeometry args={[0.8, 32, 32]} />
        <meshBasicMaterial
          color="#ff1493"
          transparent
          opacity={isListening ? 0.3 : isSpeaking ? 0.4 : 0.2}
        />
      </mesh>

      {/* Ambient light */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ff1493" />
      <ambientLight intensity={0.3} />
    </group>
  );
};
