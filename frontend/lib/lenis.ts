import type Lenis from "lenis";

// Module-level reference so any component can call scrollTo without prop-drilling
export const lenisRef: { current: Lenis | null } = { current: null };

export function scrollTo(target: string | number | HTMLElement) {
  lenisRef.current?.scrollTo(target, {
    duration: 0.5,
    easing: (t: number) => 1 - Math.pow(1 - t, 3),
  });
}
