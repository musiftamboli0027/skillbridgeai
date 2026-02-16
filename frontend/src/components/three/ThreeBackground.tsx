import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sphere, MeshDistortMaterial, Stars } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere({ scrollY }: { scrollY: number }) {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (!meshRef.current) return;
        const time = state.clock.getElapsedTime();
        meshRef.current.rotation.x = time * 0.2 + scrollY * 0.001;
        meshRef.current.rotation.y = time * 0.3 + scrollY * 0.001;
        meshRef.current.position.y = Math.sin(time) * 0.2 - scrollY * 0.002;
    });

    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
            <Sphere ref={meshRef} args={[1, 100, 100]} scale={1.5}>
                <MeshDistortMaterial
                    color="#8b5cf6"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.1}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
}

function ParticleNetwork({ scrollY }: { scrollY: number }) {
    const count = 150;
    const positions = useMemo(() => {
        const pos = new Float32Array(count * 3);
        for (let i = 0; i < count; i++) {
            pos[i * 3] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 1] = (Math.random() - 0.5) * 15;
            pos[i * 3 + 2] = (Math.random() - 0.5) * 15;
        }
        return pos;
    }, []);

    const pointsRef = useRef<THREE.Points>(null);

    useFrame((state) => {
        if (!pointsRef.current) return;
        pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.05 + scrollY * 0.0002;
        pointsRef.current.rotation.x = state.clock.getElapsedTime() * 0.02 + scrollY * 0.0001;
        pointsRef.current.position.y = -scrollY * 0.001;
    });

    return (
        <points ref={pointsRef}>
            <bufferGeometry attach="geometry">
                <bufferAttribute
                    attach="attributes-position"
                    count={positions.length / 3}
                    array={positions}
                    itemSize={3}
                    args={[positions, 3]}
                />
            </bufferGeometry>
            <pointsMaterial
                attach="material"
                size={0.05}
                sizeAttenuation={true}
                color="#a78bfa"
                transparent
                opacity={0.6}
            />
        </points>
    );
}

export default function ThreeBackground() {
    const [scrollY, setScrollY] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="absolute inset-0 z-0 bg-[#020617]">
            <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
                <ambientLight intensity={0.4} />
                <pointLight position={[10, 10, 10]} intensity={1} color="#8b5cf6" />
                <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} />

                <Stars radius={100} depth={50} count={6000} factor={4} saturation={0} fade speed={1} />

                <AnimatedSphere scrollY={scrollY} />
                <ParticleNetwork scrollY={scrollY} />

                <fog attach="fog" args={['#020617', 5, 20]} />
            </Canvas>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#020617]/50 pointer-events-none" />
        </div>
    );
}
