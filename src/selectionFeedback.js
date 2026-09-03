export const DEFAULT_SELECTION_HINT = 'Bir panel seç; Ctrl/Cmd + tık ile panelleri çoklu seç.';

function result(message, {
  foamModuleId = null,
  foamControlsVisible = false,
  foamColor = '#ffffff',
} = {}) {
  return { message, foamModuleId, foamControlsVisible, foamColor };
}

export function describeSurfaceSelection(surfaces, modules = []) {
  if (!surfaces?.length) return result(DEFAULT_SELECTION_HINT);

  if (surfaces.length === 1) {
    const surface = surfaces[0];
    const { moduleIndex, widthCm, stripNumber, moduleType } = surface.userData;

    if (moduleType === 'counter') {
      const faceLabel = surface.userData.surfaceRole === 'front'
        ? 'ön'
        : (surface.userData.surfaceRole === 'left'
          ? 'sol yan'
          : (surface.userData.surfaceRole === 'return' ? 'L dönüş' : 'sağ yan'));
      const counterLabel = surface.userData.counterShape === 'L'
        ? ('Köşe Banko ' + widthCm + '×' + (Number(surface.userData.depthCm) || widthCm))
        : ('Banko ' + widthCm + ' cm');
      return result('Modül ' + (moduleIndex + 1) + ' · ' + counterLabel + ' · ' + faceLabel + ' cephe · renk + görsel uygulanabilir.');
    }

    if (moduleType === 'base-wall') {
      const role = surface.userData.surfaceRole;
      const label = role === 'front'
        ? 'baza ön panel'
        : (role === 'left'
          ? 'baza sol yan panel'
          : (role === 'right' ? 'baza sağ yan panel' : `alttan ${stripNumber}. duvar paneli`));
      return result('Modül ' + (moduleIndex + 1) + ' · Panel Bazalı ' + widthCm + ' cm · ' + label + ' · renk + görsel uygulanabilir.');
    }

    if (moduleType === 'base') {
      const faceLabel = surface.userData.surfaceRole === 'front'
        ? 'ön'
        : (surface.userData.surfaceRole === 'left' ? 'sol yan' : 'sağ yan');
      return result('Modül ' + (moduleIndex + 1) + ' · Baza ' + widthCm + ' cm · ' + faceLabel + ' panel · renk + görsel uygulanabilir.');
    }

    if (moduleType === 'separator') {
      return result(`Modül ${moduleIndex + 1} · Separatör ${widthCm} cm · yalnızca renk uygulanabilir.`);
    }

    if (moduleType === 'door') {
      return result(surface.userData.surfaceRole === 'door'
        ? `Modül ${moduleIndex + 1} · Kapı ${widthCm} cm · kapı yüzeyi · renk + görsel uygulanabilir.`
        : `Modül ${moduleIndex + 1} · Kapı ${widthCm} cm · üst ${stripNumber}. panel · renk + görsel uygulanabilir.`);
    }

    if (moduleType === 'showcase-3' || moduleType === 'showcase-2') {
      const eyeCount = moduleType === 'showcase-3' ? 3 : 2;
      return result(`Modül ${moduleIndex + 1} · ${eyeCount} Gözlü Vitrin ${widthCm} cm · alttan ${stripNumber}. panel · renk + görsel uygulanabilir.`);
    }

    if (moduleType === 'shelf') {
      const shelfCount = Number(surface.userData.shelfCount) || 2;
      return result('Modül ' + (moduleIndex + 1) + ' · Raf ' + widthCm + ' cm · ' + shelfCount + ' raflı · alttan ' + stripNumber + '. panel · renk + görsel uygulanabilir.');
    }

    if (moduleType === 'table-chair-set-eames') {
      return result('Modül ' + (moduleIndex + 1) + ' · Eames Masa Sandalye Takımı · 4 Eames sandalye · sandalye gövde rengi değiştirilebilir · cam masa sabittir.');
    }

    if (moduleType === 'bar-stool') {
      return result('Modül ' + (moduleIndex + 1) + ' · Bar Taburesi · GLB model.');
    }

    if (moduleType === 'indoor-plant-1' && modules[moduleIndex]?.surface) {
      return result('Modül ' + (moduleIndex + 1) + ' · Uzun Saksı ' + (Number(modules[moduleIndex]?.widthCm) || '') + ' · saksı gövdesi · renk uygulanabilir.');
    }

    if (moduleType === 'mini-fridge') {
      return result('Modül ' + (moduleIndex + 1) + ' · Mini Buzdolabı · 45 × 43 × 66 cm · GLB model.');
    }

    if (moduleType === 'illuminated-foam') {
      const foamState = modules[moduleIndex];
      const foamColor = foamState?.haloColor || '#ffffff';
      return result(
        `Modül ${moduleIndex + 1} · Işıklı Strafor · ${Number(foamState?.widthCm) || 0} × ${Number(foamState?.heightCm) || 0} cm · ${Number(foamState?.depthCm) || 3.5} cm kalınlık · ışık ${foamColor}.`,
        {
          foamModuleId: foamState?.id ?? null,
          foamControlsVisible: true,
          foamColor,
        },
      );
    }

    if (moduleType === 'tv') {
      const tvState = modules[moduleIndex];
      const sizeInch = Number(tvState?.sizeInch) || 42;
      const screenWidthCm = Number(tvState?.screenWidthCm) || 93;
      const screenHeightCm = Number(tvState?.screenHeightCm) || 52.3;
      return result(`Modül ${moduleIndex + 1} · TV ${sizeInch}" · ${screenWidthCm} × ${screenHeightCm} cm ekran.`);
    }

    if (moduleType === 'led-floodlight') {
      return result('Modül ' + (moduleIndex + 1) + ' · LED Projektör · 350 cm üst profile bağlı aydınlatma.');
    }

    return result(`Modül ${moduleIndex + 1} · ${widthCm} cm · alttan ${stripNumber}. panel · Ctrl/Cmd + tık ile çoklu seç.`);
  }

  const allCounterPanels = surfaces.every(
    (surface) => surface.userData.moduleType === 'counter',
  );
  if (allCounterPanels) {
    const widthCm = surfaces[0]?.userData.widthCm ?? '';
    return result(`Banko ${widthCm} cm · ${surfaces.length} panel seçili · renk + görsel toplu uygulanabilir.`);
  }

  const selectedFabricGroupIds = new Set(
    surfaces.map((surface) => surface.userData.surfaceState?.fabricGroupId).filter(Boolean),
  );
  if (selectedFabricGroupIds.size === 1
    && surfaces.every((surface) => surface.userData.surfaceState?.fabricGroupId)) {
    const fabricType = surfaces[0]?.userData.surfaceState?.fabricType === 'mesh'
      ? 'mesh'
      : 'lightbox';
    return result(fabricType === 'mesh'
      ? 'Tek parça Mesh (Delikli) Branda seçili · renk + görsel uygulanabilir.'
      : 'Tek parça Lightbox Kumaş seçili · renk + görsel uygulanabilir.');
  }

  return result(`${surfaces.length} panel seçili · Lightbox Kumaş / Mesh Branda için eksiksiz dikdörtgen panel grubunu seç.`);
}

export function describeFloorSelection({ selected, floorType, paintable } = {}) {
  if (!selected) return null;
  const label = floorType === 'karolaj' ? 'Karolaj' : (floorType === 'hali' ? 'Halı' : 'Parke');
  return paintable
    ? label + ' zemini seçili · mevcut Aktif renk ile boyanabilir.'
    : label + ' zemini seçili · bu zemin tipi boyanamaz.';
}
