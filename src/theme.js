export const ALUMINUM_PROFILE_COLOR = '#D0D3D4';

if (typeof document !== 'undefined') {
  document.documentElement.style.setProperty('--aluminum-profile-color', ALUMINUM_PROFILE_COLOR);
}

export const GLASS_APPEARANCE = Object.freeze({
  color: 0xd7e9ed,
  opacity: 0.48,
  roughness: 0.16,
  metalness: 0,
  transparent: true,
  depthWrite: false,
});

export const TABLE_GLASS_APPEARANCE = Object.freeze({
  ...GLASS_APPEARANCE,
  opacity: 0.42,
  roughness: 0.10,
  transmission: 0.32,
  clearcoat: 0.65,
});

export const PANEL_GLASS_BACKING_APPEARANCE = Object.freeze({
  color: 0xc9dce1,
  opacity: 0.18,
  roughness: 0.22,
  metalness: 0,
  transparent: true,
  depthWrite: false,
});

const MATERIAL_APPEARANCE_BY_MATERIAL = Object.freeze({
  cam: GLASS_APPEARANCE,
});

export function getMaterialAppearance(material) {
  return MATERIAL_APPEARANCE_BY_MATERIAL[material] ?? null;
}
