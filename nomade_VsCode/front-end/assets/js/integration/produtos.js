/* NÔMADE — produtos.js: digitar novos ou escolher existentes. */

let productFormBound = false;
let productDeleteBound = false;
let productImageActionsBound = false;
let productImagePreviewUrl = null;
let productCache = { fornecedores: [], categorias: [], lotes: [] };

const cadastroTipos = {
  fornecedor: {
    input: "pFornecedor", datalist: "fornecedoresDisponiveis", hint: "pFornecedorHint",
    cache: "fornecedores", key: "id_fornecedor", nome: "nome", fieldNovo: "nome_fornecedor",
    registros: "fornecedorRecords", endpoint: "/fornecedores", label: "fornecedor",
  },
  categoria: {
    input: "pCategoria", datalist: "categoriasDisponiveis", hint: "pCategoriaHint",
    cache: "categorias", key: "id_categoria", nome: "nome_categoria", fieldNovo: "nome_categoria",
    registros: "categoriaRecords", endpoint: "/categorias", label: "categoria",
  },
  lote: {
    input: "pLote", datalist: "lotesDisponiveis", hint: "pLoteHint",
    cache: "lotes", key: "id_lote", nome: "codigo_lote", fieldNovo: "codigo_lote",
    registros: "loteRecords", endpoint: "/lotes", label: "lote",
  },
};

function normalizarNome(texto) {
  return String(texto ?? "").normalize("NFKC").trim().replace(/\s+/g, " ").toLocaleLowerCase("pt-BR");
}

function nomeRegistro(tipo, item) {
  const info = cadastroTipos[tipo];
  return String(item[info.nome] || (tipo === "lote" ? `Lote #${item[info.key]}` : ""));
}

function registroExistente(tipo, texto) {
  const info = cadastroTipos[tipo];
  const nome = normalizarNome(texto);
  if (!nome) return null;
  return productCache[info.cache].find(
    (registro) => normalizarNome(nomeRegistro(tipo, registro)) === nome,
  ) || null;
}

function preencherCadastro(tipo) {
  const info = cadastroTipos[tipo];
  const input = document.getElementById(info.input);
  const datalist = document.getElementById(info.datalist);
  const tbody = document.getElementById(info.registros);
  if (!input || !datalist || !tbody) return;

  const valores = productCache[info.cache];
  // datalist deixa digitar livremente E selecionar uma sugestão existente.
  datalist.innerHTML = valores.map((item) =>
    `<option value="${escHtml(nomeRegistro(tipo, item))}"></option>`,
  ).join("");
  tbody.innerHTML = valores.length ? valores.map((item) => `
    <tr>
      <td class="cell-strong">${escHtml(nomeRegistro(tipo, item))}</td>
      <td><button type="button" class="btn-ghost btn-cadastro-delete"
        data-tipo="${tipo}" data-id="${Number(item[info.key])}">Excluir</button></td>
    </tr>`).join("") :
    `<tr><td colspan="2" class="cell-muted text-center">Nenhum ${info.label} cadastrado.</td></tr>`;
  atualizarDicaCadastro(tipo);
}

function atualizarDicaCadastro(tipo) {
  const info = cadastroTipos[tipo];
  const texto = document.getElementById(info.input)?.value.trim() || "";
  const hint = document.getElementById(info.hint);
  if (!hint) return;
  const existe = registroExistente(tipo, texto);
  hint.textContent = !texto
    ? "Digite para criar ou selecione na lista de sugestões."
    : existe
      ? "Cadastro existente: será reutilizado, sem criar outro."
      : "Novo cadastro: será criado automaticamente ao salvar o produto.";

  if (tipo === "lote") {
    const quantidade = document.getElementById("pQuantidade");
    if (quantidade) {
      // Uma quantidade já pertence ao lote existente, não deve ser sobrescrita.
      quantidade.disabled = Boolean(existe);
    }
  }
}

function obterRelacionamento(tipo) {
  const info = cadastroTipos[tipo];
  const nome = document.getElementById(info.input)?.value.trim() || "";
  if (!nome) throw new Error(`Informe ${info.label}.`);
  const encontrado = registroExistente(tipo, nome);
  return encontrado
    ? { [info.key]: encontrado[info.key] }
    : { [info.fieldNovo]: nome };
}

function validarArquivoImagem(arquivo) {
  if (!arquivo) return;
  const tipos = ["image/jpeg", "image/png", "image/webp"];
  if (!tipos.includes(arquivo.type)) throw new Error("Escolha uma imagem JPG, PNG ou WebP.");
  if (arquivo.size > 5 * 1024 * 1024) throw new Error("A imagem deve ter no máximo 5 MB.");
}

function limparPreviewImagem() {
  if (productImagePreviewUrl) URL.revokeObjectURL(productImagePreviewUrl);
  productImagePreviewUrl = null;
  const imagem = document.getElementById("pImagemPreview");
  const prompt = document.getElementById("productImagePrompt");
  const remover = document.getElementById("removerPreviewImagem");
  if (imagem) { imagem.hidden = true; imagem.removeAttribute("src"); }
  if (prompt) prompt.hidden = false;
  if (remover) remover.hidden = true;
}

function atualizarPreviewImagem() {
  limparPreviewImagem();
  const campo = document.getElementById("pImagem");
  const arquivo = campo?.files?.[0];
  if (!arquivo) return;
  try {
    validarArquivoImagem(arquivo);
    productImagePreviewUrl = URL.createObjectURL(arquivo);
    document.getElementById("pImagemPreview").src = productImagePreviewUrl;
    document.getElementById("pImagemPreview").hidden = false;
    document.getElementById("productImagePrompt").hidden = true;
    document.getElementById("removerPreviewImagem").hidden = false;
  } catch (erro) {
    campo.value = "";
    limparPreviewImagem();
    showError(erro.message);
  }
}

function bindProductImageInput() {
  const campo = document.getElementById("pImagem");
  const dropzone = document.getElementById("productImageDropzone");
  if (!campo || !dropzone) return;
  campo.addEventListener("change", atualizarPreviewImagem);
  document.getElementById("removerPreviewImagem")?.addEventListener("click", () => {
    campo.value = "";
    limparPreviewImagem();
  });
  ["dragenter", "dragover"].forEach((nome) => {
    dropzone.addEventListener(nome, (evento) => {
      evento.preventDefault();
      dropzone.classList.add("is-dragging");
    });
  });
  ["dragleave", "drop"].forEach((nome) => {
    dropzone.addEventListener(nome, (evento) => {
      evento.preventDefault();
      dropzone.classList.remove("is-dragging");
    });
  });
  dropzone.addEventListener("drop", (evento) => {
    const arquivo = evento.dataTransfer?.files?.[0];
    if (!arquivo) return;
    try {
      validarArquivoImagem(arquivo);
      const lista = new DataTransfer();
      lista.items.add(arquivo);
      campo.files = lista.files;
      atualizarPreviewImagem();
    } catch (erro) { showError(erro.message); }
  });
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

function bindProductForm() {
  const form = document.getElementById("productForm");
  if (!form || productFormBound) return;
  productFormBound = true;
  bindProductImageInput();

  ["fornecedor", "categoria", "lote"].forEach((tipo) => {
    const campo = document.getElementById(cadastroTipos[tipo].input);
    campo?.addEventListener("input", () => atualizarDicaCadastro(tipo));
    campo?.addEventListener("change", () => atualizarDicaCadastro(tipo));
  });
  document.getElementById("pCusto")?.addEventListener("input", recalcMargin);
  document.getElementById("pVenda")?.addEventListener("input", recalcMargin);
  form.addEventListener("reset", () => {
    // O evento reset dispara antes de os campos serem efetivamente limpos.
    queueMicrotask(() => {
      ["fornecedor", "categoria", "lote"].forEach(atualizarDicaCadastro);
      recalcMargin();
      limparPreviewImagem();
    });
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const button = form.querySelector('button[type="submit"]');
    if (button?.disabled) return;

    try {
      const body = {
        ...obterRelacionamento("fornecedor"),
        ...obterRelacionamento("categoria"),
        ...obterRelacionamento("lote"),
        quantidade_atual: Number(document.getElementById("pQuantidade").value || 0),
        nome: document.getElementById("pNome").value.trim(),
        descricao: document.getElementById("pDescricao").value.trim(),
        modelo: document.getElementById("pModelo").value.trim(),
        data_validade: document.getElementById("pValidade").value || null,
        codigo_produto: document.getElementById("pCodigo").value.trim(),
        cor: document.getElementById("pCor").value.trim(),
      };
      const dados = new FormData();
      Object.entries(body).forEach(([chave, valor]) => {
        if (valor !== null && valor !== undefined) dados.append(chave, String(valor));
      });
      const arquivo = document.getElementById("pImagem")?.files?.[0];
      if (arquivo) {
        validarArquivoImagem(arquivo);
        dados.append("imagem", arquivo);
      }
      if (button) button.disabled = true;
      // Não defina Content-Type manualmente; o navegador cria o boundary multipart.
      await nomadeApi("/produtos", { method: "POST", body: dados });
      nomadeToast("Produto e novos cadastros salvos com sucesso.");
      form.reset();
      await renderProducts();
    } catch (error) {
      showError(error.message);
    } finally {
      if (button) button.disabled = false;
    }
  });
}

function bindCadastroDelete() {
  const panel = document.getElementById("cadastrosPanel");
  if (!panel || productDeleteBound) return;
  productDeleteBound = true;
  panel.addEventListener("click", async (evento) => {
    const button = evento.target.closest(".btn-cadastro-delete");
    if (!button || !panel.contains(button)) return;
    const info = cadastroTipos[button.dataset.tipo];
    if (!info || !/^\d+$/.test(button.dataset.id)) return;
    if (!confirm(`Deseja excluir este ${info.label}? Se estiver vinculado a um produto, a exclusão será impedida.`)) return;
    button.disabled = true;
    try {
      await nomadeApi(`${info.endpoint}/${button.dataset.id}`, { method: "DELETE" });
      const input = document.getElementById(info.input);
      const excluido = productCache[info.cache].find(
        (item) => String(item[info.key]) === button.dataset.id,
      );
      if (input && excluido && normalizarNome(input.value) === normalizarNome(nomeRegistro(button.dataset.tipo, excluido))) {
        input.value = "";
      }
      nomadeToast(`${info.label[0].toUpperCase()}${info.label.slice(1)} excluído com sucesso.`);
      await renderProducts();
    } catch (erro) {
      showError(erro.message);
    } finally {
      button.disabled = false;
    }
  });
}

// Trocar/remover imagem de um produto existente sem mudar os outros campos.
function bindCatalogImageActions() {
  const tabela = document.getElementById("catalogTable");
  const seletor = document.getElementById("trocarImagemArquivo");
  if (!tabela || !seletor || productImageActionsBound) return;
  productImageActionsBound = true;
  let idProdutoParaTroca = null;

  tabela.addEventListener("click", async (evento) => {
    const trocar = evento.target.closest(".btn-trocar-imagem");
    if (trocar) {
      idProdutoParaTroca = trocar.dataset.id;
      seletor.value = "";
      seletor.click();
      return;
    }
    const remover = evento.target.closest(".btn-remover-imagem");
    if (!remover) return;
    if (!confirm("Deseja remover a imagem deste produto?")) return;
    remover.disabled = true;
    try {
      await nomadeApi(`/produtos/${remover.dataset.id}/imagem`, { method: "DELETE" });
      nomadeToast("Imagem removida com sucesso.");
      await renderProducts();
    } catch (erro) { showError(erro.message); }
    finally { remover.disabled = false; }
  });

  seletor.addEventListener("change", async () => {
    const arquivo = seletor.files?.[0];
    if (!arquivo || !idProdutoParaTroca) return;
    try {
      validarArquivoImagem(arquivo);
      const formData = new FormData();
      formData.append("imagem", arquivo);
      await nomadeApi(`/produtos/${idProdutoParaTroca}/imagem`, { method: "PUT", body: formData });
      nomadeToast("Imagem atualizada com sucesso.");
      await renderProducts();
    } catch (erro) { showError(erro.message); }
    finally { seletor.value = ""; idProdutoParaTroca = null; }
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
        const imagemUrl = nomadeImagemUrl(produto.imagem);
        const id = Number(produto.id_produto);
        return `
          <tr>
            <td class="cell-strong">${escHtml(produto.nome)}</td>
            <td class="cell-muted">${escHtml(lote?.codigo_lote || "-")}</td>
            <td class="cell-muted">${escHtml(supplierById[produto.id_fornecedor] || "-")}</td>
            <td class="cell-muted">${escHtml(produto.data_validade || "-")}</td>
            <td>${imagemUrl
              ? `<a href="${imagemUrl}" target="_blank" rel="noopener noreferrer" title="Ampliar imagem">
                   <img class="catalog-product-image" src="${imagemUrl}" alt="Imagem de ${escHtml(produto.nome)}" loading="lazy" />
                 </a>`
              : `<span class="cell-muted">Sem imagem</span>`}</td>
            <td>
              <span class="product-image-actions">
                <button type="button" class="btn-ghost btn-trocar-imagem" data-id="${id}">${imagemUrl ? "Trocar foto" : "Adicionar foto"}</button>
                ${imagemUrl ? `<button type="button" class="btn-ghost btn-remover-imagem" data-id="${id}">Remover foto</button>` : ""}
                ${rowActions(id, "/produtos")}
              </span>
            </td>
          </tr>`;
      }).join("") ||
      `<tr><td colspan="6" class="cell-muted text-center">Nenhum produto cadastrado.</td></tr>`;
    }
    document.getElementById("catalogFilter")?.dispatchEvent(new Event("input"));

    ["fornecedor", "categoria", "lote"].forEach(preencherCadastro);
    bindProductForm();
    bindCadastroDelete();
    bindCatalogImageActions();
    bindDeleteButtons(document, renderProducts);
  } catch (erro) {
    showError(erro.message);
  }
}

if (nomadeInitInternalPage("produtos", "Buscar produto...")) {
  nomadeInitTableFilter("catalogFilter", "#catalogTable");
  renderProducts();
  nomadeLiveSync(renderProducts);
}