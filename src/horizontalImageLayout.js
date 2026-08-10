export function createHorizontalImageLayout(items) {
  if (!Array.isArray(items) || items.length < 2) {
    return { ok: false, message: 'Birleşik yatay görsel için en az 2 panel seç.' };
  }

  const ordered = [...items].sort((a, b) => a.moduleIndex - b.moduleIndex);
  const stripIndex = ordered[0].stripIndex;

  if (ordered.some((item) => item.stripIndex !== stripIndex)) {
    return { ok: false, message: 'Yatay birleşik görsel için paneller aynı sırada olmalı.' };
  }

  for (let index = 1; index < ordered.length; index += 1) {
    if (ordered[index].moduleIndex !== ordered[index - 1].moduleIndex + 1) {
      return { ok: false, message: 'Yatay birleşik görsel için seçili paneller bitişik olmalı.' };
    }
  }

  const totalWidth = ordered.reduce((sum, item) => sum + item.width, 0);
  const height = ordered[0].height;

  if (!(totalWidth > 0) || !(height > 0)) {
    return { ok: false, message: 'Seçili panel ölçüleri geçersiz.' };
  }

  let cursor = 0;
  const entries = ordered.map((item) => {
    const regionStart = cursor / totalWidth;
    const regionWidth = item.width / totalWidth;
    cursor += item.width;
    return {
      ...item,
      regionStart,
      regionWidth,
    };
  });

  return {
    ok: true,
    stripIndex,
    totalWidth,
    height,
    groupAspect: totalWidth / height,
    entries,
  };
}
