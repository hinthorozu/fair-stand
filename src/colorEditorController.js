import { colorValuesFromHex, cmykToRgb, rgbToHex } from './colorUtils.js';
import { normalizeCmykValues, readNumberGroup } from './colorEditorInputs.js';

function writeRgbInputs(inputs, rgb) {
  inputs.r.value = String(rgb.r);
  inputs.g.value = String(rgb.g);
  inputs.b.value = String(rgb.b);
}

function writeCmykInputs(inputs, cmyk) {
  inputs.c.value = String(cmyk.c);
  inputs.m.value = String(cmyk.m);
  inputs.y.value = String(cmyk.y);
  inputs.k.value = String(cmyk.k);
}

export function createColorEditorController({
  colorInput,
  colorHexInput,
  colorRgbInputs,
  colorCmykInputs,
  onApply = () => {},
}) {
  function syncFromHex(hex, { apply = false } = {}) {
    const values = colorValuesFromHex(hex);
    if (!values) return false;

    colorInput.value = values.hex;
    colorHexInput.value = values.hex;
    writeRgbInputs(colorRgbInputs, values.rgb);
    writeCmykInputs(colorCmykInputs, values.cmyk);

    if (apply) onApply();
    return true;
  }

  function syncFromRgbInputs() {
    const rgb = readNumberGroup(colorRgbInputs);
    if (!rgb) return;
    syncFromHex(rgbToHex(rgb.r, rgb.g, rgb.b), { apply: true });
  }

  function syncFromCmykInputs() {
    const cmyk = readNumberGroup(colorCmykInputs);
    if (!cmyk) return;

    const normalizedCmyk = normalizeCmykValues(cmyk);
    writeCmykInputs(colorCmykInputs, normalizedCmyk);

    const rgb = cmykToRgb(
      normalizedCmyk.c,
      normalizedCmyk.m,
      normalizedCmyk.y,
      normalizedCmyk.k,
    );
    const hex = rgbToHex(rgb.r, rgb.g, rgb.b);
    colorInput.value = hex;
    colorHexInput.value = hex;
    writeRgbInputs(colorRgbInputs, rgb);
    onApply();
  }

  return { syncFromHex, syncFromRgbInputs, syncFromCmykInputs };
}
