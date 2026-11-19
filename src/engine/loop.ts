const STEP = 1 / 60;
const MAX_STEPS = 5;
const MAX_FRAME_SECONDS = 0.25;

export type FrameHandlers = {
  update: (dt: number) => void;
  render: (fps: number) => void;
};

export function startLoop(handlers: FrameHandlers): { stop: () => void } {
  let last = performance.now();
  let accumulator = 0;
  let frames = 0;
  let fpsWindowStart = last;
  let fps = 0;
  let handle = 0;
  let running = true;

  const tick = (now: number) => {
    if (!running) {
      return;
    }

    let elapsed = (now - last) / 1000;
    last = now;
    if (elapsed > MAX_FRAME_SECONDS) {
      elapsed = MAX_FRAME_SECONDS;
    }
    accumulator += elapsed;

    let steps = 0;
    while (accumulator >= STEP && steps < MAX_STEPS) {
      handlers.update(STEP);
      accumulator -= STEP;
      steps += 1;
    }
    if (steps === MAX_STEPS) {
      accumulator = 0;
    }

    frames += 1;
    const windowMs = now - fpsWindowStart;
    if (windowMs >= 500) {
      fps = (frames * 1000) / windowMs;
      frames = 0;
      fpsWindowStart = now;
    }

    handlers.render(fps);
    handle = requestAnimationFrame(tick);
  };

  handle = requestAnimationFrame(tick);
  return {
    stop() {
      running = false;
      cancelAnimationFrame(handle);
    },
  };
}
