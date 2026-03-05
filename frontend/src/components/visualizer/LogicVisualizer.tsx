import React, { Suspense, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Float,
    Text,
    MeshDistortMaterial,
    Line
} from '@react-three/drei';
import * as THREE from 'three';

interface VisualizerProps {
    type: 'conditional' | 'loop' | 'variable';
    data?: any;
}

const FlowNode = ({ position, color, label, isActive }: { position: [number, number, number], color: string, label: string, isActive: boolean }) => {
    return (
        <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <mesh position={position}>
                <boxGeometry args={[1.5, 0.8, 0.5]} />
                <MeshDistortMaterial
                    color={isActive ? "#10B981" : color}
                    speed={2}
                    distort={0.4}
                    radius={1}
                />
                <Text
                    position={[0, 0, 0.3]}
                    fontSize={0.2}
                    color="white"
                    font="/fonts/Inter-Bold.ttf"
                    anchorX="center"
                    anchorY="middle"
                >
                    {label}
                </Text>
            </mesh>
        </Float>
    );
};

const ConnectionLine = ({ start, end, isActive }: { start: [number, number, number], end: [number, number, number], isActive: boolean }) => {
    const points = [new THREE.Vector3(...start), new THREE.Vector3(...end)];

    return (
        <Line
            points={points}
            color={isActive ? "#10B981" : "#334155"}
            lineWidth={isActive ? 3 : 1}
            dashed={!isActive}
        />
    );
};

const LogicScene = ({ type }: { type: string }) => {
    const [step, setStep] = useState(0);

    // Auto-advance visualization steps for demo
    useFrame((state) => {
        const time = state.clock.getElapsedTime();
        const newStep = Math.floor(time % 4);
        if (newStep !== step) setStep(newStep);
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <PerspectiveCamera makeDefault position={[0, 0, 8]} />
            <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />

            {type === 'conditional' && (
                <group>
                    <FlowNode position={[0, 2, 0]} color="#6366F1" label="IF (x > 10)" isActive={step === 0} />

                    <ConnectionLine start={[0, 1.6, 0]} end={[-2, 0, 0]} isActive={step === 1} />
                    <ConnectionLine start={[0, 1.6, 0]} end={[2, 0, 0]} isActive={step === 2} />

                    <FlowNode position={[-2, 0, 0]} color="#F43F5E" label="True: print('Big')" isActive={step === 1} />
                    <FlowNode position={[2, 0, 0]} color="#F43F5E" label="False: print('Small')" isActive={step === 2} />

                    <ConnectionLine start={[-2, -0.4, 0]} end={[0, -2, 0]} isActive={step === 3} />
                    <ConnectionLine start={[2, -0.4, 0]} end={[0, -2, 0]} isActive={step === 3} />

                    <FlowNode position={[0, -2, 0]} color="#8B5CF6" label="Continue..." isActive={step === 3} />
                </group>
            )}

            {type === 'loop' && (
                <group>
                    <FlowNode position={[0, 2, 0]} color="#6366F1" label="FOR i in range(5)" isActive={step === 0} />

                    <ConnectionLine start={[0, 1.6, 0]} end={[0, 0, 0]} isActive={step === 1} />
                    <FlowNode position={[0, 0, 0]} color="#10B981" label={`Doing iteration ${step + 1}`} isActive={step > 0} />

                    {/* Loop back line */}
                    <Line
                        points={[
                            new THREE.Vector3(0, -0.4, 0),
                            new THREE.Vector3(2, -0.4, 0),
                            new THREE.Vector3(2, 2, 0),
                            new THREE.Vector3(0.8, 2, 0)
                        ]}
                        color="#10B981"
                        lineWidth={step > 0 ? 2 : 1}
                    />
                </group>
            )}

            {/* Background elements for "Wired" feel */}
            <mesh scale={20}>
                <sphereGeometry args={[1, 64, 64]} />
                <meshBasicMaterial color="#0f172a" side={THREE.BackSide} />
            </mesh>

            <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -2]} />
        </>
    );
};

export const LogicVisualizer: React.FC<VisualizerProps> = ({ type }) => {
    return (
        <div className="w-full h-full min-h-[400px] bg-[#020617] relative rounded-[2rem] overflow-hidden border border-white/5">
            <div className="absolute top-8 left-8 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <h4 className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em]">
                        Live Execution Visualizer
                    </h4>
                </div>
                <h3 className="text-xl font-black text-white mt-1 uppercase tracking-tight">
                    {type === 'conditional' ? 'Branching Path' : 'Iteration Cycle'}
                </h3>
            </div>

            <Canvas>
                <Suspense fallback={null}>
                    <LogicScene type={type} />
                </Suspense>
            </Canvas>

            <div className="absolute bottom-8 left-8 right-8 z-10 flex justify-between items-end">
                <div className="max-w-[200px]">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                        Interaction: Click and drag to rotate. The 3D nodes represent memory segments and logic gates.
                    </p>
                </div>
                <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
                    <span className="text-[10px] font-black text-white uppercase tracking-widest">
                        Engine: SkillBridge V3-Logic
                    </span>
                </div>
            </div>
        </div>
    );
};

export default LogicVisualizer;
