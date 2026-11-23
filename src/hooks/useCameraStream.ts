import { useCallback, useEffect, useRef, useState } from 'react';
import {
  attachStreamToVideo,
  formatCameraError,
  requestCameraStream,
  stopMediaStream,
} from '../utils/camera';

export interface UseCameraStreamOptions {
  autoStart?: boolean;
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  onStarted?: () => void;
}

export function useCameraStream(options: UseCameraStreamOptions = {}) {
  const {
    autoStart = true,
    width = 640,
    height = 480,
    facingMode = 'user',
    onStarted,
  } = options;

  const videoElementRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const onStartedRef = useRef(onStarted);
  onStartedRef.current = onStarted;

  const [cameraActive, setCameraActive] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const setVideoRef = useCallback((node: HTMLVideoElement | null) => {
    videoElementRef.current = node;
    if (node && streamRef.current) {
      attachStreamToVideo(node, streamRef.current);
    }
  }, []);

  const cleanupCamera = useCallback((updateState: boolean) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (streamRef.current) {
      stopMediaStream(streamRef.current);
      streamRef.current = null;
    }
    if (videoElementRef.current) {
      videoElementRef.current.srcObject = null;
    }
    if (updateState) {
      setCameraActive(false);
      setIsLoading(false);
    }
  }, []);

  const stopCamera = useCallback(() => {
    cleanupCamera(true);
  }, [cleanupCamera]);

  const startCamera = useCallback(async (): Promise<boolean> => {
    cleanupCamera(false);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    setCameraError(null);
    setIsLoading(true);

    try {
      const stream = await requestCameraStream({
        width,
        height,
        facingMode,
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        stopMediaStream(stream);
        return false;
      }

      streamRef.current = stream;
      attachStreamToVideo(videoElementRef.current, stream);
      setCameraActive(true);
      setIsLoading(false);
      onStartedRef.current?.();
      return true;
    } catch (err: unknown) {
      if (
        controller.signal.aborted ||
        (err as { name?: string })?.name === 'AbortError'
      ) {
        return false;
      }
      const info = formatCameraError(err);
      console.warn('Camera access issue:', err);
      setCameraError(info.message);
      setCameraActive(false);
      setIsLoading(false);
      return false;
    }
  }, [cleanupCamera, facingMode, height, width]);

  useEffect(() => {
    if (autoStart) {
      startCamera();
    }
    return () => {
      cleanupCamera(false);
    };
  }, [autoStart, startCamera, cleanupCamera]);

  return {
    videoRef: setVideoRef,
    videoElementRef,
    streamRef,
    cameraActive,
    cameraError,
    isLoading,
    startCamera,
    stopCamera,
  };
}
