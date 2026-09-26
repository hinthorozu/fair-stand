import styleCss from './style.css?inline';
import colorEditorCss from './colorEditor.css?inline';
import imageActionsCss from './imageActions.css?inline';
import helpGuideCss from './helpGuide.css?inline';
import productionBomPanelCss from './productionBomPanel.css?inline';
import { FAIR_STAND_MARKUP } from './configuratorMarkup.js';
import { setFairStandHostDocument } from './hostDocument.js';
import { startFairStandConfigurator } from './main.js';

const TRASH_BIN_PREVIEW_CSS = `
.module-drag-card[data-module-key="plastic_trash_bin"] .module-drag-panel,
.module-catalog-card[data-module-key="plastic_trash_bin"] .module-drag-panel {
  position: relative;
  display: block;
  width: 34px !important;
  height: 48px;
  border: 3px solid #4b5563;
  border-radius: 5px 5px 8px 8px;
  background: #d7dce2;
  box-sizing: border-box;
  box-shadow: 3px 3px 0 #b8c0c9;
}
.module-drag-card[data-module-key="plastic_trash_bin"] .module-drag-panel span,
.module-catalog-card[data-module-key="plastic_trash_bin"] .module-drag-panel span {
  display: none;
}
.module-drag-card[data-module-key="plastic_trash_bin"] .module-drag-panel::before,
.module-catalog-card[data-module-key="plastic_trash_bin"] .module-drag-panel::before {
  content: '';
  position: absolute;
  left: -5px;
  right: -5px;
  top: -8px;
  height: 7px;
  border: 3px solid #4b5563;
  border-radius: 5px 5px 2px 2px;
  background: #aeb6c0;
  box-sizing: border-box;
}
.module-drag-card[data-module-key="plastic_trash_bin"] .module-drag-panel::after,
.module-catalog-card[data-module-key="plastic_trash_bin"] .module-drag-panel::after {
  content: '';
  position: absolute;
  left: 6px;
  right: 6px;
  top: 8px;
  bottom: 7px;
  border-left: 2px solid #9aa3ad;
  border-right: 2px solid #9aa3ad;
}
`;

export function mountFairStand(container, options = {}) {
  if (!container) {
    throw new Error('Fair Stand mount container is required.');
  }

  const iframe = document.createElement('iframe');
  iframe.title = 'Fair Stand';
  iframe.setAttribute('data-testid', 'fair-stand-frame');
  iframe.setAttribute('aria-label', 'Fair Stand configurator');
  Object.assign(iframe.style, {
    width: '100%',
    height: '100%',
    border: '0',
    display: 'block',
    background: '#eef1f4',
  });
  container.replaceChildren(iframe);

  const hostDocument = iframe.contentDocument;
  if (!hostDocument) {
    throw new Error('Fair Stand host document could not be created.');
  }

  hostDocument.open();
  hostDocument.write(`<!doctype html>
<html lang="tr">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>${styleCss}\n${colorEditorCss}\n${imageActionsCss}\n${helpGuideCss}\n${productionBomPanelCss}\n${TRASH_BIN_PREVIEW_CSS}</style>
  </head>
  <body>
    ${FAIR_STAND_MARKUP}
  </body>
</html>`);
  hostDocument.close();

  setFairStandHostDocument(hostDocument);
  if (options.catalogHeaders) {
    iframe.contentWindow.__FAIR_STAND_CATALOG_HEADERS__ = options.catalogHeaders;
    globalThis.__FAIR_STAND_CATALOG_HEADERS__ = options.catalogHeaders;
  }
  if (options.capabilities) {
    iframe.contentWindow.__FAIR_STAND_PROJECT_CAPABILITIES__ = options.capabilities;
    globalThis.__FAIR_STAND_PROJECT_CAPABILITIES__ = options.capabilities;
  }
  if (options.initialProjectId) {
    iframe.contentWindow.__FAIR_STAND_INITIAL_PROJECT_ID__ = options.initialProjectId;
    globalThis.__FAIR_STAND_INITIAL_PROJECT_ID__ = options.initialProjectId;
  }
  const stop = startFairStandConfigurator({
    initialProjectId: options.initialProjectId,
    capabilities: options.capabilities,
  });

  return function unmountFairStand() {
    try {
      stop?.();
    } catch (error) {
      console.warn('Fair Stand runtime stop failed:', error);
    }
    setFairStandHostDocument(typeof document !== 'undefined' ? document : null);
    try {
      delete globalThis.__FAIR_STAND_INITIAL_PROJECT_ID__;
      delete globalThis.__FAIR_STAND_PROJECT_CAPABILITIES__;
    } catch {
      /* ignore */
    }
    iframe.remove();
    container.replaceChildren();
  };
}
