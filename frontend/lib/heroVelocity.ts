// Shared module-level refs so Hero and StarBackground can sync rotation.
// Plain objects — no React, no re-renders, zero overhead.
export const heroVel = {
  x:         0,
  y:         0,
  dragging:  false,
};
