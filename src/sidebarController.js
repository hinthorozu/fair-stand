export function createSidebarController({
  appElement,
  toggleButton,
  windowRef = window,
  EventClass = Event,
}) {
  function setCollapsed(collapsed) {
    appElement?.classList.toggle('sidebar-collapsed', collapsed);

    if (toggleButton) {
      toggleButton.textContent = collapsed ? '›' : '‹';
      toggleButton.setAttribute('aria-expanded', String(!collapsed));
      toggleButton.setAttribute('aria-label', collapsed ? 'Menüyü aç' : 'Menüyü kapat');
      toggleButton.title = collapsed ? 'Menüyü aç' : 'Menüyü kapat';
    }

    windowRef.dispatchEvent(new EventClass('resize'));
  }

  function toggle() {
    const collapsed = !appElement?.classList.contains('sidebar-collapsed');
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
