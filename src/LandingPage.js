import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const ParticleSystem = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // 입자 생성
    const particleCount = 1500;
    const particles = new Float32Array(particleCount * 3);
    const geometry = new THREE.BufferGeometry();
    const material = new THREE.PointsMaterial({
      color: 0xFFFFFF,
      size: 0.05,
      blending: THREE.AdditiveBlending,
      transparent: true,
      sizeAttenuation: true
    });

    // 8자 모양의 입자 배치
    for (let i = 0; i < particleCount; i++) {
      const t = i / particleCount;
      const x = 0.5 * Math.sin(4 * Math.PI * t);
      const y = 0.5 * Math.sin(2 * Math.PI * t);
      const z = 0.1 * (Math.random() - 0.5);  // 약간의 깊이 추가

      particles[i * 3] = x;
      particles[i * 3 + 1] = y;
      particles[i * 3 + 2] = z;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));
    const particleSystem = new THREE.Points(geometry, material);
    scene.add(particleSystem);

    camera.position.z = 2;

    // 노이즈 애니메이션
    const animate = () => {
      requestAnimationFrame(animate);

      const positions = geometry.attributes.position.array;
      for (let i = 0; i < particleCount; i++) {
        positions[i * 3 + 2] += (Math.random() - 0.5) * 0.01;
      }
      geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
    };

    animate();

    // 창 크기 조정 처리
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // 정리
    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} />;
};

export default ParticleSystem;