# @jodygs/hrnet-react-modal

[![npm version](https://img.shields.io/npm/v/@jodygs/hrnet-react-modal.svg)](https://www.npmjs.com/package/@jodygs/hrnet-react-modal)
[![license](https://img.shields.io/npm/l/@jodygs/hrnet-react-modal.svg)](./LICENSE)

Accessible and lightweight **React modal component**, written to replace the jQuery plugin
[jquery-modal](https://github.com/kylefox/jquery-modal) in **HRnet**, the internal HR application
of WealthHealth.

- ⚛️ 100% React, function components and hooks, no jQuery
- ♿ Accessible: `role="dialog"`, `aria-modal`, focus trap, focus restoration, Escape key
- 🎨 Easy to style: plain CSS, class name props and CSS custom properties
- 🪶 Zero dependency (~2 kB gzipped JS + 0.6 kB CSS), React is a peer dependency
- 🔁 Same options as jquery-modal (`escapeClose`, `clickClose`, `showClose`, `fadeDuration`…)

## Table of contents

- [Installation](#installation)
- [Quick start](#quick-start)
- [Props](#props)
- [`useModal` hook](#usemodal-hook)
- [Styling](#styling)
- [Accessibility](#accessibility)
- [Migrating from jquery-modal](#migrating-from-jquery-modal)
- [Development](#development)
- [Project structure](#project-structure)

## Installation

```bash
npm install @jodygs/hrnet-react-modal
```

Requires `react` and `react-dom` 18 or higher.

## Quick start

```jsx
import { Modal, useModal } from '@jodygs/hrnet-react-modal'
import '@jodygs/hrnet-react-modal/style.css' // default theme, import it once

function CreateEmployee() {
  const { isOpen, open, close } = useModal()

  const handleSubmit = (event) => {
    event.preventDefault()
    // …save the employee…
    open()
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        {/* … */}
        <button type="submit">Save</button>
      </form>

      <Modal isOpen={isOpen} onClose={close} ariaLabel="Confirmation">
        <p>Employee Created!</p>
      </Modal>
    </>
  )
}
```

The component is **controlled**: the parent decides whether the modal is open through `isOpen`,
and the modal asks to be closed by calling `onClose` (close button, Escape key or overlay click).

## Props

| Prop              | Type                  | Default         | Description                                                                                 |
| ----------------- | --------------------- | --------------- | ------------------------------------------------------------------------------------------- |
| `isOpen`          | `boolean`             | **required**    | Whether the modal is displayed.                                                             |
| `onClose`         | `() => void`          | –               | Called when the user asks to close the modal. Set `isOpen` to `false` in it.                |
| `children`        | `ReactNode`           | –               | Content of the dialog.                                                                      |
| `title`           | `ReactNode`           | –               | Heading displayed at the top of the dialog, also used as its accessible name.              |
| `escapeClose`     | `boolean`             | `true`          | Close the modal with the Escape key.                                                        |
| `clickClose`      | `boolean`             | `true`          | Close the modal by clicking on the overlay.                                                 |
| `showClose`       | `boolean`             | `true`          | Display the round "×" close button in the top right corner.                                 |
| `closeText`       | `string`              | `'Close'`       | Accessible label and tooltip of the close button.                                           |
| `fadeDuration`    | `number` (ms)         | `0`             | Duration of the fade in / fade out. `0` disables the animation.                             |
| `fadeDelay`       | `number`              | `1`             | Delay before the dialog fades in, as a fraction of `fadeDuration` (overlay appears first). |
| `modalClass`      | `string`              | –               | Extra class name(s) for the dialog box.                                                     |
| `blockerClass`    | `string`              | –               | Extra class name(s) for the overlay.                                                        |
| `closeClass`      | `string`              | –               | Extra class name(s) for the close button.                                                   |
| `lockScroll`      | `boolean`             | `true`          | Prevent the page behind the modal from scrolling.                                           |
| `ariaLabel`       | `string`              | –               | Accessible name of the dialog when there is no `title`.                                     |
| `ariaDescribedBy` | `string`              | –               | Id of the element describing the dialog.                                                    |
| `portalTarget`    | `Element`             | `document.body` | DOM element the modal is rendered into.                                                     |
| `onOpen`          | `() => void`          | –               | Called once the modal is fully displayed (after the fade in).                               |
| `onAfterClose`    | `() => void`          | –               | Called once the modal is hidden and removed from the DOM.                                   |

Every prop is also documented with JSDoc in [`src/Modal.jsx`](./src/Modal.jsx), and TypeScript
declarations are shipped with the package, so editors show the documentation on hover.

### Examples

```jsx
// Title, fade animation and lifecycle callbacks
<Modal
  isOpen={isOpen}
  onClose={close}
  title="Delete employee"
  fadeDuration={300}
  fadeDelay={0.5}
  onOpen={() => console.log('opened')}
  onAfterClose={() => console.log('closed')}
>
  <p>This action cannot be undone.</p>
  <button onClick={close}>Cancel</button>
</Modal>

// Forced choice: only the button inside can close the modal
<Modal isOpen={isOpen} onClose={close} title="Terms" escapeClose={false} clickClose={false} showClose={false}>
  <button onClick={close}>I agree</button>
</Modal>
```

## `useModal` hook

Optional helper that stores the open state of a modal.

```js
const { isOpen, open, close, toggle } = useModal(initialOpen = false)
```

| Returned value | Type         | Description                          |
| -------------- | ------------ | ------------------------------------ |
| `isOpen`       | `boolean`    | Current state, to pass to `<Modal>`. |
| `open`         | `() => void` | Opens the modal.                     |
| `close`        | `() => void` | Closes the modal (use as `onClose`). |
| `toggle`       | `() => void` | Switches between open and closed.    |

The three functions are memoized: they keep the same identity between renders.

## Styling

Import the default theme once (`@jodygs/hrnet-react-modal/style.css`). It reproduces the look of
jquery-modal. It can then be adapted in three ways:

**1. CSS custom properties**, globally or on a specific modal:

```css
:root {
  --hrnet-modal-max-width: 640px;
  --hrnet-modal-radius: 4px;
  --hrnet-modal-close-bg: #5a6f07;
}
```

| Variable                     | Default              |
| ---------------------------- | -------------------- |
| `--hrnet-modal-z-index`      | `1000`               |
| `--hrnet-modal-overlay-bg`   | `rgba(0, 0, 0, .75)` |
| `--hrnet-modal-bg`           | `#fff`               |
| `--hrnet-modal-color`        | `inherit`            |
| `--hrnet-modal-max-width`    | `500px`              |
| `--hrnet-modal-padding`      | `15px 30px`          |
| `--hrnet-modal-radius`       | `8px`                |
| `--hrnet-modal-shadow`       | `0 0 10px #000`      |
| `--hrnet-modal-close-size`   | `30px`               |
| `--hrnet-modal-close-bg`     | `#000`               |
| `--hrnet-modal-close-color`  | `#fff`               |
| `--hrnet-modal-close-border` | `#fff`               |
| `--hrnet-modal-focus-ring`   | `#5b8def`            |

**2. Class name props**: `modalClass`, `blockerClass` and `closeClass` are added next to the
default classes.

**3. Default class names**, to override in your own stylesheet:

| Element      | Class                                               |
| ------------ | --------------------------------------------------- |
| Overlay      | `.hrnet-modal-blocker` (+ `.is-visible` when shown) |
| Dialog       | `.hrnet-modal`                                      |
| Title        | `.hrnet-modal__title`                               |
| Close button | `.hrnet-modal__close`                               |

Animations are disabled for users who enabled `prefers-reduced-motion`.

## Accessibility

- The dialog has `role="dialog"` and `aria-modal="true"`, and is named by its `title`
  (`aria-labelledby`) or by `ariaLabel`.
- When it opens, the focus moves to the first focusable element of the dialog (or to the dialog
  itself). Tab and Shift+Tab stay inside the dialog.
- When it closes, the focus goes back to the element that had it before (usually the button that
  opened the modal).
- The close button is a real `<button>` with an accessible label (`closeText`).
- The page behind is not scrollable while the modal is open, without any layout shift.

## Migrating from jquery-modal

Only the user interface part of the plugin was converted. The AJAX loading feature
(`rel="modal:open"` on a link to a remote page, spinner) is out of scope: in React, load the data
yourself and render it as `children`.

| jquery-modal                            | @jodygs/hrnet-react-modal                  |
| --------------------------------------- | ------------------------------------------ |
| `$('#confirmation').modal()`            | `open()` / `isOpen={true}`                 |
| `$.modal.close()`                       | `close()` / `isOpen={false}`               |
| `escapeClose: true`                     | `escapeClose={true}`                       |
| `clickClose: true`                      | `clickClose={true}`                        |
| `showClose: true`                       | `showClose={true}`                         |
| `closeText: 'Close'`                    | `closeText="Close"`                        |
| `closeClass: ''`                        | `closeClass=""`                            |
| `modalClass: 'modal'`                   | `modalClass=""`                            |
| `blockerClass: 'jquery-modal'`          | `blockerClass=""`                          |
| `fadeDuration: null`                    | `fadeDuration={0}`                         |
| `fadeDelay: 1.0`                        | `fadeDelay={1}`                            |
| `closeExisting: true`                   | Not needed: each modal has its own state   |
| `$(el).on('modal:open', fn)`            | `onOpen={fn}`                              |
| `$(el).on('modal:after-close', fn)`     | `onAfterClose={fn}`                        |
| `showSpinner`, `spinnerHtml` (AJAX)     | Out of scope                               |

## Development

```bash
git clone git@github.com:JodyGs/hrnet-react-modal.git
cd hrnet-react-modal
npm install
```

| Script              | Description                                                   |
| ------------------- | ------------------------------------------------------------- |
| `npm run dev`       | Starts the interactive demo (`demo/`) on http://localhost:5173 |
| `npm test`          | Runs the unit tests (Vitest + Testing Library)                |
| `npm run coverage`  | Runs the tests with a coverage report                         |
| `npm run lint`      | Lints the code (oxlint)                                       |
| `npm run build`     | Builds the package into `dist/` (ESM, CommonJS, CSS, types)   |

## Project structure

```
src/
├── index.js                  # public API: Modal, useModal
├── bundle.js                 # build entry: public API + default stylesheet
├── Modal.jsx                 # the component (composition of the hooks below)
├── hooks/
│   ├── useModal.js           # open / close state helper (public)
│   ├── useFadeTransition.js  # keeps the modal mounted during its fade out
│   ├── useFocusTrap.js       # moves, traps and restores the focus
│   ├── useEscapeKey.js       # Escape key listener
│   ├── useOverlayClick.js    # click on the overlay only
│   ├── useBodyScrollLock.js  # locks the page scroll
│   └── useLatestRef.js       # latest callback for long-lived listeners
├── utils/
│   ├── classNames.js
│   └── getFocusableElements.js
└── styles/modal.css          # default theme (CSS custom properties)
demo/                         # demo page served by `npm run dev`
```

Each behaviour of the modal lives in its own small hook, so that `Modal.jsx` only composes them.
This keeps every piece independently readable and testable.

## License

[MIT](./LICENSE) © Jody Gonzales
