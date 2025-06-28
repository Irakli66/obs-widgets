// components/SpinningCube.tsx
"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import { useRef, useState } from "react";
import { Mesh } from "three";

function AnimatedCube() {
  const meshRef = useRef<Mesh>(null);
  const [hovered, setHovered] = useState(false);

  // Rotate cube on each frame
  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta;
      meshRef.current.rotation.x += delta * 0.5;
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={[0, 0, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      castShadow
      receiveShadow
    >
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color={hovered ? "hotpink" : "skyblue"} />
    </mesh>
  );
}

export default function SpinningCubeScene() {
  return (
    <Canvas
      shadows
      style={{ height: "100vh" }}
      camera={{ position: [5, 5, 5], fov: 50 }}
    >
      {/* Scene fog and background */}
      <color attach="background" args={["#202025"]} />
      <fog attach="fog" args={["#202025", 5, 20]} />

      {/* Lighting */}
      <ambientLight intensity={0.3} />
      <directionalLight
        castShadow
        position={[5, 10, 5]}
        intensity={1}
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
      />

      {/* Cube */}
      <AnimatedCube />

      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <shadowMaterial opacity={0.3} />
      </mesh>

      {/* Floating Text */}
      <Text
        position={[0, 2.5, 0]}
        fontSize={0.5}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        Hover Me!
      </Text>

      {/* Controls */}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
}
