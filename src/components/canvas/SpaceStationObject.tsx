import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';
import { DESTINATIONS } from '../../data/spaceData';

export const SpaceStationObject: React.FC = () => {
  const stationData = DESTINATIONS.find((d) => d.id === 'station')!;
  const stationGroupRef = useRef<THREE.Group>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const solarPanelRef = useRef<THREE.Group>(null);

  const { selectDestination, setHoveredDestination, hoveredDestination, activeDestination, reducedMotion } = useMission();
  const isHovered = hoveredDestination?.id === 'station';
  const isSelected = activeDestination?.id === 'station';

  useFrame((state, delta) => {
    if (!reducedMotion) {
      // Station slow drift
      if (stationGroupRef.current) {
        stationGroupRef.current.rotation.y += delta * 0.04;
      }
      // Torus ring centrifugal rotation
      if (ringRef.current) {
        ringRef.current.rotation.z += delta * 0.35;
      }
      // Solar panel alignment tracking
      if (solarPanelRef.current) {
        solarPanelRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.2;
      }
    }
  });

  return (
    <group
      position={stationData.position}
      onClick={(e) => {
        e.stopPropagation();
        selectDestination(stationData);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        document.body.style.cursor = 'pointer';
        setHoveredDestination(stationData);
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto';
        setHoveredDestination(null);
      }}
    >
      <group ref={stationGroupRef} scale={stationData.scale * 0.7}>
        {/* Central Core Spindle */}
        <mesh position={[0, 0, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 4.2, 16]} />
          <meshStandardMaterial
            color="#334155"
            metalness={0.9}
            roughness={0.25}
          />
        </mesh>

        {/* Command Habitat Module (Upper Cap) */}
        <mesh position={[0, 2.3, 0]}>
          <sphereGeometry args={[0.9, 16, 16]} />
          <meshStandardMaterial
            color="#475569"
            metalness={0.8}
            roughness={0.3}
            emissive="#0284c7"
            emissiveIntensity={isHovered || isSelected ? 0.6 : 0.2}
          />
        </mesh>

        {/* Observation Cupola Windows */}
        <mesh position={[0, 2.6, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.4, 12]} />
          <meshBasicMaterial color="#00f3ff" />
        </mesh>

        {/* Rotating Toroidal Habitat Ring */}
        <mesh ref={ringRef} position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.8, 0.42, 16, 32]} />
          <meshStandardMaterial
            color="#e2e8f0"
            metalness={0.7}
            roughness={0.3}
            wireframe={false}
          />
        </mesh>

        {/* Spokes connecting Central Spindle to Torus Ring */}
        {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, i) => (
          <mesh key={i} rotation={[0, 0, angle]}>
            <cylinderGeometry args={[0.1, 0.1, 5.4, 8]} />
            <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
          </mesh>
        ))}

        {/* Solar Array Wings */}
        <group ref={solarPanelRef}>
          {/* Left Solar Wing */}
          <group position={[-3.2, 0, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 0.05, 1.2]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0]} scale={1.01}>
              <boxGeometry args={[2.4, 0.06, 1.2]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>

          {/* Right Solar Wing */}
          <group position={[3.2, 0, 0]}>
            <mesh>
              <boxGeometry args={[2.4, 0.05, 1.2]} />
              <meshStandardMaterial color="#0284c7" metalness={0.95} roughness={0.1} />
            </mesh>
            <mesh position={[0, 0, 0]} scale={1.01}>
              <boxGeometry args={[2.4, 0.06, 1.2]} />
              <meshBasicMaterial color="#38bdf8" wireframe />
            </mesh>
          </group>
        </group>

        {/* Docking Bay Ring at Lower Spindle */}
        <mesh position={[0, -2.1, 0]}>
          <cylinderGeometry args={[0.7, 0.5, 0.6, 12]} />
          <meshStandardMaterial color="#1e293b" metalness={0.9} />
        </mesh>

        {/* Station Navigation Lights */}
        <pointLight position={[0, 3, 0]} color="#00f3ff" intensity={2} distance={6} />
        <pointLight position={[0, -2.8, 0]} color="#ff0055" intensity={1.5} distance={4} />
      </group>

      {/* Target Engagement Reticle */}
      {(isHovered || isSelected) && (
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <ringGeometry args={[stationData.scale * 1.5, stationData.scale * 1.55, 48]} />
          <meshBasicMaterial
            color="#38bdf8"
            side={THREE.DoubleSide}
            transparent
            opacity={0.8}
          />
        </mesh>
      )}
    </group>
  );
};
