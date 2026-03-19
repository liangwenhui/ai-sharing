import test from 'node:test';
import assert from 'node:assert/strict';
import { slides } from '../src/slides.js';
import { renderDeck, renderDemoSection, renderNavigation, renderPresentation } from '../src/render.js';

test('renderDeck renders all planned sections', () => {
  const html = renderDeck(slides);
  const sectionMatches = html.match(/<section /g) ?? [];

  assert.equal(slides.length, 12);
  assert.equal(sectionMatches.length, 12);
  assert.match(html, /id="hero"/);
  assert.match(html, /id="summary"/);
});

test('renderDemoSection outputs all workflow steps', () => {
  const demoSlide = slides.find((slide) => slide.variant === 'demo');
  const html = renderDemoSection(demoSlide);

  assert.match(html, /先分析方案/);
  assert.match(html, /看 diff/);
  assert.match(html, /测试\/构建\/lint/);
});

test('renderNavigation creates one marker per slide', () => {
  const html = renderNavigation(slides);
  const markerMatches = html.match(/data-target=/g) ?? [];

  assert.equal(markerMatches.length, 12);
  assert.match(html, /网页端到协作/);
  assert.match(html, /立即开始/);
});

test('renderPresentation combines navigation and deck shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /class="deck-progress"/);
  assert.match(html, /class="deck"/);
  assert.match(html, /class="scroll-cue"/);
});

test('summary slide copy uses a distinct class from the summary slide variant', () => {
  const html = renderDeck(slides);

  assert.match(html, /<section class="slide slide-summary" id="summary"/);
  assert.match(html, /<p class="slide-description">先开始，再慢慢收敛。先把顺手的用法跑起来，比追求最复杂的玩法更重要。<\/p>/);
  assert.doesNotMatch(html, /<p class="slide-summary">/);
});

test('renderDeck marks the ladder web card as an interactive demo trigger', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-demo-trigger="web-ai"/);
  assert.match(html, /网页端/);
});

test('renderDeck marks the cli agent card as an interactive live codex trigger', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-demo-trigger="codex-live-terminal"/);
  assert.match(html, /Live Codex Demo/);
});

test('renderDeck exposes ladder level indexes for staged animation hooks', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-ladder-level="0"/);
  assert.match(html, /data-ladder-level="1"/);
  assert.match(html, /data-ladder-level="2"/);
});

test('renderDeck exposes backend scenario cards as interactive guide triggers', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-backend-guide-trigger="backend-call-chain"/);
  assert.match(html, /data-backend-guide-trigger="backend-test-draft"/);
  assert.match(html, /data-backend-guide-trigger="backend-debug-assist"/);
});

test('renderPresentation includes the scripted web ai demo modal shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-web-demo-modal/);
  assert.match(html, /这段代码怎么优化？/);
  assert.match(html, /Web AI Demo/);
});

test('renderPresentation includes backend scenario guide modals', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-backend-guide-modal="backend-call-chain"/);
  assert.match(html, /backend-guide-window-codex-cli/);
  assert.match(html, /现身说法/);
  assert.match(html, /src="\/jaker\.png"/);
  assert.match(html, /Jaker Lu\(QA\) 的微信提问截图/);
  assert.match(html, /怎么提问/);
  assert.match(html, /提问例子/);
  assert.match(html, /Codex CLI Transcript/);
  assert.match(html, /Explored/);
  assert.match(html, /GetProductV1接口中，flashPrice的缓存时间是多少/);
  assert.match(html, /flashPrice 的缓存时间是 30 秒/);
});

test('renderPresentation includes the live codex terminal modal shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-live-terminal-modal/);
  assert.match(html, /data-live-terminal-open="codex-live-terminal"/);
  assert.match(html, /data-live-terminal-viewport/);
  assert.match(html, /Type `codex` to begin the live agent demo\./);
});
