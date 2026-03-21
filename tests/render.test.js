import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { slides } from '../src/slides.js';
import { renderDeck, renderNavigation, renderPresentation } from '../src/render.js';

test('renderDeck renders all planned sections', () => {
  const html = renderDeck(slides);
  const sectionMatches = html.match(/data-slide-id=/g) ?? [];

  assert.equal(sectionMatches.length, slides.length);
  assert.match(html, /id="hero"/);
  assert.match(html, /id="qna"/);
  assert.match(html, /id="qna"[\s\S]*src="\/banana\.jpg"/);
  assert.match(html, /id="qna"[\s\S]*data-qna-notebook/);
  assert.match(html, /id="summary"/);
});

test('renderNavigation creates one marker per slide', () => {
  const html = renderNavigation(slides);
  const markerMatches = html.match(/data-target=/g) ?? [];

  assert.equal(markerMatches.length, slides.length);
  assert.match(html, /网页端到协作/);
  assert.match(html, /Q & A/);
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
  assert.match(html, /data-backend-guide-trigger="backend-code-review"/);
  assert.match(html, /data-backend-guide-trigger="backend-design-plan"/);
  assert.match(html, /data-backend-guide-trigger="backend-rollout"/);
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
  assert.match(html, /data-backend-guide-modal="backend-code-review"/);
  assert.match(html, /data-backend-guide-modal="backend-design-plan"/);
  assert.match(html, /data-backend-guide-modal="backend-rollout"/);
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
  assert.match(html, /CodeReview/);
  assert.match(html, /pull-requests\/1939 根据PR描述 CR一下/);
  assert.match(html, /Request changes，先修第 1 条/);
  assert.match(html, /data-backend-guide-modal="backend-code-review"[\s\S]*backend-guide-example-scroll/);
  assert.match(html, /设计实现方案/);
  assert.match(html, /PDRV-1679 分析需求，设计最小改动实现方案，列出改动步骤/);
  assert.match(html, /data-backend-guide-modal="backend-design-plan"[\s\S]*backend-guide-example-scroll/);
  assert.match(html, /方案落地/);
  assert.match(html, /data-backend-guide-modal="backend-debug-assist"/);
  assert.match(html, /src="\/temp\.png"/);
  assert.match(html, /data-backend-image-trigger/);
  assert.match(html, /点击查看大图/);
});

test('backend guide example area is scrollable for long transcripts', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.backend-guide-example\s*\{[^}]*overflow:\s*auto;/);
  assert.match(css, /\.backend-guide-example-scroll\s*\{[^}]*overflow-y:\s*scroll;/);
});

test('renderPresentation includes backend image preview modal shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-backend-image-modal/);
  assert.match(html, /data-backend-image-view/);
  assert.match(html, /data-backend-image-close/);
  assert.match(html, /图片预览/);
});

test('renderPresentation includes team starter guide modal with repo memory content', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-team-starter-modal="team-starter-readme"/);
  assert.match(html, /Project Memory Index/);
  assert.match(html, /product-core-service/);
  assert.match(html, /double write/);
});

test('renderPresentation includes the live codex terminal modal shell', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-live-terminal-modal/);
  assert.match(html, /data-live-terminal-open="codex-live-terminal"/);
  assert.match(html, /data-live-terminal-viewport/);
  assert.match(html, /Type `codex` to begin the live agent demo\./);
});
