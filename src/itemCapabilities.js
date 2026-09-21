import { getItem } from './items.js';

const NO_SURFACE_CAPABILITIES = Object.freeze({
  color: false,
  image: false,
  glass: false,
  lightbox: false,
  mesh: false,
});

export function getItemSurfaceCapabilities(itemOrKey) {
  const item = typeof itemOrKey === 'string' ? getItem(itemOrKey) : itemOrKey;
  if (!item) return NO_SURFACE_CAPABILITIES;
  return Object.freeze({
    color: item.acceptsColor === true,
    image: item.acceptsImage === true,
    glass: item.acceptsGlass === true,
    lightbox: item.acceptsLightbox === true,
    mesh: item.acceptsMesh === true,
  });
}

export function itemSurfaceAcceptsImage(itemOrKey) {
  return getItemSurfaceCapabilities(itemOrKey).image === true;
}

export function surfaceCapabilityUserData(itemOrKey) {
  const capabilities = getItemSurfaceCapabilities(itemOrKey);
  return {
    acceptsColor: capabilities.color,
    acceptsImage: capabilities.image,
    acceptsGlass: capabilities.glass,
    acceptsLightbox: capabilities.lightbox,
    acceptsMesh: capabilities.mesh,
  };
}
