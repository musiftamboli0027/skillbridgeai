import React, { Suspense, useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import {
    OrbitControls,
    PerspectiveCamera,
    Float,
    Text,
    MeshDistortMaterial,
    RoundedBox,
    SpotLight
} from '@react-three/drei';

interface Variable {
    name: string;
    value: any;
    type: string;
}

interface Scope {
    name: string;
    variables: Variable[];
    color: string;
    position: [number, number, number];
}

const ScopeBox = ({ scope, isActive }: { scope: Scope, isActive: boolean }) => {
    return (
        <Float speed={isActive ? 2 : 1} rotationIntensity={isActive ? 0.5 : 0.1}>
            <group position={scope.position}>
                {/* Scope Label */}
                <Text
                    position={[0, 2.5, 0]}
                    fontSize={0.3}
                    color="white"
                >
                    {scope.name.toUpperCase()} SCOPE
                </Text>

                {/* The Box */}
                <RoundedBox args={[4, 4, 4]} radius={0.2} smoothness={4}>
                    <meshStandardMaterial
                        color={scope.color}
                        transparent
                        opacity={isActive ? 0.3 : 0.1}
                        wireframe={!isActive}
                    />
                </RoundedBox>

                {/* Variables inside */}
                {scope.variables.map((v, i) => (
                    <group key={v.name} position={[
                        (i % 2 === 0 ? -1 : 1) * 0.8,
                        (i < 2 ? 0.8 : -0.8),
                        0
                    ]}>
                        <mesh>
                            <sphereGeometry args={[0.4]} />
                            <MeshDistortMaterial
                                color={isActive ? "#fbbf24" : "#475569"}
                                speed={3}
                                distort={0.4}
                            />
                        </mesh>
                        <Text
                            position={[0, -0.7, 0]}
                            fontSize={0.2}
                            color="white"
                        >
                            {`${v.name}: ${v.value}`}
                        </Text>
                    </group>
                ))}
            </group>
        </Float>
    );
};

export const ScopeVisualizer: React.FC = () => {
    const [activeScope, setActiveScope] = useState<'global' | 'local'>('global');

    const scopes: Scope[] = useMemo(() => [
        {
            name: 'global',
            variables: [
                { name: 'apiKey', value: '123-x', type: 'string' },
                { name: 'version', value: '1.0', type: 'number' }
            ],
            color: '#6366f1',
            position: [-4, 0, 0]
        },
        {
            name: 'local',
            variables: [
                { name: 'tempCount', value: '42', type: 'number' },
                { name: 'isAuth', value: 'true', type: 'boolean' }
            ],
            color: '#10b981',
            position: [4, 0, 0]
        }
    ], []);

    return (
        <div className="w-full h-full min-h-[500px] bg-[#020617] rounded-[3rem] overflow-hidden border border-white/5 relative group">
            {/* Header */}
            <div className="absolute top-10 left-10 z-20">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_15px_#6366f1]" />
                    <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Memory Lab</span>
                </div>
                <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                    Variable Scope <span className="text-indigo-500">Explorer</span>
                </h2>
                <p className="text-slate-500 text-xs font-bold mt-2 max-w-sm uppercase tracking-widest leading-relaxed">
                    Visualizing the lifetime and accessibility of variables across execution contexts.
                </p>
            </div>

            {/* Scope Toggle */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 flex gap-4 p-2 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <button
                    onClick={() => setActiveScope('global')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeScope === 'global' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Global Context
                </button>
                <button
                    onClick={() => setActiveScope('local')}
                    className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeScope === 'local' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
                >
                    Local Stack
                </button>
            </div>

            {/* Instruction Overlay */}
            <div className="absolute top-10 right-10 z-20 text-right opacity-40 group-hover:opacity-100 transition-opacity">
                <p className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Orbit Alpha Control</p>
                <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Right Click: Pan • Left Click: Rotate</p>
            </div>

            <Canvas shadows>
                <Suspense fallback={null}>
                    <PerspectiveCamera makeDefault position={[0, 0, 15]} fov={40} />
                    <OrbitControls minDistance={8} maxDistance={25} />
                    <ambientLight intensity={0.4} />
                    <SpotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} castShadow color="#6366f1" />

                    <ScopeBox scope={scopes[0]} isActive={activeScope === 'global'} />
                    <ScopeBox scope={scopes[1]} isActive={activeScope === 'local'} />

                    {/* Connection Bridge */}
                    <mesh rotation={[0, 0, Math.PI / 2]}>
                        <cylinderGeometry args={[0.02, 0.02, 8]} />
                        <meshStandardMaterial color="#334155" />
                    </mesh>

                    {/* Environment */}
                    <gridHelper args={[50, 50, "#1e293b", "#0f172a"]} position={[0, -5, 0]} />
                </Suspense>
            </Canvas>

            {/* Hint Data Block */}
            <div className="absolute bottom-10 right-10 z-20">
                <div className="p-6 bg-black/40 backdrop-blur-md rounded-3xl border border-white/5 max-w-[240px]">
                    <h4 className="text-[10px] font-black text-indigo-400 uppercase mb-2 tracking-widest">Compiler Note</h4>
                    <p className="text-[11px] text-slate-300 font-medium leading-relaxed italic">
                        {activeScope === 'global'
                            ? "Global variables persist for the entire runtime of the engine."
                            : "Local variables are destroyed as soon as the function stack pop completes."}
                    </p>
                </div>
            </div>
        </div>
    );
};
