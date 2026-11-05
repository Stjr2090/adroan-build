// HomeStory owns this state in motion mode; reduced motion uses the static observer.
export function publishHomeScene(scene) {
  const root = document.documentElement;
  root.dataset.scene = scene;
  root.dataset.theme = ['about', 'team'].includes(scene) ? 'light' : 'dark';
  root.dataset.strip = scene === 'landing' ? 'names' : 'dots';
  window.dispatchEvent(new CustomEvent('adroan:scene', { detail: scene }));
}
