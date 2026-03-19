# Repository Guidelines

## Project Structure & Module Organization
`src/` contains the app code for the single-page deck. Keep interaction logic in `src/main.js`, HTML rendering helpers in `src/render.js`, slide content in `src/slides.js`, and presentation styling in `src/styles.css`. Put static assets in `public/`. Keep tests in `tests/`, currently centered on rendering behavior in `tests/render.test.js`. Treat `dist/` as generated build output; do not edit it by hand.

## Build, Test, and Development Commands
Use `npm install` to install dependencies. `npm run dev` starts the Vite dev server for local editing. `npm run build` creates the production bundle in `dist/`. `npm run preview` serves the built bundle for a final browser check. `npm test` runs the built-in Node test suite (`node --test`).

## Coding Style & Naming Conventions
Follow the existing plain JavaScript and CSS style: ES modules, 2-space indentation, semicolons, and single quotes. Prefer small, focused functions and keep responsibilities separated by file rather than growing `main.js`. Use `camelCase` for variables and functions, and keep CSS classes and `data-*` hooks descriptive, for example `data-slide-id` or `data-demo-trigger`. When adding slides, keep object keys consistent with the existing shape in `src/slides.js`.

## Testing Guidelines
Add tests under `tests/*.test.js` using `node:test` and `node:assert/strict`. Name tests after observable behavior, for example `renderNavigation creates one marker per slide`. If you change slide data, rendering helpers, or interaction hooks, update or add assertions that cover section count, key IDs, modal markup, and navigation markers.

## Commit & Pull Request Guidelines
The current history uses Conventional Commit style (`feat: add team ai sharing deck`); continue with prefixes like `feat:`, `fix:`, and `docs:` plus an imperative summary. PRs should include a short description of the deck change, linked issue or context when available, verification results for `npm test` and `npm run build`, and screenshots or a short recording for visual updates.

## Security & Configuration Tips
This repo is a static presentation, so avoid committing secrets, tokens, or private internal links without checking the target audience. Vite is configured with `base: './'` in `vite.config.js`; keep relative asset paths working in both `npm run preview` and exported builds.
