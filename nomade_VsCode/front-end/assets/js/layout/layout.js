/* =========================================================
   NÔMADE — layout.js
   Menu hambúrguer, topbar e estrutura visual das páginas internas.
   Requer: assets/js/layout/icons.js
   ========================================================= */

const NOMADE_NAV = [
  {
    key: "dashboard",
    href: "dashboard.html",
    label: "Painel de Controle",
    icon: "grid",
  },
  { key: "estoque", href: "estoque.html", label: "Inventário", icon: "box" },
  { key: "produtos", href: "produtos.html", label: "Produtos", icon: "cart" },
  {
    key: "movimentacao",
    href: "movimentacao.html",
    label: "Entrada &amp; Saída",
    icon: "scan",
  },
  { key: "usuarios", href: "usuarios.html", label: "Usuários", icon: "users" },
  {
    key: "relatorios",
    href: "relatorios.html",
    label: "Relatórios",
    icon: "doc",
  },
];

function nomadeBrandMark() {
  return `<img class="logo-nomade-sidebar" src="assets/img/logo-nomade.png"
               alt="NÔMADE" width="190" height="123" />`;
}

function nomadeBuildSidebar(active) {
  const links = NOMADE_NAV.map(
    (item) => `
    <a href="${item.href}" class="nav-link-app${item.key === active ? " active" : ""}"${item.key === active ? ' aria-current="page"' : ""}>
      ${NOMADE_ICONS[item.icon]}
      <span>${item.label}</span>
    </a>`,
  ).join("");

  return `
    <aside class="sidebar" id="nomadeSidebar" aria-hidden="true">
      <div class="sidebar-head">
        <div class="brand">
          ${nomadeBrandMark()}
        </div>

        <button
          class="icon-btn sidebar-close"
          id="sidebarClose"
          type="button"
          aria-label="Fechar menu"
        >
          ${NOMADE_ICONS.close}
        </button>
      </div>

      <nav class="nav-section" aria-label="Navegação principal">
        ${links}
      </nav>

      <div class="sidebar-footer">
        <a href="suporte.html" class="nav-link-app">
          ${NOMADE_ICONS.help}
          <span>Suporte</span>
        </a>
        <div class="sidebar-version">Nômade v2.4.0</div>
      </div>
    </aside>

    <button
      class="sidebar-backdrop"
      id="sidebarBackdrop"
      type="button"
      aria-label="Fechar menu"
      tabindex="-1"
    ></button>`;
}

function nomadeBuildTopbar(options = {}, active = "") {
  const placeholder = options.searchPlaceholder || "Buscar no sistema...";
  const settingsClass = active === "configuracoes" ? " active" : "";

  return `
    <header class="topbar">
      <button
        class="icon-btn sidebar-toggle"
        id="sidebarToggle"
        type="button"
        aria-label="Abrir menu"
        aria-controls="nomadeSidebar"
        aria-expanded="false"
      >
        ${NOMADE_ICONS.menu}
      </button>

      <div class="search-field">
        ${NOMADE_ICONS.search}
        <input type="search" id="globalSearch" placeholder="${placeholder}" aria-label="${placeholder}" autocomplete="off">
      </div>

      <span class="status-pill">
        <span class="status-dot" aria-hidden="true"></span>
        Sistema Online
      </span>

      <div class="ms-auto d-flex align-items-center gap-2">
        <button class="icon-btn" type="button" aria-label="Notificações">
          ${NOMADE_ICONS.bell}<span class="ping"></span>
        </button>

        <button class="icon-btn" type="button" aria-label="Status de sincronização">
          ${NOMADE_ICONS.wifi}
        </button>

        <div class="topbar-user-wrap">
          <button
            class="topbar-user"
            id="userMenuToggle"
            type="button"
            aria-haspopup="menu"
            aria-controls="userDropdown"
            aria-expanded="false"
          >
            <div class="avatar" aria-hidden="true">U</div>
            <div class="user-meta">
              <div class="name">Usuário</div>
              <div class="role">—</div>
            </div>
            <svg class="user-menu-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="m7 10 5 5 5-5"/>
            </svg>
          </button>

          <div class="user-dropdown" id="userDropdown" role="menu" aria-hidden="true">
            <a
              href="configuracoes.html"
              class="user-dropdown-item${settingsClass}"
              role="menuitem"
            >
              ${NOMADE_ICONS.gear}
              <span>Configurações</span>
            </a>

            <div class="user-dropdown-separator"></div>

            <a
              href="index.html"
              class="user-dropdown-item danger"
              role="menuitem"
              data-nomade-logout
            >
              ${NOMADE_ICONS.logout}
              <span>Sair</span>
            </a>
          </div>
        </div>
      </div>
    </header>`;
}

function nomadeInitSidebar() {
  const toggle = document.getElementById("sidebarToggle");
  const close = document.getElementById("sidebarClose");
  const sidebar = document.getElementById("nomadeSidebar");
  const backdrop = document.getElementById("sidebarBackdrop");

  if (!toggle || !sidebar || !backdrop) return;

  const setOpen = (open) => {
    sidebar.classList.toggle("open", open);
    backdrop.classList.toggle("open", open);
    document.body.classList.toggle("sidebar-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    sidebar.setAttribute("aria-hidden", String(!open));

    if (open) {
      close?.focus();
    } else if (document.activeElement === close) {
      toggle.focus();
    }
  };

  toggle.addEventListener("click", () => {
    setOpen(!sidebar.classList.contains("open"));
  });

  close?.addEventListener("click", () => setOpen(false));
  backdrop.addEventListener("click", () => setOpen(false));

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && sidebar.classList.contains("open")) {
      setOpen(false);
    }
  });
}

function nomadeInitUserMenu() {
  const wrap = document.querySelector(".topbar-user-wrap");
  const toggle = document.getElementById("userMenuToggle");
  const dropdown = document.getElementById("userDropdown");

  if (!wrap || !toggle || !dropdown) return;

  const setOpen = (open) => {
    wrap.classList.toggle("open", open);
    toggle.setAttribute("aria-expanded", String(open));
    dropdown.setAttribute("aria-hidden", String(!open));
  };

  toggle.addEventListener("click", (event) => {
    event.stopPropagation();
    setOpen(!wrap.classList.contains("open"));
  });

  dropdown.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  document.addEventListener("click", (event) => {
    if (!wrap.contains(event.target)) setOpen(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && wrap.classList.contains("open")) {
      setOpen(false);
      toggle.focus();
    }
  });
}

function nomadeMountShell(active, options = {}) {
  const root = document.getElementById("app-shell");
  if (!root || document.getElementById("nomadeSidebar")) return;

  root.insertAdjacentHTML("afterbegin", nomadeBuildSidebar(active));

  const mainCol = document.createElement("div");
  mainCol.className = "main-col";
  mainCol.id = "mainCol";

  Array.from(root.childNodes)
    .filter((node) => !["nomadeSidebar", "sidebarBackdrop"].includes(node.id))
    .forEach((node) => mainCol.appendChild(node));

  root.appendChild(mainCol);
  mainCol.insertAdjacentHTML("afterbegin", nomadeBuildTopbar(options, active));

  nomadeInitSidebar();
  nomadeInitUserMenu();
}