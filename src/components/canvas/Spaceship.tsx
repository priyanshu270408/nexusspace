import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useMission } from '../../context/MissionContext';

export const Spaceship: React.FC = () => {
  const shipGroupRef = useRef<THREE.Group>(null);
  const thrusterRef1 = useRef<THREE.Mesh>(null);
  const thrusterRef2 = useRef<THREE.Mesh>(null);
  const lightRefRed = useRef<THREE.PointLight>(null);
  const lightRefGreen = useRef<THREE.PointLight>(null);

  const { isWarping, warpFactor, phase, activeDestination, reducedMotion } = useMission();

  // Ship position relative to camera view
  useFrame((state, delta) => {
    if (!shipGroupRef.current) return;

    const time = state.clock.getElapsedTime();
    const camera = state.camera;

    // When in inspection or explore, place spaceship in front-right corner of camera view
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(camera.quaternion);
    const up = new THREE.Vector3(0, 1, 0).applyQuaternion(camera.quaternion);

    // Default offset relative to camera
    const isInspecting = phase === 'INSPECTING' || !!activeDestination;
    const distance = isInspecting ? 5.5 : 4.8;
    const rightOffset = isInspecting ? 2.4 : 1.6;
    const downOffset = isInspecting ? -1.6 : -1.2;

    const targetPos = camera.position
      .clone()
      .add(forward.clone().multiplyScalar(distance))
      .add(right.clone().multiplyScalar(rightOffset))
      .add(up.clone().multiplyScalar(downOffset));

    // Idle hover oscillation
    if (!reducedMotion) {
      targetPos.y += Math.sin(time * 2.2) * 0.08;
      targetPos.x += Math.cos(time * 1.5) * 0.04;
    }

    // Smoothly follow camera
    const lerpSpeed = isWarping ? 12 : 5;
    shipGroupRef.current.position.lerp(targetPos, delta * lerpSpeed);

    // Rotate ship to orient along camera direction with banking tilt
    const targetQuaternion = camera.quaternion.clone();

    // Banking effect when warping or moving
    if (isWarping) {
      const bankEuler = new THREE.Euler(0.1, 0, -0.25 * warpFactor, 'YXZ');
      const bankQuat = new THREE.Quaternion().setFromEuler(bankEuler);
      targetQuaternion.multiply(bankQuat);
    } else {
      // Subtle idle banking
      const idleEuler = new THREE.Euler(
        Math.sin(time * 1.2) * 0.03,
        0,
        Math.cos(time * 1.6) * 0.04,
        'YXZ'
      );
      const idleQuat = new THREE.Quaternion().setFromEuler(idleEuler);
      targetQuaternion.multiply(idleQuat);
    }

    shipGroupRef.current.quaternion.slerp(targetQuaternion, delta * lerpSpeed);

    // Thruster engine glow pulse
    const thrusterScale = isWarping ? 2.5 + Math.random() * 0.5 : 1 + Math.sin(time * 15) * 0.15;
    if (thrusterRef1.current) {
      thrusterRef1.current.scale.set(1, 1, thrusterScale);
    }
    if (thrusterRef2.current) {
      thrusterRef2.current.scale.set(1, 1, thrusterScale);
    }

    // Blinking navigation beacons
    const blink = Math.sin(time * 4) > 0 ? 1 : 0.1;
    if (lightRefRed.current) lightRefRed.current.intensity = blink * 1.5;
    if (lightRefGreen.current) lightRefGreen.current.intensity = blink * 1.5;
  });

  return (
    <group ref={shipGroupRef} scale={0.28}>
      {/* Central Fuselage / Cockpit */}
      <mesh position={[0, 0, 0]}>
        <coneGeometry args={[0.9, 3.8, 5]} />
        <meshStandardMaterial
          color="#0f172a"
          roughness={0.25}
          metalness={0.9}
        />
      </mesh>

      {/* Cockpit Canopy (Glass / Holographic Cyan) */}
      <mesh position={[0, 0.35, -0.2]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.5, 0.35, 1.2]} />
        <meshPhysicalMaterial
          color="#00f3ff"
          emissive="#00f3ff"
          emissiveIntensity={0.6}
          roughness={0.1}
          metalness={0.3}
          transparent
          opacity={0.85}
        />
      </mesh>

      {/* Main Hull Armor Plates */}
      <mesh position={[0, -0.1, 0.4]}>
        <boxGeometry args={[1.4, 0.4, 2.2]} />
        <meshStandardMaterial
          color="#1e293b"
          roughness={0.3}
          metalness={0.85}
        />
      </mesh>

      {/* Swept Back Left Wing */}
      <group position={[-1.2, -0.05, 0.5]} rotation={[0, -0.3, -0.1]}>
        <mesh>
          <boxGeometry args={[1.8, 0.1, 1.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Left Wingtip Nav Beacon (Port - Red) */}
        <mesh position={[-0.9, 0, -0.7]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#ff0044" />
        </mesh>
        <pointLight ref={lightRefRed} position={[-0.9, 0.2, -0.7]} color="#ff0044" distance={2} />
      </group>

      {/* Swept Back Right Wing */}
      <group position={[1.2, -0.05, 0.5]} rotation={[0, 0.3, 0.1]}>
        <mesh>
          <boxGeometry args={[1.8, 0.1, 1.6]} />
          <meshStandardMaterial color="#0f172a" roughness={0.3} metalness={0.9} />
        </mesh>
        {/* Right Wingtip Nav Beacon (Starboard - Green) */}
        <mesh position={[0.9, 0, -0.7]}>
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshBasicMaterial color="#00ff66" />
        </mesh>
        <pointLight ref={lightRefGreen} position={[0.9, 0.2, -0.7]} color="#00ff66" distance={2} />
      </group>

      {/* Dual Ion Thrusters */}
      {/* Left Thruster Housing */}
      <mesh position={[-0.55, 0, 1.6]}>
        <cylinderGeometry args={[0.26, 0.32, 0.8, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Left Thruster Plasma Exhaust Cone */}
      <mesh ref={thrusterRef1} position={[-0.55, 0, 2.2]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.24, 1.2, 16, 1, true]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Right Thruster Housing */}
      <mesh position={[0.55, 0, 1.6]}>
        <cylinderGeometry args={[0.26, 0.32, 0.8, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.9} roughness={0.2} />
      </mesh>
      {/* Right Thruster Plasma Exhaust Cone */}
      <mesh ref={thrusterRef2} position={[0.55, 0, 2.2]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.24, 1.2, 16, 1, true]} />
        <meshBasicMaterial
          color="#00f3ff"
          transparent
          opacity={0.85}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Plasma Engine Glow Light */}
      <pointLight position={[0, 0, 2.3]} color="#00f3ff" intensity={isWarping ? 8 : 3} distance={5} />
    </group>
  );
};
