import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface EdithCoreProps {
  isListening: boolean;
  isSpeaking: boolean;
}

export const EdithCore = ({ isListening, isSpeaking }: EdithCoreProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const petalsRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      const scale = isListening ? 1.2 : isSpeaking ? 1.3 : 1;
      groupRef.current.scale.lerp(new THREE.Vector3(scale, scale, scale), 0.1);
    }

    if (petalsRef.current) {
      petalsRef.current.rotation.z = state.clock.getElapsedTime() * 0.2;
      const breathe = Math.sin(state.clock.getElapsedTime() * 2) * 0.1 + 1;
      petalsRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  // Create sunflower petals
  const numPetals = 16;
  const petals = Array.from({ length: numPetals }, (_, i) => ({
    angle: (i * Math.PI * 2) / numPetals,
    index: i,
  }));

  return (
    <group ref={groupRef}>
      {/* Warm dusk background */}
      <mesh position={[0, 0, -5]}>
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial
          color="#ff8c42"
          transparent
          opacity={0.15}
          side={THREE.BackSide}
        />
      </mesh>
      
      <group ref={petalsRef}>
        {/* Petals */}
        {petals.map(({ angle, index }) => {
          const distance = 1.5;
          const x = Math.cos(angle) * distance;
          const y = Math.sin(angle) * distance;
          
          return (
            <group key={index} position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
              <mesh>
                <capsuleGeometry args={[0.2, 0.8, 8, 16]} />
                <meshBasicMaterial 
                  color="#ffd700" 
                  transparent 
                  opacity={0.8} 
                />
              </mesh>
            </group>
          );
        })}

        {/* Inner petals layer */}
        {petals.map(({ angle, index }) => {
          const distance = 1.0;
          const x = Math.cos(angle + Math.PI / numPetals) * distance;
          const y = Math.sin(angle + Math.PI / numPetals) * distance;
          
          return (
            <group key={`inner-${index}`} position={[x, y, 0]} rotation={[0, 0, angle + Math.PI / 2]}>
              <mesh>
                <capsuleGeometry args={[0.15, 0.6, 8, 16]} />
                <meshBasicMaterial 
                  color="#ffed4e" 
                  transparent 
                  opacity={0.7} 
                />
              </mesh>
            </group>
          );
        })}
      </group>

      {/* Center core */}
      <mesh>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshBasicMaterial 
          color="#ff8c00" 
          transparent 
          opacity={isListening ? 0.8 : isSpeaking ? 0.9 : 0.6} 
        />
      </mesh>

      {/* Seeds pattern in center */}
      {Array.from({ length: 50 }).map((_, i) => {
        const radius = Math.sqrt(i / 50) * 0.5;
        const angle = i * 137.5 * (Math.PI / 180);
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <mesh key={i} position={[x, y, 0.2]}>
            <sphereGeometry args={[0.02, 8, 8]} />
            <meshBasicMaterial color="#8b4513" />
          </mesh>
        );
      })}

      {/* Glow */}
      <mesh>
        <sphereGeometry args={[1.2, 32, 32]} />
        <meshBasicMaterial
          color="#ffd700"
          transparent
          opacity={0.1}
          side={THREE.BackSide}
        />
      </mesh>

      {/* Ambient light */}
      <pointLight position={[0, 0, 0]} intensity={1.5} color="#ffd700" />
      <ambientLight intensity={0.3} />
    </group>
  );
};
