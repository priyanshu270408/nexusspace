import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';

export const Starfield: React.FC = () => {
  const { isWarping, warpFactor, reducedMotion } = useMission();
  const pointsRef = useRef<THREE.Points>(null);

  // Generate 6,000 stars distributed in a 3D sphere
  const count = 6000;
  const [positions, colors, sizes] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const sz = new Float32Array(count);

    const palette = [
      new THREE.Color('#ffffff'), // pure white
      new THREE.Color('#99e6ff'), // blue-white
      new THREE.Color('#00f3ff'), // electric cyan
      new THREE.Color('#e0b0ff'), // soft violet
      new THREE.Color('#ffdfa0'), // warm golden
    ];

    for (let i = 0; i < count; i++) {
      // Spherical distribution around universe center
      const radius = 60 + Math.random() * 220;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);

      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi);

      const color = palette[Math.floor(Math.random() * palette.length)];
      col[i * 3] = color.r;
      col[i * 3 + 1] = color.g;
      col[i * 3 + 2] = color.b;

      sz[i] = 1.2 + Math.random() * 2.4;
    }

    return [pos, col, sz];
  }, [count]);

  // Subtle slow rotation + hyperspace warp streak
  useFrame((_, delta) => {
    if (!pointsRef.current) return;

    if (!reducedMotion) {
      pointsRef.current.rotation.y += delta * 0.015;
      pointsRef.current.rotation.x += delta * 0.005;
    }

    // Warp stretching effect
    const mat = pointsRef.current.material as THREE.PointsMaterial;
    if (mat) {
      const targetSize = isWarping ? 3.5 + warpFactor * 4 : 1.8;
      mat.size = THREE.MathUtils.lerp(mat.size, targetSize, delta * 6);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
        <bufferAttribute
          attach="attributes-color"
          args={[colors, 3]}
        />
        <bufferAttribute
          attach="attributes-size"
          args={[sizes, 1]}
        />
      </bufferGeometry>
      <pointsMaterial
        size={1.8}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
};
