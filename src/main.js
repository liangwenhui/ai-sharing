import './styles.css';
import '@xterm/xterm/css/xterm.css';
import { slides } from './slides.js';
import { renderPresentation } from './render.js';
import { createLiveTerminalController } from './live-terminal.js';

const app = document.querySelector('#app');
app.innerHTML = renderPresentation(slides);

const deck = app.querySelector('[data-deck]');
const sections = [...app.querySelectorAll('[data-slide-id]')];
const buttons = [...app.querySelectorAll('[data-target]')];
const progressFill = app.querySelector('[data-progress-fill]');
const scrollCue = app.querySelector('.scroll-cue');
const demoModal = app.querySelector('[data-web-demo-modal]');
const demoOpeners = [...app.querySelectorAll('[data-demo-trigger="web-ai"]')];
const demoClosers = [...app.querySelectorAll('[data-web-demo-close]')];
const demoSteps = [...app.querySelectorAll('[data-web-demo-step]')];
const backendGuideOpeners = [...app.querySelectorAll('[data-backend-guide-trigger]')];
const backendGuideClosers = [...app.querySelectorAll('[data-backend-guide-close]')];
const liveTerminalController = createLiveTerminalController({
  modal: app.querySelector('[data-live-terminal-modal]'),
  openers: [...app.querySelectorAll('[data-live-terminal-open="codex-live-terminal"]')],
  closers: [...app.querySelectorAll('[data-live-terminal-close]')],
  retryButton: app.querySelector('[data-live-terminal-retry]'),
  statusNode: app.querySelector('[data-live-terminal-status]'),
  viewport: app.querySelector('[data-live-terminal-viewport]')
});

let activeIndex = 0;
let demoTimers = [];
let activeBackendGuideModal = null;

function updateActiveState(index) {
  activeIndex = index;
  const ratio = sections.length > 1 ? index / (sections.length - 1) : 0;

  buttons.forEach((button, buttonIndex) => {
    button.classList.toggle('is-active', buttonIndex === index);
  });

  sections.forEach((section, sectionIndex) => {
    section.classList.toggle('is-active', sectionIndex === index);
  });

  if (progressFill) {
    progressFill.style.transform = `scaleY(${Math.max(ratio, 0.08)})`;
  }

  if (scrollCue && index > 0) {
    scrollCue.classList.add('is-hidden');
  }

  const activeSection = sections[index];
  if (activeSection?.classList.contains('slide-demo')) {
    playDemo(activeSection);
  }
}

function goToIndex(index) {
  const boundedIndex = Math.max(0, Math.min(index, sections.length - 1));
  sections[boundedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function playDemo(section) {
  if (section.dataset.demoPlayed === 'true') return;
  section.dataset.demoPlayed = 'true';
  const lines = [...section.querySelectorAll('[data-demo-line]')];

  lines.forEach((line, index) => {
    window.setTimeout(() => {
      line.classList.add('is-visible');
    }, 220 * index + 180);
  });
}

function clearWebDemoTimers() {
  demoTimers.forEach((timer) => window.clearTimeout(timer));
  demoTimers = [];
}

function resetWebDemo() {
  clearWebDemoTimers();
  demoSteps.forEach((step) => step.classList.remove('is-visible'));
}

function playWebDemo() {
  resetWebDemo();
  demoSteps.forEach((step, index) => {
    const timer = window.setTimeout(() => {
      step.classList.add('is-visible');
    }, 320 * index + 220);
    demoTimers.push(timer);
  });
}

function openWebDemo() {
  if (!demoModal) return;

  demoModal.classList.add('is-open');
  demoModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-web-demo-modal');
  playWebDemo();
}

function closeWebDemo() {
  if (!demoModal) return;

  demoModal.classList.remove('is-open');
  demoModal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('has-web-demo-modal');
  resetWebDemo();
}

function openBackendGuide(trigger) {
  const modal = app.querySelector(`[data-backend-guide-modal="${trigger}"]`);
  if (!modal) return;

  if (activeBackendGuideModal && activeBackendGuideModal !== modal) {
    activeBackendGuideModal.classList.remove('is-open');
    activeBackendGuideModal.setAttribute('aria-hidden', 'true');
  }

  modal.classList.add('is-open');
  modal.setAttribute('aria-hidden', 'false');
  activeBackendGuideModal = modal;
  document.body.classList.add('has-backend-guide-modal');
}

function closeBackendGuide() {
  if (!activeBackendGuideModal) return;

  activeBackendGuideModal.classList.remove('is-open');
  activeBackendGuideModal.setAttribute('aria-hidden', 'true');
  activeBackendGuideModal = null;
  document.body.classList.remove('has-backend-guide-modal');
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = sections.findIndex((section) => section.id === button.dataset.target);
    goToIndex(index);
  });
});

demoOpeners.forEach((opener) => {
  opener.addEventListener('click', () => {
    openWebDemo();
  });

  opener.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openWebDemo();
    }
  });
});

demoClosers.forEach((closer) => {
  closer.addEventListener('click', () => {
    closeWebDemo();
  });
});

backendGuideOpeners.forEach((opener) => {
  const trigger = opener.dataset.backendGuideTrigger;
  if (!trigger) return;

  opener.addEventListener('click', () => {
    openBackendGuide(trigger);
  });

  opener.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openBackendGuide(trigger);
    }
  });
});

backendGuideClosers.forEach((closer) => {
  closer.addEventListener('click', () => {
    closeBackendGuide();
  });
});

window.addEventListener('keydown', (event) => {
  if (liveTerminalController.isOpen()) {
    if (event.key === 'Escape') {
      event.preventDefault();
      liveTerminalController.close();
    }
    return;
  }

  if (activeBackendGuideModal?.classList.contains('is-open')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeBackendGuide();
    }
    return;
  }

  if (demoModal?.classList.contains('is-open')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeWebDemo();
    }
    return;
  }

  if (['ArrowDown', 'PageDown', ' '].includes(event.key)) {
    event.preventDefault();
    goToIndex(activeIndex + 1);
  }

  if (['ArrowUp', 'PageUp'].includes(event.key)) {
    event.preventDefault();
    goToIndex(activeIndex - 1);
  }

  if (event.key === 'Home') {
    event.preventDefault();
    goToIndex(0);
  }

  if (event.key === 'End') {
    event.preventDefault();
    goToIndex(sections.length - 1);
  }
});

const observer = new IntersectionObserver(
  (entries) => {
    const visibleEntry = entries
      .filter((entry) => entry.isIntersecting)
      .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0];

    if (!visibleEntry) return;

    const index = sections.findIndex((section) => section === visibleEntry.target);
    if (index !== -1) updateActiveState(index);
  },
  {
    root: deck,
    threshold: [0.45, 0.6, 0.8]
  }
);

sections.forEach((section) => observer.observe(section));
updateActiveState(0);
