export function createViewportToolbarController({ toolbarElement, toggleButton }) {
  function setCollapsed(collapsed) {
    toolbarElement?.classList.toggle('is-collapsed', collapsed);

    if (toggleButton) {
      toggleButton.textContent = collapsed ? '‹' : '›';
      toggleButton.setAttribute('aria-expanded', String(!collapsed));
      toggleButton.setAttribute('aria-label', collapsed ? 'Üst bandı aç' : 'Üst bandı kapat');
      toggleButton.title = collapsed ? 'Üst bandı aç' : 'Üst bandı kapat';
    }
  }

  function toggle() {
    const collapsed = !toolbarElement?.classList.contains('is-collapsed');
    setCollapsed(collapsed);
    return collapsed;
  }

  function bind() {
    if (!toggleButton) return () => {};
    const onClick = () => toggle();
    toggleButton.addEventListener('click', onClick);
    return () => toggleButton.removeEventListener('click', onClick);
  }

  return { bind, setCollapsed, toggle };
}
