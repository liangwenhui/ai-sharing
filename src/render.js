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
        <article class="panel info-card">
          <h3>${card.title}</h3>
          <p>${card.body}</p>
        </article>
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
      ${levels.map((level) => `
        <article class="panel ladder-step">
          <span class="ladder-tag">${level.tag}</span>
          <h3>${level.title}</h3>
          <p>${level.body}</p>
        </article>
      `).join('')}
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
      <div class="scroll-cue">Scroll / PageDown</div>
    </div>
  `;
}
