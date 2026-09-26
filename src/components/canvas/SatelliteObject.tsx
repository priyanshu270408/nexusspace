import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const SatelliteObject: React.FC = () => {
  const satData = DESTINATIONS.find((d) => d.id === 'satellite')!;
  const satGroupRef = useRef<THREE.Group>(null);
  const dishRef = useRef<THREE.Group>(null);
  const pulseRing1 = useRef<THREE.Mesh>(null);
  const pulseRing2 = useRef<THREE.Mesh>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'satellite';
  const isSelected = activeDestination?.id === 'satellite';

  useFrame((state, delta) => {
    const time = state.clock.getElapsedTime();

    if (!reducedMotion) {
      if (satGroupRef.current) {
        satGroupRef.current.rotation.y += delta * 0.05;
        satGroupRef.current.position.y = satData.position[1] + Math.sin(time * 1.5) * 0.2;
      }
      if (dishRef.current) {
        dishRef.current.rotation.x = Math.sin(time * 0.4) * 0.15;
      }
    }

    // Expanding radio wave pulse rings
    if (pulseRing1.current) {
      const p1 = (time * 0.8) % 2;
      pulseRing1.current.scale.set(p1 * 2 + 1, p1 * 2 + 1, 1);
      const mat = pulseRing1.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, 1 - p1 / 2) * 0.6;
    }

    if (pulseRing2.current) {
      const p2 = (time * 0.8 + 1) % 2;
      pulseRing2.current.scale.set(p2 * 2 + 1, p2 * 2 + 1, 1);
      const mat = pulseRing2.current.material as THREE.MeshBasicMaterial;
      if (mat) mat.opacity = Math.max(0, 1 - p2 / 2) * 0.6;
    }
  });

  return (
    <group
      position={satData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(satData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(satData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      <group ref={satGroupRef} scale={satData.scale * 0.85}>
        {/* Main Hexagonal Bus Body */}
        <mesh>
          <cylinderGeometry args={[0.7, 0.7, 1.4, 6]} />
          <meshStandardMaterial
            color="#eab308"
            metalness={0.9}
            roughness={0.2}
            emissive="#ca8a04"
            emissiveIntensity={isHovered || isSelected ? 0.4 : 0.15}
          />
        </mesh>

        {/* High-Gain Parabolic Communications Dish */}
        <group ref={dishRef} position={[0, 1.1, 0.4]} rotation={[0.4, 0, 0]}>
          <mesh>
            <sphereGeometry args={[1.1, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2.8]} />
            <meshStandardMaterial
              color="#e2e8f0"
              metalness={0.8}
              roughness={0.2}
              side={THREE.DoubleSide}
            />
          </mesh>
          {/* Feed Horn Struts */}
          <mesh position={[0, 0, 0.6]}>
            <cylinderGeometry args={[0.04, 0.04, 0.9, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          <mesh position={[0, 0, 1.05]}>
            <sphereGeometry args={[0.1, 8, 8]} />
            <meshBasicMaterial color="#06d6a0" />
          </mesh>

          {/* Radio Signal Pulse Rings expanding from Dish */}
          <mesh ref={pulseRing1} position={[0, 0, 1.2]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.5, 0.54, 32]} />
            <meshBasicMaterial
              color="#06d6a0"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          </mesh>
          <mesh ref={pulseRing2} position={[0, 0, 1.2]} rotation={[0, 0, 0]}>
            <ringGeometry args={[0.5, 0.54, 32]} />
            <meshBasicMaterial
              color="#00f3ff"
              side={THREE.DoubleSide}
              transparent
              opacity={0.6}
            />
          </mesh>
        </group>

        {/* Solar Panel Wings */}
        {/* Left Solar Panel */}
        <group position={[-2.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.04, 0.9]} />
            <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh scale={1.01}>
            <boxGeometry args={[2.2, 0.05, 0.9]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>

        {/* Right Solar Panel */}
        <group position={[2.4, 0, 0]}>
          <mesh>
            <boxGeometry args={[2.2, 0.04, 0.9]} />
            <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
          </mesh>
          <mesh scale={1.01}>
            <boxGeometry args={[2.2, 0.05, 0.9]} />
            <meshBasicMaterial color="#38bdf8" wireframe />
          </mesh>
        </group>

        {/* Comms Pulse Light */}
        <pointLight color="#06d6a0" intensity={isHovered || isSelected ? 3 : 1.5} distance={8} />
      </group>

      {/* Target Reticle */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[satData.scale * 1.5, satData.scale * 1.54, 48]} />
          <meshBasicMaterial
            color="#06d6a0"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};
