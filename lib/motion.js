export const motionTokens = Object.freeze({
  ease: 'cubic-bezier(0.22, 1, 0.36, 1)',
  duration: Object.freeze({
    fast: 160,
    base: 280,
    slow: 560,
  }),
  stagger: 60,
  rise: 16,
});

export const motionCssVariables = Object.freeze({
  ease: '--motion-ease',
  durationFast: '--motion-duration-fast',
  durationBase: '--motion-duration-base',
  durationSlow: '--motion-duration-slow',
  stagger: '--motion-stagger',
  rise: '--motion-rise',
});
