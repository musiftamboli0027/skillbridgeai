import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Float, PerspectiveCamera, OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

type VisualState = 'idle' | 'if' | 'else' | 'loop';

interface LogicVisualizer3DProps {
    state: VisualState;
}

const Branch = ({ color, rotation, active }: { color: string, rotation: [number, number, number], active: boolean }) => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame(() => {
        if (!meshRef.current) return;
        if (active) {
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 1.5, 0.1);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 1.5, 0.1);
        } else {
            meshRef.current.scale.y = THREE.MathUtils.lerp(meshRef.current.scale.y, 0.01, 0.1);
            meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, 0, 0.1);
        }
    });

    return (
        <group rotation={rotation}>
            <mesh ref={meshRef} position={[0, 0, 0]}>
                <cylinderGeometry args={[0.03, 0.03, 2, 16]} />
                <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} transparent opacity={0.6} />
            </mesh>
        </group>
    );
};

const OrbitingNodes = ({ state }: { state: VisualState }) => {
    const groupRef = useRef<THREE.Group>(null);
    const nodes = useMemo(() => [...Array(20)].map(() => ({
        position: [Math.random() * 4 - 2, Math.random() * 4 - 2, Math.random() * 4 - 2] as [number, number, number],
        size: Math.random() * 0.06 + 0.02
    })), []);

    useFrame((s) => {
        if (!groupRef.current) return;
        const t = s.clock.getElapsedTime();

        if (state === 'loop') {
            groupRef.current.rotation.y += 0.06;
            groupRef.current.children.forEach((child, i) => {
                const radius = 1.8;
                const speed = 2.5;
                const angle = t * speed + (i / 20) * Math.PI * 2;
                child.position.x = Math.cos(angle) * radius;
                child.position.z = Math.sin(angle) * radius;
                child.position.y = Math.sin(t * 2 + i) * 0.15;
            });
        } else {
            groupRef.current.rotation.y += 0.003;
            groupRef.current.children.forEach((child, i) => {
                const p = nodes[i].position;
                child.position.x = THREE.MathUtils.lerp(child.position.x, p[0], 0.05);
                child.position.y = THREE.MathUtils.lerp(child.position.y, p[1] + Math.sin(t + i) * 0.1, 0.05);
                child.position.z = THREE.MathUtils.lerp(child.position.z, p[2], 0.05);
            });
        }
    });

    return (
        <group ref={groupRef}>
            {nodes.map((node, i) => (
                <mesh key={i} position={node.position}>
                    <sphereGeometry args={[node.size, 16, 16]} />
                    <meshStandardMaterial
                        color={state === 'loop' ? "#10b981" : "#6366f1"}
                        emissive={state === 'loop' ? "#10b981" : "#6366f1"}
                        emissiveIntensity={2}
                    />
                </mesh>
            ))}
        </group>
    );
};

const SceneContent = ({ state }: { state: VisualState }) => {
    const { size } = useThree();

    // Log dimensions to confirm it uses clientWidth/Height as the Canvas ResizeObserver provides
    useEffect(() => {
        console.log(`[Three.js] Resized to: ${size.width}x${size.height}`);
    }, [size]);

    return (
        <>
            <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
            <OrbitControls enableZoom={false} enablePan={false} rotateSpeed={0.5} />

            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
            <pointLight position={[-10, -10, -10]} intensity={0.8} color="#10b981" />

            <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

            <Float speed={1.5} rotationIntensity={0.8} floatIntensity={0.5}>
                {/* Decision Core */}
                {state === 'if' || state === 'else' ? (
                    <mesh>
                        <octahedronGeometry args={[0.75]} />
                        <MeshDistortMaterial color="#6366f1" speed={4} distort={0.2} radius={1} emissive="#6366f1" emissiveIntensity={0.5} />
                    </mesh>
                ) : (
                    <Sphere args={[0.5, 64, 64]}>
                        <MeshDistortMaterial
                            color={state === 'loop' ? "#059669" : "#1e293b"}
                            speed={2}
                            distort={0.3}
                            radius={1}
                        />
                    </Sphere>
                )}

                {/* Architecture Connections */}
                <Branch color="#818cf8" rotation={[0, 0, Math.PI / 3]} active={state === 'if' || state === 'else'} />
                <Branch color="#ef4444" rotation={[0, 0, -Math.PI / 3]} active={state === 'else'} />

                <OrbitingNodes state={state} />
            </Float>

            <fog attach="fog" args={['#050506', 5, 20]} />
        </>
    );
};

const LogicVisualizer3D: React.FC<LogicVisualizer3DProps> = ({ state }) => {
    const mountRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={mountRef} className="w-full h-full bg-[#050506] overflow-hidden">
            <Canvas shadows gl={{ antialias: true, alpha: true }}>
                <SceneContent state={state} />
            </Canvas>
        </div>
    );
};

export default LogicVisualizer3D;
