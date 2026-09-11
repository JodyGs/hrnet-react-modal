// Build entry used by Vite: the public API plus the default stylesheet,
// which Vite extracts to dist/style.css. Kept apart from index.js so that the
// generated type declarations do not reference a CSS file.
import './styles/modal.css'

export * from './index.js'
