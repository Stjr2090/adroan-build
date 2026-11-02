// Shared reference to the active Lenis instance.
// Set by components/SmoothScroll (desktop only), read by the nav strip
// in components/SiteHeader for smooth section scrolls.
export const lenisRef = { current: null };
