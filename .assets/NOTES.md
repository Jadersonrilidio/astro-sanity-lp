# My specifications to create auto-scrolling photo carousel

- implement the auto-scrolling photo carousel as an Astro component, with tailwindcss and typescript
- use images named `carousel-sample-` available on directory `public/assets/img` to create cards. ;
- photo card SHOULD not occupy more than 48% of the view width;
- photo card aspect ratio should always mantain 3:4 width/height ratio.
- use the attached image as reference for the carousel cards full display (with no hidden-overflow);
- the cards contains ONLY the image, with aspect-ratio and width described above, card title below image and a text with tags of the card.

# Claude generated -> Spec: Auto-Scrolling Photo Carousel (Project Showcase)


## 1. Overview

A horizontally scrolling carousel of project cards. It moves left on its own, pauses when the user shows interest, can be dragged, swiped or stepped with arrow buttons, and each card links to a project page.

**Primary goal:** showcase projects with a continuous, unobtrusive motion that the user can take over at any moment.

### Non-goals (out of scope for v1)

- Lightbox, zoom, video slides, thumbnails, pagination dots.
- Server-side data fetching (the component receives data as props).
- Vertical carousels.

## 2. Terminology

| Term | Meaning |
| --- | --- |
| **Track** | The inner strip that holds all cards in a row and is translated horizontally. |
| **Viewport** | The visible, `overflow: hidden` window over the track. |
| **Card** | One photo with title and link to a project. |
| **Autoplay** | Continuous leftward motion with no user input. |
| **Drag** | Pointer or touch moves the track by the amount the pointer moves. |
| **Step** | Moving by exactly one card (arrow buttons). |

## 3. Data contract

```ts
type CarouselItem = {
  id: string;            // unique, stable
  imageSrc: string;
  imageAlt: string;      // required, non-empty
  title: string;         // shown on card
  href: string;          // project page URL
  caption?: string;
};

type CarouselProps = {
  items: CarouselItem[];
  speed?: number;        // px per second, default 40
  gap?: number;          // px between cards, default 16
  resumeDelay?: number;  // ms after touch/drag end before autoplay resumes, default 1500
  stepDuration?: number; // ms for arrow step animation, default 400
  ariaLabel: string;     // e.g. "Featured projects"
};
```

## 4. Layout and responsive rules

- The viewport fills the container width. The track is wider than the viewport.
- Cards have a fixed aspect ratio of **4:3**, `object-fit: cover`, and reserve their space before the image loads (no layout shift).
- Card width by breakpoint:

| Viewport width | Cards visible (approx.) | Card width |
| --- | --- | --- |
| < 640px | 1.2 | 80% of viewport |
| 640–1023px | 2.5 | 38% of viewport |
| ≥ 1024px | 3.5 | 28% of viewport |

- The partially visible card at the edge is intentional: it signals that the content scrolls.
- Cards have a title overlay at the bottom with a gradient scrim so text meets **4.5:1** contrast on any image.
- Border radius, gap and shadow come from design tokens, not hard-coded values.

## 5. Motion model

### 5.1 Autoplay

- The track moves **left** at `speed` px/s using `transform: translate3d` driven by `requestAnimationFrame` (time-based, using the frame delta, so speed is the same on 60 Hz and 120 Hz screens).
- The loop is **seamless and infinite**: the items are rendered twice (clone set); when the offset passes the width of one full set, it wraps by subtracting that width with no visible jump.
- If the total width of one set is smaller than the viewport, repeat the set until it is at least 2× the viewport width.
- With fewer than 2 items: no motion, no arrows, no clones.

### 5.2 Pause and resume

- On devices with `(hover: hover)`: pointer enters the viewport → **decelerate to a stop within 300 ms**. Pointer leaves → **accelerate back to full speed within 300 ms**.
- Keyboard focus inside the carousel pauses autoplay until focus leaves.
- Tab hidden (`visibilitychange`) → pause; visible again → resume with no position jump.
- After touch, drag or arrow use, autoplay resumes after `resumeDelay` ms of inactivity (on hover devices only if the pointer is outside the viewport).

### 5.3 Drag (click and hold on desktop, touch-drag on mobile)

- Implemented with **Pointer Events** (`pointerdown/move/up/cancel`) with `setPointerCapture`, so mouse, touch and pen share one code path.
- While pressed, the track follows the pointer 1:1 (drag right → cards move right; drag left → cards move left). Autoplay is suspended.
- Cursor: `grab` on hover, `grabbing` while pressed. Text and image selection and native image dragging are disabled (`user-select: none`, `draggable="false"`).
- On release, **inertia**: the track keeps the release velocity and decays with friction (target stop in ≤ 600 ms). Velocity is computed from the last 100 ms of pointer samples.
- Dragging works infinitely in both directions thanks to the wrap logic in 5.1.
- Touch: the viewport uses `touch-action: pan-y`, so vertical page scroll still works, and only horizontal gestures are captured. If the gesture is mostly vertical (angle > 30° from horizontal in the first 10 px), the carousel releases the gesture to the browser.

### 5.4 Arrow buttons

- Two floating buttons, **Previous (left)** and **Next (right)**, vertically centered over the viewport edges.
- Style: circular, 44×44 px minimum, `background: rgba(0,0,0,0.35)`, white chevron icon with 3:1 contrast against the button, `backdrop-filter: blur(4px)` where supported. Opacity 0.6 at rest, 1.0 on hover or focus.
- Visibility: shown on hover and focus within the carousel on desktop; **always visible** on touch devices (`(hover: none)`).
- Click moves the track by **one card width + gap** with an ease-in-out animation of `stepDuration` ms. Rapid clicks queue up to 3 steps; further clicks are ignored until the queue drains.
- Arrow buttons do not wrap-jump: because the loop is infinite, stepping past the end continues seamlessly.

## 6. Card click and tap

- Each card is a real link: `<a href="{item.href}">` wrapping the image and title. This gives free keyboard support, middle-click, Cmd/Ctrl-click, and right-click “open in new tab”.
- **Click vs drag disambiguation:** a pointer interaction is a *click/tap* only if total pointer movement between down and up is **< 8 px**. If movement is ≥ 8 px, it is a drag: the navigation is cancelled (`preventDefault` on the click event) and the card does not open.
- A press-and-hold with no movement and then release (< 8 px) still counts as a click.
- A tap during inertia motion **stops the motion and does not navigate** (the first tap is consumed as “stop”).
- Default behavior: opens the project page in the **same tab**. Modified clicks (Cmd/Ctrl/Shift/middle) follow browser defaults.
- Hover feedback (desktop): card scales to 1.03 and shows a subtle shadow in 150 ms. Pressed feedback: scale 0.98.

## 7. States

| State | Behavior |
| --- | --- |
| Loading | Cards show a skeleton block at the 4:3 ratio. The first 3 images load eagerly, the rest use `loading="lazy"`. Autoplay starts when the first set is rendered, without waiting for all images. |
| Image error | Card shows a neutral fallback tile with the title and alt text. The link stays active. |
| 0 items | Component renders nothing. |
| 1 item | Static card, no arrows, no autoplay, still a link. |
| Reduced motion | See section 8. |
| Offline / slow | Layout does not shift; skeletons remain until each image loads. |

## 8. Accessibility (WCAG 2.2 AA)

- Viewport: `role="region"`, `aria-roledescription="carousel"`, `aria-label={ariaLabel}`.
- **Pause/Play button** (WCAG 2.2.2 Pause, Stop, Hide): auto-moving content longer than 5 s must be pausable. Provide a visible, focusable button with a clear label, placed before the track in the tab order. State persists until toggled.
- Under `prefers-reduced-motion: reduce`: autoplay is **off by default**, step animations are replaced by instant jumps, hover scale is disabled. The user can still drag and use arrows.
- Keyboard: Tab reaches Pause, Previous, each card link, Next. `ArrowLeft` / `ArrowRight` on the viewport steps one card. Focused card is scrolled fully into view. Visible focus ring ≥ 3:1 contrast.
- Screen readers: the cloned set is `aria-hidden="true"` and its links have `tabindex="-1"`, so each project is announced once. The track has `aria-live="off"` (it is motion, not announcements).
- Arrow buttons have `aria-label="Previous project"` / `"Next project"`.
- Touch targets ≥ 44×44 px. Text scales with 200% zoom without clipping.

## 9. Performance requirements

- Animation runs on the compositor: only `transform` changes per frame; no layout reads or writes inside the animation loop.
- Sustained **≥ 55 fps** on a mid-range mobile device (e.g. 4-year-old Android) with 20 items.
- Cumulative Layout Shift attributable to the carousel: **0**.
- Images served at responsive sizes (`srcset`/`sizes`), modern format (AVIF/WebP) with fallback.
- `will-change: transform` only on the track; removed when paused for long periods.
- No timers left running after unmount; all listeners and the rAF loop are cleaned up.
- The rAF loop does not run while the carousel is off-screen (`IntersectionObserver`).

## 10. Edge cases

- Window resize or device rotation: recompute card width and keep the same card aligned at the viewport's left edge; no jump.
- Pointer leaves the window while dragging: treated as release (pointer capture handles this).
- `pointercancel` (e.g. OS gesture): end drag without navigating, then resume per 5.2.
- Multi-touch: only the first pointer drives the drag; additional pointers are ignored.
- Items array changes at runtime: keep the current offset modulo the new set width.
- RTL languages: motion direction stays **left** as specified, arrows are not mirrored in v1 (documented limitation).

## 11. Acceptance criteria (Given / When / Then)

**Autoplay**

1. Given the page is loaded and the carousel is visible, when no input occurs, then cards move left continuously at the configured speed (±5%) with no visible jump at the loop point over 60 s.
2. Given the tab is hidden for 30 s, when it becomes visible again, then the carousel resumes from the same position with no jump.

**Hover (desktop)** 3. Given autoplay is running, when the pointer enters the viewport, then movement stops within 300 ms. 4. Given the carousel is hover-paused, when the pointer leaves, then movement resumes within 300 ms.

**Drag** 5. Given the pointer is over the carousel, when the user presses and drags 200 px to the right, then the track moves 200 px to the right 1:1 and the cursor shows `grabbing`. 6. Given the user drags and releases with velocity, when released, then the track continues with inertia and stops within 600 ms. 7. Given the user drags 20 px starting on a card, when released over that card, then **no navigation** occurs. 8. Given the user presses on a card and releases after moving < 8 px, then the browser navigates to that card's `href`.

**Touch** 9. Given a touch device, when the user swipes horizontally, then the track follows the finger and the page does not scroll horizontally. 10. Given a touch device, when the user swipes vertically on the carousel, then the page scrolls and the carousel does not move. 11. Given the user lifts the finger, when `resumeDelay` elapses with no further touch, then autoplay resumes. 12. Given the track is moving by inertia, when the user taps a card, then motion stops and no navigation occurs.

**Arrows** 13. Given any state, when Next is clicked, then the track advances exactly one card + gap in `stepDuration` ms. 14. Given Previous is clicked repeatedly 5 times quickly, then at most 3 steps are queued and the track never ends in a partial-card position. 15. Given a touch device, then both arrows are visible without hover and meet the 44×44 px minimum.

**Accessibility** 16. Given `prefers-reduced-motion: reduce`, when the page loads, then autoplay is off and the Pause/Play control shows the “Play” state. 17. Given keyboard-only use, when Tab is pressed through the page, then focus visits Pause, Previous, each real card, Next, in that order, and cloned cards are skipped. 18. Given a screen reader, then the carousel is announced as a carousel region with its label and each project is read once. 19. Automated check with axe shows **0 violations** in the carousel.

**Robustness** 20. Given 0, 1, 2 and 50 items, then the component renders correctly in each case (see section 7). 21. Given an image fails to load, then the fallback tile appears and the card is still a working link.

## 12. Test mapping

| Level | Covers |
| --- | --- |
| Unit | Wrap math (offset modulo set width), velocity calculation, click-vs-drag threshold, step queue limit. |
| Component (e.g. Testing Library) | Items 5–8, 13–14, 16–17, 20–21 using simulated pointer events and fake timers. |
| E2E (Playwright, desktop + mobile emulation) | Items 1–4, 9–12, 15, plus real navigation on click. |
| Visual regression | Layout at 375, 768, 1280 px; arrow styling; skeleton and error states. |
| Performance | Lighthouse CLS = 0; frame-rate trace on throttled CPU (4× slowdown). |
| Manual | Real iOS Safari and Android Chrome for touch, inertia and vertical-scroll hand-off; VoiceOver and TalkBack pass. |

## 13. Definition of done

- All acceptance criteria in section 11 pass in CI (except the manual-only ones, which are signed off by QA).
- Works in the last 2 versions of Chrome, Safari, Firefox, Edge, plus iOS Safari 16+ and Android Chrome.
- No console errors or warnings; no memory growth after 10 minutes of autoplay.
- Component documented with props table and a short usage example.

## 14. Open questions for product and design

1. Should clicking open the project in the same tab (assumed) or a new tab?
2. Is the default speed of 40 px/s right, or should it be tuned with design?
3. Should arrow buttons also be visible on desktop at rest, or only on hover (assumed)?
4. Do we need analytics events (card click, drag, pause) in v1?
5. Is RTL support required?
