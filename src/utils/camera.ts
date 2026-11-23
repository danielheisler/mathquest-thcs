export type CameraErrorCode =
  | 'insecure_context'
  | 'unsupported'
  | 'permission_denied'
  | 'not_found'
  | 'in_use'
  | 'overconstrained'
  | 'unknown';

export interface CameraErrorInfo {
  code: CameraErrorCode;
  message: string;
}

export interface CameraStreamOptions {
  width?: number;
  height?: number;
  facingMode?: 'user' | 'environment';
  signal?: AbortSignal;
}

export function formatCameraError(err: unknown): CameraErrorInfo {
  const error = err as { name?: string; message?: string } | null;
  const name = error?.name || '';
  const msg = error?.message || '';

  if (typeof window !== 'undefined' && !window.isSecureContext) {
    const isZeroHost = window.location.hostname === '0.0.0.0';
    return {
      code: 'insecure_context',
      message: isZeroHost
        ? `Trình duyệt chặn Camera khi truy cập qua địa chỉ 0.0.0.0. Vui lòng đổi sang http://localhost:${window.location.port || '3000'} hoặc HTTPS.`
        : 'Trình duyệt yêu cầu kết nối bảo mật (HTTPS hoặc http://localhost) để bật Camera.',
    };
  }

  if (name === 'NotAllowedError' || name === 'PermissionDeniedError') {
    return {
      code: 'permission_denied',
      message:
        'Quyền Camera đang bị chặn bởi trình duyệt hoặc khung nhúng. Bấm biểu tượng 🔒 hoặc 🎥 trên thanh địa chỉ → chọn "Cho phép" (Allow) rồi thử lại.',
    };
  }

  if (name === 'NotFoundError' || name === 'DevicesNotFoundError') {
    return {
      code: 'not_found',
      message: 'Không tìm thấy thiết bị webcam/camera nào đang kết nối với máy.',
    };
  }

  if (name === 'NotReadableError' || name === 'TrackStartError') {
    return {
      code: 'in_use',
      message:
        'Camera đang được sử dụng bởi ứng dụng hoặc tab khác (Zoom, Google Meet, Zalo, Teams...). Hãy đóng camera ở ứng dụng đó rồi thử lại.',
    };
  }

  if (name === 'OverconstrainedError' || name === 'ConstraintNotSatisfiedError') {
    return {
      code: 'overconstrained',
      message: 'Webcam không hỗ trợ độ phân giải yêu cầu. Vui lòng thử lại.',
    };
  }

  if (name === 'SecurityError') {
    return {
      code: 'insecure_context',
      message: 'Môi trường trình duyệt hiện tại không cho phép truy cập Camera (cần HTTPS hoặc thoát iframe).',
    };
  }

  return {
    code: 'unknown',
    message: msg || 'Chưa thể bật Camera trên trình duyệt này. Vui lòng kiểm tra quyền truy cập webcam.',
  };
}

export function stopMediaStream(stream: MediaStream | null | undefined): void {
  if (!stream) return;
  try {
    stream.getTracks().forEach((track) => {
      try {
        track.stop();
      } catch {
        // Ignore individual track stop errors
      }
    });
  } catch {
    // Ignore stream stop errors
  }
}

export function attachStreamToVideo(
  video: HTMLVideoElement | null,
  stream: MediaStream | null
): void {
  if (!video) return;
  video.muted = true;
  video.playsInline = true;
  if (video.srcObject !== stream) {
    video.srcObject = stream;
  }
  if (stream) {
    video.play().catch(() => {
      // Autoplay might settle on loadedmetadata
    });
  }
}

export function drawVideoFrame(
  ctx: CanvasRenderingContext2D,
  video: HTMLVideoElement,
  width: number,
  height: number,
  mirror: boolean
): void {
  ctx.save();
  if (mirror) {
    ctx.translate(width, 0);
    ctx.scale(-1, 1);
  }
  ctx.drawImage(video, 0, 0, width, height);
  ctx.restore();
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function requestCameraStream(
  options: CameraStreamOptions = {}
): Promise<MediaStream> {
  const { width = 640, height = 480, facingMode = 'user', signal } = options;

  if (signal?.aborted) {
    throw new DOMException('Camera request aborted', 'AbortError');
  }

  if (typeof window !== 'undefined' && !window.isSecureContext) {
    const info = formatCameraError(new Error('INSECURE_CONTEXT'));
    const err = new Error(info.message);
    err.name = 'SecurityError';
    throw err;
  }

  if (
    typeof navigator === 'undefined' ||
    !navigator.mediaDevices ||
    typeof navigator.mediaDevices.getUserMedia !== 'function'
  ) {
    const err = new Error(
      'Trình duyệt không hỗ trợ API Camera (getUserMedia) hoặc đang bị tắt trong môi trường hiện tại.'
    );
    err.name = 'UnsupportedError';
    throw err;
  }

  const constraintAttempts: MediaStreamConstraints[] = [
    {
      video: {
        width: { ideal: width },
        height: { ideal: height },
        facingMode: { ideal: facingMode },
      },
      audio: false,
    },
    {
      video: { facingMode: { ideal: facingMode } },
      audio: false,
    },
    {
      video: true,
      audio: false,
    },
  ];

  let lastError: unknown = null;

  for (let i = 0; i < constraintAttempts.length; i++) {
    if (signal?.aborted) {
      throw new DOMException('Camera request aborted', 'AbortError');
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia(constraintAttempts[i]);
      if (signal?.aborted) {
        stopMediaStream(stream);
        throw new DOMException('Camera request aborted', 'AbortError');
      }
      return stream;
    } catch (err: unknown) {
      lastError = err;
      const errName = (err as { name?: string })?.name || '';

      // Permission denied or security errors won't succeed with relaxed constraints
      if (
        errName === 'NotAllowedError' ||
        errName === 'PermissionDeniedError' ||
        errName === 'SecurityError'
      ) {
        throw err;
      }

      // If previous game/component just stopped the webcam, Windows/Chrome may need a brief moment to release the device
      if ((errName === 'NotReadableError' || errName === 'TrackStartError') && i === 0) {
        await wait(250);
        continue;
      }

      // On OverconstrainedError / NotFoundError (e.g. 'environment' camera missing on PC), try relaxed constraint
    }
  }

  throw lastError || new Error('Không thể khởi động Camera.');
}
