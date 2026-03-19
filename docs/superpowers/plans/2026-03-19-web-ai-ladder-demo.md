# Web AI Ladder Demo Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a clickable "网页端" card on the ladder slide that opens a scripted web-AI demo modal showing a user pasting code and asking how to optimize it.

**Architecture:** Keep the demo content in slide data, render the ladder hotspot and modal shell from `render.js`, and handle open/close plus staged message playback in `main.js`. Style the overlay as a browser-like chat window so it reads as a web AI demo without depending on any external service.

**Tech Stack:** Vite, vanilla JavaScript, CSS, Node.js built-in test runner

---

## Chunk 1: Render Contract

### Task 1: Add failing tests for the ladder hotspot and modal shell

**Files:**
- Modify: `tests/render.test.js`

- [ ] Step 1: Add a failing test that expects the ladder slide to render a clickable trigger for the `网页端` card
- [ ] Step 2: Add a failing test that expects the presentation shell to include the scripted web AI demo modal
- [ ] Step 3: Run `npm test` and confirm the new expectations fail before implementation

## Chunk 2: Modal Rendering And Interaction

### Task 2: Implement the scripted demo experience

**Files:**
- Modify: `src/slides.js`
- Modify: `src/render.js`
- Modify: `src/main.js`
- Modify: `src/styles.css`
- Test: `tests/render.test.js`

- [ ] Step 1: Add demo metadata to the `网页端` ladder item
- [ ] Step 2: Render the ladder trigger and modal shell with staged response elements
- [ ] Step 3: Add modal open/close behavior and timed reveal playback
- [ ] Step 4: Style the ladder trigger and browser-style modal
- [ ] Step 5: Run `npm test` and `npm run build`
