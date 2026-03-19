# Team AI Sharing Deck Tone Refresh Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Soften the presentation copy so it feels lighter and more collegial without changing the deck structure or the core message.

**Architecture:** Keep the existing slide model in `src/slides.js` and adjust only copy fields such as `title`, `summary`, `cards`, `columns`, `risks`, and `takeaways`. Preserve navigation labels, slide ids, and the existing demo workflow wording where tests already depend on it.

**Tech Stack:** Vite, vanilla JavaScript, Node.js built-in test runner

---

## Chunk 1: Copy Audit And Tone Rewrite

### Task 1: Rewrite hard-edged copy into a lighter internal-sharing tone

**Files:**
- Modify: `src/slides.js`

- [ ] Step 1: Review slides for directive phrasing like “不是”, “不要”, and “不能”
- [ ] Step 2: Rewrite titles and summaries into a lighter but still professional tone
- [ ] Step 3: Soften risk and boundary wording without weakening the guidance
- [ ] Step 4: Keep deck structure, ids, navigation labels, and demo flow terms stable

## Chunk 2: Verification

### Task 2: Confirm the content-only change did not break the deck

**Files:**
- Modify: `src/slides.js`
- Test: `tests/render.test.js`

- [ ] Step 1: Run `npm test`
- [ ] Step 2: Run `npm run build`
- [ ] Step 3: Review output for any copy-related regressions
