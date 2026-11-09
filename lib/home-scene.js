// HomeStory owns this state in motion mode; reduced motion uses the static observer.
export function publishHomeScene(scene) {
  const root = document.documentElement;
  root.dataset.scene = scene;
  root.dataset.theme = ['about', 'team'].includes(scene) ? 'light' : 'dark';
  root.dataset.strip = scene === 'landing' ? 'names' : 'dots';
  window.dispatchEvent(new CustomEvent('adroan:scene', { detail: scene }));
}

// Header art follows the backdrop under the fixed header, not the scene theme.
// Motion mode crossfades one full-viewport wash layer, so the scene theme is
// the backdrop there. Static/reduced motion keeps each scene's own gradient,
// so the scene's 22% top band decides; the 8px hysteresis keeps the lockup
// from oscillating on the ramp.
export function syncHeaderBackdrop() {
  const root = document.documentElement;
  const scenes = document.querySelectorAll('.scene');
  let next;
  if (!scenes.length || root.classList.contains('home-story-motion')) {
    next = root.dataset.theme === 'light' ? 'light' : 'dark';
  } else {
    const y = window.scrollY + 28;
    let current = scenes[0];
    for (const scene of scenes) {
      if (scene.getBoundingClientRect().top + window.scrollY <= y) current = scene;
    }
    const top = current.getBoundingClientRect().top + window.scrollY;
    const edge = top + (current.offsetHeight || window.innerHeight) * 0.22;
    const state = root.dataset.headerBackdrop;
    if (current.id === 'projects') {
      next = state === 'light' ? (y > edge + 4 ? 'dark' : 'light')
        : state === 'dark' ? (y < edge - 4 ? 'light' : 'dark')
          : (y < edge ? 'light' : 'dark');
    } else if (current.id === 'about' || current.id === 'team') {
      next = state === 'dark' ? (y > edge + 4 ? 'light' : 'dark')
        : state === 'light' ? (y < edge - 4 ? 'dark' : 'light')
          : (y < edge ? 'dark' : 'light');
    } else {
      next = 'dark';
    }
  }
  if (next !== root.dataset.headerBackdrop) root.dataset.headerBackdrop = next;
}
