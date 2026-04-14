import React, { useRef, useEffect, useState } from 'react';
import { useFaceAnalysis } from '../hooks/useFaceAnalysis';
import { useInterview } from '../context/InterviewContext';
import { Camera, AlertCircle, Loader2 } from 'lucide-react';

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

  // Get expression emoji
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
      <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white p-6">
          <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin text-blue-400" />
          <p className="text-sm">Loading face detection models...</p>
        </div>
      </div>
    );
  }

  if (cameraError) {
    return (
      <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg aspect-video flex items-center justify-center">
        <div className="text-center text-white p-6">
          <AlertCircle className="w-12 h-12 mx-auto mb-2 text-red-400" />
          <p className="text-sm">{cameraError}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-900 shadow-lg">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="w-full h-auto"
        style={{ transform: 'scaleX(-1)' }} // Mirror the video
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full pointer-events-none"
        style={{ transform: 'scaleX(-1)' }} // Mirror the canvas to match video
      />

      {/* Status Overlay */}
      <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm text-white px-3 py-2 rounded-lg text-sm">
        <div className="flex items-center gap-2">
          <Camera className="w-4 h-4" />
          <span>{faceData.isDetected ? 'Face Detected' : 'No Face Detected'}</span>
        </div>
        {faceData.isDetected && (
          <div className="mt-2 space-y-1 text-xs">
            <div className="flex items-center justify-between gap-4">
              <span>Eye Contact:</span>
              <span className={faceData.eyeContact >= 70 ? 'text-green-400' : faceData.eyeContact >= 40 ? 'text-yellow-400' : 'text-red-400'}>
                {faceData.eyeContact}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Confidence:</span>
              <span className={faceData.confidence >= 70 ? 'text-green-400' : faceData.confidence >= 40 ? 'text-yellow-400' : 'text-red-400'}>
                {faceData.confidence}%
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <span>Expression:</span>
              <span className={`${getExpressionColor(faceData.expression)} flex items-center gap-1`}>
                {getExpressionEmoji(faceData.expression)} {faceData.expression}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Face Detection Indicator */}
      {!faceData.isDetected && isActive && isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <AlertCircle className="w-12 h-12 mx-auto mb-2 animate-pulse" />
            <p className="font-medium">Please position your face in the camera</p>
            <p className="text-sm text-gray-300 mt-1">Make sure your face is well-lit</p>
          </div>
        </div>
      )}

      {/* Loading indicator while camera initializes */}
      {isActive && !isCameraReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="text-center text-white">
            <Loader2 className="w-12 h-12 mx-auto mb-2 animate-spin" />
            <p>Initializing camera...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default FaceDetection;
