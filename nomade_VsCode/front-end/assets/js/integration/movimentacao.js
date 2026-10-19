/* NÔMADE — movimentacao.js */

const movementModeConfig = {
  saida: {
    title: "Saída de Mercadoria",
    subtitle: "Registrar baixa técnica de estoque por venda ou ajuste.",
    confirm: "Confirmar saída",
    motivo: "Motivo da saída",
    destino: "Destino / cliente",
    sign: -1,
    apiType: "Saída",
    warning: "Esta operação removerá os itens do inventário físico. Confira o produto e a quantidade antes de confirmar.",
    options: ["Venda (Checkout)", "Transferência entre lojas", "Produto com falha", "Ajuste de inventário", "Devolução ao fornecedor"],
  },
  entrada: {
    title: "Entrada de Mercadoria",
    subtitle: "Registrar recebimento de estoque por reposição ou devolução.",
    confirm: "Confirmar entrada",
    motivo: "Motivo da entrada",
    destino: "Origem / fornecedor",
    sign: 1,
    apiType: "Entrada",
    warning: "Confirme a contagem física antes de lançar. A entrada atualiza o estoque disponível.",
    options: ["Reposição de fornecedor", "Devolução de cliente", "Transferência entre lojas", "Novo lote cadastrado"],
  },
  retirada: {
    title: "Retirada do Produto",
    subtitle: "Registrar retirada definitiva por avaria, extravio ou recall.",
    confirm: "Confirmar retirada",
    motivo: "Causa da retirada",
    destino: "Responsável pela retirada",
    sign: -1,
    apiType: "Saída",
    warning: "A retirada será registrada como saída no histórico do produto.",
    options: ["Produto avariado", "Extravio", "Recall do fabricante", "Amostra interna"],
  },
};

let movementProducts = [];
let movementLots = [];

function getMovementMode() {
  return document.querySelector("#modeTabs button.active")?.dataset.mode || "saida";
}

function applyMovementMode(mode) {
  const config = movementModeConfig[mode];
  if (!config) return;

  document.querySelectorAll("#modeTabs button").forEach((button) => {
    button.classList.toggle("active", button.dataset.mode === mode);
  });

  document.getElementById("pageTitle").textContent = config.title;
  document.getElementById("pageSubtitle").textContent = config.subtitle;
  document.getElementById("confirmBtn").textContent = config.confirm;
  document.getElementById("motivoLabel").textContent = config.motivo;
  document.getElementById("destinoLabel").textContent = config.destino;
  document.querySelector("#warnBox p").textContent = config.warning;

  document.getElementById("motivoSelect").innerHTML = config.options
    .map((option) => `<option value="${escHtml(option)}">${escHtml(option)}</option>`)
    .join("");

  updateMovementPreview();
}

function selectedMovementProduct() {
  const id = Number(document.getElementById("skuInput")?.value || 0);
  return movementProducts.find((product) => Number(product.id_produto) === id) || null;
}

function currentProductStock() {
  const product = selectedMovementProduct();
  if (!product) return null;
  const lote = movementLots.find((item) => Number(item.id_lote) === Number(product.id_lote));
  return Number(lote?.quantidade_atual || 0);
}

function setStockDisplay(elementId, value) {
  const element = document.getElementById(elementId);
  if (!element) return;
  element.innerHTML = `${value == null ? "—" : value} <span style="font-size:.8rem;color:var(--text-muted);font-family:var(--font-body)">un</span>`;
  if (elementId === "currentStockValue") element.dataset.stock = value == null ? "" : String(value);
}

function updateSelectedProductInfo() {
  const product = selectedMovementProduct();
  const title = document.getElementById("selectedProductName");
  const meta = document.getElementById("selectedProductMeta");

  if (title) title.textContent = product?.nome || "Produto selecionado";
  if (meta) meta.textContent = product ? [product.modelo, product.cor].filter(Boolean).join(" · ") || product.codigo_produto || "" : "Selecione um produto para registrar a movimentação.";

  setStockDisplay("currentStockValue", currentProductStock());
  updateMovementPreview();
}

function updateMovementPreview() {
  const stock = currentProductStock();
  const quantity = Number(document.getElementById("qtyInput")?.value || 0);
  const config = movementModeConfig[getMovementMode()];

  if (stock == null || !config) {
    setStockDisplay("postOpValue", null);
    return;
  }

  setStockDisplay("postOpValue", Math.max(0, stock + config.sign * quantity));
}

function ensureMovementProductSelect(produtos) {
  let input = document.getElementById("skuInput");
  if (!input) return;

  if (input.tagName !== "SELECT") {
    const select = document.createElement("select");
    select.id = "skuInput";
    select.className = "form-select-app";
    select.required = true;
    input.replaceWith(select);
    input = select;
  }

  input.innerHTML = `<option value="">Selecione o produto</option>` + produtos.map((produto) => `
    <option value="${produto.id_produto}">${escHtml(produto.codigo_produto || produto.nome)} — ${escHtml(produto.nome)}</option>`).join("");

  if (!input.dataset.changeBound) {
    input.dataset.changeBound = "1";
    input.addEventListener("change", updateSelectedProductInfo);
  }
}

function renderMovementRows(movimentacoes, produtos) {
  const productById = Object.fromEntries(produtos.map((p) => [p.id_produto, p]));
  const tbody = document.querySelector("#moveForm .table-app tbody");
  if (!tbody) return;

  tbody.innerHTML = movimentacoes.slice(-10).reverse().map((movimento) => {
    const produto = productById[movimento.id_produto];
    const badge = movimento.tipo === "Entrada" ? "badge-success" : "badge-danger";
    return `
      <tr>
        <td class="cell-muted">${escHtml(movimento.data_movimentacao || "-")}</td>
        <td class="cell-strong">${escHtml(produto?.codigo_produto || movimento.id_produto || "-")}</td>
        <td>${escHtml(movimento.quantidade)}</td>
        <td><span class="badge-app ${badge}">${escHtml(movimento.tipo)}</span></td>
      </tr>`;
  }).join("") || `<tr><td colspan="4" class="cell-muted text-center">Nenhuma movimentação registrada.</td></tr>`;
}

async function loadMovementData() {
  try {
    const [movimentacoes, produtos, lotes] = await Promise.all([
      nomadeApi("/movimentacoes-estoque"),
      nomadeApi("/produtos"),
      nomadeApi("/lotes"),
    ]);

    movementProducts = produtos;
    movementLots = lotes;
    ensureMovementProductSelect(produtos);
    renderMovementRows(movimentacoes, produtos);
    updateSelectedProductInfo();
  } catch (error) {
    showError(error.message);
  }
}

function bindMovementForm() {
  const form = document.getElementById("moveForm");
  if (!form || form.dataset.bound) return;
  form.dataset.bound = "1";

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const config = movementModeConfig[getMovementMode()];
    const motivo = document.getElementById("motivoSelect").value;
    const destino = document.getElementById("destinoInput").value.trim();

    const body = {
      tipo: config.apiType,
      id_produto: Number(document.getElementById("skuInput").value),
      data_movimentacao: new Date().toISOString().slice(0, 10),
      quantidade: Number(document.getElementById("qtyInput").value),
      observacao: destino ? `${motivo} — ${destino}` : motivo,
    };

    try {
      await nomadeApi("/movimentacoes-estoque", jsonRequest("POST", body));
      nomadeToast(`${config.apiType} registrada com sucesso.`);
      form.reset();
      applyMovementMode(getMovementMode());
      await loadMovementData();
    } catch (error) {
      showError(error.message);
    }
  });
}

function bindMovementControls() {
  document.querySelectorAll("#modeTabs button").forEach((button) => {
    button.addEventListener("click", () => applyMovementMode(button.dataset.mode));
  });
  document.getElementById("qtyInput")?.addEventListener("input", updateMovementPreview);
  document.getElementById("qtyInput")?.addEventListener("change", updateMovementPreview);
}

if (nomadeInitInternalPage("movimentacao", "Buscar produto...")) {
  bindMovementControls();
  bindMovementForm();
  applyMovementMode("saida");
  loadMovementData();
}
