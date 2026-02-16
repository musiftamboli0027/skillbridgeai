import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Play, RotateCcw, Zap, Target, Gauge } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdvancedDecisionVisualizer: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [inputValue, setInputValue] = useState(50);
    const [threshold, setThreshold] = useState(40);
    const [isRunning, setIsRunning] = useState(false);
    const [result, setResult] = useState<'true' | 'false' | null>(null);

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

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, containerRef.current.clientWidth / containerRef.current.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
        renderer.setPixelRatio(window.devicePixelRatio);
        containerRef.current.appendChild(renderer.domElement);

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
        scene.add(ambientLight);
        const pointLight = new THREE.PointLight(0x3b82f6, 2);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        // Decision Node (Diamond style - Golden Glow)
        const geometry = new THREE.OctahedronGeometry(1);
        const material = new THREE.MeshStandardMaterial({
            color: 0x3b82f6,
            emissive: 0x3b82f6,
            emissiveIntensity: 1,
            metalness: 0.8,
            roughness: 0.2
        });
        const decisionNode = new THREE.Mesh(geometry, material);
        scene.add(decisionNode);

        // Ball
        const ballGeo = new THREE.SphereGeometry(0.4, 32, 32);
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 0.5 });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.position.set(-8, 0, 0);
        scene.add(ball);

        // Grid/Floor for depth
        const grid = new THREE.GridHelper(20, 20, 0x1e293b, 0x0f172a);
        grid.rotation.x = Math.PI / 2;
        grid.position.z = -2;
        scene.add(grid);

        const createPath = (points: THREE.Vector3[], color: number) => {
            const curve = new THREE.CatmullRomCurve3(points);
            const geometry = new THREE.BufferGeometry().setFromPoints(curve.getPoints(50));
            const material = new THREE.LineBasicMaterial({ color, opacity: 0.2, transparent: true, linewidth: 2 });
            return new THREE.Line(geometry, material);
        };

        const truePath = createPath([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 2, 0),
            new THREE.Vector3(8, 2, 0)
        ], 0x10b981);

        const falsePath = createPath([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, -2, 0),
            new THREE.Vector3(8, -2, 0)
        ], 0xef4444);

        scene.add(truePath);
        scene.add(falsePath);

        camera.position.z = 10;

        sceneRef.current = { scene, camera, renderer, ball, decisionNode, paths: { true: truePath, false: falsePath } };

        const animate = () => {
            requestAnimationFrame(animate);
            decisionNode.rotation.y += 0.02;
            decisionNode.rotation.z += 0.01;
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

        const { ball, decisionNode } = sceneRef.current;
        const isTrue = inputValue >= threshold;
        const targetColor = isTrue ? 0x10b981 : 0xef4444;

        setIsRunning(true);
        setResult(null);

        ball.position.set(-8, 0, 0);
        (ball.material as THREE.MeshStandardMaterial).color.setHex(0xffffff);

        const curve = new THREE.CatmullRomCurve3(isTrue ? [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, 2, 0),
            new THREE.Vector3(8, 2, 0)
        ] : [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(3, -2, 0),
            new THREE.Vector3(8, -2, 0)
        ]);

        let progress = 0;
        const speed = 0.015;

        const animateBall = () => {
            progress += speed;

            if (progress <= 0.5) {
                const t = progress * 2;
                ball.position.x = -8 + (t * 8);
            } else if (progress <= 1) {
                const t = (progress - 0.5) * 2;
                ball.position.copy(curve.getPoint(t));
                (ball.material as THREE.MeshStandardMaterial).color.lerp(new THREE.Color(targetColor), 0.1);
                (decisionNode.material as THREE.MeshStandardMaterial).emissive.lerp(new THREE.Color(targetColor), 0.05);
            }

            if (progress < 1) {
                requestAnimationFrame(animateBall);
            } else {
                setIsRunning(false);
                setResult(isTrue ? 'true' : 'false');
                setTimeout(() => {
                    (decisionNode.material as THREE.MeshStandardMaterial).emissive.setHex(0x3b82f6);
                }, 1000);
            }
        };

        animateBall();
    };

    return (
        <div className="flex flex-col lg:flex-row gap-8 min-h-[600px] animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Control Panel */}
            <div className="flex-1 space-y-8 bg-white/5 p-8 rounded-[2.5rem] border border-white/5 backdrop-blur-md shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-[60px] -z-10" />

                <div>
                    <h3 className="text-2xl font-black text-white mb-2 italic">Visual Logic Flow</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">
                        Adjust the input and threshold to see how JavaScript makes decisions.
                        Green follows the true path, Red follows the false path.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Input Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Gauge size={12} className="text-blue-400" /> Input Value (Variable)
                            </label>
                            <span className="text-2xl font-black text-white">{inputValue}</span>
                        </div>
                        <div className="relative pt-2">
                            <input
                                type="range" min="0" max="100" value={inputValue}
                                onChange={(e) => setInputValue(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
                                <span>0</span>
                                <span>50</span>
                                <span>100</span>
                            </div>
                        </div>
                    </div>

                    {/* Threshold Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Target size={12} className="text-indigo-400" /> Decision Threshold
                            </label>
                            <span className="text-2xl font-black text-white">{threshold}</span>
                        </div>
                        <div className="relative pt-2">
                            <input
                                type="range" min="0" max="100" value={threshold}
                                onChange={(e) => setThreshold(parseInt(e.target.value))}
                                className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-indigo-500"
                            />
                            <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-600">
                                <span>0</span>
                                <span>40</span>
                                <span>100</span>
                            </div>
                        </div>
                    </div>

                    {/* Code Preview */}
                    <div className="bg-black/40 p-6 rounded-2xl border border-white/5 font-mono text-sm group/code">
                        <span className="text-purple-400">if</span> (
                        <span className="text-blue-300">input</span> {`>=`} <span className="text-blue-300">threshold</span>
                        ) {'{'}
                        <div className={`pl-4 transition-all duration-300 ${isCurrentlyTrue ? 'text-emerald-400 scale-105 origin-left' : 'text-slate-600'}`}>
                            return <span className="text-emerald-300">"True Path"</span>;
                        </div>
                        {'}'} <span className="text-purple-400">else</span> {'{'}
                        <div className={`pl-4 transition-all duration-300 ${!isCurrentlyTrue ? 'text-red-400 scale-105 origin-left' : 'text-slate-600'}`}>
                            return <span className="text-red-300">"False Path"</span>;
                        </div>
                        {'}'}
                    </div>

                    <button
                        disabled={isRunning}
                        onClick={triggerLogic}
                        className={`w-full py-5 rounded-2xl flex items-center justify-center gap-3 font-black text-xs uppercase tracking-widest transition-all shadow-2xl ${isRunning
                            ? 'bg-white/5 text-slate-500 cursor-not-allowed'
                            : 'bg-white text-black hover:bg-slate-200 active:scale-95'
                            }`}
                    >
                        {isRunning ? <RotateCcw className="animate-spin" size={16} /> : <Play size={16} fill="currentColor" />}
                        {isRunning ? 'Running...' : 'Run Animation'}
                    </button>
                </div>
            </div>

            {/* 3D Scene Container */}
            <div className="flex-[1.5] relative min-h-[500px] bg-black/20 rounded-[2.5rem] border border-white/5 overflow-hidden group/scene">
                <div ref={containerRef} className="absolute inset-0 w-full h-full" />

                {/* HUD Overlay */}
                <div className="absolute top-6 left-6 pointer-events-none space-y-2">
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Neural Sync Active</span>
                    </div>
                </div>

                <div className="absolute top-6 right-6 pointer-events-none space-y-3">
                    <div className={`px-4 py-2 rounded-full border transition-all duration-500 flex items-center gap-3 backdrop-blur-md ${isCurrentlyTrue ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400' : 'bg-black/20 border-white/5 text-slate-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${isCurrentlyTrue ? 'bg-emerald-500 shadow-[0_0_10px_#10b981]' : 'bg-slate-700'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">TRUE_OUT</span>
                    </div>
                    <div className={`px-4 py-2 rounded-full border transition-all duration-500 flex items-center gap-3 backdrop-blur-md ${!isCurrentlyTrue ? 'bg-red-500/20 border-red-500/40 text-red-400' : 'bg-black/20 border-white/5 text-slate-600'}`}>
                        <div className={`w-2 h-2 rounded-full ${!isCurrentlyTrue ? 'bg-red-500 shadow-[0_0_10px_#ef4444]' : 'bg-slate-700'}`} />
                        <span className="text-[10px] font-black uppercase tracking-widest">FALSE_OUT</span>
                    </div>
                </div>

                {/* Final Result Notification */}
                <AnimatePresence>
                    {result && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.8, y: 20 }}
                            className="absolute bottom-10 left-1/2 -translate-x-1/2"
                        >
                            <div className={`px-10 py-5 rounded-3xl shadow-2xl border-4 border-slate-900 flex flex-col items-center gap-1 ${result === 'true' ? 'bg-emerald-500' : 'bg-red-500'}`}>
                                <Zap size={20} className="text-white mb-2" fill="white" />
                                <span className="text-[10px] text-white/80 font-black uppercase tracking-[0.2em]">Determination</span>
                                <span className="text-3xl text-white font-black italic tracking-tighter uppercase">
                                    {result === 'true' ? 'Logical TRUE' : 'Logical FALSE'}
                                </span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdvancedDecisionVisualizer;
