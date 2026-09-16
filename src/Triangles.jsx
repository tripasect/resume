import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// Chapter accent colors as THREE.Color values
const ACCENT_HEX = [
  '#F5F0E8',   // 0: Overture
  '#ff2760',   // I: Full-Stack Engineering & Web-Apps
  '#2DD4BF',   // II: Agentic AI & RAG Engineering
  '#F59E0B',   // III: Systems, Networking & Infrastructure
  '#A78BFA',   // IV: Soft Skills & Interdisciplinary Mastery
  '#48ec56',   // V: Machine-Readable Comprehensive Technology Index
  '#F5F0E8',   // 6: Coda
];

const Triangles = ({ scrollY, accentIndex = 0 }) => {
  const meshRef = useRef();
  const tempObject = useMemo(() => new THREE.Object3D(), []);
  const count = 10;
  const targetColor = useRef(new THREE.Color(ACCENT_HEX[0]));
  const currentColor = useRef(new THREE.Color(ACCENT_HEX[0]));

  const positions = useMemo(() => {
    const pos = [];
    for (let i = 0; i < count; i++) {
      pos.push(
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 14,
        0 // Flatten to 2D
      );
    }
    return new Float32Array(pos);
  }, []);

  const scales = useMemo(() => {
    return Array.from({ length: count }, () => 0.3 + Math.random() * 0.8);
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const scrollFactor = scrollY * 0.0008;

    // Lerp color toward the target
    const hex = ACCENT_HEX[Math.min(accentIndex, ACCENT_HEX.length - 1)];
    targetColor.current.set(hex);
    currentColor.current.lerp(targetColor.current, 0.03);

    if (meshRef.current) {
      meshRef.current.material.color.copy(currentColor.current);

      for (let i = 0; i < count; i++) {
        tempObject.position.set(
          positions[i * 3] + Math.sin(time * 0.03 + i * 0.7) * 0.15, // Slower movement
          positions[i * 3 + 1] + Math.cos(time * 0.02 + i * 0.5) * 0.1 - scrollFactor, // Slower movement
          positions[i * 3 + 2] // No Z movement
        );
        tempObject.rotation.set(
          0, // No X rotation
          0, // No Y rotation
          Math.sin(time * 0.02 + i * 0.4) * Math.PI // Only Z rotation
        );
        const s = scales[i] * (1 + Math.sin(time * 0.05 + i) * 0.05); // Slower scaling
        tempObject.scale.set(s * 2, s, s); // Elongated right triangle
        tempObject.updateMatrix();
        meshRef.current.setMatrixAt(i, tempObject.matrix);
      }
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={new Float32Array([
            0, 0, 0,
            1, 0, 0,
            0, 1, 0,
          ])}
          count={3}
          itemSize={3}
        />
      </bufferGeometry>
      <meshBasicMaterial
        color="#FFFFFF"
        transparent
        opacity={0.12}
      />
    </instancedMesh>
  );
};

export default Triangles;
