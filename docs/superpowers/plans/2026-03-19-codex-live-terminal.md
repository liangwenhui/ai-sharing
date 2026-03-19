# Codex Live Terminal Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a live shell-backed terminal modal to the presentation so the presenter can run `codex` from the browser during a local demo.

**Architecture:** Keep the deck in Vite, add an `xterm.js` terminal modal on the front end, and run a local Node server that hosts Vite in middleware mode for development while bridging a PTY-backed shell over WebSocket. The shell session is created on modal open and destroyed on disconnect.

**Tech Stack:** Vite, plain ES modules, `node:test`, `xterm`, `@xterm/addon-fit`, `ws`, `node-pty`

---

## Chunk 1: Frontend Terminal UI

### Task 1: Add failing render tests for the live terminal entry and modal shell

**Files:**
- Modify: `tests/render.test.js`
- Test: `tests/render.test.js`

- [ ] **Step 1: Write failing tests**
- [ ] **Step 2: Run `npm test` and confirm the new assertions fail for missing live-terminal markup**
- [ ] **Step 3: Update render helpers and slide data to expose the trigger and modal shell**
- [ ] **Step 4: Run `npm test` and confirm the render suite passes**

### Task 2: Wire xterm-based modal behavior in the browser

**Files:**
- Modify: `src/main.js`
- Modify: `src/styles.css`

- [ ] **Step 1: Add failing tests for any new pure helper logic if helpers are extracted**
- [ ] **Step 2: Implement terminal lifecycle, WebSocket events, retry state, and resize handling**
- [ ] **Step 3: Verify the render suite still passes**

## Chunk 2: Backend PTY Bridge

### Task 3: Add failing tests for shell-session helpers

**Files:**
- Create: `tests/server/terminal-session.test.js`
- Create: `server/terminal-session.js`

- [ ] **Step 1: Write failing tests covering shell selection and startup command construction**
- [ ] **Step 2: Run `npm test` and confirm helper tests fail**
- [ ] **Step 3: Implement the minimal helper logic to pass the tests**
- [ ] **Step 4: Run `npm test` and confirm the helper tests pass**

### Task 4: Build the local dev/preview server and PTY WebSocket bridge

**Files:**
- Create: `server/app.js`
- Create: `server/routes.js` or equivalent focused helpers
- Modify: `package.json`

- [ ] **Step 1: Implement the HTTP server, Vite middleware integration, preview static serving, and WebSocket session bridge**
- [ ] **Step 2: Install required dependencies**
- [ ] **Step 3: Run targeted verification for backend helpers and full test suite**

## Chunk 3: Integration and Verification

### Task 5: Verify the live demo end to end

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Document how to run the local live-terminal demo**
- [ ] **Step 2: Run `npm test`**
- [ ] **Step 3: Run `npm run build`**
- [ ] **Step 4: Smoke-test `npm run dev` startup output**
