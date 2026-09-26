import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const BlackHoleObject: React.FC = () => {
  const blackholeData = DESTINATIONS.find((d) => d.id === 'blackhole')!;
  const diskRef = useRef<THREE.Mesh>(null);
  const outerDiskRef = useRef<THREE.Mesh>(null);
  const photonRingRef = useRef<THREE.Mesh>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'blackhole';
  const isSelected = activeDestination?.id === 'blackhole';

  useFrame((_, delta) => {
    if (!reducedMotion) {
      if (diskRef.current) {
        diskRef.current.rotation.z += delta * 0.45;
      }
      if (outerDiskRef.current) {
        outerDiskRef.current.rotation.z += delta * 0.25;
      }
      if (photonRingRef.current) {
        photonRingRef.current.rotation.y += delta * 0.1;
      }
    }
  });

  return (
    <group
      position={blackholeData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(blackholeData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(blackholeData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      {/* Event Horizon (Pure Black Void Sphere) */}
      <mesh>
        <sphereGeometry args={[blackholeData.scale * 0.85, 48, 48]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Relativistic Photon Sphere Glow (Bright thin ring) */}
      <mesh ref={photonRingRef} scale={1.04}>
        <sphereGeometry args={[blackholeData.scale * 0.85, 32, 32]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={isHovered || isSelected ? 0.75 : 0.45}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Inner Swirling Accretion Disk */}
      <mesh ref={diskRef} rotation={[Math.PI / 2.3, 0.25, 0]}>
        <ringGeometry
          args={[blackholeData.scale * 0.95, blackholeData.scale * 2.2, 64]}
        />
        <meshBasicMaterial
          color="#f72585"
          side={THREE.DoubleSide}
          transparent
          opacity={isHovered || isSelected ? 0.9 : 0.65}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Outer Accretion Plasma Flare (Cyan/Violet) */}
      <mesh ref={outerDiskRef} rotation={[Math.PI / 2.3, 0.25, 0]}>
        <ringGeometry
          args={[blackholeData.scale * 1.8, blackholeData.scale * 3.4, 64]}
        />
        <meshBasicMaterial
          color="#4cc9f0"
          side={THREE.DoubleSide}
          transparent
          opacity={isHovered || isSelected ? 0.45 : 0.25}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Gravitational Singularity Core Glow */}
      <pointLight
        color="#f72585"
        intensity={isHovered || isSelected ? 4 : 2}
        distance={15}
      />

      {/* Selection Target Ring */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry
            args={[blackholeData.scale * 3.5, blackholeData.scale * 3.56, 48]}
          />
          <meshBasicMaterial
            color="#f72585"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};
