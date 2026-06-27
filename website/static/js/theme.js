(function () {
  const KEY = "devdocs_theme";

  function getPreferred() {
    return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
  }

  function normalize(theme) {
    return theme === "light" ? "light" : "dark";
  }

  function updateIcons(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const icon = btn.querySelector("[data-theme-icon]");
      if (icon) {
        icon.setAttribute("data-lucide", theme === "dark" ? "sun" : "moon");
      }
      btn.setAttribute("aria-label", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
    });
    if (window.lucide) window.lucide.createIcons();
  }

  function apply(theme) {
    const next = normalize(theme);
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem(KEY, next);
    updateIcons(next);
  }

  function toggle() {
    const current = normalize(document.documentElement.getAttribute("data-theme"));
    apply(current === "dark" ? "light" : "dark");
  }

  apply(localStorage.getItem(KEY) || getPreferred());

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-theme-toggle]");
    if (btn) {
      e.preventDefault();
      toggle();
    }
  });

  window.devdocsTheme = { apply, toggle };
})();
