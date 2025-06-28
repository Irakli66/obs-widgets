"use client";

import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, useState, useMemo } from "react";
import { Mesh } from "three";
import { useRouter } from "next/navigation";
import * as THREE from "three";

// --- Space background stars & dust ---
function SpaceBackground() {
  const starsRef = useRef<Mesh>(null);
  const dustRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (starsRef.current)
      starsRef.current.rotation.y = state.clock.elapsedTime * 0.01;
    if (dustRef.current) {
      dustRef.current.rotation.x = state.clock.elapsedTime * 0.005;
      dustRef.current.rotation.z = state.clock.elapsedTime * 0.008;
    }
  });

  const starPositions = useMemo(() => {
    const positions = new Float32Array(200 * 3);
    for (let i = 0; i < 200; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50;
    }
    return positions;
  }, []);

  const dustPositions = useMemo(() => {
    const positions = new Float32Array(100 * 3);
    for (let i = 0; i < 100; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 30;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return positions;
  }, []);

  return (
    <group>
      <points ref={starsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[starPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.05} color="#ffffff" transparent opacity={0.8} />
      </points>
      <points ref={dustRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[dustPositions, 3]}
          />
        </bufferGeometry>
        <pointsMaterial size={0.02} color="#4a90e2" transparent opacity={0.4} />
      </points>
    </group>
  );
}

// --- Asteroids rotating in space ---
function FloatingAsteroids() {
  const asteroid1Ref = useRef<Mesh>(null);
  const asteroid2Ref = useRef<Mesh>(null);
  const asteroid3Ref = useRef<Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (asteroid1Ref.current) {
      asteroid1Ref.current.rotation.x = t * 0.3;
      asteroid1Ref.current.rotation.y = t * 0.2;
      asteroid1Ref.current.position.x = Math.sin(t * 0.5) * 8;
      asteroid1Ref.current.position.z = Math.cos(t * 0.5) * 8;
    }
    if (asteroid2Ref.current) {
      asteroid2Ref.current.rotation.x = t * 0.4;
      asteroid2Ref.current.rotation.z = t * 0.3;
      asteroid2Ref.current.position.x = Math.cos(t * 0.3) * 12;
      asteroid2Ref.current.position.y = Math.sin(t * 0.3) * 3;
    }
    if (asteroid3Ref.current) {
      asteroid3Ref.current.rotation.y = t * 0.25;
      asteroid3Ref.current.rotation.z = t * 0.35;
      asteroid3Ref.current.position.z = Math.sin(t * 0.4) * 10;
      asteroid3Ref.current.position.y = Math.cos(t * 0.4) * 2;
    }
  });

  return (
    <group>
      <mesh ref={asteroid1Ref} position={[8, 2, 0]} castShadow>
        <dodecahedronGeometry args={[0.3]} />
        <meshStandardMaterial color="#666666" roughness={0.8} />
      </mesh>
      <mesh ref={asteroid2Ref} position={[0, 5, 12]} castShadow>
        <icosahedronGeometry args={[0.4]} />
        <meshStandardMaterial color="#555555" roughness={0.9} />
      </mesh>
      <mesh ref={asteroid3Ref} position={[-6, -3, 10]} castShadow>
        <octahedronGeometry args={[0.25]} />
        <meshStandardMaterial color="#777777" roughness={0.7} />
      </mesh>
    </group>
  );
}

// --- Main interactive navigation system ---
function NavigationSystem() {
  const [hovered, setHovered] = useState<string | null>(null);
  const router = useRouter();

  const faceitRef = useRef<Mesh>(null);
  const cameraRef = useRef<Mesh>(null);

  const faceitTexture = useLoader(THREE.TextureLoader, "/images/faceit.png");

  useFrame((state) => {
    const time = state.clock.elapsedTime;

    // Orbit 1 (XZ Circle)
    if (faceitRef.current) {
      const radius = 5;
      faceitRef.current.position.x = Math.cos(time * 0.5) * radius;
      faceitRef.current.position.z = Math.sin(time * 0.5) * radius;
      faceitRef.current.rotation.y = time * 0.5 + Math.PI / 2;
    }

    // Orbit 2 (Tilted Ellipse)
    if (cameraRef.current) {
      const a = 6; // semi-major
      const b = 4; // semi-minor
      const t = time * 0.4;
      cameraRef.current.position.x = Math.cos(t) * a;
      cameraRef.current.position.z = Math.sin(t) * b;
      cameraRef.current.position.y = Math.sin(t * 1.5) * 0.5;
      cameraRef.current.rotation.y = -t + Math.PI / 2;
    }
  });

  const handleNavigation = (route: string) => {
    router.push(route);
  };

  return (
    <group>
      {/* Central TYNITE text with glow */}
      <Text
        position={[0, 0.1, 0]}
        fontSize={1.2}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
      >
        TYNITE
      </Text>
      <Text
        position={[0, 0.1, -0.05]}
        fontSize={1.3}
        color="#00ffff"
        anchorX="center"
        anchorY="middle"
        // opacity={0.2}
      >
        TYNITE
      </Text>

      {/* Ring around center */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[3, 0.05, 16, 100]} />
        <meshStandardMaterial
          color="#00ffff"
          emissive="#00ffff"
          emissiveIntensity={0.3}
          transparent
          opacity={0.3}
        />
      </mesh>

      {/* Orbit paths */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[5, 0.02, 8, 100]} />
        <meshStandardMaterial color="#ff4500" transparent opacity={0.1} />
      </mesh>
      <mesh rotation={[Math.PI / 2.5, 0, 0]}>
        <torusGeometry args={[5, 0.02, 8, 100]} />
        <meshStandardMaterial color="#4a90e2" transparent opacity={0.1} />
      </mesh>

      {/* FACEIT Navigation */}
      <group
        ref={faceitRef}
        onPointerOver={() => setHovered("faceit")}
        onPointerOut={() => setHovered(null)}
        onClick={() => handleNavigation("/faceit-stats")}
      >
        <mesh>
          <boxGeometry args={[2, 0.8, 0.2]} />
          <meshStandardMaterial
            color={hovered === "faceit" ? "#ff6600" : "#ff4500"}
            emissive={hovered === "faceit" ? "#ff6600" : "#ff4500"}
            emissiveIntensity={hovered === "faceit" ? 0.4 : 0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        {/* FaceIT Image */}
        <mesh position={[0, 0, 0.16]}>
          <planeGeometry args={[1.5, 0.5]} />
          <meshBasicMaterial map={faceitTexture} transparent />
        </mesh>
        {/* Glow border */}
        <mesh>
          <boxGeometry args={[2.1, 0.9, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={hovered === "faceit" ? 0.3 : 0.1}
            wireframe
          />
        </mesh>
      </group>

      {/* CAMERA Navigation */}
      <group
        ref={cameraRef}
        onPointerOver={() => setHovered("camera")}
        onPointerOut={() => setHovered(null)}
        onClick={() => handleNavigation("/camera-frame")}
      >
        <mesh>
          <boxGeometry args={[2, 0.8, 0.2]} />
          <meshStandardMaterial
            color={hovered === "camera" ? "#4a90e2" : "#2c5aa0"}
            emissive={hovered === "camera" ? "#4a90e2" : "#2c5aa0"}
            emissiveIntensity={hovered === "camera" ? 0.4 : 0.2}
            transparent
            opacity={0.9}
          />
        </mesh>
        <Text
          position={[0, 0, 0.15]}
          fontSize={0.25}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          CAMERA
        </Text>
        <mesh>
          <boxGeometry args={[2.1, 0.9, 0.1]} />
          <meshStandardMaterial
            color="#ffffff"
            transparent
            opacity={hovered === "camera" ? 0.3 : 0.1}
            wireframe
          />
        </mesh>
      </group>
    </group>
  );
}

export default function SpinningCubeScene() {
  return (
    <div className="relative w-full h-screen">
      <Canvas
        shadows
        style={{ height: "100vh" }}
        camera={{ position: [0, 15, 12], fov: 50 }}
      >
        <color attach="background" args={["#000011"]} />
        <fog attach="fog" args={["#000011", 10, 40]} />
        <ambientLight intensity={0.2} color="#4a4a8a" />
        <directionalLight
          castShadow
          position={[10, 10, 5]}
          intensity={0.8}
          color="#ffffff"
        />
        <pointLight position={[0, 0, 0]} color="#00ffff" intensity={0.5} />
        <pointLight position={[10, 5, 10]} color="#ffffff" intensity={0.3} />
        <pointLight position={[-10, -5, -10]} color="#4a90e2" intensity={0.3} />

        <SpaceBackground />
        <FloatingAsteroids />
        <NavigationSystem />

        <OrbitControls
          enableZoom
          enablePan
          minDistance={8}
          maxDistance={25}
          enableDamping
          dampingFactor={0.05}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>

      <div className="absolute top-4 left-4 text-cyan-300 bg-black/50 backdrop-blur-sm p-4 rounded-lg border border-cyan-500/30">
        <h2 className="font-bold text-xl mb-2">🚀 TYNITE Space Hub</h2>
        <p className="text-sm opacity-80">Click rotating panels to navigate</p>
        <p className="text-sm opacity-80">Scroll to zoom</p>
        <div className="text-xs mt-2 space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-orange-500 rounded"></div>
            <span>FaceIT Stats Widget</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded"></div>
            <span>Camera Frame Widget</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 text-white/70 text-sm">
        Use mouse to explore • Click panels to navigate
      </div>
    </div>
  );
}
