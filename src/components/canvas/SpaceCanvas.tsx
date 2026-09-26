import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Starfield } from './Starfield';
import { Nebula } from './Nebula';
import { AsteroidBelt } from './AsteroidBelt';
import { Spaceship } from './Spaceship';
import { EarthObject } from './EarthObject';
import { MarsObject } from './MarsObject';
import { AlienPlanetObject } from './AlienPlanetObject';
import { SpaceStationObject } from './SpaceStationObject';
import { BlackHoleObject } from './BlackHoleObject';
import { SatelliteObject } from './SatelliteObject';
import { MissionControlObject } from './MissionControlObject';
import { CameraController } from './CameraController';

export const SpaceCanvas: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 16, 60], fov: 58, near: 0.1, far: 1000 }}
        dpr={[1, 2]} // Crisp rendering with safe mobile cap
        gl={{
          antialias: true,
          powerPreference: 'high-performance',
          alpha: false,
        }}
      >
        {/* Deep Space Background Color & Fog */}
        <color attach="background" args={['#02040a']} />
        <fog attach="fog" args={['#02040a', 80, 320]} />

        {/* Ambient & Directional Sun Lighting */}
        <ambientLight intensity={0.4} />
        <directionalLight position={[40, 30, 20]} intensity={1.8} color="#ffffff" />
        <directionalLight position={[-30, -20, -10]} intensity={0.5} color="#00f3ff" />

        {/* Suspense fallback for safe rendering */}
        <Suspense fallback={null}>
          <Starfield />
          <Nebula />
          <AsteroidBelt />
          <Spaceship />

          {/* 7 Celestial Destinations */}
          <EarthObject />
          <MarsObject />
          <AlienPlanetObject />
          <SpaceStationObject />
          <BlackHoleObject />
          <SatelliteObject />
          <MissionControlObject />

          {/* Cinematic Camera Controller */}
          <CameraController />
        </Suspense>
      </Canvas>
    </div>
  );
};
