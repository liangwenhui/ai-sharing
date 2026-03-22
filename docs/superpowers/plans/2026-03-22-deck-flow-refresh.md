# Deck Flow Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reorder and tighten the presentation flow so the shared workflow guidance appears earlier, role scenarios are merged into one page, and the team starter example better explains why the agent understands project context.

**Architecture:** Keep the rendering system unchanged and implement the refresh by editing slide data in `src/slides.js`. Update rendering tests in `tests/render.test.js` so they validate the new order, merged scenario page, and expanded team starter markdown.

**Tech Stack:** Vite, plain JavaScript, node:test

---

### Task 1: Refresh slide flow and copy

**Files:**
- Modify: `src/slides.js`

- [ ] Move the `agent-collab` slide before the role scenario content.
- [ ] Merge frontend and QA examples into the existing `backend` slide so it becomes a shared scenario page.
- [ ] Rename the residual-connection card to `保留主线，逐轮补差`.
- [ ] Change the team tool card from `一个主工具` to `常用工具`.
- [ ] Expand the team starter markdown with startup, verification, forbidden-command, and human-accept guidance while preserving the existing project memory example.

### Task 2: Update tests for the new presentation structure

**Files:**
- Modify: `tests/render.test.js`

- [ ] Replace order assertions so they match the new flow.
- [ ] Remove checks that depend on standalone `frontend` and `qa` slides.
- [ ] Add assertions for merged scenario slide copy and expanded team starter markdown content.

### Task 3: Verify the deck still renders and tests pass

**Files:**
- Verify: `src/slides.js`
- Verify: `tests/render.test.js`

- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Review the final diff for slide order, copy, and test coverage alignment.
