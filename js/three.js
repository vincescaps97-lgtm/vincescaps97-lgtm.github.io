/* ============================================================
   Three.js — solo per la pagina Gallery.

   polaroidWall() — un piano di fotografie trascinabile, con
   hover via raycast e click per leggere la didascalia.

   È l'unico 3D del sito: nessuna otra pagina carica three.js,
   e questa lo carica solo quando arriva qui.

   Se WebGL non è disponibile esce in silenzio: la gallery
   elenca comunque ogni didascalia in HTML sotto.
   ============================================================ */

import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.160.1/build/three.module.js";

const DEFAULT_CAPTIONS = [
  "Prima call", "Impostazioni", "Dati", "Test A/B", "Report", "Funnel",
  "Keyword", "Landing", "Creative", "Audience", "Budget", "KPI",
  "Automazione", "Analytics", "Riunione", "Checklist", "Preventivi", "Setup",
  "Scaling", "Retargeting", "Naming", "Dashboard", "A/B", "Notte",
];

function makeRenderer(canvas) {
  try {
    const r = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "low-power",
    });
    r.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    return r;
  } catch {
    return null;
  }
}

function onFrame(cb) {
  let raf = 0;
  const tick = (t) => {
    cb(t);
    raf = requestAnimationFrame(tick);
  };
  raf = requestAnimationFrame(tick);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      cancelAnimationFrame(raf);
      raf = 0;
    } else if (!raf) {
      raf = requestAnimationFrame(tick);
    }
  });
  return () => cancelAnimationFrame(raf);
}

const lerp = (a, b, t) => a + (b - a) * t;

/** Disegna una polaroid su canvas e ne restituisce la texture. */
function polaroidTexture(caption, from, to) {
  const W = 420;
  const H = 500;
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const x = c.getContext("2d");

  x.fillStyle = "#fff";
  x.fillRect(0, 0, W, H);

  const g = x.createLinearGradient(0, 0, W, H);
  g.addColorStop(0, from);
  g.addColorStop(1, to);
  x.fillStyle = g;
  x.fillRect(14, 14, W - 28, H - 116);

  // un paio di segni, così non è un gradiente piatto
  x.globalAlpha = 0.18;
  x.fillStyle = "#fff";
  x.beginPath();
  x.arc(W * 0.72, H * 0.3, 62, 0, Math.PI * 2);
  x.fill();
  x.fillStyle = "#000";
  x.beginPath();
  x.moveTo(14, H - 116);
  x.lineTo(W * 0.45, H - 116);
  x.lineTo(14, H * 0.55);
  x.closePath();
  x.fill();
  x.globalAlpha = 1;

  x.fillStyle = "#111214";
  x.font = '600 34px "Darker Grotesque", sans-serif';
  x.textAlign = "center";
  x.fillText(caption, W / 2, H - 46);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export function polaroidWall(canvas, opts = {}) {
  const {
    count = 15,
    art = [["#312e81", "#818cf8"], ["#be123c", "#fb7185"]],
    captions = DEFAULT_CAPTIONS,
  } = opts;

  const renderer = makeRenderer(canvas);
  if (!renderer) return null;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

  const wall = new THREE.Group();
  scene.add(wall);

  const cards = [];
  const cols = 5;

  for (let i = 0; i < count; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const [from, to] = art[i % art.length];
    const caption = captions[i % captions.length];

    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(2.1, 2.5),
      new THREE.MeshBasicMaterial({
        map: polaroidTexture(caption, from, to),
        side: THREE.DoubleSide,
      })
    );

    const spanX = cols * 3.5;
    const spanY = Math.ceil(count / cols) * 3.6;
    mesh.position.set(
      -spanX / 2 + col * 3.5 + (Math.random() - 0.5) * 0.9,
      spanY / 2 - row * 3.6 + (Math.random() - 0.5) * 0.9,
      (Math.random() - 0.5) * 2.4
    );
    mesh.rotation.z = (Math.random() - 0.5) * 0.42;

    mesh.userData = {
      baseZ: mesh.position.z,
      baseRot: mesh.rotation.z,
      phase: Math.random() * Math.PI * 2,
      hovered: false,
      scale: 1,
      caption,
    };

    wall.add(mesh);
    cards.push(mesh);
  }

  /* ---- puntatore: hover + trascinamento ---- */

  const ray = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  let hovered = null;
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let velX = 0;
  let velY = 0;
  let onPick = null;

  const updateNdc = (e) => {
    const r = canvas.getBoundingClientRect();
    ndc.x = ((e.clientX - r.left) / r.width) * 2 - 1;
    ndc.y = -((e.clientY - r.top) / r.height) * 2 + 1;
  };

  const pick = (e) => {
    updateNdc(e);
    ray.setFromCamera(ndc, camera);
    return ray.intersectObjects(cards, false)[0]?.object ?? null;
  };

  canvas.addEventListener("pointermove", (e) => {
    if (dragging) {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      wall.rotation.y += dx * 0.005;
      wall.rotation.x += dy * 0.004;
      velX = dx * 0.005;
      velY = dy * 0.004;
      lastX = e.clientX;
      lastY = e.clientY;
      return;
    }

    const hit = pick(e);
    if (hit !== hovered) {
      if (hovered) hovered.userData.hovered = false;
      hovered = hit;
      if (hovered) hovered.userData.hovered = true;
      canvas.style.cursor = hovered ? "grab" : "default";
    }
  });

  canvas.addEventListener("pointerdown", (e) => {
    dragging = true;
    lastX = e.clientX;
    lastY = e.clientY;
    canvas.setPointerCapture(e.pointerId);
    canvas.style.cursor = "grabbing";
  });

  const endDrag = (e) => {
    if (!dragging) return;
    dragging = false;
    try {
      canvas.releasePointerCapture(e.pointerId);
    } catch {}
    canvas.style.cursor = hovered ? "grab" : "default";
  };
  canvas.addEventListener("pointerup", endDrag);
  canvas.addEventListener("pointercancel", endDrag);

  canvas.addEventListener("click", () => {
    if (Math.abs(velX) < 0.004 && hovered && onPick) onPick(hovered.userData);
  });

  /* ---- resize: la camera si adatta alla parete ---- */

  function fitCamera() {
    const box = new THREE.Box3().setFromObject(wall);
    const size = box.getSize(new THREE.Vector3());
    const vFov = (camera.fov * Math.PI) / 180;
    const hFov = 2 * Math.atan(Math.tan(vFov / 2) * camera.aspect);
    const distV = size.y / 2 / Math.tan(vFov / 2);
    const distH = size.x / 2 / Math.tan(hFov / 2);
    camera.position.z = Math.max(distV, distH, 8) * 1.28;
  }

  function resize() {
    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    fitCamera();
    camera.updateProjectionMatrix();
  }
  resize();
  window.addEventListener("resize", resize);

  onFrame((t) => {
    if (!dragging) {
      velX *= 0.94;
      velY *= 0.94;
      wall.rotation.y += velX;
      wall.rotation.x += velY;
      wall.rotation.x = Math.max(-0.6, Math.min(0.6, wall.rotation.x));
    }

    for (const m of cards) {
      const d = m.userData;
      d.scale = lerp(d.scale, d.hovered ? 1.12 : 1, 0.12);
      m.scale.setScalar(d.scale);
      m.position.z = lerp(m.position.z, d.baseZ + (d.hovered ? 0.9 : 0), 0.12);
      m.position.y += Math.sin(t * 0.0006 + d.phase) * 0.0016;
      m.rotation.z = d.baseRot + Math.sin(t * 0.0004 + d.phase) * 0.02;
    }

    renderer.render(scene, camera);
  });

  return { renderer, scene, camera, onPick: (fn) => (onPick = fn) };
}