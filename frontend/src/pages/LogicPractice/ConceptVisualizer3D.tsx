import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
    Stars,
    Float,
    PerspectiveCamera,
    OrbitControls,
    MeshDistortMaterial,
    Sphere,
    Box,
    Text,
    MeshWobbleMaterial,
    Torus,
    Cylinder,
    Cone,
    Line,
} from '@react-three/drei';
import * as THREE from 'three';

interface ThreeJsBlock {
    conceptName: string;
    visualDescription?: string;
    pythonConcept?: string;
    interactionType?: string;
    uiIntegrationHint?: string;
}

interface ConceptVisualizer3DProps {
    block: ThreeJsBlock;
}

// ─────────────────────────────────────────────────────────────────
// 1. VARIABLE BOX — Module 1: Intro to Programming & Python
//    Concept: A glowing container storing data
// ─────────────────────────────────────────────────────────────────
const VariableBox = () => {
    const boxRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!boxRef.current) return;
        boxRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.3;
        boxRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.3) * 0.1;
    });
    return (
        <group ref={boxRef}>
            <Box args={[2.2, 2.2, 2.2]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#6366f1" transparent opacity={0.12} roughness={0} metalness={1} />
            </Box>
            <lineSegments>
                <edgesGeometry args={[new THREE.BoxGeometry(2.2, 2.2, 2.2)]} />
                <lineBasicMaterial color="#818cf8" linewidth={2} />
            </lineSegments>
            <Float speed={3} rotationIntensity={0.5} floatIntensity={1.2}>
                <Sphere args={[0.45, 32, 32]} position={[0, 0, 0]}>
                    <MeshDistortMaterial color="#10b981" speed={4} distort={0.45} emissive="#10b981" emissiveIntensity={0.3} />
                </Sphere>
            </Float>
            {[[-0.8, 0.6, 0], [0.8, 0.6, 0], [0, -0.6, 0]].map((pos, i) => (
                <Float key={i} speed={2 + i} floatIntensity={0.5}>
                    <Sphere args={[0.2, 16, 16]} position={pos as [number, number, number]}>
                        <meshStandardMaterial color={['#f59e0b', '#ec4899', '#3b82f6'][i]} emissive={['#f59e0b', '#ec4899', '#3b82f6'][i]} emissiveIntensity={0.4} />
                    </Sphere>
                </Float>
            ))}
            <Text position={[0, -1.8, 0]} fontSize={0.22} color="white" anchorX="center">MEMORY_SLOT_01</Text>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 2. INDENTATION STAIRCASE — Module 2: Python Syntax & Indentation
//    Concept: Nested blocks as 3D stair layers going deeper
// ─────────────────────────────────────────────────────────────────
const IndentationStaircase = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    });
    const layers = [
        { w: 3.2, h: 0.35, color: '#6366f1', label: 'if x > 0:', y: 0.0, x: 0 },
        { w: 2.6, h: 0.35, color: '#8b5cf6', label: '    for i in range:', y: 0.5, x: 0.3 },
        { w: 2.0, h: 0.35, color: '#10b981', label: '        print(i)', y: 1.0, x: 0.6 },
        { w: 1.4, h: 0.35, color: '#f59e0b', label: '            val = i', y: 1.5, x: 0.9 },
    ];
    return (
        <group ref={groupRef} position={[0, -0.8, 0]}>
            {layers.map((l, i) => (
                <group key={i} position={[l.x, l.y, 0]}>
                    <Box args={[l.w, l.h, 0.8]}>
                        <meshStandardMaterial color={l.color} transparent opacity={0.75} roughness={0.2} metalness={0.6} />
                    </Box>
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(l.w, l.h, 0.8)]} />
                        <lineBasicMaterial color="#ffffff" />
                    </lineSegments>
                    <Text position={[0, 0, 0.45]} fontSize={0.16} color="white" anchorX="center">{l.label}</Text>
                </group>
            ))}
            {/* Connection lines between layers */}
            {layers.slice(1).map((l, i) => (
                <Line
                    key={i}
                    points={[
                        new THREE.Vector3(layers[i].x - layers[i].w / 2 + 0.1, layers[i].y + 0.18, 0),
                        new THREE.Vector3(l.x - l.w / 2 + 0.1, l.y - 0.18, 0)
                    ]}
                    color="#ffffff"
                    lineWidth={1.5}
                    dashed
                    dashSize={0.08}
                    gapSize={0.05}
                />
            ))}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 3. DATA TYPE ATOMS — Module 3: Variables & Data Types
//    Concept: Orbiting atoms = different data types
// ─────────────────────────────────────────────────────────────────
const DataTypeAtoms = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += 0.005;
    });
    const types = [
        { label: 'int', color: '#6366f1', r: 1.8, speed: 1.0, size: 0.38 },
        { label: 'str', color: '#10b981', r: 2.6, speed: 0.7, size: 0.32 },
        { label: 'float', color: '#f59e0b', r: 3.2, speed: 0.5, size: 0.28 },
        { label: 'bool', color: '#ec4899', r: 1.2, speed: 1.4, size: 0.42 },
    ];
    return (
        <group ref={groupRef}>
            {/* Nucleus */}
            <Sphere args={[0.5, 32, 32]}>
                <MeshDistortMaterial color="#1e1b4b" speed={2} distort={0.3} emissive="#6366f1" emissiveIntensity={0.8} />
            </Sphere>
            <Text position={[0, 0, 0.55]} fontSize={0.18} color="white" anchorX="center">myVar</Text>
            {/* Orbits + atoms */}
            {types.map((t, i) => {
                const OrbitingAtom = () => {
                    const ref = useRef<THREE.Group>(null);
                    useFrame((state) => {
                        if (!ref.current) return;
                        const angle = state.clock.getElapsedTime() * t.speed + i * Math.PI * 0.5;
                        ref.current.position.x = Math.cos(angle) * t.r;
                        ref.current.position.z = Math.sin(angle) * t.r;
                    });
                    return (
                        <group ref={ref}>
                            <Sphere args={[t.size, 16, 16]}>
                                <meshStandardMaterial color={t.color} emissive={t.color} emissiveIntensity={0.4} roughness={0.3} />
                            </Sphere>
                            <Text position={[0, t.size + 0.2, 0]} fontSize={0.18} color={t.color} anchorX="center">{t.label}</Text>
                        </group>
                    );
                };
                return <OrbitingAtom key={i} />;
            })}
            {/* Orbit rings */}
            {types.map((t, i) => (
                <Torus key={i} args={[t.r, 0.012, 8, 80]} rotation={[Math.PI / 2, 0, 0]}>
                    <meshStandardMaterial color={t.color} transparent opacity={0.2} />
                </Torus>
            ))}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 4. IO PIPELINE — Module 4: Input, Output & Operators
//    Concept: Data flows through a processing pipeline
// ─────────────────────────────────────────────────────────────────
const IOPipeline = () => {
    const packetRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!packetRef.current) return;
        const t = (state.clock.getElapsedTime() % 3) / 3;
        packetRef.current.position.x = -3.5 + t * 7;
        const pulse = Math.sin(state.clock.getElapsedTime() * 5) * 0.05;
        packetRef.current.scale.setScalar(1 + pulse);
    });
    const stages = [
        { x: -3.5, label: 'INPUT', color: '#3b82f6', icon: '⌨' },
        { x: 0, label: 'PROCESS', color: '#8b5cf6', icon: '⚙' },
        { x: 3.5, label: 'OUTPUT', color: '#10b981', icon: '🖥' },
    ];
    return (
        <group>
            {/* Pipe */}
            <Box args={[9, 0.12, 0.12]} position={[0, 0, 0]}>
                <meshStandardMaterial color="#334155" emissive="#1e293b" emissiveIntensity={0.5} />
            </Box>
            {/* Stage nodes */}
            {stages.map((s, i) => (
                <group key={i} position={[s.x, 0, 0]}>
                    <Cylinder args={[0.55, 0.55, 1.2, 32]}>
                        <meshStandardMaterial color={s.color} emissive={s.color} emissiveIntensity={0.35} roughness={0.2} metalness={0.7} />
                    </Cylinder>
                    <Text position={[0, 1.1, 0]} fontSize={0.22} color={s.color} anchorX="center">{s.label}</Text>
                    <Text position={[0, 0, 0.6]} fontSize={0.3} color="white" anchorX="center">{s.icon}</Text>
                </group>
            ))}
            {/* Moving data packet */}
            <mesh ref={packetRef} position={[-3.5, 0, 0]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1} />
            </mesh>
            {/* Operators floating */}
            {['+', '-', '*', '/', '%'].map((op, i) => (
                <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.7} rotationIntensity={0.5}>
                    <Text
                        position={[-2 + i * 1.0, -1.8, 0]}
                        fontSize={0.35}
                        color={['#6366f1', '#10b981', '#f59e0b', '#ec4899', '#3b82f6'][i]}
                        anchorX="center"
                        fontWeight={900}
                    >
                        {op}
                    </Text>
                </Float>
            ))}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 5. DECISION DIAMOND — Module: Conditional Statements
//    Concept: Diamond decision node with True/False branches
// ─────────────────────────────────────────────────────────────────
const DecisionDiamond = () => {
    const diamondRef = useRef<THREE.Mesh>(null);
    const packetRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!diamondRef.current) return;
        diamondRef.current.rotation.y += 0.01;
        diamondRef.current.rotation.z = Math.sin(state.clock.getElapsedTime() * 0.8) * 0.05;

        if (!packetRef.current) return;
        const t = (state.clock.getElapsedTime() % 4) / 4;
        if (t < 0.3) {
            packetRef.current.position.set(0, 3 - t * 10, 0);
        } else if (t < 0.65) {
            const dt = (t - 0.3) / 0.35;
            packetRef.current.position.set(-dt * 3, 0 - dt * 1.5, 0);
        } else {
            const dt = (t - 0.65) / 0.35;
            packetRef.current.position.set(-3 + dt * 3, -1.5, 0);
        }
    });
    return (
        <group>
            {/* Diamond decision */}
            <mesh ref={diamondRef} rotation={[0, 0, Math.PI / 4]}>
                <octahedronGeometry args={[1.1]} />
                <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} roughness={0.1} metalness={0.8} />
            </mesh>
            <Text position={[0, 0, 1.2]} fontSize={0.2} color="white" anchorX="center">if age {'>'}= 18</Text>

            {/* True branch */}
            <Line points={[new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(-3, -2.5, 0)]} color="#10b981" lineWidth={2.5} />
            <Float speed={2} floatIntensity={0.3}>
                <Box args={[2, 0.7, 0.5]} position={[-3, -3.2, 0]}>
                    <meshStandardMaterial color="#10b981" transparent opacity={0.8} roughness={0.3} />
                </Box>
            </Float>
            <Text position={[-3, -3.2, 0.3]} fontSize={0.2} color="white" anchorX="center">✓ True: Adult</Text>
            <Text position={[-1.5, -1.6, 0]} fontSize={0.22} color="#10b981" anchorX="center">TRUE</Text>

            {/* False branch */}
            <Line points={[new THREE.Vector3(0, -1.1, 0), new THREE.Vector3(3, -2.5, 0)]} color="#ef4444" lineWidth={2.5} />
            <Float speed={1.5} floatIntensity={0.3}>
                <Box args={[2, 0.7, 0.5]} position={[3, -3.2, 0]}>
                    <meshStandardMaterial color="#ef4444" transparent opacity={0.8} roughness={0.3} />
                </Box>
            </Float>
            <Text position={[3, -3.2, 0.3]} fontSize={0.2} color="white" anchorX="center">✗ False: Child</Text>
            <Text position={[1.5, -1.6, 0]} fontSize={0.22} color="#ef4444" anchorX="center">FALSE</Text>

            {/* Entry line */}
            <Line points={[new THREE.Vector3(0, 3, 0), new THREE.Vector3(0, 1.1, 0)]} color="#6366f1" lineWidth={2} />
            <Text position={[0, 3.5, 0]} fontSize={0.2} color="#6366f1" anchorX="center">INPUT</Text>

            {/* Moving packet */}
            <mesh ref={packetRef} position={[0, 3, 0]}>
                <sphereGeometry args={[0.18, 16, 16]} />
                <meshStandardMaterial color="white" emissive="white" emissiveIntensity={1.5} />
            </mesh>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 6. LOGIC GATES — Module: Logical Expressions (and/or/not)
//    Concept: Boolean gates wiring truth values
// ─────────────────────────────────────────────────────────────────
const LogicGates = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.3;
    });
    const gates = [
        { label: 'AND', x: 0, y: 1.5, color: '#6366f1', desc: 'Both True' },
        { label: 'OR', x: -2.5, y: -1, color: '#10b981', desc: 'One True' },
        { label: 'NOT', x: 2.5, y: -1, color: '#f43f5e', desc: 'Invert' },
    ];
    return (
        <group ref={groupRef}>
            {gates.map((g, i) => (
                <group key={i} position={[g.x, g.y, 0]}>
                    <Float speed={1.5 + i * 0.3} floatIntensity={0.4}>
                        <mesh rotation={[0, 0, Math.PI / 4]}>
                            <octahedronGeometry args={[0.7]} />
                            <MeshWobbleMaterial color={g.color} speed={2} factor={0.3} emissive={g.color} emissiveIntensity={0.45} />
                        </mesh>
                        <Text position={[0, 0, 0.75]} fontSize={0.25} color="white" anchorX="center" fontWeight="bold">{g.label}</Text>
                        <Text position={[0, -1.05, 0]} fontSize={0.17} color={g.color} anchorX="center">{g.desc}</Text>
                    </Float>
                </group>
            ))}
            {/* Wires between gates */}
            {[[0, 1.5, 0], [-2.5, -1, 0]].map((_, i) => (
                <Line key={i} points={[
                    new THREE.Vector3(gates[0].x, gates[0].y - 0.7, 0),
                    new THREE.Vector3(gates[i + 1].x, gates[i + 1].y + 0.7, 0)
                ]} color="#334155" lineWidth={1.5} dashed dashSize={0.1} gapSize={0.05} />
            ))}
            {/* Truth inputs */}
            {['T', 'F', 'T', 'F'].map((v, i) => (
                <Float key={i} speed={2} floatIntensity={0.6}>
                    <Sphere args={[0.25, 16, 16]} position={[-3 + i * 2, 3.2, 0]}>
                        <meshStandardMaterial color={v === 'T' ? '#10b981' : '#ef4444'} emissive={v === 'T' ? '#10b981' : '#ef4444'} emissiveIntensity={0.5} />
                    </Sphere>
                    <Text position={[-3 + i * 2, 3.8, 0]} fontSize={0.22} color={v === 'T' ? '#10b981' : '#ef4444'} anchorX="center">{v}</Text>
                </Float>
            ))}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 7. LOOP CAROUSEL — Module: for & while Loops
//    Concept: Rotating ring of iteration steps
// ─────────────────────────────────────────────────────────────────
const LoopCarousel = () => {
    const groupRef = useRef<THREE.Group>(null);
    const tickRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!groupRef.current) return;
        groupRef.current.rotation.z -= 0.015;
        if (!tickRef.current) return;
        const t = state.clock.getElapsedTime();
        tickRef.current.rotation.z = -t * 1.5;
    });
    const COUNT = 8;
    return (
        <group>
            {/* Center axis */}
            <Cylinder args={[0.15, 0.15, 0.5, 16]} rotation={[Math.PI / 2, 0, 0]}>
                <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.8} />
            </Cylinder>

            {/* Ring of iteration nodes */}
            <group ref={groupRef}>
                {[...Array(COUNT)].map((_, i) => {
                    const angle = (i / COUNT) * Math.PI * 2;
                    const R = 2.2;
                    const x = Math.cos(angle) * R;
                    const y = Math.sin(angle) * R;
                    const active = i % 3 === 0;
                    return (
                        <group key={i} position={[x, y, 0]}>
                            <Sphere args={[active ? 0.38 : 0.22, 16, 16]}>
                                <meshStandardMaterial
                                    color={active ? '#10b981' : '#334155'}
                                    emissive={active ? '#10b981' : '#1e293b'}
                                    emissiveIntensity={active ? 0.6 : 0.1}
                                />
                            </Sphere>
                            <Text position={[0, -0.55, 0]} fontSize={0.2} color={active ? '#10b981' : '#475569'} anchorX="center">{i}</Text>
                        </group>
                    );
                })}
            </group>

            {/* Orbit torus */}
            <Torus args={[2.2, 0.025, 8, 80]}>
                <meshStandardMaterial color="#10b981" transparent opacity={0.3} />
            </Torus>

            {/* Tick arrow */}
            <mesh ref={tickRef}>
                <Cone args={[0.18, 0.5, 16]} position={[2.2, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
                    <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.7} />
                </Cone>
            </mesh>

            <Text position={[0, 0, 0.2]} fontSize={0.28} color="#6366f1" anchorX="center" fontWeight="bold">i=0..7</Text>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 8. DEBUG MICROSCOPE — Module: Debugging Logical Errors
//    Concept: Scanning code for errors with a beam
// ─────────────────────────────────────────────────────────────────
const DebugMicroscope = () => {
    const beamRef = useRef<THREE.Mesh>(null);
    const scanY = useRef(2.0);
    useFrame((state) => {
        if (!beamRef.current) return;
        scanY.current = 2.0 - ((state.clock.getElapsedTime() * 0.6) % 4.5);
        beamRef.current.position.y = scanY.current;
    });
    const lines = [
        { code: 'if age > 18:', color: '#94a3b8', hasError: false },
        { code: '    print("adult")', color: '#94a3b8', hasError: false },
        { code: 'if age > 18:', color: '#ef4444', hasError: true },  // duplicate = wrong
        { code: 'x = 5 / 0', color: '#f59e0b', hasError: true },
        { code: 'while True:', color: '#ef4444', hasError: true },
        { code: '    pass # fixed', color: '#10b981', hasError: false },
    ];
    return (
        <group>
            {/* Code lines */}
            {lines.map((l, i) => (
                <group key={i} position={[-0.5, 2 - i * 0.75, 0]}>
                    <Box args={[4.5, 0.55, 0.08]}>
                        <meshStandardMaterial
                            color={l.hasError ? '#1a0a0a' : '#0f172a'}
                            transparent opacity={0.85}
                        />
                    </Box>
                    {l.hasError && (
                        <lineSegments>
                            <edgesGeometry args={[new THREE.BoxGeometry(4.5, 0.55, 0.08)]} />
                            <lineBasicMaterial color={l.color} />
                        </lineSegments>
                    )}
                    <Text position={[0, 0, 0.06]} fontSize={0.175} color={l.color} anchorX="center">{l.code}</Text>
                </group>
            ))}
            {/* Scanning beam */}
            <mesh ref={beamRef} position={[0, 2, 0]}>
                <planeGeometry args={[6, 0.08]} />
                <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={2} transparent opacity={0.7} />
            </mesh>
            {/* Error indicator */}
            <Float speed={3} floatIntensity={0.5}>
                <Sphere args={[0.3, 16, 16]} position={[2.8, 0.5, 0]}>
                    <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.8} />
                </Sphere>
                <Text position={[2.8, 1.0, 0]} fontSize={0.2} color="#ef4444" anchorX="center">ERR</Text>
            </Float>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 9. FUNCTION PORTAL — Module: Functions
//    Concept: Input enters a portal, gets processed, output exits
// ─────────────────────────────────────────────────────────────────
const FunctionPortal = () => {
    const ringRef = useRef<THREE.Mesh>(null);
    const inPacket = useRef<THREE.Mesh>(null);
    const outPacket = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!ringRef.current) return;
        ringRef.current.rotation.z += 0.02;
        ringRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.15;
        const t = (state.clock.getElapsedTime() % 3) / 3;
        if (inPacket.current) inPacket.current.position.x = -4 + t * 3.5;
        if (outPacket.current) outPacket.current.position.x = -0.5 + t * 4.5;
    });
    return (
        <group>
            {/* Portal ring */}
            <mesh ref={ringRef}>
                <Torus args={[1.2, 0.12, 16, 80]}>
                    <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.6} roughness={0.1} metalness={0.9} />
                </Torus>
            </mesh>
            {/* Portal glow inside */}
            <mesh>
                <circleGeometry args={[1.0, 64]} />
                <meshStandardMaterial color="#4338ca" transparent opacity={0.25} emissive="#6366f1" emissiveIntensity={0.4} />
            </mesh>
            {/* Function def label */}
            <Text position={[0, 1.7, 0]} fontSize={0.24} color="#818cf8" anchorX="center" fontWeight="bold">def calculate(x):</Text>
            {/* Labels */}
            <Text position={[-3.5, 0.7, 0]} fontSize={0.2} color="#94a3b8" anchorX="center">INPUT</Text>
            <Text position={[3.5, 0.7, 0]} fontSize={0.2} color="#10b981" anchorX="center">RETURN</Text>
            {/* Input packet */}
            <mesh ref={inPacket} position={[-4, 0, 0]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={1} />
            </mesh>
            {/* Output packet */}
            <mesh ref={outPacket} position={[0, 0, 0]}>
                <sphereGeometry args={[0.22, 16, 16]} />
                <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={1} />
            </mesh>
            {/* Flow lines */}
            <Line points={[new THREE.Vector3(-4.5, 0, 0), new THREE.Vector3(-1.2, 0, 0)]} color="#3b82f6" lineWidth={2} dashed dashSize={0.1} gapSize={0.05} />
            <Line points={[new THREE.Vector3(1.2, 0, 0), new THREE.Vector3(4.5, 0, 0)]} color="#10b981" lineWidth={2} />
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 10. LIST ARRAY TRAIN — Module: Lists & Tuples
//     Concept: A chain of indexed slots representing list elements
// ─────────────────────────────────────────────────────────────────
const ListArrayTrain = () => {
    const trainRef = useRef<THREE.Group>(null);
    useFrame((state) => {
        if (!trainRef.current) return;
        trainRef.current.position.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.5;
    });
    const items = [
        { val: '10', color: '#6366f1' },
        { val: '20', color: '#8b5cf6' },
        { val: '30', color: '#10b981' },
        { val: '40', color: '#f59e0b' },
        { val: '50', color: '#ec4899' },
    ];
    return (
        <group ref={trainRef}>
            <Text position={[0, 2.2, 0]} fontSize={0.25} color="#94a3b8" anchorX="center">numbers = [10, 20, 30, 40, 50]</Text>
            {items.map((item, i) => (
                <group key={i} position={[-4 + i * 2, 0, 0]}>
                    {/* Index box */}
                    <Box args={[1.5, 1.8, 0.6]}>
                        <meshStandardMaterial color={item.color} transparent opacity={0.7} roughness={0.2} metalness={0.6} />
                    </Box>
                    <lineSegments>
                        <edgesGeometry args={[new THREE.BoxGeometry(1.5, 1.8, 0.6)]} />
                        <lineBasicMaterial color="white" />
                    </lineSegments>
                    {/* Value */}
                    <Text position={[0, 0.15, 0.35]} fontSize={0.35} color="white" anchorX="center" fontWeight="bold">{item.val}</Text>
                    {/* Index label */}
                    <Text position={[0, -0.65, 0.35]} fontSize={0.18} color="rgba(255,255,255,0.5)" anchorX="center">[{i}]</Text>
                    {/* Connector */}
                    {i < items.length - 1 && (
                        <Line points={[new THREE.Vector3(0.75, 0, 0), new THREE.Vector3(1.25, 0, 0)]} color="#334155" lineWidth={4} />
                    )}
                </group>
            ))}
            {/* Tuple below - immutable */}
            <group position={[0, -2.2, 0]}>
                <Text position={[0, 0.5, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">TUPLE (immutable) = (1, 2, 3)</Text>
                {[1, 2, 3].map((v, i) => (
                    <group key={i} position={[-1.2 + i * 1.2, -0.3, 0]}>
                        <Sphere args={[0.35, 16, 16]}>
                            <MeshWobbleMaterial color="#475569" speed={0} factor={0} />
                        </Sphere>
                        <Text position={[0, 0, 0.4]} fontSize={0.22} color="#64748b" anchorX="center">{v}</Text>
                    </group>
                ))}
            </group>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 11. DICTIONARY KEYMAP — Module: Dictionaries & Strings
//     Concept: Keys orbiting a central value store
// ─────────────────────────────────────────────────────────────────
const DictionaryKeymap = () => {
    const groupRef = useRef<THREE.Group>(null);
    useFrame(() => {
        if (!groupRef.current) return;
        groupRef.current.rotation.y += 0.006;
    });
    const entries = [
        { key: 'name', val: '"Sara"', color: '#6366f1', angle: 0 },
        { key: 'age', val: '21', color: '#10b981', angle: Math.PI * 2 / 3 },
        { key: 'city', val: '"Mumbai"', color: '#f59e0b', angle: Math.PI * 4 / 3 },
    ];
    const R = 2.8;
    return (
        <group ref={groupRef}>
            {/* Central dict store */}
            <mesh>
                <octahedronGeometry args={[0.7]} />
                <MeshDistortMaterial color="#4c1d95" speed={2} distort={0.35} emissive="#6366f1" emissiveIntensity={0.7} />
            </mesh>
            <Text position={[0, 0, 0.8]} fontSize={0.2} color="white" anchorX="center">dict{}</Text>

            {entries.map((e, i) => {
                const x = Math.cos(e.angle) * R;
                const z = Math.sin(e.angle) * R;
                return (
                    <group key={i} position={[x, 0, z]}>
                        {/* Key */}
                        <Box args={[1.5, 0.6, 0.4]}>
                            <meshStandardMaterial color={e.color} transparent opacity={0.8} roughness={0.3} />
                        </Box>
                        <Text position={[0, 0.05, 0.22]} fontSize={0.18} color="white" anchorX="center">"{e.key}"</Text>
                        {/* Value */}
                        <Box args={[1.5, 0.6, 0.4]} position={[0, -0.8, 0]}>
                            <meshStandardMaterial color="#1e293b" transparent opacity={0.9} roughness={0.1} />
                        </Box>
                        <lineSegments position={[0, -0.8, 0]}>
                            <edgesGeometry args={[new THREE.BoxGeometry(1.5, 0.6, 0.4)]} />
                            <lineBasicMaterial color={e.color} />
                        </lineSegments>
                        <Text position={[0, -0.75, 0.22]} fontSize={0.18} color={e.color} anchorX="center">{e.val}</Text>

                        {/* Wire to center */}
                        <Line
                            points={[new THREE.Vector3(0, 0, 0), new THREE.Vector3(-x * 0.85, 0, -z * 0.85)]}
                            color={e.color}
                            lineWidth={1.5}
                            transparent
                            opacity={0.4}
                        />
                    </group>
                );
            })}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 12. FILE CABINET — Module: File Handling
//     Concept: Data drawers opening and closing
// ─────────────────────────────────────────────────────────────────
const FileCabinet = () => {
    const drawer1 = useRef<THREE.Group>(null);
    const drawer2 = useRef<THREE.Group>(null);
    useFrame((state) => {
        const t = state.clock.getElapsedTime();
        if (drawer1.current) drawer1.current.position.z = 0.4 + Math.abs(Math.sin(t * 0.7)) * 0.8;
        if (drawer2.current) drawer2.current.position.z = 0.4 + Math.abs(Math.sin(t * 0.7 + Math.PI)) * 0.8;
    });
    const modes = ['"r" Read', '"w" Write', '"a" Append', '"x" Create'];
    return (
        <group>
            {/* Cabinet body */}
            <Box args={[3, 4, 1.5]} position={[0, 0, -0.5]}>
                <meshStandardMaterial color="#1e293b" roughness={0.4} metalness={0.8} />
            </Box>
            <lineSegments position={[0, 0, -0.5]}>
                <edgesGeometry args={[new THREE.BoxGeometry(3, 4, 1.5)]} />
                <lineBasicMaterial color="#334155" />
            </lineSegments>

            {/* Drawer 1 - read */}
            <group ref={drawer1} position={[0, 0.8, 0]}>
                <Box args={[2.6, 1.0, 0.5]}>
                    <meshStandardMaterial color="#3b82f6" transparent opacity={0.8} roughness={0.2} />
                </Box>
                <Text position={[0, 0, 0.28]} fontSize={0.2} color="white" anchorX="center">"r" mode — READ</Text>
            </group>

            {/* Drawer 2 - write */}
            <group ref={drawer2} position={[0, -0.8, 0]}>
                <Box args={[2.6, 1.0, 0.5]}>
                    <meshStandardMaterial color="#10b981" transparent opacity={0.8} roughness={0.2} />
                </Box>
                <Text position={[0, 0, 0.28]} fontSize={0.2} color="white" anchorX="center">"w" mode — WRITE</Text>
            </group>

            {/* Mode labels floating */}
            {modes.map((m, i) => (
                <Float key={i} speed={1.5 + i * 0.3} floatIntensity={0.5}>
                    <Text
                        position={[-3.8 + (i % 2) * 3.8, 2.2 - Math.floor(i / 2) * 1.2, 0]}
                        fontSize={0.18}
                        color={['#3b82f6', '#10b981', '#f59e0b', '#6366f1'][i]}
                        anchorX="center"
                    >
                        {m}
                    </Text>
                </Float>
            ))}

            <Text position={[0, 2.8, 0]} fontSize={0.22} color="#94a3b8" anchorX="center">open("data.txt", mode)</Text>
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// 13. TRY-EXCEPT SHIELD — Module: Error Handling & Modular Design
//     Concept: A shield catching error projectiles
// ─────────────────────────────────────────────────────────────────
const TryExceptShield = () => {
    const shieldRef = useRef<THREE.Mesh>(null);
    const errRef = useRef<THREE.Mesh>(null);
    useFrame((state) => {
        if (!shieldRef.current) return;
        shieldRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.6) * 0.3;
        if (!errRef.current) return;
        const t = (state.clock.getElapsedTime() % 2.5) / 2.5;
        errRef.current.position.x = -5 + t * 4.5;
        errRef.current.position.y = Math.sin(t * Math.PI * 2) * 0.5;
        const hit = t > 0.85;
        (errRef.current.material as THREE.MeshStandardMaterial).color.set(hit ? '#ef4444' : '#f59e0b');
        (errRef.current.material as THREE.MeshStandardMaterial).emissive.set(hit ? '#ef4444' : '#f59e0b');
    });
    return (
        <group>
            {/* TRY zone */}
            <Box args={[5.5, 3.5, 0.1]} position={[-1.5, 0, -0.5]}>
                <meshStandardMaterial color="#0f172a" transparent opacity={0.5} />
            </Box>
            <lineSegments position={[-1.5, 0, -0.5]}>
                <edgesGeometry args={[new THREE.BoxGeometry(5.5, 3.5, 0.1)]} />
                <lineBasicMaterial color="#6366f1" />
            </lineSegments>
            <Text position={[-1.5, 1.95, 0]} fontSize={0.22} color="#6366f1" anchorX="center">try:</Text>

            {/* Shield */}
            <mesh ref={shieldRef} position={[0.5, 0, 0]}>
                <Cylinder args={[1.3, 1.0, 0.25, 6]}>
                    <meshStandardMaterial color="#6366f1" emissive="#6366f1" emissiveIntensity={0.5} roughness={0.1} metalness={0.9} transparent opacity={0.85} />
                </Cylinder>
            </mesh>
            <Text position={[0.5, 0, 0.15]} fontSize={0.22} color="white" anchorX="center">except:</Text>

            {/* Error projectile */}
            <mesh ref={errRef} position={[-5, 0, 0]}>
                <octahedronGeometry args={[0.3]} />
                <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.8} />
            </mesh>

            {/* Caught error */}
            <Float speed={2} floatIntensity={0.5}>
                <Sphere args={[0.25, 16, 16]} position={[3.2, 0, 0]}>
                    <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={0.6} />
                </Sphere>
                <Text position={[3.2, 0.7, 0]} fontSize={0.18} color="#10b981" anchorX="center">HANDLED</Text>
            </Float>

            {/* Error types */}
            {['ValueError', 'ZeroDivisionError', 'FileNotFoundError'].map((e, i) => (
                <Float key={i} speed={1 + i * 0.4} floatIntensity={0.3}>
                    <Text position={[-4.5 + i * 1.8, -2.2, 0]} fontSize={0.16} color="#ef4444" anchorX="center">{e}</Text>
                </Float>
            ))}
        </group>
    );
};

// ─────────────────────────────────────────────────────────────────
// ROUTER — maps conceptName → the right 3D scene
// ─────────────────────────────────────────────────────────────────
const ConceptVisualizer3D: React.FC<ConceptVisualizer3DProps> = ({ block }) => {
    const renderConcept = () => {
        const name = block.conceptName.toLowerCase();
        if (name.includes('variable box') || name.includes('intro') || name.includes('programming')) return <VariableBox />;
        if (name.includes('indentation') || name.includes('syntax') || name.includes('staircase')) return <IndentationStaircase />;
        if (name.includes('data type') || name.includes('atom') || name.includes('types')) return <DataTypeAtoms />;
        if (name.includes('pipeline') || name.includes('input') || name.includes('output') || name.includes('operator')) return <IOPipeline />;
        if (name.includes('decision') || name.includes('conditional') || name.includes('diamond') || name.includes('if-else')) return <DecisionDiamond />;
        if (name.includes('logic gate') || name.includes('boolean') || name.includes('and or not')) return <LogicGates />;
        if (name.includes('loop') || name.includes('carousel') || name.includes('iteration')) return <LoopCarousel />;
        if (name.includes('debug') || name.includes('microscope') || name.includes('error scan')) return <DebugMicroscope />;
        if (name.includes('function') || name.includes('portal') || name.includes('def')) return <FunctionPortal />;
        if (name.includes('list') || name.includes('array') || name.includes('tuple') || name.includes('train')) return <ListArrayTrain />;
        if (name.includes('dictionary') || name.includes('keymap') || name.includes('dict')) return <DictionaryKeymap />;
        if (name.includes('file') || name.includes('cabinet') || name.includes('handling')) return <FileCabinet />;
        if (name.includes('try') || name.includes('except') || name.includes('shield') || name.includes('error handling')) return <TryExceptShield />;
        // Variable scope legacy support
        if (name.includes('scope') || name.includes('variable scope')) return <VariableBox />;

        // Fallback - animated distort sphere
        return (
            <Float speed={5} rotationIntensity={2} floatIntensity={2}>
                <Sphere args={[1, 64, 64]}>
                    <MeshDistortMaterial color="#6366f1" speed={2} distort={0.5} emissive="#6366f1" emissiveIntensity={0.3} />
                </Sphere>
            </Float>
        );
    };

    return (
        <div className="w-full h-full bg-[#050506]/50 rounded-[2rem] overflow-hidden border border-white/5 relative">
            <Canvas shadows dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: 'high-performance' }}>
                <PerspectiveCamera makeDefault position={[0, 0, 7]} fov={45} />
                <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.4} />

                <ambientLight intensity={0.25} />
                <pointLight position={[10, 10, 10]} intensity={1.5} color="#818cf8" />
                <pointLight position={[-10, -10, -10]} intensity={0.6} color="#10b981" />
                <pointLight position={[0, 5, -5]} intensity={0.4} color="#f59e0b" />

                <Stars radius={100} depth={50} count={800} factor={4} saturation={0} fade speed={1} />

                {renderConcept()}

                <fog attach="fog" args={['#050506', 8, 18]} />
            </Canvas>

            {/* Overlays */}
            <div className="absolute top-6 left-6 pointer-events-none">
                <div className="flex items-center gap-2 mb-1">
                    <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                    <span className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic">3D Concept Engine</span>
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">{block.conceptName}</h3>
                <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">{block.pythonConcept}</p>
            </div>

            <div className="absolute top-6 right-6 pointer-events-none">
                <div className="text-[9px] font-black text-white/20 uppercase tracking-widest text-right">
                    <div>Drag to Rotate</div>
                    <div className="text-white/10">{block.interactionType}</div>
                </div>
            </div>

            <div className="absolute bottom-6 left-6 right-6 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-md p-3 rounded-2xl border border-white/5">
                    <p className="text-[10px] text-slate-400 leading-relaxed italic">{block.visualDescription}</p>
                </div>
            </div>
        </div>
    );
};

export default ConceptVisualizer3D;
