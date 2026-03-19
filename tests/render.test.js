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

test('renderPresentation includes the scripted web ai demo modal shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-web-demo-modal/);
  assert.match(html, /这段代码怎么优化？/);
  assert.match(html, /Web AI Demo/);
});
