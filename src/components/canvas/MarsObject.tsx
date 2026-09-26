import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const MarsObject: React.FC = () => {
  const marsData = DESTINATIONS.find((d) => d.id === 'mars')!;
  const planetRef = useRef<THREE.Group>(null);
  const probeRef = useRef<THREE.Group>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'mars';
  const isSelected = activeDestination?.id === 'mars';

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (planetRef.current) {
        planetRef.current.rotation.y += delta * 0.06;
      }
      if (probeRef.current) {
        const time = state.clock.getElapsedTime();
        probeRef.current.rotation.y = -time * 0.35;
        probeRef.current.rotation.z = 0.3;
      }
    }
  });

  return (
    <group
      position={marsData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(marsData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(marsData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      {/* Main Mars Body */}
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[marsData.scale, 40, 40]} />
          <meshStandardMaterial
            color="#c2410c"
            roughness={0.9}
            metalness={0.15}
            emissive="#7c2d12"
            emissiveIntensity={isHovered || isSelected ? 0.4 : 0.15}
          />
        </mesh>

        {/* Crater Bump Layer */}
        <mesh scale={1.003}>
          <dodecahedronGeometry args={[marsData.scale, 2]} />
          <meshStandardMaterial
            color="#991b1b"
            roughness={0.95}
            metalness={0.1}
            transparent
            opacity={0.35}
          />
        </mesh>

        {/* North Polar Ice Cap */}
        <mesh position={[0, marsData.scale * 0.95, 0]}>
          <sphereGeometry args={[marsData.scale * 0.32, 16, 16]} />
          <meshStandardMaterial color="#f8fafc" roughness={0.5} />
        </mesh>
      </group>

      {/* Rusty Atmospheric Haze Glow */}
      <mesh scale={1.1}>
        <sphereGeometry args={[marsData.scale, 32, 32]} />
        <meshBasicMaterial
          color="#f97316"
          transparent
          opacity={isHovered ? 0.38 : 0.18}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Exploration Probe */}
      <group ref={probeRef}>
        <group position={[marsData.scale + 1.1, 0, 0]}>
          <mesh>
            <octahedronGeometry args={[0.15, 0]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.1} />
          </mesh>
          <pointLight color="#ffedd5" intensity={1.2} distance={2} />
        </group>
      </group>

      {/* Selection Target Ring */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2.2, 0, 0]}>
          <ringGeometry args={[marsData.scale * 1.35, marsData.scale * 1.38, 48]} />
          <meshBasicMaterial
            color="#ff5533"
            side={THREE.DoubleSide}
            transparent
            opacity={0.75}
          />
        </mesh>
      )}
    </group>
  );
};
