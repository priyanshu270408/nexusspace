import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';

export const AsteroidBelt: React.FC = () => {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { reducedMotion } = useMission();

  const count = 350;
  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Pre-generate asteroid orbital data
  const asteroids = useMemo(() => {
    const data = [];
    const minRadius = 42;
    const maxRadius = 54;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2 + (Math.random() - 0.5) * 0.3;
      const radius = minRadius + Math.random() * (maxRadius - minRadius);
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const y = (Math.random() - 0.5) * 6;

      const scale = 0.2 + Math.random() * 0.7;
      const rotSpeedX = (Math.random() - 0.5) * 1.5;
      const rotSpeedY = (Math.random() - 0.5) * 1.5;
      const rotSpeedZ = (Math.random() - 0.5) * 1.5;

      data.push({ x, y, z, scale, rotSpeedX, rotSpeedY, rotSpeedZ, angle, radius });
    }
    return data;
  }, [count]);

  // Initial matrix placement
  useMemo(() => {
    if (!meshRef.current) return;
    asteroids.forEach((ast, i) => {
      dummy.position.set(ast.x, ast.y, ast.z);
      dummy.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      dummy.scale.set(ast.scale, ast.scale * (0.8 + Math.random() * 0.4), ast.scale);
      dummy.updateMatrix();
      meshRef.current?.setMatrixAt(i, dummy.matrix);
    });
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [asteroids, dummy]);

  // Orbit rotation
  useFrame((_, delta) => {
    if (!meshRef.current || reducedMotion) return;
    meshRef.current.rotation.y += delta * 0.02;
  });

  return (
    <instancedMesh
      ref={meshRef}
      args={[undefined, undefined, count]}
      castShadow
      receiveShadow
    >
      <dodecahedronGeometry args={[1, 1]} />
      <meshStandardMaterial
        color="#5c6370"
        roughness={0.88}
        metalness={0.2}
        flatShading
      />
    </instancedMesh>
  );
};
