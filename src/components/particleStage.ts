/**
 * Lusion 风格实时 3D 粒子形态重组与引力交互引擎
 * 支持 4 种三维数学雕塑形态实时平滑变形：
 *   0 - 企业软件：三维架构矩阵晶格 (Cube Matrix Lattice)
 *   1 - AI Agent：斐波那契神经网络球 + 双轨道环 (Neural Sphere & Orbitals)
 *   2 - 工作流自动化：三维三叶结无限流转管道 (3D Torus Knot Pipeline)
 *   3 - 官网建设：三维谐波数字地形波浪 (Harmonic Digital Horizon)
 */

const PARTICLE_COUNT = 780;
const FORM_COUNT = 4;

interface ProjectedPoint {
  x: number;
  y: number;
  z: number;
  alpha: number;
  size: number;
  accent: boolean;
}

const PALETTES: readonly { primary: string; accent: string; line: string; hue: number }[] = [
  { primary: '#60A5FA', accent: '#38BDF8', line: 'rgba(56, 189, 248, 0.17)', hue: 215 },
  { primary: '#A78BFA', accent: '#38BDF8', line: 'rgba(167, 139, 250, 0.18)', hue: 258 },
  { primary: '#34D399', accent: '#38BDF8', line: 'rgba(52, 211, 153, 0.17)', hue: 175 },
  { primary: '#818CF8', accent: '#F472B6', line: 'rgba(129, 140, 248, 0.18)', hue: 235 }
];

let activeFormIndex = 0;
let morphBurst = 0;

export function setParticleForm(index: number): void {
  const next = ((index % FORM_COUNT) + FORM_COUNT) % FORM_COUNT;
  if (next !== activeFormIndex) {
    activeFormIndex = next;
    morphBurst = 1;
    const palette = PALETTES[activeFormIndex] ?? PALETTES[0];
    document.body.style.setProperty('--stage-hue', String(palette.hue));
  }
}

export function initParticleStage(initialForm = 0): void {
  activeFormIndex = ((initialForm % FORM_COUNT) + FORM_COUNT) % FORM_COUNT;
  document.body.classList.add('cosmic-stage');
  const initialPalette = PALETTES[activeFormIndex] ?? PALETTES[0];
  document.body.style.setProperty('--stage-hue', String(initialPalette.hue));

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

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 预计算 4 种三维目标几何形态坐标
  const forms = Array.from({ length: FORM_COUNT }, () => new Float32Array(PARTICLE_COUNT * 3));
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const k = i * 3;
    const t = i / PARTICLE_COUNT;

    // Form 0: 三维架构矩阵晶格 (Cube Matrix Lattice)
    const gx = (i % 10) - 4.5;
    const gy = (Math.floor(i / 10) % 9) - 4;
    const gz = Math.floor(i / 90) - 4;
    forms[0][k] = gx * 0.34;
    forms[0][k + 1] = gy * 0.32;
    forms[0][k + 2] = gz * 0.34;

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
    const tubeAngle = (i % 16) * ((Math.PI * 2) / 16);
    const rr = 1.15 + 0.45 * Math.cos(3 * t * Math.PI * 2);
    const tubeR = 0.22;
    forms[2][k] = (rr + tubeR * Math.cos(tubeAngle)) * Math.cos(2 * t * Math.PI * 2);
    forms[2][k + 1] = (rr + tubeR * Math.cos(tubeAngle)) * Math.sin(2 * t * Math.PI * 2);
    forms[2][k + 2] = 0.65 * Math.sin(3 * t * Math.PI * 2) + tubeR * Math.sin(tubeAngle);

    // Form 3: 三维谐波数字地形 (Harmonic Wave Horizon)
    const cols = 30;
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
  const projected: ProjectedPoint[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    x: 0,
    y: 0,
    z: 0,
    alpha: 0.5,
    size: 1.5,
    accent: i % 5 === 0
  }));

  let width = window.innerWidth;
  let height = window.innerHeight;
  let pointerX = width * 0.65;
  let pointerY = height * 0.42;
  let normX = 0;
  let normY = 0;
  let targetRotX = 0.25;
  let targetRotY = -0.35;
  let rotX = 0.25;
  let rotY = -0.35;
  let time = 0;

  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    if (!canvas) return;
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  };

  resize();
  window.addEventListener('resize', resize, { passive: true });

  window.addEventListener(
    'pointermove',
    (event) => {
      pointerX = event.clientX;
      pointerY = event.clientY;
      normX = event.clientX / Math.max(1, width) - 0.5;
      normY = event.clientY / Math.max(1, height) - 0.5;
      targetRotY = normX * 0.85;
      targetRotX = -normY * 0.55;
      document.body.style.setProperty('--cursor-x', `${event.clientX.toFixed(0)}px`);
      document.body.style.setProperty('--cursor-y', `${event.clientY.toFixed(0)}px`);
    },
    { passive: true }
  );

  window.addEventListener('lizi:particle-form', ((event: CustomEvent<{ form: number }>) => {
    if (typeof event.detail?.form === 'number') {
      setParticleForm(event.detail.form);
    }
  }) as EventListener);

  const renderFrame = () => {
    if (!document.hidden) {
      time += 0.012;
      morphBurst *= 0.94;

      rotX += (targetRotX + Math.sin(time * 0.45) * 0.14 - rotX) * 0.045;
      rotY += (targetRotY + time * 0.22 - rotY) * 0.045;

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
        currentPositions[k] += (targetForm[k] - currentPositions[k]) * 0.065;
        currentPositions[k + 1] += (targetForm[k + 1] - currentPositions[k + 1]) * 0.065;
        currentPositions[k + 2] += (targetForm[k + 2] - currentPositions[k + 2]) * 0.065;

        const wave = 1 + morphBurst * 0.24 * Math.sin(i * 0.07 - time * 5);
        const x = currentPositions[k] * wave;
        const y = currentPositions[k + 1] * wave + Math.sin(time * 1.4 + i * 0.03) * 0.045;
        const z = currentPositions[k + 2] * wave;

        // 3D 旋转矩阵
        const rx = x * cosY + z * sinY;
        const rz = -x * sinY + z * cosY;
        const ry = y * cosX - rz * sinX;
        const depth = y * sinX + rz * cosX;

        const fov = 4.4 / Math.max(1.2, 4.4 - depth);
        let sx = cx + rx * scale * fov;
        let sy = cy + ry * scale * fov;

        // 鼠标引力排斥力场
        const dx = sx - pointerX;
        const dy = sy - pointerY;
        const dist = Math.hypot(dx, dy);
        if (dist < 135 && dist > 1) {
          const force = ((135 - dist) / 135) * 24;
          sx += (dx / dist) * force;
          sy += (dy / dist) * force;
        }

        const p = projected[i];
        p.x = sx;
        p.y = sy;
        p.z = depth;
        p.alpha = Math.max(0.12, Math.min(0.88, (depth + 2.2) / 4.2));
        p.size = Math.max(0.9, (depth + 2.3) * 0.72);
      }

      // 绘制鼠标附近与相邻节点的神经流光线丝
      ctx.lineWidth = 0.75;
      ctx.strokeStyle = palette.line;
      ctx.beginPath();
      for (let i = 0; i < PARTICLE_COUNT - 1; i += 2) {
        const a = projected[i];
        const b = projected[i + 1];
        const segDist = Math.hypot(a.x - b.x, a.y - b.y);
        if (segDist < 68 && a.z > -0.8) {
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
        }
      }
      ctx.stroke();

      // 绘制三维发光粒子
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const p = projected[i];
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.accent ? palette.accent : palette.primary;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    window.requestAnimationFrame(renderFrame);
  };

  window.requestAnimationFrame(renderFrame);
}
