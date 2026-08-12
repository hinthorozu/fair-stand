import fs from 'node:fs';

const path = 'src/scene3d.js';
let source = fs.readFileSync(path, 'utf8');

const oldFloorMaterial = `  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0x8f9294,
    roughness: 0.62,
    metalness: 0.06,
  });`;

const newFloorMaterial = `  function createConcreteFloorTexture() {
    const size = 512;
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#92918e';
    ctx.fillRect(0, 0, size, size);

    // Broad, low-contrast cloudy patches create the polished-concrete mottling.
    for (let i = 0; i < 180; i += 1) {
      const x = (Math.sin(i * 91.17) * 0.5 + 0.5) * size;
      const y = (Math.sin(i * 47.31 + 1.7) * 0.5 + 0.5) * size;
      const radiusX = 18 + ((i * 37) % 58);
      const radiusY = 10 + ((i * 53) % 42);
      const light = i % 3 === 0;
      ctx.fillStyle = light ? 'rgba(255,255,255,0.025)' : 'rgba(35,37,38,0.022)';
      ctx.beginPath();
      ctx.ellipse(x, y, radiusX, radiusY, (i % 11) * 0.21, 0, Math.PI * 2);
      ctx.fill();
    }

    // Fine speckle keeps close views from reading as a flat grey plane.
    for (let i = 0; i < 3200; i += 1) {
      const x = (i * 73) % size;
      const y = (i * 151 + (i % 17) * 19) % size;
      const alpha = 0.012 + (i % 5) * 0.003;
      ctx.fillStyle = i % 2 ? \\`rgba(255,255,255,\\${alpha})\\` : \\`rgba(20,22,23,\\${alpha})\\`;
      ctx.fillRect(x, y, 1, 1);
    }

    // Very subtle slab joints, similar to a large exhibition-hall concrete floor.
    ctx.strokeStyle = 'rgba(55,57,58,0.10)';
    ctx.lineWidth = 1;
    for (const cut of [128, 256, 384]) {
      ctx.beginPath();
      ctx.moveTo(cut, 0);
      ctx.lineTo(cut, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, cut);
      ctx.lineTo(size, cut);
      ctx.stroke();
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(5, 5);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    return texture;
  }

  const hallConcreteTexture = createConcreteFloorTexture();
  const hallFloorMaterial = new THREE.MeshStandardMaterial({
    color: 0xb0afac,
    map: hallConcreteTexture,
    roughness: 0.54,
    metalness: 0.08,
  });`;

if (!source.includes(oldFloorMaterial)) {
  throw new Error('hall floor material block not found');
}

source = source.replace(oldFloorMaterial, newFloorMaterial);
fs.writeFileSync(path, source);
