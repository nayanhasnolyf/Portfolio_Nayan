'use client';

import { useEffect, useRef, useState } from 'react';

type Particle = {
  originX: number;
  originY: number;
  x: number;
  y: number;
  radius: number;
  color: string;
  driftX: number;
  driftY: number;
  opacity: number;
};

type CursorPosition = {
  x: number;
  y: number;
} | null;

type ParticleGroup = {
  color: string;
  particles: Particle[];
};

const PARTICLE_COUNT = 420;
const REPEL_RADIUS = 160;
const REPEL_STRENGTH = 60;
const RETURN_SPEED = 0.055;
const EDGE_FADE_DISTANCE = 80;
const PARTICLE_COLORS = [
  'rgba(96,210,255,0.5)',
  'rgba(100,140,255,0.4)',
  'rgba(255,255,255,0.25)',
  'rgba(180,140,255,0.35)',
  'rgba(255,240,200,0.2)',
];

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function createBiasedCoordinate(size: number) {
  return Math.random() * size;
}

function createParticles(width: number, height: number, particleCount = PARTICLE_COUNT, shouldDrift = true) {
  return Array.from({ length: particleCount }, () => {
    let originX = createBiasedCoordinate(width);
    let originY = createBiasedCoordinate(height);

    if (Math.random() < 0.15) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.32;

      originX = width / 2 + Math.cos(angle) * radius;
      originY = height / 2 + Math.sin(angle) * radius;
    }

    return {
      originX: Math.min(Math.max(originX, 0), width),
      originY: Math.min(Math.max(originY, 0), height),
      x: Math.min(Math.max(originX, 0), width),
      y: Math.min(Math.max(originY, 0), height),
      radius: randomBetween(0.8, 2.2),
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      driftX: shouldDrift ? randomBetween(-0.08, 0.08) : 0,
      driftY: shouldDrift ? randomBetween(-0.08, 0.08) : 0,
      opacity: 1,
    };
  });
}

function createParticleGroups(width: number, height: number, particleCount = PARTICLE_COUNT, shouldDrift = true) {
  const groups = new Map<string, Particle[]>();

  createParticles(width, height, particleCount, shouldDrift).forEach((particle) => {
    const group = groups.get(particle.color);

    if (group) {
      group.push(particle);
    } else {
      groups.set(particle.color, [particle]);
    }
  });

  return Array.from(groups, ([color, particles]) => ({ color, particles }));
}

function getEdgeOpacity(x: number, y: number, width: number, height: number) {
  const edgeDistance = Math.min(x, y, width - x, height - y);
  return Math.min(Math.max(edgeDistance / EDGE_FADE_DISTANCE, 0), 1);
}

function createParticleWorker() {
  const workerSource = `
    const PARTICLE_COUNT = ${PARTICLE_COUNT};
    const REPEL_RADIUS = ${REPEL_RADIUS};
    const REPEL_STRENGTH = ${REPEL_STRENGTH};
    const RETURN_SPEED = ${RETURN_SPEED};
    const EDGE_FADE_DISTANCE = ${EDGE_FADE_DISTANCE};
    const PARTICLE_COLORS = ${JSON.stringify(PARTICLE_COLORS)};

    let canvas = null;
    let context = null;
    let groups = [];
    let cursor = null;
    let width = 0;
    let height = 0;
    let pixelRatio = 1;
    let particleCount = ${PARTICLE_COUNT};
    let shouldDrift = true;
    let enableRepulsion = true;
    let animationFrame = 0;
    let last = 0;

    const requestFrame = (callback) => {
      if (typeof self.requestAnimationFrame === 'function') {
        return self.requestAnimationFrame(callback);
      }

      return self.setTimeout(() => callback(performance.now()), 16);
    };

    const cancelFrame = (frame) => {
      if (typeof self.cancelAnimationFrame === 'function') {
        self.cancelAnimationFrame(frame);
        return;
      }

      self.clearTimeout(frame);
    };

    const randomBetween = (min, max) => min + Math.random() * (max - min);
    const createBiasedCoordinate = (size) => Math.random() * size;

    const createParticles = () => Array.from({ length: particleCount }, () => {
      let originX = createBiasedCoordinate(width);
      let originY = createBiasedCoordinate(height);

      if (Math.random() < 0.15) {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(Math.random()) * Math.min(width, height) * 0.32;

        originX = width / 2 + Math.cos(angle) * radius;
        originY = height / 2 + Math.sin(angle) * radius;
      }

      return {
        originX: Math.min(Math.max(originX, 0), width),
        originY: Math.min(Math.max(originY, 0), height),
        x: Math.min(Math.max(originX, 0), width),
        y: Math.min(Math.max(originY, 0), height),
        radius: randomBetween(0.8, 2.2),
        color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
        driftX: shouldDrift ? randomBetween(-0.08, 0.08) : 0,
        driftY: shouldDrift ? randomBetween(-0.08, 0.08) : 0,
        opacity: 1,
      };
    });

    const createParticleGroups = () => {
      const nextGroups = new Map();

      createParticles().forEach((particle) => {
        const group = nextGroups.get(particle.color);

        if (group) {
          group.push(particle);
        } else {
          nextGroups.set(particle.color, [particle]);
        }
      });

      groups = Array.from(nextGroups, ([color, particles]) => ({ color, particles }));
    };

    const getEdgeOpacity = (x, y) => {
      const edgeDistance = Math.min(x, y, width - x, height - y);
      return Math.min(Math.max(edgeDistance / EDGE_FADE_DISTANCE, 0), 1);
    };

    const updateParticle = (particle) => {
      if (shouldDrift) {
        particle.x += particle.driftX;
        particle.y += particle.driftY;
      }

      if (particle.x < 0) {
        particle.x = width;
        particle.originX = width;
      } else if (particle.x > width) {
        particle.x = 0;
        particle.originX = 0;
      }

      if (particle.y < 0) {
        particle.y = height;
        particle.originY = height;
      } else if (particle.y > height) {
        particle.y = 0;
        particle.originY = 0;
      }

      if (enableRepulsion && cursor) {
        const deltaX = particle.x - cursor.x;
        const deltaY = particle.y - cursor.y;
        const distance = Math.max(Math.hypot(deltaX, deltaY), 0.001);

        if (distance < REPEL_RADIUS) {
          const falloff = 1 - distance / REPEL_RADIUS;
          const force = REPEL_STRENGTH * falloff * falloff;

          particle.x += (deltaX / distance) * force;
          particle.y += (deltaY / distance) * force;
        }
      }

      particle.x += (particle.originX - particle.x) * RETURN_SPEED;
      particle.y += (particle.originY - particle.y) * RETURN_SPEED;
      if (shouldDrift) {
        particle.originX += particle.driftX;
        particle.originY += particle.driftY;
      }

      if (particle.originX < 0) {
        particle.originX = width;
      } else if (particle.originX > width) {
        particle.originX = 0;
      }

      if (particle.originY < 0) {
        particle.originY = height;
      } else if (particle.originY > height) {
        particle.originY = 0;
      }

      particle.opacity = getEdgeOpacity(particle.x, particle.y);
    };

    const draw = () => {
      context.save();
      context.clearRect(0, 0, width, height);

      for (const group of groups) {
        context.fillStyle = group.color;
        context.globalAlpha = 1;
        context.beginPath();

        for (const particle of group.particles) {
          updateParticle(particle);

          if (particle.opacity < 0.05) {
            continue;
          }

          context.moveTo(particle.x + particle.radius, particle.y);
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        }

        context.fill();
      }

      context.restore();
    };

    const loop = (timestamp) => {
      if (!context) {
        return;
      }

      if (timestamp - last < 16) {
        animationFrame = requestFrame(loop);
        return;
      }

      last = timestamp;
      draw();
      animationFrame = requestFrame(loop);
    };

    self.onmessage = (event) => {
      const message = event.data;

      if (message.type === 'init') {
        canvas = message.canvas;
        context = canvas.getContext('2d');
        return;
      }

      if (message.type === 'resize') {
        width = message.width;
        height = message.height;
        pixelRatio = message.pixelRatio || 1;
        particleCount = message.particleCount || PARTICLE_COUNT;
        shouldDrift = Boolean(message.shouldDrift);
        enableRepulsion = Boolean(message.enableRepulsion);

        if (!canvas || !context) {
          return;
        }

        canvas.width = width * pixelRatio;
        canvas.height = height * pixelRatio;
        context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        createParticleGroups();

        if (!animationFrame) {
          animationFrame = requestFrame(loop);
        }

        return;
      }

      if (message.type === 'cursor') {
        cursor = message.cursor;
        return;
      }

      if (message.type === 'stop') {
        if (animationFrame) {
          cancelFrame(animationFrame);
          animationFrame = 0;
        }
      }
    };
  `;
  const blob = new Blob([workerSource], { type: 'application/javascript' });
  const url = URL.createObjectURL(blob);

  return {
    url,
    worker: new Worker(url),
  };
}

export function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particleGroupsRef = useRef<ParticleGroup[]>([]);
  const cursorRef = useRef<CursorPosition>(null);
  const animationFrameRef = useRef<number>();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return undefined;
    }

    const canvas = canvasRef.current;

    if (!canvas) {
      return undefined;
    }

    canvas.style.willChange = 'transform';
    canvas.style.transform = 'translateZ(0)';

    const isMobileViewport = () => window.innerWidth < 768;
    const supportsOffscreenCanvas =
      process.env.NODE_ENV === 'production' &&
      !isMobileViewport() &&
      typeof OffscreenCanvas !== 'undefined' &&
      'transferControlToOffscreen' in canvas &&
      typeof Worker !== 'undefined';
    let workerHandle: ReturnType<typeof createParticleWorker> | null = null;

    if (supportsOffscreenCanvas) {
      const offscreen = canvas.transferControlToOffscreen();
      workerHandle = createParticleWorker();
      workerHandle.worker.postMessage({ type: 'init', canvas: offscreen }, [offscreen]);
    }

    const context = supportsOffscreenCanvas ? null : canvas.getContext('2d');

    if (!supportsOffscreenCanvas && !context) {
      return undefined;
    }

    const resizeCanvas = () => {
      const pixelRatio = window.devicePixelRatio || 1;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isMobile = isMobileViewport();
      const particleCount = isMobile ? 60 : PARTICLE_COUNT;
      const shouldDrift = !isMobile;
      const enableRepulsion = !isMobile;

      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      if (workerHandle) {
        workerHandle.worker.postMessage({
          type: 'resize',
          width,
          height,
          pixelRatio,
          particleCount,
          shouldDrift,
          enableRepulsion,
        });
        return;
      }

      if (!context) {
        return;
      }

      canvas.width = width * pixelRatio;
      canvas.height = height * pixelRatio;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      particleGroupsRef.current = createParticleGroups(width, height, particleCount, shouldDrift);
    };

    const handleMouseMove = (event: MouseEvent) => {
      cursorRef.current = {
        x: event.clientX,
        y: event.clientY,
      };
      workerHandle?.worker.postMessage({ type: 'cursor', cursor: cursorRef.current });
    };

    const handleMouseLeave = () => {
      cursorRef.current = null;
      workerHandle?.worker.postMessage({ type: 'cursor', cursor: null });
    };

    const updateParticle = (particle: Particle, width: number, height: number) => {
      const cursor = cursorRef.current;

      if (particle.driftX || particle.driftY) {
        particle.x += particle.driftX;
        particle.y += particle.driftY;
      }

      if (particle.x < 0) {
        particle.x = width;
        particle.originX = width;
      } else if (particle.x > width) {
        particle.x = 0;
        particle.originX = 0;
      }

      if (particle.y < 0) {
        particle.y = height;
        particle.originY = height;
      } else if (particle.y > height) {
        particle.y = 0;
        particle.originY = 0;
      }

      if (cursor && !isMobileViewport()) {
        const deltaX = particle.x - cursor.x;
        const deltaY = particle.y - cursor.y;
        const distance = Math.max(Math.hypot(deltaX, deltaY), 0.001);

        if (distance < REPEL_RADIUS) {
          const falloff = 1 - distance / REPEL_RADIUS;
          const force = REPEL_STRENGTH * falloff * falloff;

          particle.x += (deltaX / distance) * force;
          particle.y += (deltaY / distance) * force;
        }
      }

      particle.x += (particle.originX - particle.x) * RETURN_SPEED;
      particle.y += (particle.originY - particle.y) * RETURN_SPEED;
      if (particle.driftX || particle.driftY) {
        particle.originX += particle.driftX;
        particle.originY += particle.driftY;
      }

      if (particle.originX < 0) {
        particle.originX = width;
      } else if (particle.originX > width) {
        particle.originX = 0;
      }

      if (particle.originY < 0) {
        particle.originY = height;
      } else if (particle.originY > height) {
        particle.originY = 0;
      }

      particle.opacity = getEdgeOpacity(particle.x, particle.y, width, height);
    };

    const draw = (timestamp = 0) => {
      if (!context) {
        return;
      }

      const width = window.innerWidth;
      const height = window.innerHeight;

      context.save();
      context.clearRect(0, 0, width, height);

      for (const group of particleGroupsRef.current) {
        context.fillStyle = group.color;
        context.globalAlpha = 1;
        context.beginPath();

        for (const particle of group.particles) {
          updateParticle(particle, width, height);

          if (particle.opacity < 0.05) {
            continue;
          }

          context.moveTo(particle.x + particle.radius, particle.y);
          context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        }

        context.fill();
      }

      context.restore();

      if (!isMobileViewport()) {
        animationFrameRef.current = window.requestAnimationFrame(loop);
      }
    };

    let last = 0;

    const loop = (timestamp: number) => {
      if (timestamp - last < 16) {
        animationFrameRef.current = window.requestAnimationFrame(loop);
        return;
      }

      last = timestamp;
      draw(timestamp);
    };

    resizeCanvas();

    if (!workerHandle) {
      animationFrameRef.current = window.requestAnimationFrame(loop);
    }

    const handleStaticRefresh = () => {
      resizeCanvas();

      if (!workerHandle && isMobileViewport()) {
        animationFrameRef.current = window.requestAnimationFrame(loop);
      }
    };

    window.addEventListener('resize', handleStaticRefresh);
    if (!isMobileViewport()) {
      window.addEventListener('mousemove', handleMouseMove, { passive: true });
      window.addEventListener('mouseleave', handleMouseLeave);
    }
    window.addEventListener('portfolio:refresh-particles', handleStaticRefresh);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      workerHandle?.worker.postMessage({ type: 'stop' });
      workerHandle?.worker.terminate();
      if (workerHandle) {
        URL.revokeObjectURL(workerHandle.url);
      }

      window.removeEventListener('resize', handleStaticRefresh);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('portfolio:refresh-particles', handleStaticRefresh);
    };
  }, [mounted]);

  if (!mounted) {
    return null;
  }

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="particle-field-canvas"
    />
  );
}
