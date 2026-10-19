/* =========================================================
   NÔMADE — theme.js
   Tema global (escuro / claro).
   Deve ser carregado no <head> para evitar "piscar" o tema.
   ========================================================= */

const NOMADE_THEME_KEY = "nomade_theme";
const NOMADE_LEGACY_DARK_KEY = "nomade_dark_mode";

function nomadeNormalizeTheme(theme) {
  return theme === "light" ? "light" : "dark";
}

function nomadeGetTheme() {
  const savedTheme = localStorage.getItem(NOMADE_THEME_KEY);

  if (savedTheme === "light" || savedTheme === "dark") {
    return savedTheme;
  }

  // Compatibilidade com a preferência salva pela versão anterior.
  const legacyDarkMode = localStorage.getItem(NOMADE_LEGACY_DARK_KEY);

  if (legacyDarkMode === "false") return "light";
  if (legacyDarkMode === "true") return "dark";

  return "dark";
}

function nomadeApplyTheme(theme) {
  const normalizedTheme = nomadeNormalizeTheme(theme);
  document.documentElement.dataset.theme = normalizedTheme;
  document.documentElement.style.colorScheme = normalizedTheme;
  return normalizedTheme;
}

function nomadeSetTheme(theme) {
  const normalizedTheme = nomadeApplyTheme(theme);
  localStorage.setItem(NOMADE_THEME_KEY, normalizedTheme);

  // Remove a chave antiga para existir apenas uma fonte de verdade.
  localStorage.removeItem(NOMADE_LEGACY_DARK_KEY);

  window.dispatchEvent(
    new CustomEvent("nomade:themechange", {
      detail: { theme: normalizedTheme },
    })
  );

  return normalizedTheme;
}

function nomadeResetTheme() {
  localStorage.removeItem(NOMADE_THEME_KEY);
  localStorage.removeItem(NOMADE_LEGACY_DARK_KEY);
  return nomadeApplyTheme("dark");
}

// Aplica imediatamente, antes de o corpo da página ser renderizado.
nomadeApplyTheme(nomadeGetTheme());
