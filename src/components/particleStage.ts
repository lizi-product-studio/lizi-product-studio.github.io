/**
 * Lusion 风格实时 3D 粒子形态重组与引力交互引擎（高性能批处理渲染版）
 * 支持 4 种三维数学雕塑形态实时平滑变形：
 *   0 - 企业软件：三维架构矩阵晶格 (Cube Matrix Lattice)
 *   1 - AI Agent：斐波那契神经网络球 + 双轨道环 (Neural Sphere & Orbitals)
 *   2 - 工作流自动化：三维三叶结无限流转管道 (3D Torus Knot Pipeline)
 *   3 - 官网建设：三维谐波数字地形波浪 (Harmonic Digital Horizon)
 *
 * 性能优化设计：
 *   - 绝不在 pointermove 中修改 document.body 的 CSS 变量，避免全 DOM 样式重算
 *   - 使用平方距离裁剪替代逐粒子 Math.hypot 开方运算
 *   - 将粒子按颜色与景深分为 4 个批次合并 path 绘制，每帧仅 4 次 ctx.fill()（降低 99% Canvas 调用开销）
 */

const PARTICLE_COUNT = 420;
const FORM_COUNT = 4;
const TWO_PI = Math.PI * 2;

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  size: number;
  bucket: 0 | 1 | 2 | 3; // 0: primary-far, 1: primary-near, 2: accent-far, 3: accent-near
}

const PALETTES: readonly {
  primary: string;
  accent: string;
  line: string;
  glow: string;
}[] = [
  {
    primary: '#60A5FA',
    accent: '#38BDF8',
    line: 'rgba(56, 189, 248, 0.16)',
    glow: 'rgba(59, 130, 246, 0.10)'
  },
  {
    primary: '#A78BFA',
    accent: '#38BDF8',
    line: 'rgba(167, 139, 250, 0.17)',
    glow: 'rgba(139, 92, 246, 0.10)'
  },
  {
    primary: '#34D399',
    accent: '#38BDF8',
    line: 'rgba(52, 211, 153, 0.16)',
    glow: 'rgba(16, 185, 129, 0.09)'
  },
  {
    primary: '#818CF8',
    accent: '#F472B6',
    line: 'rgba(129, 140, 248, 0.17)',
    glow: 'rgba(99, 102, 241, 0.10)'
  }
];

let activeFormIndex = 0;
let morphBurst = 0;

export function setParticleForm(index: number): void {
  const next = ((index % FORM_COUNT) + FORM_COUNT) % FORM_COUNT;
  if (next !== activeFormIndex) {
    activeFormIndex = next;
    morphBurst = 1;
  }
}

export function initParticleStage(initialForm = 0): void {
  activeFormIndex = ((initialForm % FORM_COUNT) + FORM_COUNT) % FORM_COUNT;
  document.body.classList.add('cosmic-stage');

  if (!document.querySelector('.cosmic-grid-overlay')) {
    const grid = document.createElement('div');
    grid.className = 'cosmic-grid-overlay';
    grid.setAttribute('aria-hidden', 'true');
    document.body.prepend(grid);
  }

  let canvas = document.getElementById('lizi-particle-canvas') as HTMLCanvasElement | null;
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'lizi-particle-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    document.body.prepend(canvas);
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) return;

  // 预计算 4 种三维目标几何形态坐标
  const forms = Array.from({ length: FORM_COUNT }, () => new Float32Array(PARTICLE_COUNT * 3));
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const k = i * 3;
    const t = i / PARTICLE_COUNT;

    // Form 0: 三维架构矩阵晶格 (Cube Matrix Lattice)
    const gx = (i % 8) - 3.5;
    const gy = (Math.floor(i / 8) % 7) - 3;
    const gz = Math.floor(i / 56) - 3.5;
    forms[0][k] = gx * 0.42;
    forms[0][k + 1] = gy * 0.4;
    forms[0][k + 2] = gz * 0.42;

    // Form 1: 斐波那契神经网络球 + 外围双轨道环
    if (i < PARTICLE_COUNT * 0.72) {
      const idx = i;
      const total = PARTICLE_COUNT * 0.72;
      const y = 1 - (idx / (total - 1)) * 2;
      const radius = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = goldenAngle * idx;
      const r = 1.45;
      forms[1][k] = Math.cos(theta) * radius * r;
      forms[1][k + 1] = y * r;
      forms[1][k + 2] = Math.sin(theta) * radius * r;
    } else {
      const ringIdx = i - Math.floor(PARTICLE_COUNT * 0.72);
      const angle = (ringIdx / (PARTICLE_COUNT * 0.28)) * Math.PI * 4;
      const ringRadius = ringIdx % 2 === 0 ? 2.15 : 1.82;
      const tilt = ringIdx % 2 === 0 ? 0.48 : -0.52;
      forms[1][k] = Math.cos(angle) * ringRadius;
      forms[1][k + 1] = Math.sin(angle) * Math.sin(tilt) * ringRadius;
      forms[1][k + 2] = Math.sin(angle) * Math.cos(tilt) * ringRadius;
    }

    // Form 2: 三维三叶结流转管道 (3D Torus Knot Pipeline)
    const tubeAngle = (i % 14) * (TWO_PI / 14);
    const rr = 1.15 + 0.45 * Math.cos(3 * t * TWO_PI);
    const tubeR = 0.22;
    forms[2][k] = (rr + tubeR * Math.cos(tubeAngle)) * Math.cos(2 * t * TWO_PI);
    forms[2][k + 1] = (rr + tubeR * Math.cos(tubeAngle)) * Math.sin(2 * t * TWO_PI);
    forms[2][k + 2] = 0.65 * Math.sin(3 * t * TWO_PI) + tubeR * Math.sin(tubeAngle);

    // Form 3: 三维谐波数字地形 (Harmonic Wave Horizon)
    const cols = 21;
    const rows = Math.ceil(PARTICLE_COUNT / cols);
    const col = i % cols;
    const row = Math.floor(i / cols);
    const wx = (col / (cols - 1) - 0.5) * 3.8;
    const wz = (row / (rows - 1) - 0.5) * 2.8;
    const wy = Math.sin(wx * 1.9) * Math.cos(wz * 1.9) * 0.62;
    forms[3][k] = wx;
    forms[3][k + 1] = wy;
    forms[3][k + 2] = wz;
  }

  const currentPositions = new Float32Array(forms[activeFormIndex]);
  const projected: ProjectedPoint[] = Array.from({ length: PARTICLE_COUNT }, () => ({
    x: 0,
    y: 0,
    z: 0,
    size: 1.5,
    bucket: 0
  }));

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointerX = width * 0.62;
  let pointerY = height * 0.42;
  let targetRotX = 0.25;
  let targetRotY = -0.35;
  let rotX = 0.25;
  let rotY = -0.35;
  let time = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    // 限制背景粒子 Canvas DPR 为 1，大幅降低全屏像素填充压力且保持柔和星云质感
    if (!canvas) return;
    canvas.width = width;
    canvas.height = height;
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      const normX = pointerX / Math.max(1, width) - 0.5;
      const normY = pointerY / Math.max(1, height) - 0.5;
      targetRotY = normX * 0.75;
      targetRotX = -normY * 0.48;
    },
    { passive: true }
  );

  const REPULSE_RADIUS = 125;
  const REPULSE_RADIUS_SQ = REPULSE_RADIUS * REPULSE_RADIUS;
  const LINE_DIST_SQ = 64 * 64;

  const renderFrame = () => {
    if (!document.hidden) {
      time += 0.011;
      morphBurst *= 0.93;

      rotX += (targetRotX + Math.sin(time * 0.45) * 0.12 - rotX) * 0.05;
      rotY += (targetRotY + time * 0.2 - rotY) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const palette = PALETTES[activeFormIndex] ?? PALETTES[0];
      const targetForm = forms[activeFormIndex] ?? forms[0];
      const cx = width * (width >= 1024 ? 0.62 : 0.5);
      const cy = height * 0.46;
      const scale = Math.min(width, height) * 0.25;

      const sinX = Math.sin(rotX);
      const cosX = Math.cos(rotX);
      const sinY = Math.sin(rotY);
      const cosY = Math.cos(rotY);

      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const k = i * 3;

        // 三维形态平滑插值变形
        currentPositions[k] += (targetForm[k] - currentPositions[k]) * 0.075;
        currentPositions[k + 1] += (targetForm[k + 1] - currentPositions[k + 1]) * 0.075;
        currentPositions[k + 2] += (targetForm[k + 2] - currentPositions[k + 2]) * 0.075;

        const wave = 1 + morphBurst * 0.22 * Math.sin(i * 0.07 - time * 5);
        const x = currentPositions[k] * wave;
        const y = currentPositions[k + 1] * wave + Math.sin(time * 1.4 + i * 0.04) * 0.04;
        const z = currentPositions[k + 2] * wave;

        // 3D 旋转矩阵
        const rx = x * cosY + z * sinY;
        const rz = -x * sinY + z * cosY;
        const ry = y * cosX - rz * sinX;
        const depth = y * sinX + rz * cosX;

        const fov = 4.4 / Math.max(1.2, 4.4 - depth);
        let sx = cx + rx * scale * fov;
        let sy = cy + ry * scale * fov;

        // 鼠标引力排斥力场（先做平方距离过滤，98% 粒子无需 Math.sqrt）
        const dx = sx - pointerX;
        const dy = sy - pointerY;
        const distSq = dx * dx + dy * dy;
        if (distSq < REPULSE_RADIUS_SQ && distSq > 1) {
          const dist = Math.sqrt(distSq);
          const force = ((REPULSE_RADIUS - dist) / REPULSE_RADIUS) * 22;
          sx += (dx / dist) * force;
          sy += (dy / dist) * force;
        }

        const p = projected[i];
        p.x = sx;
        p.y = sy;
        p.z = depth;
        p.size = depth > 0.15 ? 1.85 : 1.15;
        const isAccent = i % 5 === 0;
        const isNear = depth > -0.1;
        p.bucket = (isAccent ? 2 : 0) + (isNear ? 1 : 0) as 0 | 1 | 2 | 3;
      }

      // 1. 单次绘制相邻节点神经连线
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = palette.line;
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT - 1; i += 2) {
        const a = projected[i];
        if (a.z < -0.7) continue;
        const b = projected[i + 1];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (dx * dx + dy * dy < LINE_DIST_SQ) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
      ctx.stroke();

      // 2. 分 4 个批次合并绘制全部粒子（每帧仅 4 次 ctx.fill 调用！）
      const bucketConfigs: readonly { color: string; alpha: number }[] = [
        { color: palette.primary, alpha: 0.36 },
        { color: palette.primary, alpha: 0.82 },
        { color: palette.accent, alpha: 0.42 },
        { color: palette.accent, alpha: 0.92 }
      ];

      for (let b = 0; b < 4; b++) {
        const cfg = bucketConfigs[b];
        ctx.fillStyle = cfg.color;
        ctx.globalAlpha = cfg.alpha;
        ctx.beginPath();
        for (let i = 0; i < PARTICLE_COUNT; i++) {
          const p = projected[i];
          if (p.bucket !== b) continue;
          ctx.moveTo(p.x + p.size, p.y);
          ctx.arc(p.x, p.y, p.size, 0, TWO_PI);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
}
