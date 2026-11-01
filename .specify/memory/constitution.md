<!--
Sync Impact Report
Version change: 1.0.0 → 1.1.0
Modified principles: I. Portuguese-Brazilian Experience; II. Astro-First, Vite-Powered Architecture;
  III. Static-First, Sanity Later; IV. Simplicity and Deliberate Dependencies;
  V. Accessible, Responsive Quality.
Added sections: none.
Removed sections: none.
Follow-up TODO: confirm the original ratification date.
-->

# MICRA Architecture Website Constitution

## Core Principles

### I. Portuguese-Brazilian Experience

All visitor-facing website content MUST be written in Brazilian Portuguese (`pt-BR`),
including navigation, page copy, form labels, validation messages, and metadata intended
for local visitors. Code identifiers, technical documentation, and Copilot instructions
MAY use English for consistency with the development workflow. The document language
MUST identify the page as `pt-BR`.

### II. Astro-First, Vite-Powered Architecture

Astro MUST be the primary page and component framework, with Tailwind CSS used for
styling and Vite used through Astro's supported integration. The current declared
versions are Astro `^7.3.8`, Tailwind CSS `^4.3.3`, and Vite `^8.3.3`; package manifests
are the source of truth if these versions change. Pages MUST prefer static rendering and
Astro components. React, TypeScript, client-side hydration, and other runtime additions
MUST be introduced only when an approved requirement justifies them, with dependencies
and integrations explicitly configured before use.

### III. Static-First, Sanity Later

Page structure, visual design, and reusable components MUST first be implemented and
reviewed with static content. Sanity schemas and data fetching MUST NOT be introduced
until the page and component layouts are complete and approved. After that approval,
content MUST move from static data to Sanity in small, reviewable increments, preserving
the rendered experience at each step. Sanity schemas, queries, generated types, and
preview behavior MUST follow the repository's adopted Sanity guidance when Sanity work
begins.

### IV. Simplicity and Deliberate Dependencies

Implementations MUST use the simplest structure that meets the approved design and
behavior. Prefer native Astro and existing project utilities; avoid unnecessary
abstractions, dependencies, client JavaScript, and framework layers. External assets,
scripts, and copied implementation code MUST have an approved source and reuse rights.
The supplied online page is a visual reference, not a dependency that the finished site
may require at runtime.

### V. Accessible, Mobile-first, Responsive Quality

Every page MUST target mobile-first layout and remain usable on narrow and wide screens and support keyboard navigation, semantic structure, meaningful accessible names, visible focus, and sufficient content contrast. Motion MUST respect reduced-motion preferences. Changes MUST be validated with checks proportionate to the behavior: build and rendered-page checks for static content, and browser tests for important interactive flows.

## Technology and Deployment Constraints

- The production site MUST be deployable to Vercel using Astro's Vite-based build.
- Framework and styling versions MUST be managed through the project package manifest
  and lockfile; do not introduce an untracked global tool dependency.
- Vercel settings, build commands, output mode, and environment variables MUST remain
  consistent with the Astro application. Secrets MUST be supplied through environment
  configuration and MUST NOT be committed.
- This repository is a static landing page site. Additional frameworks, client-heavy state
  management, SSR, or CMS integration MUST be added only with explicit approval and a
  demonstrated requirement.
- Initial prototypes MUST use static content and approved local assets or replaceable
  placeholders. Do not generate images unless a separate approved requirement permits it.
- Sanity is the planned headless CMS for the later content migration phase; it is not a
  prerequisite for completing the initial page layouts.
- For this project, the Astro production build (`npm run build`) is the baseline
  validation gate when no repo-specific test suite exists. Unverified claims are not
  allowed.

## Delivery Workflow and Quality Gates

1. Define and approve scope and acceptance criteria before implementing feature work.
2. Build and review page layouts with static content before connecting Sanity.
3. Keep implementation changes scoped to the current approved task and preserve
   unrelated work in the repository.
4. Run the relevant build and tests after application changes. For this repo, the
   production build is the required minimal validation unless a narrower browser or
   component check is explicitly justified. Review responsive rendering for visual
   changes and user-visible behavior for interactive changes.
5. Before release, verify the production build and Vercel deployment configuration.
   Review content, assets, accessibility, and runtime dependencies against this
   constitution.
6. Report validation that was not run and the reason; do not claim unverified results.

## Governance

This constitution governs project decisions and takes precedence over conflicting
general guidance. A feature specification or task MAY refine its requirements but MUST
NOT silently waive a constitutional principle. Exceptions require documented rationale
and approval from the project owner before implementation.

Amendments MUST be proposed with a rationale, reviewed for impact on active work and
project guidance, and approved by the project owner before adoption. Update the
constitution version and last-amended date in the same change. Use semantic versioning:
MAJOR for incompatible removals or redefinitions of principles; MINOR for new principles,
sections, or materially expanded requirements; PATCH for clarifications and non-semantic
wording changes.

Every implementation review MUST check relevant acceptance criteria and constitutional
requirements. Any deviation MUST be identified, justified, and approved; unresolved
violations block completion or release.

**Version**: 1.1.0 | **Ratified**: TODO(RATIFICATION_DATE): confirm original adoption date | **Last Amended**: 2026-11-01
