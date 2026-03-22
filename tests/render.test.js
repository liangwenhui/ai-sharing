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
  assert.match(html, /协作方式/);
  assert.match(html, /Q & A/);
  assert.match(html, /立即开始/);
});

test('merged scenario slide appears before the agent collaboration slide', () => {
  const slideIds = slides.map((slide) => slide.id);
  const agentCollabIndex = slideIds.indexOf('agent-collab');
  const backendIndex = slideIds.indexOf('backend');

  assert.notEqual(agentCollabIndex, -1);
  assert.notEqual(backendIndex, -1);
  assert.ok(backendIndex < agentCollabIndex);
});

test('pitfalls are folded into the collaboration slide instead of a standalone section', () => {
  const slideIds = slides.map((slide) => slide.id);

  assert.equal(slideIds.includes('pitfalls'), false);
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

test('renderDeck exposes the residual-connection card as an interactive guide trigger', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-backend-guide-trigger="agent-residual-connection"/);
  assert.match(html, /aria-label="查看 保留主线，逐轮补差 的图解说明"/);
  assert.match(html, /点击查看图解/);
});

test('renderDeck exposes the structured-input card as an interactive guide trigger', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-backend-guide-trigger="agent-structured-input"/);
  assert.match(html, /aria-label="查看 结构化输入 的详细说明"/);
  assert.match(html, /点击查看详解/);
});

test('renderDeck exposes the iteration-loop card as an interactive guide trigger', () => {
  const html = renderDeck(slides);

  assert.match(html, /data-backend-guide-trigger="agent-iteration-loop"/);
  assert.match(html, /aria-label="查看 迭代循环 的详细说明"/);
  assert.match(html, /点击查看详解/);
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
  assert.match(html, /Code Review/);
  assert.doesNotMatch(html, /后端｜Code Review/);
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

test('renderPresentation includes the residual-connection explainer modal', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-backend-guide-modal="agent-residual-connection"/);
  assert.match(html, /保留主线，逐轮补差：从残差连接到 Agent 协作/);
  assert.match(html, /深度学习中的残差连接/);
  assert.match(html, /Agent 协作中的类比操作/);
  assert.match(html, /推荐提问方式/);
  assert.match(html, /y = x \+ F\(x\)/);
  assert.match(html, /没有残差连接时/);
  assert.match(html, /输出 y = x \+ F1\(x\)/);
  assert.match(html, /输出 y2 = y \+ F2\(y\)/);
  assert.match(html, /这是我的需求：xxxx，涉及 shop API。请你分析需求，基于现有代码，设计出最小改动的实现方案。/);
  assert.match(html, /这是需求 xxxx，方案是 A。请你列出具体的实现步骤 B，以及对应的代码位置。/);
  assert.match(html, /这是需求 xxxx，实现步骤 B。请你基于当前代码，确认这些实现步骤是否可行，并指出风险点。/);
  assert.match(html, /请按步骤 B 分批执行。每完成一批，都说明改了哪些文件、为什么这样改、还剩哪些步骤。/);
  assert.match(html, /backend-guide-prompts/);
  assert.match(html, /保留已经确认正确的主线/);
  assert.match(html, /data-guide-diagram="residual-connection"/);
});

test('renderDeck merges frontend and qa examples into the shared scenario slide', () => {
  const html = renderDeck(slides);

  assert.match(html, /id="backend"/);
  assert.match(html, /场景分享/);
  assert.match(html, /组件初稿/);
  assert.match(html, /代码阅读与重构拆分/);
  assert.match(html, /测试点与回归清单/);
  assert.doesNotMatch(html, /前端｜组件初稿/);
  assert.doesNotMatch(html, /前端｜代码阅读与重构拆分/);
  assert.doesNotMatch(html, /QA｜测试点与回归清单/);
  assert.doesNotMatch(html, /后端｜调用链理解/);
  assert.doesNotMatch(html, /后端｜单测草案/);
  assert.doesNotMatch(html, /后端｜排查辅助/);
  assert.doesNotMatch(html, /后端｜Code Review/);
  assert.doesNotMatch(html, /后端｜设计实现方案/);
  assert.doesNotMatch(html, /后端｜方案落地/);
  assert.doesNotMatch(html, /id="frontend"/);
  assert.doesNotMatch(html, /id="qa"/);
});

test('renderPresentation includes the structured-input explainer modal', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-backend-guide-modal="agent-structured-input"/);
  assert.match(html, /什么叫结构化输入/);
  assert.match(html, /为什么这样更稳/);
  assert.match(html, /模糊提问 vs 结构化提问/);
  assert.match(html, /推荐提问模板/);
  assert.match(html, /帮我改一下 shop 接口。/);
  assert.match(html, /目标：/);
  assert.match(html, /上下文：/);
  assert.match(html, /约束：/);
  assert.match(html, /输出格式：/);
  assert.match(html, /验收标准：/);
  assert.match(html, /这是我的任务：____/);
  assert.match(html, /请先基于当前代码分析，再给出最小改动方案。/);
  assert.match(html, /backend-guide-prompts/);
});

test('renderPresentation includes the iteration-loop explainer modal', () => {
  const html = renderPresentation(slides);

  assert.match(html, /data-backend-guide-modal="agent-iteration-loop"/);
  assert.match(html, /什么叫迭代循环/);
  assert.match(html, /为什么这样更有效/);
  assert.match(html, /一个典型循环/);
  assert.match(html, /推荐提问方式/);
  assert.match(html, /我先给一个初稿 \/ 想法 \/ 草案/);
  assert.match(html, /这是我现在的初稿，请先不要推倒重来，在这个基础上优化。/);
  assert.match(html, /我已经筛掉了这些方向，请基于剩下的版本继续优化。/);
  assert.match(html, /这是第 2 轮结果，请继续迭代，目标是更清晰 \/ 更完整 \/ 更适合落地。/);
  assert.match(html, /backend-guide-prompts/);
});

test('renderDeck includes pitfalls content inside the collaboration slide', () => {
  const html = renderDeck(slides);

  assert.match(html, /id="agent-collab"[\s\S]*幻觉：回答看起来很完整，实际可能不对/);
  assert.match(html, /id="agent-collab"[\s\S]*偏航：多轮对话后慢慢偏离原本目标/);
  assert.match(html, /id="agent-collab"[\s\S]*假完成：命令失败了，也可能继续往下说/);
  assert.match(html, /id="agent-collab"[\s\S]*上下文漂移：任务一复杂，改着改着就散了/);
  assert.match(html, /id="agent-collab"[\s\S]*盲信结果：这是最需要警惕的一点/);
  assert.doesNotMatch(html, /id="pitfalls"/);
});

test('backend guide example area is scrollable for long transcripts', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.backend-guide-example\s*\{[^}]*overflow:\s*auto;/);
  assert.match(css, /\.backend-guide-example-scroll\s*\{[^}]*overflow-y:\s*scroll;/);
});

test('residual-connection guide diagram styles are present', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.guide-diagram-residual\s*\{/);
  assert.match(css, /\.guide-diagram-residual-block\s*\{/);
  assert.match(css, /\.guide-diagram-residual-lane\s*\{/);
  assert.match(css, /\.guide-diagram-residual-merge\s*\{/);
});

test('backend guide prompt area styles are present for scrollable prompt blocks', () => {
  const css = readFileSync(new URL('../src/styles.css', import.meta.url), 'utf8');

  assert.match(css, /\.backend-guide-prompts\s*\{[^}]*overflow-y:\s*scroll;/);
  assert.match(css, /\.backend-guide-prompt\s*\{/);
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
  assert.match(html, /AGENTS\.md \/ Project Memory 示例/);
  assert.match(html, /启动：`npm install`、`npm run dev`/);
  assert.match(html, /哪些命令别直接跑/);
  assert.match(html, /哪些事情必须人工确认/);
  assert.match(html, /为什么我的 Agent 会更懂我/);
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
