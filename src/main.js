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
const backendImageModal = app.querySelector('[data-backend-image-modal]');
const backendImageOpeners = [...app.querySelectorAll('[data-backend-image-trigger]')];
const backendImageClosers = [...app.querySelectorAll('[data-backend-image-close]')];
const backendImageView = app.querySelector('[data-backend-image-view]');
const backendImageCaption = app.querySelector('[data-backend-image-caption]');
const liveTerminalController = createLiveTerminalController({
  modal: app.querySelector('[data-live-terminal-modal]'),
  openers: [...app.querySelectorAll('[data-live-terminal-open="codex-live-terminal"]')],
  closers: [...app.querySelectorAll('[data-live-terminal-close]')],
  retryButton: app.querySelector('[data-live-terminal-retry]'),
  statusNode: app.querySelector('[data-live-terminal-status]'),
  viewport: app.querySelector('[data-live-terminal-viewport]')
});

const teamStarterModal = app.querySelector('[data-team-starter-modal]');
const teamStarterOpeners = [...app.querySelectorAll('[data-backend-guide-trigger="team-starter-readme"]')];
const teamStarterClosers = [...app.querySelectorAll('[data-team-starter-close]')];
const qnaNotebook = app.querySelector('[data-qna-notebook]');
const qnaQuestionInput = app.querySelector('[data-qna-question]');
const qnaAnswerInput = app.querySelector('[data-qna-answer]');
const qnaAddButton = app.querySelector('[data-qna-add]');
const qnaClearButton = app.querySelector('[data-qna-clear]');
const qnaList = app.querySelector('[data-qna-list]');

let activeIndex = 0;
let demoTimers = [];
let activeBackendGuideModal = null;
let isBackendImageOpen = false;
const qnaStorageKey = 'team-ai-sharing-deck:qna-notes';
let qnaNotes = [];

function formatQnaTime(timestamp) {
  return new Date(timestamp).toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

function saveQnaNotes() {
  try {
    window.localStorage.setItem(qnaStorageKey, JSON.stringify(qnaNotes));
  } catch {
    // Ignore storage errors (private mode, quota, etc.)
  }
}

function loadQnaNotes() {
  try {
    const raw = window.localStorage.getItem(qnaStorageKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];

    return parsed
      .filter((item) => item && typeof item === 'object')
      .map((item) => ({
        question: String(item.question ?? ''),
        answer: String(item.answer ?? ''),
        createdAt: Number(item.createdAt) || Date.now()
      }));
  } catch {
    return [];
  }
}

function renderQnaNotes() {
  if (!qnaList) return;

  if (!qnaNotes.length) {
    qnaList.innerHTML = '<li class="qna-notebook-empty">暂无记录</li>';
    return;
  }

  qnaList.innerHTML = '';
  qnaNotes.forEach((note, index) => {
    const item = document.createElement('li');
    item.className = 'qna-note-item';

    const meta = document.createElement('p');
    meta.className = 'qna-note-meta';
    meta.textContent = `${String(index + 1).padStart(2, '0')} · ${formatQnaTime(note.createdAt)}`;

    const question = document.createElement('p');
    question.className = 'qna-note-question';
    question.textContent = `Q: ${note.question}`;

    const answer = document.createElement('p');
    answer.className = 'qna-note-answer';
    answer.textContent = `A: ${note.answer}`;

    item.append(meta, question, answer);
    qnaList.append(item);
  });
}

function addQnaNote() {
  if (!qnaQuestionInput || !qnaAnswerInput) return;

  const question = qnaQuestionInput.value.trim();
  const answer = qnaAnswerInput.value.trim();
  if (!question && !answer) return;

  qnaNotes.unshift({
    question: question || '（待补充）',
    answer: answer || '（待补充）',
    createdAt: Date.now()
  });

  saveQnaNotes();
  renderQnaNotes();
  qnaQuestionInput.value = '';
  qnaAnswerInput.value = '';
  qnaQuestionInput.focus();
}

function clearQnaNotes() {
  qnaNotes = [];
  saveQnaNotes();
  renderQnaNotes();
}

function isTypingTarget(target) {
  if (!(target instanceof HTMLElement)) return false;
  if (target.isContentEditable) return true;

  const tagName = target.tagName.toLowerCase();
  return tagName === 'input' || tagName === 'textarea' || tagName === 'select';
}

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

function openBackendImage(src, alt) {
  if (!backendImageModal || !backendImageView) return;

  const safeSrc = src?.trim();
  if (!safeSrc) return;

  backendImageView.setAttribute('src', safeSrc);
  backendImageView.setAttribute('alt', alt ?? '');
  if (backendImageCaption) {
    backendImageCaption.textContent = alt ?? '';
  }

  backendImageModal.classList.add('is-open');
  backendImageModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-backend-image-modal');
  isBackendImageOpen = true;
}

function closeBackendImage() {
  if (!backendImageModal || !backendImageView || !isBackendImageOpen) return;

  backendImageModal.classList.remove('is-open');
  backendImageModal.setAttribute('aria-hidden', 'true');
  backendImageView.setAttribute('src', '');
  backendImageView.setAttribute('alt', '');
  if (backendImageCaption) {
    backendImageCaption.textContent = '';
  }

  document.body.classList.remove('has-backend-image-modal');
  isBackendImageOpen = false;
}

function openTeamStarter() {
  if (!teamStarterModal) return;

  teamStarterModal.classList.add('is-open');
  teamStarterModal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('has-team-starter-modal');
}

function closeTeamStarter() {
  if (!teamStarterModal) return;

  teamStarterModal.classList.remove('is-open');
  teamStarterModal.setAttribute('aria-hidden', 'false');
  document.body.classList.remove('has-team-starter-modal');
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

backendImageOpeners.forEach((opener) => {
  opener.addEventListener('click', () => {
    openBackendImage(opener.dataset.imageSrc, opener.dataset.imageAlt ?? '');
  });
});

backendImageClosers.forEach((closer) => {
  closer.addEventListener('click', () => {
    closeBackendImage();
  });
});

teamStarterOpeners.forEach((opener) => {
  opener.addEventListener('click', () => {
    openTeamStarter();
  });

  opener.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openTeamStarter();
    }
  });
});

teamStarterClosers.forEach((closer) => {
  closer.addEventListener('click', () => {
    closeTeamStarter();
  });
});

if (qnaNotebook) {
  qnaNotes = loadQnaNotes();
  renderQnaNotes();

  qnaAddButton?.addEventListener('click', () => {
    addQnaNote();
  });

  qnaClearButton?.addEventListener('click', () => {
    clearQnaNotes();
  });

  qnaQuestionInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      addQnaNote();
    }
  });

  qnaAnswerInput?.addEventListener('keydown', (event) => {
    if ((event.metaKey || event.ctrlKey) && event.key === 'Enter') {
      event.preventDefault();
      addQnaNote();
    }
  });
}

window.addEventListener('keydown', (event) => {
  if (isTypingTarget(event.target)) return;

  if (liveTerminalController.isOpen()) {
    if (event.key === 'Escape') {
      event.preventDefault();
      liveTerminalController.close();
    }
    return;
  }

  if (isBackendImageOpen) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeBackendImage();
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

  if (teamStarterModal?.classList.contains('is-open')) {
    if (event.key === 'Escape') {
      event.preventDefault();
      closeTeamStarter();
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
