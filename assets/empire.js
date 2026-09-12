import * as THREE from './vendor/three.module.min.js';

/** A small trading district becomes a connected skyline.
 * All geometry is procedural. No models, textures, services, or build step.
 * The scene is decorative; the HTML is independent of the rendering loop.
 */
export function initEmpire() {
  const host = document.getElementById('empire-scene');
  const hero = document.querySelector('.hero');
  const controls = document.getElementById('journey-controls');
  const motionButton = document.getElementById('motion-toggle');
  const progressBar = document.getElementById('journey-progress');
  const stageButtons = [...document.querySelectorAll('[data-stage]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const coarsePointer = window.matchMedia('(pointer: coarse)');
  const lowPower = coarsePointer.matches || (navigator.hardwareConcurrency || 8) <= 4;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: !lowPower, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, lowPower ? 1.25 : 1.75));
  renderer.setClearColor(0x080909, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.5;
  host.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x080909, 0.021);
  const camera = new THREE.OrthographicCamera(-16, 16, 16, -16, .1, 120);
  camera.position.set(26, 22, 29);
  camera.lookAt(0, 2.4, 0);

  const city = new THREE.Group();
  scene.add(city);
  const hemisphere = new THREE.HemisphereLight(0xe9dfbd, 0x122a24, 2.5);
  const key = new THREE.DirectionalLight(0xffdfa2, 4.2);
  key.position.set(-8, 18, 9);
  const rim = new THREE.DirectionalLight(0x77cbbb, 2.4);
  rim.position.set(8, 7, -9);
  scene.add(hemisphere, key, rim);

  const box = new THREE.BoxGeometry(1, 1, 1);
  const edges = new THREE.EdgesGeometry(box);
  const goldLine = new THREE.LineBasicMaterial({ color: 0xc5a367, transparent: true, opacity: .48 });
  const tealLine = new THREE.LineBasicMaterial({ color: 0x68b3a0, transparent: true, opacity: .36 });
  const outlineDim = new THREE.LineBasicMaterial({ color: 0x747750, transparent: true, opacity: .18 });
  const stone = new THREE.MeshStandardMaterial({ color: 0x25302c, metalness: .58, roughness: .46 });
  const bronze = new THREE.MeshStandardMaterial({ color: 0x514530, metalness: .68, roughness: .4 });
  const glass = new THREE.MeshStandardMaterial({ color: 0x192a26, metalness: .7, roughness: .27 });
  const groundMat = new THREE.MeshStandardMaterial({ color: 0x171d18, metalness: .3, roughness: .85 });
  const plinthMat = new THREE.MeshStandardMaterial({ color: 0x17221c, metalness: .3, roughness: .6 });
  const roofMat = new THREE.MeshStandardMaterial({ color: 0x62523a, metalness: .6, roughness: .55 });
  const awningGold = new THREE.MeshStandardMaterial({ color: 0xccad70, roughness: .8 });
  const awningDark = new THREE.MeshStandardMaterial({ color: 0x303d31, roughness: .8 });
  const windowGold = new THREE.MeshBasicMaterial({ color: 0xd6ac66, toneMapped: false });
  const windowTeal = new THREE.MeshBasicMaterial({ color: 0x548578, toneMapped: false });
  const windowDim = new THREE.MeshBasicMaterial({ color: 0x3c4f3e });
  const beaconMat = new THREE.MeshBasicMaterial({ color: 0xffda8b, toneMapped: false });

  const solid = (parent, material, x, y, z, sx, sy, sz, outline = null) => {
    const mesh = new THREE.Mesh(box, material);
    mesh.position.set(x, y, z);
    mesh.scale.set(sx, sy, sz);
    parent.add(mesh);
    if (outline) mesh.add(new THREE.LineSegments(edges, outline));
    return mesh;
  };

  const platform = new THREE.Group();
  city.add(platform);
  solid(platform, groundMat, 0, -.35, 0, 20.8, .45, 19.8, outlineDim);
  solid(platform, groundMat, 0, -.64, 0, 19.9, .12, 18.9, outlineDim);

  // Thin illuminated road markings make the scene read as a place, not a bar chart.
  const roadPositions = [];
  for (let n = -4; n <= 4; n++) {
    const p = n * 2.4;
    roadPositions.push(-10.1, -.09, p, 10.1, -.09, p);
    roadPositions.push(p, -.09, -9.7, p, -.09, 9.7);
  }
  const roadGeo = new THREE.BufferGeometry();
  roadGeo.setAttribute('position', new THREE.Float32BufferAttribute(roadPositions, 3));
  const roadMat = new THREE.LineBasicMaterial({ color: 0x80784a, transparent: true, opacity: .2 });
  city.add(new THREE.LineSegments(roadGeo, roadMat));

  // Deterministic details keep the same city between visits.
  let seed = 4917;
  const random = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
  const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
  const smooth = (start, end, value) => { const x = clamp((value - start) / (end - start)); return x * x * (3 - 2 * x); };
  const dummy = new THREE.Object3D();
  const buildings = [];
  const shops = [];

  function makeWindows(parent, width, height, depth, accent) {
    const panes = [[], [], []];
    const floors = Math.max(2, Math.floor(height / .38));
    const columns = Math.max(2, Math.floor(width / .27));
    const sides = Math.max(2, Math.floor(depth / .27));
    const pushPane = (x, y, z, sx, sy, sz) => {
      const bucket = random() > .45 ? (accent && random() > .35 ? 1 : 0) : 2;
      panes[bucket].push([x, y, z, sx, sy, sz]);
    };
    for (let floor = 0; floor < floors; floor++) {
      const y = .22 + (floor / floors) * (height - .3);
      for (let col = 0; col < columns; col++) {
        const x = -width / 2 + (col + .5) * width / columns;
        pushPane(x, y, depth / 2 + .008, .09, .10, .012);
        pushPane(x, y, -depth / 2 - .008, .09, .10, .012);
      }
      for (let col = 0; col < sides; col++) {
        const z = -depth / 2 + (col + .5) * depth / sides;
        pushPane(width / 2 + .008, y, z, .012, .1, .09);
        pushPane(-width / 2 - .008, y, z, .012, .1, .09);
      }
    }
    [windowGold, windowTeal, windowDim].forEach((material, index) => {
      if (!panes[index].length) return;
      const mesh = new THREE.InstancedMesh(box, material, panes[index].length);
      panes[index].forEach(([x, y, z, sx, sy, sz], i) => {
        dummy.position.set(x, y, z);
        dummy.scale.set(sx, sy, sz);
        dummy.rotation.set(0, 0, 0);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      });
      mesh.instanceMatrix.needsUpdate = true;
      parent.add(mesh);
    });
  }

  function addTower(x, z, width, height, depth, delay, index) {
    const plot = new THREE.Group();
    plot.position.set(x, 0, z);
    city.add(plot);
    const base = solid(plot, plinthMat, 0, -.045, 0, width + .32, .11, depth + .32, outlineDim);
    const tower = new THREE.Group();
    plot.add(tower);
    const material = index % 5 === 0 ? bronze : index % 3 === 0 ? glass : stone;
    const outline = index % 4 === 0 ? tealLine : goldLine;
    solid(tower, material, 0, height / 2, 0, width, height, depth, outline);
    // Setback roofs and light strips create a varied architectural silhouette.
    solid(tower, roofMat, 0, height + .025, 0, width + .04, .055, depth + .04, outline);
    if (height > 4) {
      solid(tower, material, 0, height + height * .075, 0, width * .72, height * .15, depth * .72, outline);
      solid(tower, windowGold, 0, height * 1.15 + .03, 0, width * .72, .035, depth * .72);
      solid(tower, material, 0, height * 1.15 + .22, 0, width * .4, .4, depth * .4, outline);
    }
    if (height > 7) {
      solid(tower, bronze, 0, height * 1.15 + .9, 0, .055, 1.4, .055);
      solid(tower, beaconMat, 0, height * 1.15 + 1.59, 0, .075, .075, .075);
    }
    // Recessed vertical mullions give the towers a precise, architectural finish.
    if (height > 2.8) {
      for (const side of [-1, 1]) {
        solid(tower, roofMat, side * width * .37, height * .5, depth / 2 + .012, .028, height, .02);
      }
    }
    makeWindows(tower, width, height, depth, index % 4 === 0);
    buildings.push({ tower, base, delay, seedHeight: height < 2 ? .10 : .035 });
  }

  // Offset blocks leave real avenues and a readable central business district.
  let index = 0;
  for (let row = -3; row <= 3; row++) {
    for (let col = -3; col <= 3; col++) {
      if ((Math.abs(row) === 3 && Math.abs(col) === 3) || (row === 2 && Math.abs(col) <= 1)) continue;
      const distance = Math.sqrt(row * row + col * col);
      const h = Math.max(1.0, 8.3 - distance * 1.65 + random() * 1.6);
      const x = col * 2.4 + .48;
      const z = row * 2.4 + .48;
      const width = 1.05 + random() * .65;
      const depth = 1.05 + random() * .60;
      const delay = .08 + distance * .069 + random() * .10;
      addTower(x, z, width, h, depth, delay, index++);
    }
  }

  // Three shopfronts remain at street level as the surrounding enterprise grows.
  for (let i = 0; i < 3; i++) {
    const shop = new THREE.Group();
    shop.position.set((i - 1) * 2.4 + .48, 0, 5.28);
    city.add(shop);
    solid(shop, plinthMat, 0, -.03, 0, 2, .13, 1.8, goldLine);
    solid(shop, stone, 0, .49, 0, 1.65, .95, 1.35, goldLine);
    solid(shop, roofMat, 0, .99, 0, 1.78, .1, 1.5, goldLine);
    solid(shop, windowGold, -.4, .45, .683, .6, .5, .015);
    solid(shop, windowTeal, .42, .4, .683, .45, .75, .015);
    solid(shop, bronze, 0, .78, .72, 1.75, .2, .13);
    solid(shop, windowGold, 0, .79, .791, .64, .042, .012);
    for (let stripe = 0; stripe < 8; stripe++) {
      const canopy = solid(shop, stripe % 2 === 0 ? awningGold : awningDark, -.82 + stripe * .235, .68, .91, .235, .07, .48);
      canopy.rotation.x = .18;
    }
    // A slender street light beside each first business.
    solid(shop, bronze, -1, .7, 1, .028, 1.4, .028);
    solid(shop, windowGold, -.9, 1.39, 1, .24, .04, .09);
    shops.push(shop);
  }

  // Low landscaping is kept geometric and quiet against the architecture.
  const treeGeo = new THREE.IcosahedronGeometry(.23, 0);
  const treeMat = new THREE.MeshStandardMaterial({ color: 0x354d39, roughness: 1 });
  for (let i = 0; i < 22; i++) {
    const side = i % 2 ? -1 : 1;
    const x = side * 9.1;
    const z = -8.6 + Math.floor(i / 2) * 1.66;
    solid(city, bronze, x, .14, z, .03, .3, .03);
    const tree = new THREE.Mesh(treeGeo, treeMat);
    tree.position.set(x, .4, z);
    city.add(tree);
  }

  // A small number of light trails connect the shops to the growing district.
  const trafficMat = new THREE.MeshBasicMaterial({ color: 0xf1c879, transparent: true, opacity: .8, toneMapped: false });
  const traffic = [];
  for (let i = 0; i < (lowPower ? 14 : 26); i++) {
    const mesh = solid(city, trafficMat, 0, -.045, 0, .19, .023, .05);
    traffic.push({ mesh, lane: (Math.floor(random() * 7) - 3) * 2.4 + .12, offset: random(), speed: .013 + random() * .008, vertical: i % 2 === 0 });
  }

  const ringGeo = new THREE.RingGeometry(11.2, 11.215, 100);
  const ringMat = new THREE.MeshBasicMaterial({ color: 0xbaa36c, side: THREE.DoubleSide, transparent: true, opacity: .12 });
  const ring = new THREE.Mesh(ringGeo, ringMat);
  ring.rotation.x = -Math.PI / 2;
  ring.position.y = -.8;
  city.add(ring);

  let elapsed = reducedMotion.matches ? 27 : 0;
  let playing = !reducedMotion.matches;
  let inView = true;
  let disposed = false;
  let contextLost = false;
  let frameId = 0;
  let previousTime = 0;
  let lastPaint = 0;
  let activeStage = -1;
  let pointerX = 0;
  let pointerY = 0;
  let rotationX = 0;
  let rotationY = 0;
  const duration = 36;
  const frameInterval = 1000 / (lowPower ? 24 : 30);

  function setMotionLabel() {
    const label = playing ? 'Pause animation' : 'Play animation';
    motionButton.setAttribute('aria-label', label);
    motionButton.title = label;
    motionButton.innerHTML = playing
      ? '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="M6 4h3v12H6zm5 0h3v12h-3z"/></svg>'
      : '<svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path d="m6 3 10 7-10 7z"/></svg>';
  }

  function render() {
    if (disposed || contextLost) return;
    const position = elapsed % duration;
    const growth = smooth(2.5, 26, position);
    const fade = playing ? smooth(0, 1.2, position) * (1 - smooth(34.5, 36, position)) : 1;
    host.style.opacity = String(fade);
    for (const building of buildings) {
      const progress = smooth(building.delay, Math.min(building.delay + .49, 1), growth);
      building.tower.visible = progress > .006;
      building.tower.scale.y = .03 + .97 * progress;
      building.base.scale.y = .11;
    }
    shops.forEach((shop, i) => {
      const entry = smooth(i * .025, .06 + i * .025, growth + .075);
      shop.scale.setScalar(.93 + entry * .07);
    });
    roadMat.opacity = .13 + growth * .20;
    ringMat.opacity = .045 + growth * .13;
    traffic.forEach(({ mesh, lane, offset, speed, vertical }) => {
      const positionAlong = ((elapsed * speed + offset) % 1) * 19 - 9.5;
      mesh.visible = growth > .06;
      mesh.position.set(vertical ? lane : positionAlong, -.04, vertical ? positionAlong : lane);
      mesh.rotation.y = vertical ? Math.PI / 2 : 0;
    });
    rotationX += (pointerX - rotationX) * .035;
    rotationY += (pointerY - rotationY) * .035;
    const ambient = playing && !reducedMotion.matches ? Math.sin(position * .11) * .035 : 0;
    city.rotation.y = -.17 + ambient + rotationX * .045;
    city.rotation.x = rotationY * .016;
    const stage = position < 11 ? 0 : position < 23 ? 1 : 2;
    if (stage !== activeStage) {
      activeStage = stage;
      stageButtons.forEach((button, index) => {
        button.classList.toggle('active', stage === index);
        button.setAttribute('aria-pressed', String(stage === index));
      });
    }
    progressBar.style.width = `${Math.min(position / 28, 1) * 100}%`;
    renderer.render(scene, camera);
  }

  function tick(now) {
    frameId = 0;
    if (disposed || contextLost || !playing || !inView || document.hidden) return;
    if (previousTime) elapsed += Math.min((now - previousTime) / 1000, .1);
    previousTime = now;
    if (now - lastPaint >= frameInterval) { render(); lastPaint = now; }
    frameId = requestAnimationFrame(tick);
  }

  function resumeLoop() {
    if (playing && inView && !document.hidden && !disposed && !contextLost && !frameId) {
      previousTime = 0;
      frameId = requestAnimationFrame(tick);
    }
  }

  function stopLoop() { cancelAnimationFrame(frameId); frameId = 0; previousTime = 0; }

  function resize() {
    const width = host.clientWidth;
    const height = host.clientHeight;
    if (!width || !height || disposed) return;
    const aspect = width / height;
    // Preserve the whole island on tall and narrow displays.
    const verticalSpan = Math.max(25, 31 / aspect);
    camera.left = -verticalSpan * aspect / 2;
    camera.right = verticalSpan * aspect / 2;
    camera.top = verticalSpan / 2;
    camera.bottom = -verticalSpan / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    render();
  }

  function toggleMotion() {
    playing = !playing;
    if (playing && elapsed >= 34.5) elapsed = 0;
    setMotionLabel();
    if (playing) resumeLoop(); else { stopLoop(); render(); }
  }

  function chooseStage(event) {
    const index = Number(event.currentTarget.dataset.stage);
    elapsed = [5, 18, 28][index];
    playing = false;
    stopLoop();
    setMotionLabel();
    render();
  }

  function handleMotionPreference() {
    playing = !reducedMotion.matches;
    pointerX = pointerY = rotationX = rotationY = 0;
    if (!playing) { elapsed = 28; stopLoop(); }
    setMotionLabel();
    render();
    resumeLoop();
  }

  function pointerMove(event) {
    if (coarsePointer.matches || reducedMotion.matches || !playing) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width * 2 - 1;
    pointerY = (event.clientY - rect.top) / rect.height * 2 - 1;
  }
  function pointerLeave() { pointerX = pointerY = 0; }
  function visibilityChange() { if (document.hidden) stopLoop(); else resumeLoop(); }
  function loseContext(event) { event.preventDefault(); contextLost = true; stopLoop(); host.style.opacity = '0'; controls.hidden = true; }
  function restoreContext() { contextLost = false; controls.hidden = false; resize(); resumeLoop(); }

  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting;
    if (inView) resumeLoop(); else stopLoop();
  }, { threshold: .01 });
  observer.observe(hero);
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  motionButton.addEventListener('click', toggleMotion);
  stageButtons.forEach((button) => button.addEventListener('click', chooseStage));
  reducedMotion.addEventListener('change', handleMotionPreference);
  hero.addEventListener('pointermove', pointerMove, { passive: true });
  hero.addEventListener('pointerleave', pointerLeave);
  document.addEventListener('visibilitychange', visibilityChange);
  renderer.domElement.addEventListener('webglcontextlost', loseContext);
  renderer.domElement.addEventListener('webglcontextrestored', restoreContext);

  const cleanup = () => {
    disposed = true;
    stopLoop();
    observer.disconnect();
    resizeObserver.disconnect();
    reducedMotion.removeEventListener('change', handleMotionPreference);
    document.removeEventListener('visibilitychange', visibilityChange);
    hero.removeEventListener('pointermove', pointerMove);
    hero.removeEventListener('pointerleave', pointerLeave);
    motionButton.removeEventListener('click', toggleMotion);
    stageButtons.forEach((button) => button.removeEventListener('click', chooseStage));
    const geometries = new Set();
    const materials = new Set();
    scene.traverse((object) => {
      if (object.geometry) geometries.add(object.geometry);
      if (object.material) {
        for (const material of (Array.isArray(object.material) ? object.material : [object.material])) materials.add(material);
      }
      if (object.isInstancedMesh) object.dispose();
    });
    geometries.forEach((geometry) => geometry.dispose());
    materials.forEach((material) => material.dispose());
    renderer.dispose();
  };
  window.addEventListener('pagehide', (event) => { if (!event.persisted) cleanup(); });

  controls.hidden = false;
  setMotionLabel();
  resize();
  resumeLoop();
}
