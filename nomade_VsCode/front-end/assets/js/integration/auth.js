/* =========================================================
   NÔMADE — integration/auth.js
   Login e cadastro da página index.html.
   Requer: core.js + Bootstrap.
   ========================================================= */

function setRegisterMessage(message, tone = "danger") {
  const box = document.getElementById("registerMessage");
  if (!box) return;
  box.className = `small mb-3 text-${tone}`;
  box.textContent = message;
}

function initRegister() {
  const openLink = document.getElementById("openRegister");
  const form = document.getElementById("registerForm");
  const modalElement = document.getElementById("registerModal");
  if (!openLink || !form || !modalElement) return;

  openLink.addEventListener("click", (event) => {
    event.preventDefault();
    setRegisterMessage("", "danger");
    bootstrap.Modal.getOrCreateInstance(modalElement).show();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const nome = document.getElementById("registerNome").value.trim();
    const login = document.getElementById("registerLogin").value.trim();
    const senha = document.getElementById("registerSenha").value;
    const confirmar = document.getElementById("registerConfirmar").value;
    const cargo = document.getElementById("registerCargo").value;
    const setor = document.getElementById("registerSetor").value.trim();
    const button = document.getElementById("registerButton");

    if (senha.length < 6) {
      setRegisterMessage("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (senha !== confirmar) {
      setRegisterMessage("As senhas não coincidem.");
      return;
    }

    button.disabled = true;

    try {
      await nomadeApi("/usuarios", jsonRequest("POST", { nome, login, senha, cargo, setor }));

      document.getElementById("email").value = login;
      document.getElementById("senha").value = senha;
      setRegisterMessage("Usuário cadastrado! Agora você já pode entrar no sistema.", "success");

      setTimeout(() => {
        bootstrap.Modal.getOrCreateInstance(modalElement).hide();
        form.reset();
        const setorInput = document.getElementById("registerSetor");
        if (setorInput) setorInput.value = "Estoque";
      }, 700);
    } catch (error) {
      setRegisterMessage(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

function initLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  if (currentUser()) {
    window.location.href = "dashboard.html";
    return;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const login = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const lembrar = document.getElementById("lembrar")?.checked;
    const errorBox = document.getElementById("loginError");
    const button = form.querySelector('button[type="submit"]');

    if (errorBox) errorBox.textContent = "";
    button.disabled = true;

    try {
      const data = await nomadeApi("/usuarios/login", jsonRequest("POST", { login, senha }));
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(data.usuario));

      if (lembrar) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.usuario));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }

      window.location.href = "dashboard.html";
    } catch (error) {
      if (errorBox) errorBox.textContent = error.message;
      else showError(error.message);
    } finally {
      button.disabled = false;
    }
  });
}

initRegister();
initLogin();
