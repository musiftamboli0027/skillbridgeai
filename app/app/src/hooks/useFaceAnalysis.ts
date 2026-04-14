import { useEffect, useRef, useState, useCallback } from 'react';
import * as faceapi from 'face-api.js';

export interface FaceData {
  isDetected: boolean;
  eyeContact: number;
  confidence: number;
  expression: string;
  expressions?: { [key: string]: number };
}

interface UseFaceAnalysisReturn {
  faceData: FaceData;
  modelsLoaded: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useFaceAnalysis = (
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  isActive: boolean
): UseFaceAnalysisReturn => {
  const [faceData, setFaceData] = useState<FaceData>({
    isDetected: false,
    eyeContact: 0,
    confidence: 0,
    expression: 'neutral',
    expressions: {},
  });
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelsLoadingRef = useRef(false);

  // Load face-api models
  useEffect(() => {
    const loadModels = async () => {
      if (modelsLoadingRef.current || modelsLoaded) return;
      
      modelsLoadingRef.current = true;
      setIsLoading(true);
      
      const MODEL_URL = 'https://justadudewhohacks.github.io/face-api.js/models';
      
      try {
        await Promise.all([
          faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        ]);
        
        setModelsLoaded(true);
        setIsLoading(false);
        setError(null);
      } catch (err) {
        console.error('Error loading face-api models:', err);
        setError('Failed to load face detection models. Please check your internet connection.');
        setIsLoading(false);
      }
    };

    loadModels();
  }, [modelsLoaded]);

  const analyzeFace = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current || !modelsLoaded) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if video is ready
    if (video.readyState !== 4 || video.paused || video.ended) return;

    try {
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ inputSize: 416, scoreThreshold: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions();

      if (detections.length > 0) {
        const detection = detections[0];
        const landmarks = detection.landmarks;
        const expressions = detection.expressions;

        // Calculate eye contact based on eye positions
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const eyeContactScore = calculateEyeContact(leftEye, rightEye, video.videoWidth, video.videoHeight);

        // Get dominant expression
        const sortedExpressions = Object.entries(expressions).sort((a, b) => b[1] - a[1]);
        const dominantExpression = sortedExpressions[0]?.[0] || 'neutral';

        // Calculate confidence based on detection score and expression clarity
        const confidenceScore = Math.round(detection.detection.score * 100);

        const newData: FaceData = {
          isDetected: true,
          eyeContact: eyeContactScore,
          confidence: confidenceScore,
          expression: dominantExpression,
          expressions: expressions as unknown as { [key: string]: number },
        };

        setFaceData(newData);

        // Draw face overlay
        const displaySize = { width: video.videoWidth, height: video.videoHeight };
        faceapi.matchDimensions(canvas, displaySize);
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          faceapi.draw.drawDetections(canvas, resizedDetections);
          faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);
        }
      } else {
        setFaceData({
          isDetected: false,
          eyeContact: 0,
          confidence: 0,
          expression: 'none',
          expressions: {},
        });
        
        // Clear canvas
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
      }
    } catch (err) {
      console.error('Error analyzing face:', err);
    }
  }, [videoRef, canvasRef, modelsLoaded]);

  useEffect(() => {
    if (isActive && modelsLoaded) {
      // Analyze immediately and then every second
      analyzeFace();
      intervalRef.current = setInterval(analyzeFace, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, modelsLoaded, analyzeFace]);

  return {
    faceData,
    modelsLoaded,
    isLoading,
    error,
  };
};

const calculateEyeContact = (
  leftEye: faceapi.Point[],
  rightEye: faceapi.Point[],
  videoWidth: number,
  videoHeight: number
): number => {
  // Calculate center of eyes
  const leftCenter = getCenter(leftEye);
  const rightCenter = getCenter(rightEye);
  const eyesCenter = {
    x: (leftCenter.x + rightCenter.x) / 2,
    y: (leftCenter.y + rightCenter.y) / 2,
  };

  // Calculate distance from center of frame (assuming user should look at center)
  const frameCenter = { x: videoWidth / 2, y: videoHeight / 2 };
  const distance = Math.sqrt(
    Math.pow(eyesCenter.x - frameCenter.x, 2) +
    Math.pow(eyesCenter.y - frameCenter.y, 2)
  );

  // Normalize to 0-100 score (closer to center = higher score)
  const maxDistance = Math.sqrt(Math.pow(videoWidth / 2, 2) + Math.pow(videoHeight / 2, 2));
  const score = Math.max(0, Math.round(100 - (distance / maxDistance) * 100));

  return score;
};

const getCenter = (points: faceapi.Point[]): { x: number; y: number } => {
  const sum = points.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y,
    }),
    { x: 0, y: 0 }
  );
  return {
    x: sum.x / points.length,
    y: sum.y / points.length,
  };
};
