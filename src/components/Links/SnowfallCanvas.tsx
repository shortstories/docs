"use client";
import React, { useEffect, useRef } from 'react';

/** Snow particle options */
export interface SnowOptions {
  color?: string;            // Flake color
  radius?: [number, number]; // Min/Max radius
  speed?: [number, number];  // Vertical speed range
  wind?: [number, number];   // Horizontal drift range
  count?: number;            // Particle count
  responsiveFactor?: number; // Multiplier for smaller screens (0~1)
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  speed: number;
  wind: number;
  color: string;
  isResized: boolean;
}

const defaultOptions: Required<Omit<SnowOptions, 'count' | 'responsiveFactor'>> & { count: number; responsiveFactor: number } = {
  color: 'white',
  radius: [0.6, 5],
  speed: [1, 3],
  wind: [-1.5, 4],
  count: 500,
  responsiveFactor: 0.5
};

function rand(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const SnowfallCanvas: React.FC<{ options?: SnowOptions; className?: string; id?: string; debug?: boolean }>= ({ options, className, id, debug }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameRef = useRef<number>();
  const particlesRef = useRef<Particle[]>([]);
  const opts = { ...defaultOptions, ...options };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    function ensureCanvasStyle() {
      // If no explicit size styles, stretch to viewport
      const style = window.getComputedStyle(canvas);
      if (parseInt(style.width) === 0 || parseInt(style.height) === 0) {
        canvas.style.position = canvas.style.position || 'fixed';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.width = '100vw';
        canvas.style.height = '100vh';
      }
      canvas.style.pointerEvents = 'none';
      // Put above background image but below interactive elements if needed
      if (!canvas.style.zIndex) canvas.style.zIndex = '1';
    }

    function resize() {
      ensureCanvasStyle();
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.scale(dpr, dpr);
      particlesRef.current.forEach(p => (p.isResized = true));
    }

    function initParticles() {
      particlesRef.current = [];
      const factor = window.innerWidth < 640 ? opts.responsiveFactor : 1;
      const count = Math.round((options?.count ?? opts.count) * factor);
      for (let i = 0; i < count; i++) {
        particlesRef.current.push(createParticle());
      }
    }

    function createParticle(): Particle {
      return {
        color: opts.color,
        x: rand(0, canvas.offsetWidth),
        y: rand(-canvas.offsetHeight, canvas.offsetHeight),
        radius: rand(opts.radius[0], opts.radius[1]),
        speed: rand(opts.speed[0], opts.speed[1]),
        wind: rand(opts.wind[0], opts.wind[1]),
        isResized: false
      };
    }

    function resetParticle(p: Particle) {
      p.x = rand(0, canvas.offsetWidth);
      p.y = rand(-canvas.offsetHeight, 0);
    }

    function update(p: Particle) {
      p.y += p.speed;
      p.x += p.wind;
      if (p.y >= canvas.offsetHeight) {
        if (p.isResized) {
          resetParticle(p);
          p.isResized = false;
        } else {
          p.y = 0;
          p.x = rand(0, canvas.offsetWidth);
        }
      }
    }

    function draw(p: Particle) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.fill();
      if (debug) {
        ctx.strokeStyle = 'rgba(255,0,0,0.3)';
        ctx.stroke();
      }
      ctx.closePath();
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);
      for (const p of particlesRef.current) {
        draw(p);
        update(p);
      }
      frameRef.current = requestAnimationFrame(loop);
    }

  resize();
  initParticles();
  if (debug) console.log('[Snowfall] particles:', particlesRef.current.length);
  loop();

    window.addEventListener('resize', resize);
    return () => {
      window.removeEventListener('resize', resize);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opts.color, opts.radius[0], opts.radius[1], opts.speed[0], opts.speed[1], opts.wind[0], opts.wind[1], options?.count]);

  return <canvas ref={canvasRef} id={id || 'bg-canvas'} className={className || 'background-overlay'} />;
};

export default SnowfallCanvas;
