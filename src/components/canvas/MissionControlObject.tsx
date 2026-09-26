import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const MissionControlObject: React.FC = () => {
  const mcData = DESTINATIONS.find((d) => d.id === 'missioncontrol')!;
  const groupRef = useRef<THREE.Group>(null);
  const radarRef = useRef<THREE.Group>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'missioncontrol';
  const isSelected = activeDestination?.id === 'missioncontrol';

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.05;
        groupRef.current.position.y = mcData.position[1] + Math.sin(state.clock.getElapsedTime() * 1.2) * 0.15;
      }
      if (radarRef.current) {
        radarRef.current.rotation.y += delta * 1.5;
      }
    }
  });

  return (
    <group
      position={mcData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(mcData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(mcData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      <group ref={groupRef} scale={mcData.scale * 0.8}>
        {/* Main Command Outpost Hull */}
        <mesh>
          <octahedronGeometry args={[1.5, 1]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.85}
            roughness={0.25}
            emissive="#0284c7"
            emissiveIntensity={isHovered || isSelected ? 0.5 : 0.15}
          />
        </mesh>

        {/* Command Bridge Observation Band */}
        <mesh scale={1.01}>
          <cylinderGeometry args={[1.2, 1.2, 0.4, 16]} />
          <meshBasicMaterial color="#00f3ff" wireframe />
        </mesh>

        {/* Revolving Radar Scanner on Top Mast */}
        <group ref={radarRef} position={[0, 1.8, 0]}>
          <mesh>
            <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.9} />
          </mesh>
          {/* Radar Curved Grid */}
          <mesh position={[0, 0.4, 0.3]} rotation={[0.3, 0, 0]}>
            <boxGeometry args={[0.8, 0.35, 0.05]} />
            <meshStandardMaterial color="#00f3ff" roughness={0.1} />
          </mesh>
        </group>

        {/* Lower Docking Struts and Bays */}
        <mesh position={[0, -1.6, 0]}>
          <coneGeometry args={[0.9, 0.8, 8]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

        {/* Nav Beacons */}
        <pointLight position={[0, 2.2, 0]} color="#00f3ff" intensity={2} distance={6} />
        <pointLight position={[0, -1.8, 0]} color="#ff0055" intensity={1.5} distance={4} />
      </group>

      {/* Target Reticle */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[mcData.scale * 1.5, mcData.scale * 1.54, 48]} />
          <meshBasicMaterial
            color="#00f3ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};
