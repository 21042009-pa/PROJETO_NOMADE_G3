/* NÔMADE — usuarios.js */

function userRowInitials(user) {
  return (user.nome || user.login || "U")
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function bindUserForm() {
  const form = document.getElementById("addUserForm");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nome = document.getElementById("uNome").value.trim();
    const login = document.getElementById("uEmail").value.trim();
    const senha = document.getElementById("uSenha").value;
    const cargo = document.getElementById("uFuncao").value;

    if (senha.length < 6) {
      showError("A senha deve ter no mínimo 6 caracteres.");
      return;
    }

    try {
      await nomadeApi("/usuarios", jsonRequest("POST", { nome, login, senha, cargo, setor: "Estoque" }));
      bootstrap.Modal.getOrCreateInstance(document.getElementById("addUserModal")).hide();
      nomadeToast("Usuário adicionado com sucesso.");
      form.reset();
      await renderUsers();
    } catch (error) {
      showError(error.message);
    }
  });
}

function bindCustomizeUser() {
  const modalEl = document.getElementById("customizeUserModal");
  const form = document.getElementById("customizeUserForm");
  if (!modalEl || !form || form.dataset.bound) return;
  form.dataset.bound = "1";

  // abre o modal com os dados da linha clicada
  modalEl.addEventListener("show.bs.modal", (event) => {
    const linha = event.relatedTarget && event.relatedTarget.closest("tr");
    if (!linha) return;
    const celulas = linha.querySelectorAll("td");
    document.getElementById("cUsuario").value = linha.querySelector(".cell-strong").textContent.trim();
    document.getElementById("cFuncao").value = celulas[1].textContent.trim();
    document.getElementById("cAcesso").value = celulas[2].textContent.trim();
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    bootstrap.Modal.getOrCreateInstance(modalEl).hide();
    nomadeToast("Usuário atualizado com sucesso.");
  });
}

async function renderUsers() {
  try {
    const users = await nomadeApi("/usuarios");
    const tbody = document.querySelector("#userTable tbody");

    if (tbody) {
      tbody.innerHTML = users.map((user) => `
        <tr>
          <td>
            <div class="d-flex align-items-center gap-2">
              <div class="avatar" style="width:34px;height:34px;font-size:.72rem">${escHtml(userRowInitials(user))}</div>
              <div>
                <div class="cell-strong">${escHtml(user.nome || "-")}</div>
                <div class="cell-muted" style="font-size:.78rem">${escHtml(user.login || "-")}</div>
              </div>
            </div>
          </td>
          <td><span class="badge-app badge-info">${escHtml(user.cargo || "Usuário")}</span></td>
          <td class="cell-muted">${escHtml(user.setor || "-")}</td>
          <td><span class="badge-app badge-success">Ativo</span></td>
          <td class="cell-muted">—</td>
          <td class="text-end">
            <button type="button" class="btn-ghost me-2" style="padding:4px 10px;font-size:.78rem"
              data-bs-toggle="modal" data-bs-target="#customizeUserModal">Personalizar usuário</button>
            ${rowActions(user.id_usuario, "/usuarios")}
          </td>
        </tr>`).join("") || `<tr><td colspan="6" class="cell-muted text-center">Nenhum usuário cadastrado.</td></tr>`;
    }

    const metrics = document.querySelectorAll(".metric-card .metric-value");
    if (metrics[0]) metrics[0].textContent = users.length;
    if (metrics[1]) metrics[1].textContent = users.length;

    bindUserForm();
    bindCustomizeUser();
    bindDeleteButtons(document, renderUsers);
  } catch (error) {
    showError(error.message);
  }
}

if (nomadeInitInternalPage("usuarios", "Pesquisar membros da equipe...")) {
  nomadeInitTableFilter("userFilter", "#userTable");
  renderUsers();
}