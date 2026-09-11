# Changelog

All notable changes to this project are documented in this file.
The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the project
uses [Semantic Versioning](https://semver.org/).

## [1.0.0] - 2026-09-11

First public release: React replacement of the jQuery plugin jquery-modal for HRnet.

### Added

- `Modal` controlled component rendered in a portal (`isOpen` / `onClose`).
- jquery-modal options: `escapeClose`, `clickClose`, `showClose`, `closeText`, `fadeDuration`,
  `fadeDelay`, `modalClass`, `blockerClass`, `closeClass`.
- `onOpen` / `onAfterClose` callbacks (replace the `modal:open` / `modal:after-close` events).
- Accessibility: `role="dialog"`, `aria-modal`, accessible name from `title` or `ariaLabel`,
  `ariaDescribedBy`, focus trap and focus restoration.
- Page scroll lock without layout shift (`lockScroll`).
- `useModal` helper hook.
- Default theme customisable with CSS custom properties; animations disabled with
  `prefers-reduced-motion`.
- TypeScript declarations generated from the JSDoc.
