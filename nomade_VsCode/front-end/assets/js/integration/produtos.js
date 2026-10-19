/* NÔMADE — produtos.js */

let productFormBound = false;
let productCache = { fornecedores: [], categorias: [], lotes: [] };

function setSelectOptions(select, placeholder, items, valueKey, labelFn) {
  select.innerHTML = `<option value="">${placeholder}</option>` + items.map((item) =>
    `<option value="${escHtml(item[valueKey])}">${escHtml(labelFn(item))}</option>`
  ).join("");
}

function ensureProductSelects(fornecedores, categorias, lotes) {
  let fornecedor = document.getElementById("pFornecedor");
  if (fornecedor && fornecedor.tagName !== "SELECT") {
    const select = document.createElement("select");
    select.id = "pFornecedor";
    select.className = "form-select-app";
    select.required = true;
    fornecedor.replaceWith(select);
    fornecedor = select;
  }
  if (fornecedor) setSelectOptions(fornecedor, "Selecione o fornecedor", fornecedores, "id_fornecedor", (f) => f.nome);

  let categoria = document.getElementById("pCategoria");
  if (!categoria && fornecedor) {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <label class="field-label" for="pCategoria">Categoria</label>
      <select class="form-select-app" id="pCategoria" required></select>`;
    fornecedor.closest(".col-md-6")?.after(col);
    categoria = document.getElementById("pCategoria");
  }
  if (categoria) setSelectOptions(categoria, "Selecione a categoria", categorias, "id_categoria", (c) => c.nome_categoria);

  let lote = document.getElementById("pLote");
  if (!lote && categoria) {
    const col = document.createElement("div");
    col.className = "col-md-6";
    col.innerHTML = `
      <label class="field-label" for="pLote">Lote</label>
      <select class="form-select-app" id="pLote" required></select>`;
    categoria.closest(".col-md-6")?.after(col);
    lote = document.getElementById("pLote");
  }
  if (lote) setSelectOptions(lote, "Selecione o lote", lotes, "id_lote", (l) => l.codigo_lote || `Lote ${l.id_lote}`);
}

function recalcMargin() {
  const custo = Number(document.getElementById("pCusto")?.value || 0);
  const venda = Number(document.getElementById("pVenda")?.value || 0);
  const output = document.getElementById("marginOutput");
  if (!output) return;

  if (custo <= 0 || venda <= 0) {
    output.textContent = "—%";
    output.style.color = "";
    return;
  }

  const margin = ((venda - custo) / venda) * 100;
  output.textContent = `${margin.toFixed(1)}%`;
  output.style.color = margin >= 0 ? "var(--success)" : "var(--danger)";
}

function bindMarginCalculator() {
  document.getElementById("pCusto")?.addEventListener("input", recalcMargin);
  document.getElementById("pVenda")?.addEventListener("input", recalcMargin);
}

function bindProductForm() {
  const form = document.getElementById("productForm");
  if (!form || productFormBound) return;
  productFormBound = true;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const body = {
      id_fornecedor: Number(document.getElementById("pFornecedor").value),
      id_categoria: Number(document.getElementById("pCategoria").value),
      id_lote: Number(document.getElementById("pLote").value),
      nome: document.getElementById("pNome").value.trim(),
      descricao: document.getElementById("pDescricao").value.trim(),
      modelo: document.getElementById("pModelo").value.trim(),
      data_validade: document.getElementById("pValidade").value || null,
      codigo_produto: document.getElementById("pCodigo").value.trim(),
      cor: document.getElementById("pCor").value.trim(),
    };

    try {
      await nomadeApi("/produtos", jsonRequest("POST", body));
      nomadeToast("Produto cadastrado com sucesso.");
      form.reset();
      recalcMargin();
      await renderProducts();
    } catch (error) {
      showError(error.message);
    }
  });
}

async function renderProducts() {
  try {
    const [produtos, fornecedores, categorias, lotes] = await Promise.all([
      nomadeApi("/produtos"),
      nomadeApi("/fornecedores"),
      nomadeApi("/categorias"),
      nomadeApi("/lotes"),
    ]);

    productCache = { fornecedores, categorias, lotes };
    const supplierById = Object.fromEntries(fornecedores.map((f) => [f.id_fornecedor, f.nome]));
    const lotById = Object.fromEntries(lotes.map((l) => [l.id_lote, l]));
    const tbody = document.querySelector("#catalogTable tbody");

    if (tbody) {
      tbody.innerHTML = produtos.map((produto) => {
        const lote = lotById[produto.id_lote];
        return `
          <tr>
            <td class="cell-strong">${escHtml(produto.nome)}</td>
            <td class="cell-muted">${escHtml(lote?.codigo_lote || "-")}</td>
            <td class="cell-muted">${escHtml(supplierById[produto.id_fornecedor] || "-")}</td>
            <td class="cell-muted">${escHtml(produto.data_validade || "-")}</td>
            <td class="cell-muted">${escHtml(produto.imagem || "-")}</td>
            <td>${rowActions(produto.id_produto, "/produtos")}</td>
          </tr>`;
      }).join("") || `<tr><td colspan="6" class="cell-muted text-center">Nenhum produto cadastrado.</td></tr>`;
    }

    ensureProductSelects(fornecedores, categorias, lotes);
    bindProductForm();
    bindDeleteButtons(document, renderProducts);
  } catch (error) {
    showError(error.message);
  }
}

if (nomadeInitInternalPage("produtos", "Buscar produto...")) {
  nomadeInitTableFilter("catalogFilter", "#catalogTable");
  bindMarginCalculator();
  renderProducts();
}
