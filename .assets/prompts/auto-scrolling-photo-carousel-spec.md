# Spec: Auto-Scrolling Photo Carousel

## 1. Overview

Implement a horizontally auto-scrolling photo carousel as a reusable **Astro component**, using **TypeScript** and **Tailwind CSS**.

The carousel presents project photos in portrait cards. Each card contains an image, a project title below the image, and a short text containing the project's tags.

The supplied reference image defines the intended card composition: image first, followed by a dark information area containing the title and tags. Cards should be displayed completely; do not crop or clip cards at the carousel's visible edges.

## 2. Scope and implementation constraints

- Framework: Astro.
- Language: TypeScript.
- Styling: Tailwind CSS.
- Implement card as an Astro component, not as a page-specific block.
- Use the image assets whose filenames begin with `carousel-sample-` in `public/assets/img` as card images.
- Implement the carousel as an Astro component, not as a page-specific block.
- The component should receive its card data through typed props or an equivalent clearly defined data structure.
- Do not introduce a CMS, server-side data fetching, or other backend functionality.

## 3. Card content and data

Each card must contain only these content elements, in this order:

1. Project image.
2. Project title below the image.
3. Project's tags below the title.

Do not place text overlays, gradients, buttons, badges, or other content on top of the image.

Suggested TypeScript data contract:

```ts
export type Card = {
  id: string;
  imageSrc: string;
  imageAlt: string;
  title: string;
  tags: string[];
};

export type PhotoCarouselProps = {
  items: Card[];
  ariaLabel: string;
  speed?: number;
};
```

`id`, `imageSrc`, `imageAlt`, `title`, and `tags` describe each card. `speed` may configure the autoplay speed. The component must not assume that project URLs exist: card navigation is not part of the stated requirements.

Use the available `carousel-sample-` files as the image assets. Do not invent image filenames or assume that titles and tags can be inferred reliably from filenames. Keep title/tag content in the supplied item data unless the project provides an explicit metadata source.

## 4. Card layout and responsive behavior

- Each image/card uses a **3:4 width-to-height aspect ratio** (portrait).
- A card's width must never exceed **60% of the carousel's available viewport width**.
- Preserve the 3:4 ratio at every viewport.
- Cards must remain fully visible: do not intentionally show a partially clipped card at either edge.
- Do not use `overflow-hidden` as a means of cutting off card content or card edges.
- Use an appropriate fit mode for card image such as `object-fit: contain` or `object-fit: cover`. Center the image on the card image container. 
- The title and tags sit below the image, not over it.
- Maintain consistent spacing between cards and between the image, title, and tags.
- The carousel must have full-view-width and adapt height to narrow and wide viewports without exceeding the 48% card-width limit.
- Cards should be clickable, although place a `#` href link meanwhile URL redirecting is not decided.  
Derive spacing and typography from the project's existing design tokens where available.
- Mock title and tag text, no longer than 3 words.
- Do not add card background color.

## 5. Auto-scrolling behavior

- Cards are arranged horizontally in a single row.
- The carousel scrolls automatically in one consistent direction.
- Motion should be continuous and visually unobtrusive.
- The loop should be seamless: when the end of the sequence is reached, scrolling continues without a visible jump.
- If duplicating the item sequence is necessary to create a seamless loop, duplicate cards must not create duplicate screen-reader announcements or keyboard stops.
- The carousel must not move when the total cards fit the viewport width.
- Do not add carousel background color.
- The implementation must clean up animation frames, event listeners, and other resources when the component is removed or no longer active.

The original requirements do not specify a scroll direction, speed, pause delay, or arrow controls. Make these configurable or follow the existing project design conventions; do not treat arbitrary values from the previous generated specification as fixed requirements.

## 6. User interaction and motion preferences

- Support pointer and touch interaction.
- Pause automatic movement while the user is interacting with the carousel.
- If controls are provided, they must be keyboard accessible and have clear accessible labels.
- Add arrow navigation on carousel hover. Use `arrow-left.svg` and `arrow-right.svg` icons available on `public/assets/icon`.
- Do not add hover scaling, or other interaction effects unless they are needed by the existing project design or explicitly approved. 

## 7. Accessibility

- Give the carousel a meaningful accessible name through `ariaLabel`.
- Provide meaningful alternative text for each project image.
- Keep the title and tags available as text; do not embed them in images.
- Ensure keyboard users can reach any interactive controls.
- Ensure duplicated visual items used for looping are hidden from assistive technology and are not keyboard-focusable.
- Avoid announcing every automatic movement to screen readers.

## 8. Image loading and layout stability

- Reserve the image's 3:4 display space before the image loads to prevent layout shifts.
- Use lazy loading where appropriate, while avoiding delayed loading of the first visible images.
- Provide a sensible fallback if an image cannot be loaded.

## 9. Acceptance criteria

1. The implementation is an Astro component written in TypeScript and styled with Tailwind CSS.
2. The component uses the available image assets beginning with `carousel-sample-` in `public/assets/img`.
3. Every card image maintains a 3:4 width-to-height aspect ratio at all supported viewport sizes.
4. No card exceeds 48% of the carousel viewport width.
5. Cards are not partially clipped at the visible edges.
6. Each card displays its image, title below the image, and tags below the title.
7. No text or decorative overlay is placed on top of the image.
8. Autoplay moves the horizontal sequence continuously and loops without a visible jump.
9. Image loading does not cause avoidable layout shifts.
10. The component cleans up animation and event resources appropriately.
11. Autoplay direction to left.

## 10. Decisions still required

The following details are not specified by the requirements or the reference image and should be confirmed against the surrounding project before implementation:

- Exact spacing, typography.

Do not silently add requirements for navigation links, inertia, analytics, or a CMS.
