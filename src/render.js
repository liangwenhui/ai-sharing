function renderTags(chips = []) {
  if (!chips.length) return '';
  return `<div class="chip-row">${chips.map((chip) => `<span class="chip">${chip}</span>`).join('')}</div>`;
}

function renderMetrics(metrics = []) {
  if (!metrics.length) return '';
  return `
    <div class="metric-grid">
      ${metrics.map((item) => `
        <article class="metric-card panel">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </article>
      `).join('')}
    </div>
  `;
}

function renderCards(cards = []) {
  if (!cards.length) return '';
  return `
    <div class="card-grid">
      ${cards.map((card) => `
        ${card.guide?.trigger
    ? `
            <article
              class="panel info-card info-card-trigger"
              data-backend-guide-trigger="${card.guide.trigger}"
              role="button"
              tabindex="0"
              aria-label="查看 ${card.title} 的提问示例"
            >
              <h3>${card.title}</h3>
              <p>${card.body}</p>
              <span class="info-card-link">点击查看提问方式</span>
            </article>
          `
    : `
            <article class="panel info-card">
              <h3>${card.title}</h3>
              <p>${card.body}</p>
            </article>
          `}
      `).join('')}
    </div>
  `;
}

function renderColumns(columns = []) {
  if (!columns.length) return '';
  return `
    <div class="column-grid">
      ${columns.map((column) => `
        <article class="panel column-card ${column.tone ?? ''}">
          <h3>${column.title}</h3>
          <ul>
            ${column.items.map((item) => `<li>${item}</li>`).join('')}
          </ul>
        </article>
      `).join('')}
    </div>
  `;
}

function renderLevels(levels = []) {
  if (!levels.length) return '';
  return `
    <div class="ladder-grid">
      ${levels.map((level, index) => {
        const tag = `<span class="ladder-tag">${level.tag}</span>`;
        const title = `<h3>${level.title}</h3>`;
        const body = `<p>${level.body}</p>`;
        const hint = level.demo?.label ? `<span class="ladder-demo-link">${level.demo.label}</span>` : '';

        if (level.demo?.trigger) {
          return `
            <article
              class="panel ladder-step ladder-step-trigger"
              data-ladder-level="${index}"
              data-demo-trigger="${level.demo.trigger}"
              ${level.demo.mode === 'live-terminal' ? `data-live-terminal-open="${level.demo.trigger}"` : ''}
              role="button"
              tabindex="0"
              aria-label="${level.demo.ariaLabel ?? 'Open demo'}"
            >
              ${tag}
              ${title}
              ${body}
              ${hint}
            </article>
          `;
        }

        return `
          <article class="panel ladder-step" data-ladder-level="${index}">
            ${tag}
            ${title}
            ${body}
          </article>
        `;
      }).join('')}
    </div>
  `;
}

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderCodeBlock(lines = []) {
  if (!lines.length) return '';
  return `<pre class="web-demo-code"><code>${escapeHtml(lines.join('\n'))}</code></pre>`;
}

function findWebDemo(slides) {
  for (const slide of slides) {
    if (!slide.levels) continue;
    for (const level of slide.levels) {
      if (level.demo?.trigger === 'web-ai') return level.demo;
    }
  }

  return null;
}

function renderWebDemoModal(slides) {
  const demo = findWebDemo(slides);
  if (!demo) return '';

  return `
    <div class="web-demo-modal" data-web-demo-modal aria-hidden="true">
      <div class="web-demo-backdrop" data-web-demo-close></div>
      <section class="web-demo-window panel" role="dialog" aria-modal="true" aria-labelledby="web-demo-title">
        <header class="web-demo-topbar">
          <div class="web-demo-dots"><span></span><span></span><span></span></div>
          <strong id="web-demo-title">${demo.title}</strong>
          <button class="web-demo-close" type="button" aria-label="Close demo" data-web-demo-close>Close</button>
        </header>
        <div class="web-demo-thread">
          <article class="web-demo-message web-demo-message-user is-visible">
            <span class="web-demo-message-label">User</span>
            ${renderCodeBlock(demo.code)}
            <p class="web-demo-question">${demo.prompt}</p>
          </article>
          ${demo.responses.map((response, index) => `
            <article class="web-demo-message web-demo-message-ai" data-web-demo-step="${index}">
              <span class="web-demo-message-label">${response.label}</span>
              ${response.text ? `<p>${response.text}</p>` : ''}
              ${response.code ? renderCodeBlock(response.code) : ''}
            </article>
          `).join('')}
        </div>
        <footer class="web-demo-composer">
          <span>继续在网页里追问代码问题...</span>
          <button type="button" disabled>Send</button>
        </footer>
      </section>
    </div>
  `;
}

function findLiveTerminalDemo(slides) {
  for (const slide of slides) {
    if (!slide.levels) continue;
    for (const level of slide.levels) {
      if (level.demo?.mode === 'live-terminal') return level.demo;
    }
  }

  return null;
}

function renderLiveTerminalModal(slides) {
  const demo = findLiveTerminalDemo(slides);
  if (!demo) return '';

  return `
    <div class="live-terminal-modal" data-live-terminal-modal aria-hidden="true">
      <div class="live-terminal-backdrop" data-live-terminal-close></div>
      <section class="live-terminal-window panel" role="dialog" aria-modal="true" aria-labelledby="live-terminal-title">
        <header class="live-terminal-topbar">
          <div class="live-terminal-dots"><span></span><span></span><span></span></div>
          <div class="live-terminal-heading">
            <strong id="live-terminal-title">${demo.title}</strong>
            <p>${demo.summary}</p>
          </div>
          <button class="live-terminal-close" type="button" aria-label="Close live terminal demo" data-live-terminal-close>Close</button>
        </header>
        <div class="live-terminal-statusbar">
          <span class="live-terminal-chip">${demo.badge ?? 'Live Terminal'}</span>
          <p class="live-terminal-status" data-live-terminal-status>Connecting to your local shell...</p>
          <button class="live-terminal-retry" type="button" data-live-terminal-retry hidden>Retry</button>
        </div>
        <div class="live-terminal-viewport" data-live-terminal-viewport></div>
        <footer class="live-terminal-footer">
          <span>Type \`codex\` to begin the live agent demo.</span>
          <strong>${demo.cwdLabel ?? 'Working directory: repository root'}</strong>
        </footer>
      </section>
    </div>
  `;
}

function findBackendGuides(slides) {
  const guides = [];

  for (const slide of slides) {
    if (slide.id !== 'backend' || !slide.cards?.length) continue;

    for (const card of slide.cards) {
      if (!card.guide?.trigger) continue;

      guides.push({
        trigger: card.guide.trigger,
        title: card.title,
        howToAsk: card.guide.howToAsk,
        example: card.guide.example,
        theme: card.guide.theme ?? 'default',
        story: card.guide.story ?? null,
        alwaysScrollExample: card.guide.alwaysScrollExample ?? false
      });
    }
  }

  return guides;
}

function findTeamStarterGuide(slides) {
  for (const slide of slides) {
    if (slide.id !== 'team' || !slide.cards?.length) continue;

    for (const card of slide.cards) {
      if (!card.guide?.trigger) continue;

      return {
        trigger: card.guide.trigger,
        title: card.guide.title,
        content: card.guide.content,
        markdown: card.guide.markdown
      };
    }
  }

  return null;
}

function renderTeamStarterGuideContent(guide) {
  if (guide?.markdown) {
    return `
      <pre class="team-starter-markdown"><code>${escapeHtml(guide.markdown)}</code></pre>
    `;
  }

  const content = guide?.content;
  if (!content?.length) return '';

  return content.map(section => `
    <section class="team-starter-section">
      <h4>${section.title}</h4>
      <ul>
        ${section.items.map(item => `<li>${item}</li>`).join('')}
      </ul>
    </section>
  `).join('');
}

function renderTeamStarterModal(slides) {
  const guide = findTeamStarterGuide(slides);
  if (!guide) return '';

  return `
    <div class="team-starter-modal" data-team-starter-modal="team-starter-readme" aria-hidden="true">
      <div class="team-starter-backdrop" data-team-starter-close></div>
      <section class="team-starter-window panel" role="dialog" aria-modal="true" aria-labelledby="team-starter-title">
        <header class="team-starter-topbar">
          <div class="team-starter-dots"><span></span><span></span><span></span></div>
          <strong id="team-starter-title">${guide.title}</strong>
          <button class="team-starter-close" type="button" aria-label="Close team starter guide" data-team-starter-close>Close</button>
        </header>
        <div class="team-starter-content">
          ${renderTeamStarterGuideContent(guide)}
        </div>
      </section>
    </div>
  `;
}

function renderBackendGuideStory(story) {
  if (!story) return '';

  if (story.imageSrc) {
    const imageSrc = escapeHtml(story.imageSrc);
    const imageAlt = escapeHtml(story.imageAlt ?? '聊天截图');

    return `
      <section class="backend-guide-story panel">
        <span class="backend-guide-story-tag">${escapeHtml(story.tag ?? '现身说法')}</span>
        <figure class="backend-guide-story-image-wrap">
          <button
            class="backend-guide-story-image-trigger"
            type="button"
            aria-label="查看图片大图"
            data-backend-image-trigger
            data-image-src="${imageSrc}"
            data-image-alt="${imageAlt}"
          >
            <img
              class="backend-guide-story-image"
              src="${imageSrc}"
              alt="${imageAlt}"
              loading="lazy"
            />
            <span class="backend-guide-story-image-hint">点击查看大图</span>
          </button>
        </figure>
      </section>
    `;
  }

  if (!story.lines?.length) return '';

  const highlightWord = story.highlightWord ? escapeHtml(story.highlightWord) : '';
  const lines = story.lines.map((line) => {
    const safeLine = escapeHtml(line);
    if (!highlightWord) return `<p>${safeLine}</p>`;
    return `<p>${safeLine.replace(highlightWord, `<mark>${highlightWord}</mark>`)}</p>`;
  }).join('');

  return `
    <section class="backend-guide-story panel">
      <span class="backend-guide-story-tag">${escapeHtml(story.tag ?? '现身说法')}</span>
      <article class="backend-guide-chat-shot">
        <div class="backend-guide-chat-avatar">${escapeHtml(story.avatar ?? 'QA')}</div>
        <div class="backend-guide-chat-bubble">
          <p class="backend-guide-chat-meta">
            <strong>${escapeHtml(story.author ?? '')}</strong>
            <span>${escapeHtml(story.time ?? '')}</span>
          </p>
          ${lines}
        </div>
      </article>
    </section>
  `;
}

function renderBackendGuideModals(slides) {
  const guides = findBackendGuides(slides);
  if (!guides.length) return '';

  return guides.map((guide) => {
    const exampleClasses = ['backend-guide-example'];
    if (guide.theme === 'codex-cli') exampleClasses.push('backend-guide-example-codex');
    if (guide.alwaysScrollExample) exampleClasses.push('backend-guide-example-scroll');

    return `
    <div class="backend-guide-modal" data-backend-guide-modal="${guide.trigger}" aria-hidden="true">
      <div class="backend-guide-backdrop" data-backend-guide-close></div>
      <section class="backend-guide-window backend-guide-window-${guide.theme} panel" role="dialog" aria-modal="true" aria-labelledby="backend-guide-title-${guide.trigger}">
        <header class="backend-guide-topbar">
          <div class="backend-guide-dots"><span></span><span></span><span></span></div>
          <strong id="backend-guide-title-${guide.trigger}">${guide.title}</strong>
          <button class="backend-guide-close" type="button" aria-label="Close backend guide" data-backend-guide-close>Close</button>
        </header>
        <div class="backend-guide-content">
          ${renderBackendGuideStory(guide.story)}
          <section class="backend-guide-block">
            <h4>怎么提问</h4>
            <p>${guide.howToAsk}</p>
          </section>
          <section class="backend-guide-block">
            <h4>提问例子</h4>
            ${guide.theme === 'codex-cli' ? '<span class="backend-guide-cli-label">Codex CLI Transcript</span>' : ''}
            <pre class="${exampleClasses.join(' ')}"><code>${escapeHtml(guide.example)}</code></pre>
          </section>
        </div>
      </section>
    </div>
  `;
  }).join('');
}

function renderBackendImageModal() {
  return `
    <div class="backend-image-modal" data-backend-image-modal aria-hidden="true">
      <div class="backend-image-backdrop" data-backend-image-close></div>
      <section class="backend-image-window panel" role="dialog" aria-modal="true" aria-labelledby="backend-image-title">
        <header class="backend-image-topbar">
          <strong id="backend-image-title">图片预览</strong>
          <button class="backend-image-close" type="button" aria-label="Close image preview" data-backend-image-close>Close</button>
        </header>
        <div class="backend-image-content">
          <img class="backend-image-view" data-backend-image-view alt="" />
          <p class="backend-image-caption" data-backend-image-caption></p>
        </div>
      </section>
    </div>
  `;
}

function renderChecklist(checklist = []) {
  if (!checklist.length) return '';
  return `
    <ol class="checklist panel">
      ${checklist.map((item, index) => `<li><span>${String(index + 1).padStart(2, '0')}</span><strong>${item}</strong></li>`).join('')}
    </ol>
  `;
}

function renderRisks(risks = []) {
  if (!risks.length) return '';
  return `
    <div class="risk-grid">
      ${risks.map((risk) => `<article class="panel risk-card"><p>${risk}</p></article>`).join('')}
    </div>
  `;
}

function renderTakeaways(takeaways = []) {
  if (!takeaways.length) return '';
  return `
    <div class="takeaway-stack">
      ${takeaways.map((item) => `<article class="panel takeaway-card"><p>${item}</p></article>`).join('')}
    </div>
  `;
}

function renderResources(resources = []) {
  if (!resources.length) return '';
  return `
    <div class="resource-row">
      ${resources.map((resource) => `
        <a class="panel resource-card" href="${resource.href}" target="_blank" rel="noreferrer">
          <span>会后资料</span>
          <strong>${resource.label}</strong>
        </a>
      `).join('')}
    </div>
  `;
}

export function renderDemoSection(slide) {
  return `
    <section class="slide slide-demo" id="${slide.id}" data-slide-id="${slide.id}">
      <div class="slide-shell demo-layout">
        <div class="slide-copy">
          <p class="slide-eyebrow">${slide.eyebrow}</p>
          <h2 class="slide-title">${slide.title}</h2>
          <p class="slide-description">${slide.summary}</p>
          <div class="demo-steps panel">
            ${slide.steps.map((step, index) => `<div class="demo-step"><span>${String(index + 1).padStart(2, '0')}</span><strong>${step}</strong></div>`).join('')}
          </div>
        </div>
        <div class="terminal panel" data-demo-terminal>
          <div class="terminal-topbar">
            <span></span><span></span><span></span>
          </div>
          <div class="terminal-body">
            ${slide.terminal.map((line, index) => `<div class="terminal-line ${line.tone}" data-demo-line data-index="${index}">${line.text}</div>`).join('')}
          </div>
        </div>
      </div>
    </section>
  `;
}

function renderStandardSection(slide) {
  const titleTag = slide.variant === 'hero' ? 'h1' : 'h2';
  const subtitle = slide.subtitle ? `<p class="slide-kicker">${slide.subtitle}</p>` : '';
  const extraContent = [
    renderMetrics(slide.metrics),
    renderCards(slide.cards),
    renderColumns(slide.columns),
    renderLevels(slide.levels),
    renderChecklist(slide.checklist),
    renderRisks(slide.risks),
    renderTakeaways(slide.takeaways),
    renderResources(slide.resources)
  ].join('');

  return `
    <section class="slide slide-${slide.variant}" id="${slide.id}" data-slide-id="${slide.id}">
      <div class="slide-shell">
        <div class="slide-copy">
          <p class="slide-eyebrow">${slide.eyebrow}</p>
          <${titleTag} class="slide-title">${slide.title}</${titleTag}>
          ${subtitle}
          <p class="slide-description">${slide.summary}</p>
          ${renderTags(slide.chips)}
        </div>
        ${extraContent}
      </div>
    </section>
  `;
}

export function renderDeck(slides) {
  return slides
    .map((slide) => (slide.variant === 'demo' ? renderDemoSection(slide) : renderStandardSection(slide)))
    .join('');
}

export function renderNavigation(slides) {
  return `
    <aside class="deck-progress" aria-label="Presentation navigation">
      <div class="progress-rail"><span class="progress-fill" data-progress-fill></span></div>
      <div class="progress-markers">
        ${slides.map((slide, index) => `
          <button class="progress-button ${index === 0 ? 'is-active' : ''}" type="button" data-target="${slide.id}">
            <span class="dot"></span>
            <span class="label">${slide.navLabel}</span>
          </button>
        `).join('')}
      </div>
    </aside>
  `;
}

export function renderPresentation(slides) {
  return `
    <div class="presentation-shell">
      <div class="ambient ambient-a"></div>
      <div class="ambient ambient-b"></div>
      <div class="grid-overlay"></div>
      ${renderNavigation(slides)}
      <main class="deck" data-deck>
        ${renderDeck(slides)}
      </main>
      ${renderWebDemoModal(slides)}
      ${renderBackendGuideModals(slides)}
      ${renderBackendImageModal()}
      ${renderLiveTerminalModal(slides)}
      ${renderTeamStarterModal(slides)}
      <div class="scroll-cue">Scroll / PageDown</div>
    </div>
  `;
}
