"use client";

import { Camera, Mesh, Plane, Program, Renderer, Texture, Transform } from "ogl";
import { useEffect, useRef } from "react";

function debounce(func: Function, wait: number) {
  let timeout: ReturnType<typeof setTimeout>;
  return function (this: any, ...args: any[]) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1: number, p2: number, t: number) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance: any) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

const DEFAULT_FONT = "bold 30px Figtree";
const DEFAULT_FONT_URL =
  "https://fonts.googleapis.com/css2?family=Figtree:wght@400;700&display=swap";

function deriveFontFamilyFromUrl(url: string) {
  const fileName = (url.split("/").pop() || "custom-font").split("?")[0];
  const base = fileName.replace(/\.(woff2?|ttf|otf|eot)$/i, "");
  return base.replace(/[^a-zA-Z0-9-_ ]/g, "").trim() || "CircularGalleryFont";
}

async function loadFontFromStylesheet(url: string) {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`Failed to fetch font stylesheet (${response.status})`);
  const cssText = await response.text();
  const faceBlocks = cssText.match(/@font-face\s*{[^}]*}/g) || [];
  let family: string | null = null;
  const fontFaces: FontFace[] = [];
  for (const block of faceBlocks) {
    const familyMatch = block.match(/font-family:\s*['"]?([^;'"]+)['"]?/);
    const urlMatch = block.match(/url\(\s*['"]?([^'")]+)['"]?\s*\)/);
    if (!familyMatch || !urlMatch) continue;
    family = familyMatch[1].trim();
    const descriptors: any = {};
    const weightMatch = block.match(/font-weight:\s*([^;]+);/);
    const styleMatch = block.match(/font-style:\s*([^;]+);/);
    if (weightMatch) descriptors.weight = weightMatch[1].trim();
    if (styleMatch) descriptors.style = styleMatch[1].trim();
    fontFaces.push(new FontFace(family, `url(${urlMatch[1]})`, descriptors));
  }
  if (!family) throw new Error("No @font-face rule found");
  await Promise.allSettled(fontFaces.map(async (face) => { await face.load(); document.fonts.add(face); }));
  return family;
}

async function loadFontFromFile(url: string) {
  const family = deriveFontFamilyFromUrl(url);
  const fontFace = new FontFace(family, `url(${url})`);
  await fontFace.load();
  document.fonts.add(fontFace);
  return family;
}

async function loadCustomFont(fontUrl: string) {
  const isStylesheet = fontUrl.includes("fonts.googleapis.com") || /\.css(\?.*)?$/i.test(fontUrl);
  return isStylesheet ? loadFontFromStylesheet(fontUrl) : loadFontFromFile(fontUrl);
}

async function resolveFont(font: string, fontUrl?: string) {
  const effectiveUrl = fontUrl || (font === DEFAULT_FONT ? DEFAULT_FONT_URL : null);
  if (!effectiveUrl) {
    if (document.fonts?.load) {
      try { await document.fonts.load(font); await document.fonts.ready; } catch {}
    }
    return font;
  }
  try {
    const family = await loadCustomFont(effectiveUrl);
    const sizeMatch = font.match(/^\s*(.*?\d+px)/);
    const prefix = sizeMatch ? sizeMatch[1].trim() : "bold 30px";
    return `${prefix} "${family}"`;
  } catch {
    return font;
  }
}

function getFontSize(font: string) {
  const match = font.match(/(\d+)px/);
  return match ? parseInt(match[1], 10) : 30;
}

function createTextTexture(gl: any, text: string, subtitle: string, font = "bold 30px monospace", color = "black") {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d")!;
  const titleFont = font;
  const subFont = font.replace(/(\d+)px/, (_, s) => `${Math.round(parseInt(s) * 0.55)}px`).replace("bold", "normal");
  context.font = titleFont;
  const tm = context.measureText(text);
  context.font = subFont;
  const sm = context.measureText(subtitle);
  const textWidth = Math.ceil(Math.max(tm.width, sm.width));
  const th = Math.ceil(getFontSize(titleFont) * 1.2);
  const sh = Math.ceil(getFontSize(subFont) * 1.3);
  canvas.width = textWidth + 24;
  canvas.height = th + sh + 16;
  context.font = titleFont;
  context.fillStyle = color;
  context.textBaseline = "middle";
  context.textAlign = "center";
  context.fillText(text, canvas.width / 2, 8 + th / 2);
  if (subtitle) {
    context.font = subFont;
    context.fillStyle = color;
    context.globalAlpha = 0.55;
    context.fillText(subtitle, canvas.width / 2, 8 + th + sh / 2 + 4);
    context.globalAlpha = 1;
  }
  const texture = new Texture(gl, { generateMipmaps: false });
  texture.image = canvas;
  return { texture, width: canvas.width, height: canvas.height };
}

class Title {
  gl!: any; plane!: any; renderer!: any; text!: string; subtitle!: string; textColor!: string; font!: string; mesh!: any;
  constructor({ gl, plane, renderer, text, subtitle, textColor, font }: any) {
    autoBind(this);
    this.gl = gl; this.plane = plane; this.renderer = renderer;
    this.text = text; this.subtitle = subtitle || ""; this.textColor = textColor; this.font = font;
    this.createMesh();
  }
  createMesh() {
    const { texture, width, height } = createTextTexture(this.gl, this.text, this.subtitle, this.font, this.textColor);
    const geometry = new Plane(this.gl);
    const program = new Program(this.gl, {
      vertex: `attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragment: `precision highp float; uniform sampler2D tMap; varying vec2 vUv; void main() { vec4 color = texture2D(tMap, vUv); if (color.a < 0.1) discard; gl_FragColor = color; }`,
      uniforms: { tMap: { value: texture } },
      transparent: true,
    });
    this.mesh = new Mesh(this.gl, { geometry, program });
    const aspect = width / height;
    const textHeight = this.plane.scale.y * 0.15;
    const textWidth = textHeight * aspect;
    this.mesh.scale.set(textWidth, textHeight, 1);
    this.mesh.position.y = -this.plane.scale.y * 0.5 - textHeight * 0.5 - 0.05;
    this.mesh.setParent(this.plane);
  }
}

class Media {
  extra = 0; geometry!: any; gl!: any; image!: string; index!: number; length!: number;
  renderer!: any; scene!: any; screen!: any; text!: string; viewport!: any; bend!: number;
  textColor!: string; borderRadius!: number; font!: string;
  program!: any; plane!: any; title!: any; scale = 0; padding = 0; width = 0;
  widthTotal = 0; x = 0; speed = 0; isBefore = false; isAfter = false;

  constructor(opts: any) {
    Object.assign(this, opts);
    this.createShader(); this.createMesh(); this.createTitle(); this.onResize();
  }
  createShader() {
    const texture = new Texture(this.gl, { generateMipmaps: true });
    this.program = new Program(this.gl, {
      depthTest: false, depthWrite: false,
      vertex: `precision highp float; attribute vec3 position; attribute vec2 uv; uniform mat4 modelViewMatrix; uniform mat4 projectionMatrix; uniform float uTime; uniform float uSpeed; varying vec2 vUv; void main() { vUv = uv; vec3 p = position; p.z = (sin(p.x * 4.0 + uTime) * 1.5 + cos(p.y * 2.0 + uTime) * 1.5) * (0.1 + uSpeed * 0.5); gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0); }`,
      fragment: `precision highp float; uniform vec2 uImageSizes; uniform vec2 uPlaneSizes; uniform sampler2D tMap; uniform float uBorderRadius; varying vec2 vUv;
        float roundedBoxSDF(vec2 p, vec2 b, float r) { vec2 d = abs(p) - b; return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r; }
        void main() {
          vec2 ratio = vec2(min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0), min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0));
          vec2 uv = vec2(vUv.x * ratio.x + (1.0 - ratio.x) * 0.5, vUv.y * ratio.y + (1.0 - ratio.y) * 0.5);
          vec4 color = texture2D(tMap, uv);
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          float alpha = 1.0 - smoothstep(-0.002, 0.002, d);
          gl_FragColor = vec4(color.rgb, alpha);
        }`,
      uniforms: { tMap: { value: texture }, uPlaneSizes: { value: [0, 0] }, uImageSizes: { value: [0, 0] }, uSpeed: { value: 0 }, uTime: { value: 100 * Math.random() }, uBorderRadius: { value: this.borderRadius } },
      transparent: true,
    });
    const img = new Image(); img.crossOrigin = "anonymous"; img.src = this.image;
    img.onload = () => { texture.image = img; this.program.uniforms.uImageSizes.value = [img.naturalWidth, img.naturalHeight]; };
  }
  createMesh() {
    this.plane = new Mesh(this.gl, { geometry: this.geometry, program: this.program });
    this.plane.setParent(this.scene);
  }
  createTitle() {
    this.title = new Title({ gl: this.gl, plane: this.plane, renderer: this.renderer, text: this.text, subtitle: (this as any).subtitle || "", textColor: this.textColor, font: this.font });
  }
  update(scroll: any, direction: string, canLoop: boolean) {
    this.plane.position.x = this.x - scroll.current - this.extra;
    const x = this.plane.position.x;
    const H = this.viewport.width / 2;
    if (this.bend === 0) { this.plane.position.y = 0; this.plane.rotation.z = 0; }
    else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);
      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) { this.plane.position.y = -arc; this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R); }
      else { this.plane.position.y = arc; this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R); }
    }
    this.speed = scroll.current - scroll.last;
    this.program.uniforms.uTime.value += 0.04;
    this.program.uniforms.uSpeed.value = this.speed;
    if (!canLoop) return;
    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) { this.extra -= this.widthTotal; this.isBefore = this.isAfter = false; }
    if (direction === "left" && this.isAfter) { this.extra += this.widthTotal; this.isBefore = this.isAfter = false; }
  }
  onResize({ screen, viewport }: any = {}) {
    if (screen) this.screen = screen;
    if (viewport) this.viewport = viewport;
    this.scale = this.screen.height / 1500;
    this.plane.scale.y = (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x = (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [this.plane.scale.x, this.plane.scale.y];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  container!: HTMLElement; scrollSpeed!: number; scroll: any; onCheckDebounce!: Function;
  renderer!: any; gl!: any; camera!: any; scene!: any; planeGeometry!: any;
  medias: any[] = []; mediasImages: any[] = []; screen!: any; viewport!: any;
  isDown = false; start = 0; raf = 0;
  boundOnResize: any; boundOnWheel: any; boundOnTouchDown: any; boundOnTouchMove: any; boundOnTouchUp: any;

  constructor(container: HTMLElement, opts: any = {}) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scrollSpeed = opts.scrollSpeed ?? 2;
    this.scroll = { ease: opts.scrollEase ?? 0.05, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck.bind(this), 200);
    this.createRenderer(); this.createCamera(); this.createScene(); this.onResize();
    this.createGeometry(); this.createMedias(opts); this.update(); this.addEventListeners();
  }
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    this.gl = this.renderer.gl; this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  createCamera() { this.camera = new Camera(this.gl); this.camera.fov = 45; this.camera.position.z = 20; }
  createScene() { this.scene = new Transform(); }
  createGeometry() { this.planeGeometry = new Plane(this.gl, { heightSegments: 50, widthSegments: 100 }); }

  createMedias(opts: any) {
    const defaultItems = [
      { image: "https://picsum.photos/seed/1/800/600?grayscale", text: "Bridge" },
      { image: "https://picsum.photos/seed/2/800/600?grayscale", text: "Desk Setup" },
      { image: "https://picsum.photos/seed/3/800/600?grayscale", text: "Waterfall" },
      { image: "https://picsum.photos/seed/4/800/600?grayscale", text: "Strawberries" },
      { image: "https://picsum.photos/seed/5/800/600?grayscale", text: "Deep Diving" },
      { image: "https://picsum.photos/seed/6/800/600?grayscale", text: "Train Track" },
      { image: "https://picsum.photos/seed/7/800/600?grayscale", text: "Santorini" },
      { image: "https://picsum.photos/seed/8/800/600?grayscale", text: "Blurry Lights" },
      { image: "https://picsum.photos/seed/9/800/600?grayscale", text: "New York" },
      { image: "https://picsum.photos/seed/10/800/600?grayscale", text: "Good Boy" },
      { image: "https://picsum.photos/seed/11/800/600?grayscale", text: "Coastline" },
      { image: "https://picsum.photos/seed/12/800/600?grayscale", text: "Palm Trees" },
    ];
    const items = opts.items?.length ? opts.items : defaultItems;
    // 少量卡片时不复制，避免视觉重复
    const shouldDuplicate = items.length > 4;
    this.mediasImages = shouldDuplicate ? items.concat(items) : items;
    this.medias = this.mediasImages.map((data: any, index: number) =>
      new Media({
        geometry: this.planeGeometry, gl: this.gl, image: data.image, index, length: this.mediasImages.length,
        renderer: this.renderer, scene: this.scene, screen: this.screen, text: data.text,
        viewport: this.viewport, bend: opts.bend ?? 3, textColor: opts.textColor ?? "#fff",
        borderRadius: opts.borderRadius ?? 0.05, font: opts.font ?? DEFAULT_FONT,
      })
    );
  }
  onTouchDown(e: any) { this.isDown = true; this.scroll.position = this.scroll.current; this.start = e.touches ? e.touches[0].clientX : e.clientX; }
  onTouchMove(e: any) { if (!this.isDown) return; const x = e.touches ? e.touches[0].clientX : e.clientX; this.scroll.target = this.scroll.position + (this.start - x) * (this.scrollSpeed * 0.025); }
  onTouchUp() { this.isDown = false; this.onCheck(); }
  onWheel(e: any) { const delta = e.deltaY || e.wheelDelta || e.detail; this.scroll.target += (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2; this.onCheckDebounce(); }
  onCheck() {
    if (!this.medias?.[0]) return;
    const width = this.medias[0].width;
    const idx = Math.round(Math.abs(this.scroll.target) / width);
    this.scroll.target = this.scroll.target < 0 ? -width * idx : width * idx;
  }
  onResize() {
    this.screen = { width: this.container.clientWidth, height: this.container.clientHeight };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({ aspect: this.screen.width / this.screen.height });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    this.medias?.forEach((m: any) => m.onResize({ screen: this.screen, viewport: this.viewport }));
  }
  get canLoop(): boolean {
    if (!this.medias?.length || !this.viewport) return false;
    const totalW = this.medias[0].width * this.medias.length;
    return totalW > this.viewport.width * 1.2;
  }
  getCenterIndex(): number {
    if (!this.medias?.length) return 0;
    const w = this.medias[0].width;
    const duplicated = this.medias.length > 4;
    const n = duplicated ? this.medias.length / 2 : this.medias.length;
    const idx = Math.round(Math.abs(this.scroll.current) / w) % n;
    return Math.max(0, Math.min(idx, n - 1));
  }
  update() {
    // Clamp scroll when not looping
    if (!this.canLoop && this.medias?.length) {
      const totalW = this.medias[0].width * this.medias.length;
      const maxScroll = Math.max(0, totalW - this.viewport.width * 0.7);
      this.scroll.target = Math.max(0, Math.min(this.scroll.target, maxScroll));
    }
    this.scroll.current = lerp(this.scroll.current, this.scroll.target, this.scroll.ease);
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    const canLoop = this.canLoop;
    this.medias?.forEach((m: any) => m.update(this.scroll, direction, canLoop));
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(() => this.update());
  }
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this); this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this); this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    window.addEventListener("resize", this.boundOnResize);
    this.container.addEventListener("wheel", this.boundOnWheel);
    this.container.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    this.container.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
  }
  destroy() {
    cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    this.container.removeEventListener("wheel", this.boundOnWheel);
    this.container.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    this.container.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    if (this.gl?.canvas?.parentNode) this.gl.canvas.parentNode.removeChild(this.gl.canvas);
  }
}

export default function CircularGallery({ items, bend = 3, textColor = "#ffffff", borderRadius = 0.05, font = DEFAULT_FONT, fontUrl, scrollSpeed = 2, scrollEase = 0.05, onItemClick }: any) {
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<App | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    let app: App; let mounted = true;
    resolveFont(font, fontUrl).then((resolvedFont) => {
      if (!mounted || !containerRef.current) return;
      app = new App(containerRef.current, { items, bend, textColor, borderRadius, font: resolvedFont, scrollSpeed, scrollEase });
      appRef.current = app;
    });
    return () => { mounted = false; app?.destroy(); };
  }, [items, bend, textColor, borderRadius, font, fontUrl, scrollSpeed, scrollEase]);

  const handleClick = () => {
    if (onItemClick && appRef.current) {
      const idx = appRef.current.getCenterIndex();
      if (items[idx]) onItemClick(items[idx], idx);
    }
  };

  return <div className="circular-gallery" ref={containerRef} onClick={handleClick} />;
}
