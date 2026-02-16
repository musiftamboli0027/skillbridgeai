import React, { useCallback, useEffect } from 'react';
import Editor from '@monaco-editor/react';

type VisualState = 'idle' | 'if' | 'else' | 'loop';

interface CodeEditorProps {
    onStateChange: (state: VisualState) => void;
    code: string;
    setCode: (code: string) => void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onStateChange, code, setCode }) => {

    const detectLogic = useCallback((value: string) => {
        const lowerCode = value.toLowerCase();

        // Check for loops (for, while, map, each)
        if (
            lowerCode.includes('for') ||
            lowerCode.includes('while') ||
            lowerCode.includes('.map') ||
            lowerCode.includes('.foreach')
        ) {
            onStateChange('loop');
            return;
        }

        // Check for branching (if-else)
        if (lowerCode.includes('else')) {
            onStateChange('else');
            return;
        }

        if (
            lowerCode.includes('if') ||
            lowerCode.includes('switch') ||
            lowerCode.includes('?')
        ) {
            onStateChange('if');
            return;
        }

        onStateChange('idle');
    }, [onStateChange]);

    const handleEditorChange = (value: string | undefined) => {
        const newValue = value || '';
        setCode(newValue);
        detectLogic(newValue);
    };

    // Initial detection on mount
    useEffect(() => {
        detectLogic(code);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="w-full h-full bg-[#1e1e1e] relative">
            <Editor
                height="100%"
                defaultLanguage="javascript"
                theme="vs-dark"
                value={code}
                onChange={handleEditorChange}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    padding: { top: 24, bottom: 24 },
                    fontFamily: "'Fira Code', 'Courier New', monospace",
                    fontWeight: "500",
                    lineHeight: 1.6,
                    cursorBlinking: "expand",
                    smoothScrolling: true,
                    contextmenu: false,
                    roundedSelection: true,
                    scrollBeyondLastLine: false,
                    automaticLayout: true,
                    renderLineHighlight: "all",
                    scrollbar: {
                        vertical: 'visible',
                        horizontal: 'visible',
                        useShadows: false,
                        verticalScrollbarSize: 10,
                        horizontalScrollbarSize: 10
                    }
                }}
            />
            {/* Syntax Indicator Corner Decor */}
            <div className="absolute top-4 right-6 pointer-events-none opacity-20">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white italic">ESNEXT_ENGINE</span>
            </div>
        </div>
    );
};

export default CodeEditor;
