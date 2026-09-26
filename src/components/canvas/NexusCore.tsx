import React, { useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const satellites = [
  { radius: 11, speed: 0.22, tilt: 0.28, color: '#56e0ff', scale: 0.8 },
  { radius: 15, speed: -0.14, tilt: -0.5, color: '#b78cff', scale: 0.62 },
  { radius: 19, speed: 0.09, tilt: 0.72, color: '#55f2bd', scale: 0.52 },
];

const Satellite = ({ radius, speed, tilt, color, scale }: (typeof satellites)[number]) => {
  const orbitRef = useRef<THREE.Group>(null);
  const bodyRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (orbitRef.current) orbitRef.current.rotation.y += delta * speed;
    if (bodyRef.current) {
      bodyRef.current.rotation.x += delta * 0.5;
      bodyRef.current.rotation.z += delta * 0.35;
      bodyRef.current.position.y = Math.sin(state.clock.elapsedTime * 1.6 + radius) * 0.18;
    }
  });

  return (
    <group ref={orbitRef} rotation={[tilt, 0, tilt * 0.4]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.012, 8, 128]} />
        <meshBasicMaterial color={color} transparent opacity={0.2} />
      </mesh>
      <group ref={bodyRef} position={[radius, 0, 0]} scale={scale}>
        <mesh>
          <boxGeometry args={[1.5, 0.65, 0.85]} />
          <meshStandardMaterial color="#17243a" metalness={0.9} roughness={0.22} emissive={color} emissiveIntensity={0.22} />
        </mesh>
        <mesh position={[-1.25, 0, 0]}>
          <boxGeometry args={[1.4, 0.05, 0.75]} />
          <meshStandardMaterial color={color} metalness={0.6} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[1.25, 0, 0]}>
          <boxGeometry args={[1.4, 0.05, 0.75]} />
          <meshStandardMaterial color={color} metalness={0.6} emissive={color} emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.45, 8]} />
          <meshBasicMaterial color={color} />
        </mesh>
        <pointLight color={color} intensity={1.2} distance={4} />
      </group>
    </group>
  );
};

export const NexusCore: React.FC = () => {
  const coreRef = useRef<THREE.Group>(null);

  useFrame((state, delta) => {
    if (!coreRef.current) return;
    coreRef.current.rotation.y += delta * 0.08;
    coreRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
  });

  return (
    <group>
      <group ref={coreRef}>
        <mesh>
          <icosahedronGeometry args={[3.2, 2]} />
          <meshStandardMaterial color="#0b1730" metalness={0.75} roughness={0.15} emissive="#2563eb" emissiveIntensity={0.7} wireframe />
        </mesh>
        <mesh scale={0.72}>
          <icosahedronGeometry args={[3.2, 2]} />
          <meshStandardMaterial color="#12295b" metalness={0.65} roughness={0.18} emissive="#6d5dfc" emissiveIntensity={0.8} />
        </mesh>
        <pointLight color="#4ddcff" intensity={8} distance={20} />
      </group>
      <Text position={[0, 5.2, 0]} fontSize={1.25} letterSpacing={0.28} color="#f5fbff" anchorX="center" anchorY="middle" outlineWidth={0.025} outlineColor="#204e78">
        NEXUS
      </Text>
      <Text position={[0, 4.1, 0]} fontSize={0.28} letterSpacing={0.42} color="#56e0ff" anchorX="center" anchorY="middle">
        A LIVING DIGITAL SPACE
      </Text>
      {satellites.map((satellite) => <Satellite key={satellite.radius} {...satellite} />)}
    </group>
  );
};

export default NexusCore;
