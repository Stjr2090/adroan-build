/**
 * Shared motion tokens (brief #1319).
 * One easing curve, one duration scale. CSS mirrors these as --ease-fluid,
 * --dur-fast, --dur-base, --dur-slow, --stagger and --rise.
 */

export const EASE_FLUID = 'cubic-bezier(0.22, 1, 0.36, 1)';

export const DURATION = {
  fast: 0.16,
  base: 0.28,
  slow: 0.56,
};

export const STAGGER = 0.06;
export const RISE = 16;

/**
 * Cubic bezier evaluator for `EASE_FLUID`, so JS-driven motion (Lenis, GSAP)
 * uses the exact same curve as the CSS transitions.
 */
function cubicBezier(x1, y1, x2, y2) {
  const axis = (a, b) => ({
    a: 1 - 3 * b + 3 * a,
    b: 3 * b - 6 * a,
    c: 3 * a,
  });

  const { a: ax, b: bx, c: cx } = axis(x1, x2);
  const { a: ay, b: by, c: cy } = axis(y1, y2);

  const sample = (t, a, b, c) => ((a * t + b) * t + c) * t;
  const slope = (t, a, b, c) => 3 * a * t * t + 2 * b * t + c;

  return function ease(t) {
    if (t <= 0) return 0;
    if (t >= 1) return 1;

    let guess = t;
    for (let i = 0; i < 8; i += 1) {
      const current = sample(guess, ax, bx, cx) - t;
      const rate = slope(guess, ax, bx, cx);
      if (Math.abs(current) < 1e-6 || Math.abs(rate) < 1e-6) break;
      guess -= current / rate;
    }

    return sample(guess, ay, by, cy);
  };
}

export const easeFluid = cubicBezier(0.22, 1, 0.36, 1);
