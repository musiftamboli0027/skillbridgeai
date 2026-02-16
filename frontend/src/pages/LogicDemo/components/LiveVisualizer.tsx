import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Play, RefreshCw } from 'lucide-react';

const LiveVisualizer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState(50);
    const [threshold, setThreshold] = useState(40);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<'true' | 'false' | null>(null);

    // Live evaluate preview
    const isCurrentlyTrue = inputValue >= threshold;

    const sceneRef = useRef<{
        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera;
        renderer: THREE.WebGLRenderer;
        ball: THREE.Mesh;
        decisionNode: THREE.Mesh;
        paths: { true: THREE.Line; false: THREE.Line };
    } | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0xf8fafc);

        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        containerRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x3b82f6, 1);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Decision Node (Diamond style)
        const geometry = new THREE.OctahedronGeometry(0.8);
        const material = new THREE.MeshPhongMaterial({ color: 0x3b82f6, flatShading: true });
        const decisionNode = new THREE.Mesh(geometry, material);
        decisionNode.position.set(0, 0, 0);
        scene.add(decisionNode);

        // Input Ball
        const ballGeo = new THREE.SphereGeometry(0.3, 32, 32);
        const ballMat = new THREE.MeshPhongMaterial({ color: 0x64748b });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(-5, 0, 0);
        scene.add(ball);

        // Paths
        const createPath = (points: THREE.Vector3[], color: number) => {
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
            const material = new THREE.LineBasicMaterial({ color, opacity: 0.3, transparent: true });
            return new THREE.Line(geometry, material);
        };

        const truePath = createPath([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(5, 1, 0)
        ], 0x22c55e); // Green

        const falsePath = createPath([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, -1, 0),
            new THREE.Vector3(5, -1, 0)
        ], 0xef4444); // Red

        scene.add(truePath);
        scene.add(falsePath);

        camera.position.z = 7;

        sceneRef.current = { scene, camera, renderer, ball, decisionNode, paths: { true: truePath, false: falsePath } };

        const animate = () => {
            requestAnimationFrame(animate);
            decisionNode.rotation.y += 0.01;
            decisionNode.rotation.x += 0.005;
            renderer.render(scene, camera);
        };
        animate();

        const handleResize = () => {
            if (!containerRef.current) return;
            camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            if (containerRef.current) containerRef.current.removeChild(renderer.domElement);
        };
    }, []);

    const triggerLogic = () => {
        if (!sceneRef.current || isRunning) return;

        const { ball } = sceneRef.current;
        const isTrue = inputValue >= threshold;
        const targetColor = isTrue ? 0x22c55e : 0xef4444;
        const baseColor = 0x3b82f6;

        setIsRunning(true);
        setResult(null); // Clear result during animation for suspense

        // Reset ball position and appearance
        ball.position.set(-5, 0, 0);
        if (ball.material instanceof THREE.MeshPhongMaterial) {
            ball.material.color.setHex(baseColor);
        }

        const truePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, 1, 0),
            new THREE.Vector3(5, 1, 0)
        ];
        const falsePoints = [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(2, -1, 0),
            new THREE.Vector3(5, -1, 0)
        ];

        const curve = new THREE.CatmullRomCurve3(isTrue ? truePoints : falsePoints);

        let progress = 0;
        const animationStep = 0.015; // Slightly slower for better visibility

        const animateBall = (): void => {
            progress += animationStep;

            if (progress <= 0.5) {
                // Phase 1: Straight line to decision node (-5 to 0)
                const t = progress * 2; // 0 to 1
                ball.position.x = -5 + (t * 5);
                ball.position.y = 0;
                ball.position.z = 0;
            } else if (progress <= 1) {
                // Phase 2: Follow the decision path (0 to end)
                const t = (progress - 0.5) * 2; // 0 to 1
                const pos = curve.getPoint(t);
                ball.position.copy(pos);

                // Transition color
                if (ball.material instanceof THREE.MeshPhongMaterial) {
                    ball.material.color.setHex(targetColor);
                }
            }

            if (progress < 1) {
                requestAnimationFrame(animateBall);
            } else {
                // Animation complete
                setIsRunning(false);
                setResult(isTrue ? 'true' : 'false');
            }
        };

        animateBall();
    };

    return (
        <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-sm overflow-hidden flex flex-col md:flex-row gap-8 text-black">
            <div className="flex-1">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Visual Logic Flow</h3>
                    <p className="text-slate-600 text-sm">
                        Adjust the input and threshold to see how JavaScript makes decisions.
                        Green follows the <span className="text-green-600 font-bold italic">true</span> path,
                        Red follows the <span className="text-red-600 font-bold italic">false</span> path.
                    </p>
                </div>

                <div className="space-y-6">
                    <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                        <label className="block text-xs font-bold text-blue-600 uppercase tracking-wider mb-2">Input Value (Variable)</label>
                        <input
                            type="range" min="0" max="100" value={inputValue}
                            onChange={(e) => setInputValue(parseInt(e.target.value))}
                            className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                        />
                        <div className="flex justify-between mt-2 text-sm font-mono font-bold text-blue-700">
                            <span>0</span>
                            <span className="bg-white px-2 py-0.5 rounded border border-blue-200 shadow-sm">{inputValue}</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Decision Threshold</label>
                        <input
                            type="range" min="0" max="100" value={threshold}
                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-slate-600"
                        />
                        <div className="flex justify-between mt-2 text-sm font-mono text-slate-500">
                            <span>0</span>
                            <span>{threshold}</span>
                            <span>100</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-slate-300 p-4 rounded-xl font-mono text-xs">
                        <span className="text-purple-400">if</span> (
                        <span className="text-blue-300">input</span> {`>=`} <span className="text-blue-300">threshold</span>
                        ) {'{'}
                        <div className="pl-4 text-green-400">return "True Path";</div>
                        {'}'} <span className="text-purple-400">else</span> {'{'}
                        <div className="pl-4 text-red-400">return "False Path";</div>
                        {'}'}
                    </div>

                    <button
                        disabled={isRunning}
                        onClick={triggerLogic}
                        className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 font-bold transition-all shadow-lg ${isRunning
                            ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-500 hover:-translate-y-0.5 active:translate-y-0'
                            }`}
                    >
                        {isRunning ? <RefreshCw className="animate-spin" size={20} /> : <Play size={20} fill="currentColor" />}
                        {isRunning ? 'Running Logic...' : 'Run Animation'}
                    </button>
                </div>
            </div>

            <div className="flex-[1.5] relative min-h-[400px] bg-slate-50 rounded-xl border border-slate-100 overflow-hidden">
                <div ref={containerRef} className="absolute inset-0 w-full h-full" />

                {/* Labels Overlay */}
                <div className="absolute top-4 left-4 pointer-events-none">
                    <div className="bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-bold text-slate-500 shadow-sm border border-slate-100">
                        INPUT SOURCE
                    </div>
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="bg-blue-600 text-white px-3 py-1.5 rounded-full text-[10px] font-bold shadow-lg border-4 border-white">
                        DECISION ENGINE
                    </div>
                </div>
                <div className="absolute top-4 right-4 pointer-events-none space-y-2">
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border transition-all duration-300 flex items-center gap-2 ${isCurrentlyTrue ? 'bg-green-100 text-green-700 border-green-200 opacity-100' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                        <div className={`w-2 h-2 rounded-full ${isCurrentlyTrue ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        TRUE OUTPUT
                    </div>
                    <div className={`px-3 py-1.5 rounded-full text-xs font-bold shadow-sm border transition-all duration-300 flex items-center gap-2 ${!isCurrentlyTrue ? 'bg-red-100 text-red-700 border-red-200 opacity-100' : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'}`}>
                        <div className={`w-2 h-2 rounded-full ${!isCurrentlyTrue ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></div>
                        FALSE OUTPUT
                    </div>
                </div>

                {/* Final Result Badge */}
                {result && (
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-in zoom-in fade-in duration-300">
                        <div className={`px-8 py-3 rounded-2xl shadow-2xl border-4 border-white flex flex-col items-center gap-1 ${result === 'true' ? 'bg-green-500' : 'bg-red-500'}`}>
                            <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.2em]">Execution Result</span>
                            <span className="text-2xl text-white font-black uppercase italic">
                                {result === 'true' ? 'Logical TRUE' : 'Logical FALSE'}
                            </span>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LiveVisualizer;
