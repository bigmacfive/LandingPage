import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';

const FloatingText = ({ character, position }) => {
  const meshRef = useRef();

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.position.y += 0.01;
      if (meshRef.current.position.y > 5) meshRef.current.position.y = -5;
    }
  });

  return (
    <Text
      ref={meshRef}
      position={position}
      fontSize={0.5}
      color="white"
    >
      {character}
    </Text>
  );
};

const Scene = () => {
  const characters = useMemo(() => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    return Array.from({ length: 100 }, () => ({
      char: chars[Math.floor(Math.random() * chars.length)],
      position: [
        Math.random() * 10 - 5,
        Math.random() * 10 - 5,
        Math.random() * 10 - 5
      ]
    }));
  }, []);

  return (
    <>
      {characters.map((char, index) => (
        <FloatingText key={index} character={char.char} position={char.position} />
      ))}
      <Text
        position={[-2, 0, 0]}
        fontSize={1}
        color="red"
      >
        THE SCENT
      </Text>
      <pointLight position={[10, 10, 10]} />
    </>
  );
};

const FloatingTextAnimation = () => {
  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <Scene />
      </Canvas>
    </div>
  );
};

export default FloatingTextAnimation;