import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const EarthObject: React.FC = () => {
  const earthData = DESTINATIONS.find((d) => d.id === 'earth')!;
  const groupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const issRef = useRef<THREE.Group>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'earth';
  const isSelected = activeDestination?.id === 'earth';

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.y += delta * 0.08;
      }
      if (cloudsRef.current) {
        cloudsRef.current.rotation.y += delta * 0.12;
      }
      if (issRef.current) {
        const time = state.clock.getElapsedTime();
        issRef.current.rotation.y = time * 0.4;
        issRef.current.rotation.x = Math.sin(time * 0.2) * 0.2;
      }
    }
  });

  return (
    <group
      position={earthData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(earthData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(earthData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      {/* Main Earth Body */}
      <group ref={groupRef}>
        <mesh>
          <sphereGeometry args={[earthData.scale, 48, 48]} />
          <meshStandardMaterial
            color="#1d4ed8"
            roughness={0.4}
            metalness={0.1}
            emissive="#0369a1"
            emissiveIntensity={isHovered || isSelected ? 0.35 : 0.12}
          />
        </mesh>

        {/* Continents Layer (Greenish terrain patches) */}
        <mesh scale={1.002}>
          <dodecahedronGeometry args={[earthData.scale, 2]} />
          <meshStandardMaterial
            color="#15803d"
            roughness={0.8}
            metalness={0.05}
            transparent
            opacity={0.45}
            wireframe={false}
          />
        </mesh>

        {/* Dynamic Cloud Sphere */}
        <mesh ref={cloudsRef} scale={1.025}>
          <sphereGeometry args={[earthData.scale, 36, 36]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={0.32}
            roughness={1}
            depthWrite={false}
          />
        </mesh>
      </group>

      {/* Atmospheric Fresnel Glow Outer Shell */}
      <mesh scale={1.12}>
        <sphereGeometry args={[earthData.scale, 32, 32]} />
        <meshBasicMaterial
          color="#38bdf8"
          transparent
          opacity={isHovered ? 0.45 : 0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Orbiting Space Station / ISS */}
      <group ref={issRef}>
        <group position={[earthData.scale + 1.2, 0, 0]}>
          <mesh>
            <boxGeometry args={[0.22, 0.08, 0.08]} />
            <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
          </mesh>
          {/* Solar Panels */}
          <mesh position={[0, 0.2, 0]}>
            <boxGeometry args={[0.04, 0.32, 0.14]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[0.04, 0.32, 0.14]} />
            <meshBasicMaterial color="#38bdf8" />
          </mesh>
          {/* Blinking Signal Beacon */}
          <pointLight color="#00f3ff" intensity={1.5} distance={1.8} />
        </group>
      </group>

      {/* Selection Target Ring */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[earthData.scale * 1.35, earthData.scale * 1.38, 48]} />
          <meshBasicMaterial
            color="#00f3ff"
            side={THREE.DoubleSide}
            transparent
            opacity={0.7}
          />
        </mesh>
      )}
    </group>
  );
};
