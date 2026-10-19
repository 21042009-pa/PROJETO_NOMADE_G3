/* =========================================================
   NÔMADE — configuracoes.js
   Perfil, tema, preferências locais e encerramento da sessão.
   Requer: theme.js + core.js
   ========================================================= */

function fillProfileSettings() {
  const user = currentUser();
  if (!user) return;

  const nome = user.nome || user.login || "Usuário";
  const cargo = user.cargo || "Usuário";
  const setor = user.setor || "-";

  document.getElementById("profileName").textContent = nome;
  document.getElementById("profileRole").textContent = `${cargo} · ${setor}`;
  document.getElementById("cNome").value = user.nome || "";
  document.getElementById("cEmail").value = user.login || "";
  document.getElementById("cCargo").value = cargo;
  document.getElementById("cSetor").value = setor;
  document.getElementById("profileAvatar").textContent = userInitials(user);
}

function bindPreferenceSettings() {
  const darkSwitch = document.getElementById("darkSwitch");
  const notifSwitch = document.getElementById("notifSwitch");

  if (!darkSwitch || !notifSwitch) return;

  // Switch ligado = escuro. Desligado = claro.
  darkSwitch.checked = nomadeGetTheme() === "dark";
  notifSwitch.checked = localStorage.getItem("nomade_notifications") === "true";

  darkSwitch.addEventListener("change", () => {
    const theme = darkSwitch.checked ? "dark" : "light";
    nomadeSetTheme(theme);

    nomadeToast(
      theme === "dark"
        ? "Modo escuro ativado."
        : "Modo claro ativado."
    );
  });

  notifSwitch.addEventListener("change", () => {
    localStorage.setItem("nomade_notifications", String(notifSwitch.checked));
    nomadeToast("Preferência de notificações salva.");
  });

  document.getElementById("clearPreferencesButton")?.addEventListener("click", () => {
    localStorage.removeItem("nomade_notifications");
    nomadeResetTheme();

    darkSwitch.checked = true;
    notifSwitch.checked = false;

    nomadeToast("Preferências locais restauradas.");
  });
}


function setPasswordMessage(message, tone = "danger") {
  const box = document.getElementById("passwordMessage");
  if (!box) return;
  box.className = `small mb-3 text-${tone}`;
  box.textContent = message;
}

function bindPasswordChange() {
  const form = document.getElementById("passwordForm");
  const modalElement = document.getElementById("passwordModal");
  const button = document.getElementById("savePasswordButton");

  if (!form || !modalElement || !button) return;

  modalElement.addEventListener("show.bs.modal", () => {
    form.reset();
    setPasswordMessage("");
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const user = currentUser();
    const senhaAtual = document.getElementById("senhaAtual").value;
    const novaSenha = document.getElementById("novaSenha").value;
    const confirmarSenha = document.getElementById("confirmarNovaSenha").value;

    if (!user?.id_usuario) {
      setPasswordMessage("Não foi possível identificar o usuário da sessão.");
      return;
    }

    if (novaSenha.length < 6) {
      setPasswordMessage("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (novaSenha !== confirmarSenha) {
      setPasswordMessage("A confirmação da nova senha não confere.");
      return;
    }

    if (senhaAtual === novaSenha) {
      setPasswordMessage("A nova senha deve ser diferente da senha atual.");
      return;
    }

    button.disabled = true;

    try {
      const result = await nomadeApi(
        `/usuarios/${user.id_usuario}/senha`,
        jsonRequest("PUT", { senhaAtual, novaSenha, confirmarSenha }),
      );

      setPasswordMessage(result.mensagem || "Senha alterada com sucesso.", "success");
      nomadeToast(result.mensagem || "Senha alterada com sucesso.");
      form.reset();

      setTimeout(() => {
        bootstrap.Modal.getOrCreateInstance(modalElement).hide();
      }, 600);
    } catch (error) {
      setPasswordMessage(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

function bindSettingsLogout() {
  document.getElementById("logoutButton")?.addEventListener("click", () => {
    clearSession();
    window.location.href = "index.html";
  });
}

if (nomadeInitInternalPage("configuracoes", "Pesquisar no sistema...")) {
  fillProfileSettings();
  bindPreferenceSettings();
  bindPasswordChange();
  bindSettingsLogout();
}
