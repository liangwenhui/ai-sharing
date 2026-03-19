# Team AI Sharing Deck Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a Vite-based single-page HTML talk deck with full-screen snap scrolling, strong sci-fi visual direction, and a terminal-style demo section for the AI-in-work sharing.

**Architecture:** The deck will use a small content model in JavaScript, pure render helpers for generating section HTML, and a presentation layer built with CSS scroll snapping plus lightweight reveal effects. A separate demo renderer will simulate a terminal workflow so the page feels closer to a live product keynote than a static PPT.

**Tech Stack:** Vite, vanilla JavaScript, CSS, Node.js built-in test runner

---

## Chunk 1: Project Skeleton And Testable Rendering Core

### Task 1: Initialize project metadata and create failing rendering test

**Files:**
- Create: `package.json`
- Create: `tests/render.test.js`
- Create: `src/slides.js`
- Create: `src/render.js`

- [ ] Step 1: Create package metadata with `dev`, `build`, `preview`, and `test` scripts
- [ ] Step 2: Write a failing test for rendering the hero section and demo section HTML
- [ ] Step 3: Run `npm test` and confirm the test fails because render helpers are missing
- [ ] Step 4: Implement minimal slide data and render helpers to satisfy the tests
- [ ] Step 5: Re-run `npm test` until green

## Chunk 2: Presentation Page And Motion System

### Task 2: Build the Vite entry page and mount the generated deck

**Files:**
- Create: `index.html`
- Modify: `src/slides.js`
- Modify: `src/render.js`
- Create: `src/main.js`
- Create: `src/styles.css`

- [ ] Step 1: Create the Vite entry HTML with app root
- [ ] Step 2: Expand slide content to cover the approved 12-section talk structure
- [ ] Step 3: Implement the runtime mount logic and snap-scrolling interactions
- [ ] Step 4: Implement the visual system, responsive layout, and reveal animations
- [ ] Step 5: Run tests again to ensure rendering helpers still pass

## Chunk 3: Terminal Demo And Final Presentation Polish

### Task 3: Add the terminal-style demo section and presentation polish

**Files:**
- Modify: `src/slides.js`
- Modify: `src/render.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [ ] Step 1: Add structured demo steps to slide content
- [ ] Step 2: Render the demo section with staged terminal output blocks
- [ ] Step 3: Add deck navigation dots, progress indicator, and subtle animated background layers
- [ ] Step 4: Run `npm test` and `npm run build`
- [ ] Step 5: Document local usage in `README.md`
