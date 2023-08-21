// Interactive Page Navigation
// This script dynamically generates navigation, scrolls to sections, and highlights active sections.

// Global Variables
const sections = document.querySelectorAll('section');
const sectionData = gatherSectionData(sections);
let currentSection;
const navList = document.getElementById('navbar__list');
let navLinks = navList.childNodes;
let observerEntries = [];
const observerConfig = {
  root: null,
  rootMargin: '15px',
  threshold: 0.25,
};

// Helper Functions

// Set the active section based on URL
function setActiveSectionFromURL() {
  const url = window.location.href;
  for (const [sectionId] of sectionData) {
    if (url.includes(sectionId)) {
      currentSection = sectionId;
      activateSection(currentSection, 0);
    }
  }
}

// Prepare navigation and intersection observers
function initializePage() {
  createNavigation();
  createObservers();
}

// Create IntersectionObservers to track section visibility
function createObservers() {
  const observer = new IntersectionObserver((entries) => {
    observerEntries = entries;
  }, observerConfig);

  sections.forEach((section) => {
    observer.observe(section.firstElementChild);
  });
}

// Gather section IDs and titles
function gatherSectionData(sections) {
  const data = [];

  sections.forEach((section) => {
    const sectionId = section.id;
    const sectionTitle = section.querySelector('h2').textContent;
    data.push([sectionId, sectionTitle]);
  });

  return data;
}

// Create navigation links in the navigation menu
function createNavigation() {
  const navFragment = document.createDocumentFragment();

  sectionData.forEach(([sectionId, sectionTitle]) => {
    const listItem = document.createElement('li');
    const link = document.createElement('a');
    listItem.appendChild(link);
    link.classList = 'menu__link';
    link.setAttribute('data-nav', sectionId);
    link.setAttribute('title', sectionTitle);
    link.innerText = sectionTitle;
    listItem.appendChild(link);
    navFragment.appendChild(listItem);
  });

  navList.appendChild(navFragment);

  if (!currentSection) {
    activateSection('section1', 0);
  }

  navList.addEventListener('click', (e) => {
    if (e.target && e.target.nodeName === 'A') {
      e.preventDefault();
      activateSection(e.target.getAttribute('data-nav'), 0);
    }
  }, true);
}

// Main Functions

// Set a section as active and scroll to it
function activateSection(sectionId, eventType) {
  currentSection = sectionId;

  sections.forEach((section) => {
    if (section.id !== currentSection) {
      section.classList.remove('active');
    } else {
      section.classList.add('active');
    }
  });

  const activeSectionElement = document.getElementById(currentSection);
  if (eventType === 0) {
    activeSectionElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  updateActiveNavLink();
}

// Update active link styling for the navigation link
function updateActiveNavLink() {
  navLinks.forEach((navLink) => {
    const sectionId = navLink.querySelector('a').getAttribute('data-nav');
    const isActive = sectionId === currentSection;
    navLink.querySelector('a').classList.toggle('active', isActive);
  });
}

// Event Listeners
window.addEventListener('load', setActiveSectionFromURL);
window.addEventListener('DOMContentLoaded', initializePage);
window.addEventListener('scroll', () => {
  const scrollEntry = observerEntries[0];
  if (scrollEntry?.isIntersecting) {
    activateSection(scrollEntry.target.parentElement.id, 1);
  }
});
