/* NÔMADE — estoque.js */

async function renderStock() {
  try {
    const [produtos, fornecedores, lotes] = await Promise.all([
      nomadeApi("/produtos"),
      nomadeApi("/fornecedores"),
      nomadeApi("/lotes"),
    ]);

    const supplierById = Object.fromEntries(fornecedores.map((f) => [f.id_fornecedor, f.nome]));
    const lotById = Object.fromEntries(lotes.map((l) => [l.id_lote, l]));
    const tbody = document.querySelector("#stockTable tbody");

    if (tbody) {
      tbody.innerHTML = produtos.map((produto) => {
        const lote = lotById[produto.id_lote];
        const qtd = Number(lote?.quantidade_atual || 0);
        const badge = qtd <= 5 ? "badge-danger" : qtd <= 10 ? "badge-warning" : "badge-success";

        return `
          <tr>
            <td class="cell-strong">${escHtml(produto.nome)}</td>
            <td class="cell-muted">${escHtml(produto.codigo_produto || "-")}</td>
            <td class="cell-muted">${escHtml(supplierById[produto.id_fornecedor] || "-")}</td>
            <td class="cell-muted">${escHtml(lote?.codigo_lote || "-")}</td>
            <td class="cell-muted">${escHtml(produto.modelo || "-")}</td>
            <td class="cell-muted">${escHtml(produto.cor || "-")}</td>
            <td><span class="badge-app ${badge}">${qtd} un.</span></td>
          </tr>`;
      }).join("") || `<tr><td colspan="7" class="cell-muted text-center">Nenhum produto cadastrado.</td></tr>`;
    }

    const quantities = produtos.map((p) => Number(lotById[p.id_lote]?.quantidade_atual || 0));
    const totalStock = quantities.reduce((sum, qtd) => sum + qtd, 0);
    const lowStock = quantities.filter((qtd) => qtd > 5 && qtd <= 10).length;
    const criticalStock = quantities.filter((qtd) => qtd <= 5).length;

    const totalProductsEl = document.getElementById("totalProducts");
    const totalStockEl = document.getElementById("totalStock");
    const lowStockEl = document.getElementById("lowStock");
    const criticalStockEl = document.getElementById("criticalStock");
    const countEl = document.getElementById("stockCount");

    if (totalProductsEl) totalProductsEl.textContent = produtos.length;
    if (totalStockEl) totalStockEl.textContent = totalStock;
    if (lowStockEl) lowStockEl.textContent = `${lowStock} itens`;
    if (criticalStockEl) criticalStockEl.textContent = `${criticalStock} itens`;
    if (countEl) countEl.textContent = `Mostrando ${produtos.length} produto${produtos.length === 1 ? "" : "s"}`;
  } catch (error) {
    showError(error.message);
  }
}

if (nomadeInitInternalPage("estoque", "Pesquisar estoque global...")) {
  nomadeInitTableFilter("filterInput", "#stockTable");
  renderStock();
}
