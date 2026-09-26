import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const AlienPlanetObject: React.FC = () => {
  const alienData = DESTINATIONS.find((d) => d.id === 'alien')!;
  const planetRef = useRef<THREE.Group>(null);
  const ringsRef = useRef<THREE.Mesh>(null);
  const crystalSpireGroup = useRef<THREE.Group>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'alien';
  const isSelected = activeDestination?.id === 'alien';

  useFrame((state, delta) => {
    if (!reducedMotion) {
      if (planetRef.current) {
        planetRef.current.rotation.y += delta * 0.05;
      }
      if (ringsRef.current) {
        ringsRef.current.rotation.z += delta * 0.04;
      }
      if (crystalSpireGroup.current) {
        crystalSpireGroup.current.rotation.y -= delta * 0.03;
      }
    }

    // Glowing pulsation
    const time = state.clock.getElapsedTime();
    if (ringsRef.current) {
      const mat = ringsRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = (isHovered || isSelected ? 0.75 : 0.5) + Math.sin(time * 2.5) * 0.1;
      }
    }
  });

  return (
    <group
      position={alienData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(alienData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(alienData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      {/* Bioluminescent Exotic Body */}
      <group ref={planetRef}>
        <mesh>
          <sphereGeometry args={[alienData.scale, 40, 40]} />
          <meshStandardMaterial
            color="#4a044e"
            roughness={0.3}
            metalness={0.4}
            emissive="#a21caf"
            emissiveIntensity={isHovered || isSelected ? 0.6 : 0.25}
          />
        </mesh>

        {/* Exotic Surface Veins / Bioluminescent Crystal Ridges */}
        <mesh scale={1.004}>
          <icosahedronGeometry args={[alienData.scale, 2]} />
          <meshStandardMaterial
            color="#ec4899"
            roughness={0.2}
            metalness={0.8}
            wireframe
            transparent
            opacity={0.35}
          />
        </mesh>
      </group>

      {/* Floating Bioluminescent Crystal Spires */}
      <group ref={crystalSpireGroup}>
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const dist = alienData.scale + 0.8;
          return (
            <mesh
              key={i}
              position={[Math.cos(angle) * dist, Math.sin(angle * 2) * 0.4, Math.sin(angle) * dist]}
              rotation={[Math.PI / 4, angle, 0]}
            >
              <octahedronGeometry args={[0.25, 0]} />
              <meshBasicMaterial color="#f43f5e" />
            </mesh>
          );
        })}
      </group>

      {/* Glowing Crystalline Saturn-like Rings */}
      <mesh ref={ringsRef} rotation={[Math.PI / 2.6, 0.4, 0]}>
        <ringGeometry args={[alienData.scale * 1.4, alienData.scale * 2.2, 64]} />
        <meshBasicMaterial
          color="#d946ef"
          side={THREE.DoubleSide}
          transparent
          opacity={0.55}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Atmospheric Aurora Halo */}
      <mesh scale={1.16}>
        <sphereGeometry args={[alienData.scale, 32, 32]} />
        <meshBasicMaterial
          color="#c084fc"
          transparent
          opacity={isHovered ? 0.45 : 0.22}
          side={THREE.BackSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>

      {/* Light Source */}
      <pointLight color="#d946ef" intensity={isHovered || isSelected ? 3.5 : 2} distance={12} />

      {/* Selection Target Ring */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[alienData.scale * 2.4, alienData.scale * 2.45, 48]} />
          <meshBasicMaterial
            color="#f43f5e"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};
