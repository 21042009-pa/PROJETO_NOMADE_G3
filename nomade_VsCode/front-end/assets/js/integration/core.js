/* =========================================================
   NÔMADE — integration/core.js
   API, sessão, autenticação de páginas e helpers compartilhados.
   ========================================================= */

const API_ORIGIN = "http://localhost:3000";

// Se o front-end estiver sendo servido pelo próprio Express (porta 3000),
// usamos rotas relativas. Se estiver aberto pelo Live Server, file:// ou
// qualquer outra porta, enviamos as requisições para o back-end na 3000.
const NOMADE_API = window.location.port === "3000" ? "" : API_ORIGIN;

const SESSION_KEY = "nomade_usuario";

function escHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[char]);
}

async function nomadeApi(path, options = {}) {
  let response;

  try {
    response = await fetch(`${NOMADE_API}${path}`, options);
  } catch (error) {
    throw new Error(
      `Não foi possível conectar à API em ${API_ORIGIN}. Verifique se o servidor Node está rodando.`
    );
  }

  const raw = await response.text();
  let data = {};

  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      data = {};
    }
  }

  if (!response.ok) {
    const backendMessage = data.mensagem || data.message;

    if (backendMessage) {
      throw new Error(backendMessage);
    }

    if (response.status === 404) {
      throw new Error(`Rota ${path} não encontrada na API.`);
    }

    if (response.status === 405) {
      throw new Error(`A rota ${path} não aceita esta operação.`);
    }

    throw new Error(`Erro ${response.status} ao acessar ${path}.`);
  }

  return data;
}

function jsonRequest(method, body) {
  return {
    method,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
}

function showError(message) {
  if (typeof nomadeToast === "function") {
    nomadeToast(message, "error");
  } else {
    alert(message);
  }
}

function currentUser() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY) || "null";
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function clearSession() {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(SESSION_KEY);
}

function requireLogin() {
  if (currentUser()) return true;
  window.location.href = "index.html";
  return false;
}

function userInitials(user) {
  return (user?.nome || user?.login || "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function bindLogout() {
  const user = currentUser();
  const name = document.querySelector(".topbar-user .name");
  const role = document.querySelector(".topbar-user .role");
  const avatar = document.querySelector(".topbar-user .avatar");

  if (user) {
    if (name) name.textContent = user.nome || user.login || "Usuário";
    if (role) role.textContent = user.cargo || user.setor || "Usuário";
    if (avatar) avatar.textContent = userInitials(user);
  }

  document.querySelectorAll("[data-nomade-logout]").forEach((link) => {
    if (link.dataset.logoutBound) return;
    link.dataset.logoutBound = "1";
    link.addEventListener("click", clearSession);
  });
}

function nomadeInitInternalPage(active, searchPlaceholder) {
  if (!requireLogin()) return false;
  if (typeof nomadeMountShell !== "function") {
    console.error("layout.js não foi carregado antes do script da página.");
    return false;
  }

  nomadeMountShell(active, { searchPlaceholder });
  bindLogout();
  return true;
}

function rowActions(id, endpoint) {
  return `
    <button
      class="btn-ghost btn-delete"
      type="button"
      data-id="${id}"
      data-endpoint="${endpoint}"
    >Excluir</button>`;
}

function bindDeleteButtons(root = document, afterDelete = null) {
  root.querySelectorAll(".btn-delete").forEach((button) => {
    if (button.dataset.deleteBound) return;
    button.dataset.deleteBound = "1";

    button.addEventListener("click", async () => {
      if (!confirm("Deseja realmente excluir este registro?")) return;

      try {
        await nomadeApi(`${button.dataset.endpoint}/${button.dataset.id}`, { method: "DELETE" });
        if (typeof afterDelete === "function") await afterDelete();
      } catch (error) {
        showError(error.message);
      }
    });
  });
}
