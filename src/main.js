import './styles.css';
import { slides } from './slides.js';
import { renderPresentation } from './render.js';

const app = document.querySelector('#app');
app.innerHTML = renderPresentation(slides);

const deck = app.querySelector('[data-deck]');
const sections = [...app.querySelectorAll('[data-slide-id]')];
const buttons = [...app.querySelectorAll('[data-target]')];
const progressFill = app.querySelector('[data-progress-fill]');
const scrollCue = app.querySelector('.scroll-cue');

let activeIndex = 0;

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

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const index = sections.findIndex((section) => section.id === button.dataset.target);
    goToIndex(index);
  });
});

window.addEventListener('keydown', (event) => {
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
