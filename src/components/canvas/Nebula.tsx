import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';

export const Nebula: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);
  const { reducedMotion } = useMission();

  // Create nebula cloud clusters
  const clouds = useMemo(() => {
    return [
      {
        pos: [-50, 20, -60] as [number, number, number],
        color: '#7928ca',
        size: 70,
        speed: 0.008,
      },
      {
        pos: [55, -25, -50] as [number, number, number],
        color: '#00f3ff',
        size: 80,
        speed: 0.006,
      },
      {
        pos: [-10, -45, -70] as [number, number, number],
        color: '#ff0080',
        size: 90,
        speed: 0.005,
      },
      {
        pos: [40, 35, 40] as [number, number, number],
        color: '#4361ee',
        size: 65,
        speed: 0.007,
      },
    ];
  }, []);

  useFrame((_, delta) => {
    if (!groupRef.current || reducedMotion) return;
    groupRef.current.rotation.y += delta * 0.008;
    groupRef.current.rotation.z += delta * 0.004;
  });

  return (
    <group ref={groupRef}>
      {clouds.map((cloud, i) => (
        <mesh key={i} position={cloud.pos}>
          <sphereGeometry args={[cloud.size, 16, 16]} />
          <meshBasicMaterial
            color={cloud.color}
            transparent
            opacity={0.07}
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Internal cosmic ambient dust particles */}
      <CosmicDust />
    </group>
  );
};

const CosmicDust: React.FC = () => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 1200;

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const colorA = new THREE.Color('#00f3ff');
    const colorB = new THREE.Color('#9d4edd');

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 160;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 120;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 160;

      const c = Math.random() > 0.5 ? colorA : colorB;
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return [pos, col];
  }, [count]);

  useFrame((state, delta) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y += delta * 0.01;
    // Slow float
    const pos = pointsRef.current.geometry.attributes.position.array as Float32Array;
    const time = state.clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      pos[i * 3 + 1] += Math.sin(time + i) * 0.01;
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={2.2}
        vertexColors
        transparent
        opacity={0.4}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
