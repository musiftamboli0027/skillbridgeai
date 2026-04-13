import React, { useRef, useEffect, useState } from 'react';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';
import { useFaceAnalysis } from '../hooks/useFaceAnalysis';
import { useInterview } from '../../../context/InterviewContext';

interface FaceDetectionProps {
  isActive: boolean;
}

const FaceDetection: React.FC<FaceDetectionProps> = ({ isActive }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { faceData, isLoading, error } = useFaceAnalysis(videoRef, canvasRef, isActive);
  const { addBehaviorData } = useInterview();
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  // Setup camera
  useEffect(() => {
    const setupCamera = async () => {
      if (!isActive) return;
      
      try {
        setCameraError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 640 },
            height: { ideal: 480 },
            facingMode: 'user',
          },
          audio: false,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (err) {
        console.error('Error accessing camera:', err);
        setCameraError('Unable to access camera. Please allow camera permissions.');
        setIsCameraReady(false);
      }
    };

    if (isActive) {
      setupCamera();
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
        setIsCameraReady(false);
      }
    };
  }, [isActive]);

  // Send behavior data to context every 5 seconds
  useEffect(() => {
    if (!isActive || !faceData.isDetected) return;

    const interval = setInterval(() => {
      addBehaviorData({
        eyeContact: faceData.eyeContact,
        confidence: faceData.confidence,
        expression: faceData.expression,
        timestamp: new Date().toISOString(),
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isActive, faceData, addBehaviorData]);

  // Get expression color
  const getExpressionColor = (expression: string): string => {
    const colors: { [key: string]: string } = {
      happy: 'text-green-400',
      neutral: 'text-blue-400',
      surprised: 'text-yellow-400',
      sad: 'text-gray-400',
      angry: 'text-red-400',
      fearful: 'text-purple-400',
      disgusted: 'text-orange-400',
      none: 'text-gray-500',
    };
    return colors[expression] || 'text-gray-400';
  };

  const getExpressionEmoji = (expression: string): string => {
    const emojis: { [key: string]: string } = {
      happy: '😊',
      neutral: '😐',
      surprised: '😲',
      sad: '😔',
      angry: '😠',
      fearful: '😨',
      disgusted: '🤢',
      none: '❓',
    };
    return emojis[expression] || '❓';
  };

  if (error) {
    return (
      <div className="relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl aspect-video flex items-center justify-center">
        <div className="text-center text-white p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/40 border border-white/10 backdrop-blur-md shadow-2xl group">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto aspect-video object-cover"
        style={{ transform: 'scaleX(-1)' }}
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: 'scaleX(-1)' }}
      />

      {/* Glassmorphism Status Overlay */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-start opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="bg-black/60 backdrop-blur-md text-white px-3 py-2 rounded-xl text-xs border border-white/10">
          <div className="flex items-center gap-2 mb-2 font-semibold">
            <Camera className="w-3.5 h-3.5 text-orange-400" />
            <span>AI ANALYSIS ACTIVE</span>
          </div>
          
          {faceData.isDetected ? (
            <div className="space-y-1.5 min-w-[120px]">
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Eye Contact</span>
                <span className={faceData.eyeContact >= 70 ? 'text-green-400' : 'text-yellow-400 font-medium'}>
                  {faceData.eyeContact}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Confidence</span>
                <span className={faceData.confidence >= 70 ? 'text-green-400' : 'text-yellow-400 font-medium'}>
                  {faceData.confidence}%
                </span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-400">Expression</span>
                <span className={`${getExpressionColor(faceData.expression)} flex items-center gap-1 font-medium capitalize`}>
                  {getExpressionEmoji(faceData.expression)} {faceData.expression}
                </span>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-red-400 font-medium">
              <AlertCircle className="w-3 h-3" />
              <span>Face Not Detected</span>
            </div>
          )}
        </div>
      </div>

      {/* Detection Indicators */}
      {!faceData.isDetected && isActive && isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
          <div className="text-center text-white max-w-[80%]">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-4 border border-red-500/50">
              <AlertCircle className="w-8 h-8 text-red-500 animate-pulse" />
            </div>
            <p className="font-semibold text-lg">Position your face</p>
            <p className="text-sm text-gray-400 mt-1">Ensure good lighting for AI behavior analysis</p>
          </div>
        </div>
      )}

      {/* Initializing State */}
      {(isLoading || (isActive && !isCameraReady)) && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md">
          <div className="text-center text-white">
            <Loader2 className="w-10 h-10 mx-auto mb-4 animate-spin text-orange-500" />
            <p className="text-sm font-medium text-gray-300">Initializing AI Eye-Tracking...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
