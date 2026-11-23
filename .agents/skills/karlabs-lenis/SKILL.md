---
name: karlabs-lenis
description: Use for smooth scrolling, Lenis setup, ScrollTrigger synchronization, scroll lifecycle management, and scroll performance in the KAR Labs React portfolio.
---

# KAR Labs — Lenis Integration Skill

## Purpose
Provide smooth, reliable scrolling without interfering
with native interaction, gallery dragging, or accessibility.

## Official Documentation
- https://github.com/darkroomengineering/lenis
- https://github.com/darkroomengineering/lenis/tree/main/packages/react
- https://gsap.com/docs/v3/Plugins/ScrollTrigger/

## Responsibilities
- Smooth scrolling configuration
- ScrollTrigger synchronization
- React lifecycle management
- Scroll restoration behavior
- Reduced-motion support
- Mobile scroll usability
- Cleanup and performance

## Mandatory Audit
Before integrating Lenis:

1. Inspect the existing scrolling implementation.
2. Identify any custom scroll containers.
3. Identify existing smooth-scroll libraries.
4. Identify ScrollTrigger instances.
5. Check whether GSAP already owns the animation ticker.
6. Check drag, touch and wheel navigation conflicts.
7. Check route transitions and scroll restoration.
8. Check native anchor navigation.
9. Check accessibility and reduced-motion behavior.

## GSAP Integration Pattern

For a Lenis instance using manual RAF control:

```js
lenis.on("scroll", ScrollTrigger.update);

const update = (time) => {
  lenis.raf(time * 1000);
};

gsap.ticker.add(update);
gsap.ticker.lagSmoothing(0);
```

The GSAP ticker provides seconds.
Lenis RAF expects milliseconds.

Ensure there is only one active RAF owner.

If using ReactLenis or autoRaf, adapt the integration
to avoid creating an additional animation loop.

## Lifecycle Requirements
- Initialize client-side only.
- Create a single intentional scroll controller.
- Avoid duplicate global instances.
- Remove listeners during cleanup.
- Remove ticker callbacks during cleanup.
- Destroy owned Lenis instances on unmount.
- Refresh ScrollTrigger after layout changes when needed.

## Interaction Safety
- Do not hijack nested scroll areas.
- Do not break modal scrolling.
- Do not break normal keyboard scrolling.
- Do not interfere with horizontal gallery dragging.
- Preserve anchor navigation.
- Preserve browser back and forward behavior.
- Avoid forced scroll positions during user interaction.
- Preserve native scroll where smooth scrolling is unsuitable.

## Accessibility
Respect prefers-reduced-motion.
Provide a native-scrolling fallback.

## Performance
Avoid unnecessary resize observers, repeated refreshes,
duplicate tickers and continuously forced layout reads.

## Verification
Test:
- Wheel scrolling
- Touch scrolling
- Trackpad behavior
- Keyboard navigation
- Anchor links
- Modal interactions
- Gallery drag behavior
- Browser history
- Reduced motion
- Mobile Safari
- Android Chrome

Use Lenis only when it improves the real experience.
