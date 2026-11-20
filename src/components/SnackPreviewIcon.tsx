// Komponen kanvas kecil untuk merender pratinjau visual satu jenis jajanan Nusantara.

import { useEffect, useRef } from 'react';
import { drawSnack } from '../lib/snackRenderer';

interface SnackPreviewIconProps {
  tier: number;
  size?: number;
  className?: string;
}

export function SnackPreviewIcon({
  tier,
  size = 32,
  className = '',
}: SnackPreviewIconProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) {
      return;
    }
    const dpr = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, size, size);
    const radius = size * 0.44;
    drawSnack(ctx, tier, size / 2, size / 2, 0, radius);
  }, [tier, size]);

  return (
    <canvas
      ref={canvasRef}
      style={{ width: size, height: size }}
      className={className}
      aria-hidden="true"
    />
  );
}
