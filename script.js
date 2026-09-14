const labels = {
  en: {
    title: "Legal Information · D.O.B.",
    terms: "Terms",
    privacy: "Privacy",
    contact: "Contact",
    top: "Back to top",
  },
  it: {
    title: "Informazioni Legali · D.O.B.",
    terms: "Termini",
    privacy: "Privacy",
    contact: "Contatti",
    top: "Torna su",
  },
};

const hashMap = {
  en: {
    terms: "#terms-en",
    privacy: "#privacy-en",
    contact: "#contact-en",
  },
  it: {
    terms: "#terms-it",
    privacy: "#privacy-it",
    contact: "#contact-it",
  },
};

const panels = document.querySelectorAll("[data-lang-panel]");
const buttons = document.querySelectorAll("[data-language-button]");
const navLinks = document.querySelectorAll("[data-nav]");
const footerTop = document.querySelector("[data-footer-top]");
const year = document.querySelector("#year");

function getInitialLanguage() {
  const saved = localStorage.getItem("legal-language");
  if (saved === "it" || saved === "en") {
    return saved;
  }

  return navigator.language.toLowerCase().startsWith("it") ? "it" : "en";
}

function updateLanguage(language, shouldScroll = false) {
  document.documentElement.lang = language;
  document.title = labels[language].title;
  localStorage.setItem("legal-language", language);

  panels.forEach((panel) => {
    const isActive = panel.dataset.langPanel === language;
    panel.hidden = !isActive;
    panel.setAttribute("aria-hidden", String(!isActive));
  });

  buttons.forEach((button) => {
    button.setAttribute(
      "aria-pressed",
      String(button.dataset.languageButton === language),
    );
  });

  navLinks.forEach((link) => {
    const key = link.dataset.nav;
    link.textContent = labels[language][key];
    link.href = hashMap[language][key];
  });

  if (footerTop) {
    footerTop.textContent = labels[language].top;
  }

  const currentHash = window.location.hash;
  const targetKey = Object.values(hashMap.en).includes(currentHash)
    ? Object.entries(hashMap.en).find(([, hash]) => hash === currentHash)[0]
    : Object.entries(hashMap.it).find(([, hash]) => hash === currentHash)?.[0];

  if (targetKey) {
    history.replaceState(null, "", hashMap[language][targetKey]);
    if (shouldScroll) {
      document.querySelector(hashMap[language][targetKey])?.scrollIntoView();
    }
  }
}

buttons.forEach((button) => {
  button.addEventListener("click", () => {
    updateLanguage(button.dataset.languageButton, true);
  });
});

if (year) {
  year.textContent = String(new Date().getFullYear());
}

updateLanguage(getInitialLanguage(), Boolean(window.location.hash));
