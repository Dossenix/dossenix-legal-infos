const labels = {
  en: { home: 'Legal Information', terms: 'Terms of Service', privacy: 'Privacy Policy', contact: 'Contact', top: 'Back to top ↑', skip: 'Skip to content' },
  it: { home: 'Informazioni Legali', terms: 'Termini di Servizio', privacy: 'Privacy Policy', contact: 'Contatti', top: 'Torna su ↑', skip: 'Vai al contenuto' },
};
const page = document.body.dataset.page;
const panels = document.querySelectorAll('[data-lang-panel]');
const buttons = document.querySelectorAll('[data-language-button]');
const navLinks = document.querySelectorAll('[data-nav]');
if (window.matchMedia('(max-width: 680px)').matches) {
  document.querySelectorAll('.document-index details').forEach(details => { details.open = false; });
}
const languageFromHash = () => location.hash.match(/(?:^#|-)(en|it)(?:-|$)/)?.[1];
function initialLanguage() {
  if (languageFromHash()) return languageFromHash();
  try {
    const saved = localStorage.getItem('dob-legal-language');
    if (saved === 'en' || saved === 'it') return saved;
  } catch { /* The page remains usable when storage is disabled. */ }
  return navigator.language.toLowerCase().startsWith('it') ? 'it' : 'en';
}
function applyLanguage(language, scroll = false) {
  document.documentElement.lang = language;
  document.title = `${labels[language][page]} · D.O.B.`;
  try { localStorage.setItem('dob-legal-language', language); } catch { /* Optional preference. */ }
  panels.forEach(panel => { panel.hidden = panel.dataset.langPanel !== language; });
  buttons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.languageButton === language)));
  navLinks.forEach(link => {
    const key = link.dataset.nav;
    link.textContent = key === 'terms' ? 'ToS' : key === 'privacy' ? 'Privacy' : labels[language][key];
    link.href = key === 'contact' ? `#contact-${language}` : `${key}.html#${key}-${language}`;
    if (key === page) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  document.querySelector('[data-footer-top]').textContent = labels[language].top;
  document.querySelector('[data-skip]').textContent = labels[language].skip;
  const oldHash = location.hash;
  const hash = oldHash && oldHash !== '#top' && oldHash !== '#content'
    ? oldHash.replace(/(^#|-)(en|it)(?=-|$)/, `$1${language}`)
    : `#${language}`;
  history.replaceState(null, '', hash);
  if (scroll && oldHash && oldHash !== '#top') {
    requestAnimationFrame(() => {
      if (hash === `#${page}-${language}`) window.scrollTo({ top: 0, behavior: 'instant' });
      else document.getElementById(hash.slice(1))?.scrollIntoView();
    });
  }
}
function restoreLocation() {
  const legacy = location.hash.match(/^#(terms|privacy)-(en|it)$/);
  if (page === 'home' && legacy) {
    location.replace(`${legacy[1]}.html${location.hash}`);
    return;
  }
  applyLanguage(languageFromHash() || initialLanguage(), true);
}
buttons.forEach(button => button.addEventListener('click', () => applyLanguage(button.dataset.languageButton, true)));
window.addEventListener('hashchange', restoreLocation);
document.querySelector('#year').textContent = new Date().getFullYear();
restoreLocation();
