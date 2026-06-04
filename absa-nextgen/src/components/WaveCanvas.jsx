import { useEffect, useRef } from "react";

export default function WaveCanvas({
  spacing = 9,
  speed = 0.0006,
  amplitude = [6, 10, 3],
  opacity = [0.06, 0.025],
  fadeAlpha = 0.35,
  style = {},
}) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;
    let t = 0;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = canvas.parentElement?.scrollHeight || window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      ctx.fillStyle = `rgba(2,2,2,${fadeAlpha})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      t += 1;

      const rows = Math.ceil(canvas.height / spacing);

      for (let row = 0; row < rows; row++) {
        const baseY = row * spacing;
        const phase = row * 0.28;

        ctx.beginPath();
        ctx.moveTo(0, baseY);

        for (let x = 0; x <= canvas.width; x += 3) {
          const y =
            baseY +
            Math.sin(x * 0.012 + t * speed * 60 + phase) * amplitude[0] +
            Math.sin(x * 0.005 + t * speed * 35 + phase * 0.5) * amplitude[1] +
            Math.sin(x * 0.020 + t * speed * 80 + phase * 1.5) * amplitude[2];
          ctx.lineTo(x, y);
        }

        const op = opacity[0] + Math.sin(row * 0.15 + t * speed * 20) * opacity[1];
        ctx.strokeStyle = `rgba(132, 167, 148, ${op})`;
        ctx.lineWidth = 0.7;
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    };

    draw();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        ...style,
      }}
    />
  );
}
