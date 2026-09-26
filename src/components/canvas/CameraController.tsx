import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { OrbitControls as DreiOrbitControls } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';

export const CameraController: React.FC = () => {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { activeDestination, isWarping, warpFactor, reducedMotion } = useMission();

  // Target vectors
  const currentLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetLookAt = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, 0));
  const targetCamPos = useRef<THREE.Vector3>(new THREE.Vector3(0, 18, 62));

  // Base camera FOV
  const defaultFov = 58;

  // Whenever activeDestination changes, set the target camera and lookAt positions
  useEffect(() => {
    if (activeDestination) {
      const destPos = new THREE.Vector3(...activeDestination.position);
      const offset = new THREE.Vector3(...activeDestination.cameraOffset);
      targetCamPos.current.copy(destPos).add(offset);
      targetLookAt.current.copy(destPos);
    } else {
      // Cosmic Overview Position
      targetCamPos.current.set(0, 16, 60);
      targetLookAt.current.set(0, 0, 0);
    }
  }, [activeDestination]);

  useFrame((_, delta) => {
    const lerpSpeed = reducedMotion ? 20 : isWarping ? 3.5 : 2.5;

    // Smooth camera translation
    camera.position.lerp(targetCamPos.current, delta * lerpSpeed);

    // Smooth look-at interpolation
    currentLookAt.current.lerp(targetLookAt.current, delta * (lerpSpeed * 1.2));

    if (controlsRef.current) {
      controlsRef.current.target.copy(currentLookAt.current);
      controlsRef.current.update();
    } else {
      camera.lookAt(currentLookAt.current);
    }

    // Dynamic FOV stretch during warp
    if (camera instanceof THREE.PerspectiveCamera) {
      const targetFov = isWarping ? defaultFov + warpFactor * 18 : defaultFov;
      camera.fov = THREE.MathUtils.lerp(camera.fov, targetFov, delta * 5);
      camera.updateProjectionMatrix();
    }
  });

  return (
    <DreiOrbitControls
      ref={controlsRef}
      enablePan={false}
      enableZoom={!activeDestination}
      minDistance={15}
      maxDistance={120}
      maxPolarAngle={Math.PI / 1.7}
      minPolarAngle={Math.PI / 3.5}
      rotateSpeed={0.5}
      dampingFactor={0.05}
      enabled={!activeDestination && !isWarping}
    />
  );
};
