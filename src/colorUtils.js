function clamp(value, min, max) {
  const number = Number(value);
  if (!Number.isFinite(number)) return min;
  return Math.min(max, Math.max(min, number));
}

export function normalizeHexColor(value) {
  const raw = String(value ?? '').trim().replace(/^#/, '');
  if (/^[0-9a-fA-F]{3}$/.test(raw)) {
    return `#${raw.split('').map((char) => char + char).join('').toUpperCase()}`;
  }
  if (!/^[0-9a-fA-F]{6}$/.test(raw)) return null;
  return `#${raw.toUpperCase()}`;
}

export function rgbToHex(red, green, blue) {
  const channel = (value) => Math.round(clamp(value, 0, 255)).toString(16).padStart(2, '0');
  return `#${channel(red)}${channel(green)}${channel(blue)}`.toUpperCase();
}

export function hexToRgb(value) {
  const hex = normalizeHexColor(value);
  if (!hex) return null;
  return {
    r: Number.parseInt(hex.slice(1, 3), 16),
    g: Number.parseInt(hex.slice(3, 5), 16),
    b: Number.parseInt(hex.slice(5, 7), 16),
  };
}

export function rgbToCmyk(red, green, blue) {
  const r = clamp(red, 0, 255) / 255;
  const g = clamp(green, 0, 255) / 255;
  const b = clamp(blue, 0, 255) / 255;
  const k = 1 - Math.max(r, g, b);

  if (k >= 1 - Number.EPSILON) {
    return { c: 0, m: 0, y: 0, k: 100 };
  }

  return {
    c: Math.round(((1 - r - k) / (1 - k)) * 100),
    m: Math.round(((1 - g - k) / (1 - k)) * 100),
    y: Math.round(((1 - b - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export function cmykToRgb(cyan, magenta, yellow, black) {
  const c = clamp(cyan, 0, 100) / 100;
  const m = clamp(magenta, 0, 100) / 100;
  const y = clamp(yellow, 0, 100) / 100;
  const k = clamp(black, 0, 100) / 100;

  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

export function colorValuesFromHex(value) {
  const hex = normalizeHexColor(value);
  const rgb = hexToRgb(hex);
  if (!hex || !rgb) return null;
  return {
    hex,
    rgb,
    cmyk: rgbToCmyk(rgb.r, rgb.g, rgb.b),
  };
}
