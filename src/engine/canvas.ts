export const INTERNAL_WIDTH = 640;
export const INTERNAL_HEIGHT = 360;

export type Fit = {
  scale: number;
  integer: boolean;
  cssWidth: number;
  cssHeight: number;
};

export function fitGameView(viewWidth: number, viewHeight: number): Fit {
  const raw = Math.min(viewWidth / INTERNAL_WIDTH, viewHeight / INTERNAL_HEIGHT);
  const whole = Math.floor(raw);
  const scale = whole >= 1 ? whole : raw;
  return {
    scale,
    integer: Number.isInteger(scale),
    cssWidth: Math.max(1, Math.floor(INTERNAL_WIDTH * scale)),
    cssHeight: Math.max(1, Math.floor(INTERNAL_HEIGHT * scale)),
  };
}

export function mountCanvas(canvas: HTMLCanvasElement): {
  ctx: CanvasRenderingContext2D;
  resize: () => Fit;
} {
  canvas.width = INTERNAL_WIDTH;
  canvas.height = INTERNAL_HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Canvas 2D недоступен");
  }
  ctx.imageSmoothingEnabled = false;

  const resize = () => {
    const fit = fitGameView(window.innerWidth, window.innerHeight);
    canvas.style.width = `${fit.cssWidth}px`;
    canvas.style.height = `${fit.cssHeight}px`;
    canvas.style.imageRendering = fit.integer ? "pixelated" : "auto";
    return fit;
  };

  return { ctx, resize };
}
