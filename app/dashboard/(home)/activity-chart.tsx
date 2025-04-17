"use client";

import { useEffect, useRef } from "react";

export function ActivityChart() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth;
    canvas.height = 120;

    // Draw the wave
    ctx.beginPath();
    ctx.moveTo(0, 80);

    // Create a smooth wave pattern
    const points = [
      { x: 0, y: 80 },
      { x: canvas.width * 0.1, y: 70 },
      { x: canvas.width * 0.2, y: 50 },
      { x: canvas.width * 0.3, y: 30 },
      { x: canvas.width * 0.4, y: 40 },
      { x: canvas.width * 0.5, y: 80 },
      { x: canvas.width * 0.6, y: 100 },
      { x: canvas.width * 0.7, y: 90 },
      { x: canvas.width * 0.8, y: 60 },
      { x: canvas.width * 0.9, y: 40 },
      { x: canvas.width, y: 60 },
    ];

    // Draw the curve
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    // Fill the area under the curve
    ctx.lineTo(canvas.width, canvas.height);
    ctx.lineTo(0, canvas.height);
    ctx.closePath();

    // Create gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, "rgba(59, 130, 246, 0.5)");
    gradient.addColorStop(1, "rgba(59, 130, 246, 0.1)");
    ctx.fillStyle = gradient;

    ctx.fill();

    // Draw the line on top
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const xc = (points[i].x + points[i + 1].x) / 2;
      const yc = (points[i].y + points[i + 1].y) / 2;
      ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
    }

    ctx.strokeStyle = "#3b82f6";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Draw day labels
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    ctx.fillStyle = "#9ca3af";
    ctx.font = "12px Inter, sans-serif";
    ctx.textAlign = "center";

    ctx.fillText("Loading...", canvas.width / 2, canvas.height / 2);
    for (let i = 0; i < days.length; i++) {
      const x = (canvas.width / (days.length - 1)) * i;
      ctx.fillText(days[i], x, canvas.height - 5);
    }
  }, []);

  return (
    <div className="w-full h-[150px] relative">
      <canvas ref={canvasRef} className="w-full h-full" />
    </div>
  );
}
