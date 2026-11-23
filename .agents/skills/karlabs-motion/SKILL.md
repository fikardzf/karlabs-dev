---
name: karlabs-motion
description: Use for React component animation, gestures, spring physics, layout transitions, and accessible microinteractions in KAR Labs. Coordinate with GSAP to avoid animation conflicts.
---

# KAR Labs — Motion Skill

## Purpose
Use Motion to create polished, responsive and accessible
component-level interactions in the KAR Labs portfolio.

## Official Documentation
- https://motion.dev/docs/react
- https://motion.dev/docs/react-gestures
- https://motion.dev/docs/react-layout-animations

## Responsibilities
- Hover, tap and focus feedback
- Spring-based interactions
- Component entrance and exit transitions
- Layout transitions
- Drag gestures where appropriate
- Interactive gallery controls
- Project selection feedback
- Reduced-motion alternatives

## Implementation Rules
1. Inspect existing animation dependencies first.
2. Prefer `motion/react` for new React animations.
3. Do not blindly migrate existing framer-motion code.
4. Preserve existing functional interactions.
5. Use AnimatePresence only when required.
6. Avoid unnecessary animation wrappers.
7. Prefer transform and opacity animations.
8. Honor reduced-motion preferences.
9. Do not animate properties already controlled by GSAP.
10. Avoid creating animations during every React render.
11. Keep interactions responsive to user input.
12. Clean up subscriptions and custom listeners.

## Animation Ownership
Motion owns component-level gestures and UI state transitions.
GSAP owns complex timelines and scroll-driven choreography.
Lenis owns smooth scrolling.

Never allow two engines to control the same CSS property
on the same element simultaneously.

## Quality Requirements
- Immediate interaction feedback
- No artificial delays on primary actions
- Consistent spring behavior
- Accessible keyboard interactions
- Touch-friendly behavior
- Smooth mobile performance
- No excessive decorative animation

## Verification
Test pointer, touch, keyboard, navigation and reduced motion.

Apply this skill only when Motion materially improves UX.
