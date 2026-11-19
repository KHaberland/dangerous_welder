import { INTERNAL_HEIGHT, INTERNAL_WIDTH, mountCanvas } from "./engine/canvas";
import { startLoop } from "./engine/loop";

const showFps = true;

const canvas = document.querySelector<HTMLCanvasElement>("#game");
if (!canvas) {
  throw new Error("Холст #game не найден");
}

const screen = mountCanvas(canvas);
let simTime = 0;

function drawWorkshop(time: number): void {
  const ctx = screen.ctx;
  ctx.fillStyle = "#1b1e27";
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  ctx.fillStyle = "#2a3140";
  ctx.fillRect(0, 0, INTERNAL_WIDTH, 250);

  ctx.fillStyle = "#4a433c";
  ctx.fillRect(0, 250, INTERNAL_WIDTH, INTERNAL_HEIGHT - 250);
  ctx.fillStyle = "#3a342e";
  for (let y = 258; y < INTERNAL_HEIGHT; y += 16) {
    ctx.fillRect(0, y, INTERNAL_WIDTH, 2);
  }

  ctx.fillStyle = "#5c534a";
  ctx.fillRect(80, 40, 28, 210);
  ctx.fillRect(532, 40, 28, 210);

  const glow = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(time * 3));
  ctx.fillStyle = "#2a2418";
  ctx.fillRect(292, 18, 56, 10);
  ctx.fillStyle = `rgba(255, 176, 64, ${glow})`;
  ctx.fillRect(300, 28, 40, 14);
  ctx.fillStyle = `rgba(255, 160, 40, ${glow * 0.25})`;
  ctx.fillRect(250, 250, 140, 8);
}

function drawFps(fps: number): void {
  const ctx = screen.ctx;
  const label = fps > 0 ? String(Math.round(fps)) : "--";
  ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
  ctx.fillRect(8, 8, 54, 18);
  ctx.fillStyle = "#f2e7c9";
  ctx.font = "12px monospace";
  ctx.textBaseline = "top";
  ctx.fillText(label, 14, 11);
}

function render(fps: number): void {
  drawWorkshop(simTime);
  if (showFps) {
    drawFps(fps);
  }
}

screen.resize();
window.addEventListener("resize", () => {
  screen.resize();
});

startLoop({
  update(dt) {
    simTime += dt;
  },
  render,
});
