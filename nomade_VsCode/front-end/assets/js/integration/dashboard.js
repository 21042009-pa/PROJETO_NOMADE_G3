/* NÔMADE — dashboard.js */

function dashboardDateLabel(value) {
  if (!value) return "—";
  const date = new Date(`${String(value).slice(0, 10)}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 5);
  return new Intl.DateTimeFormat("pt-BR", { weekday: "short" }).format(date).replace(".", "").toUpperCase();
}

function renderDashboardCharts(movimentacoes, produtos, lotes) {
  const grouped = new Map();
  movimentacoes.forEach((mov) => {
    const key = String(mov.data_movimentacao || "Sem data").slice(0, 10);
    grouped.set(key, (grouped.get(key) || 0) + 1);
  });

  const chartData = [...grouped.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-7)
    .map(([date, value]) => ({ label: dashboardDateLabel(date), value }));

  nomadeRenderBarChart("salesChart", chartData.length ? chartData : [{ label: "SEM DADOS", value: 0 }]);

  const lotById = Object.fromEntries(lotes.map((lote) => [lote.id_lote, lote]));
  const buckets = { high: 0, medium: 0, low: 0 };

  produtos.forEach((produto) => {
    const qtd = Number(lotById[produto.id_lote]?.quantidade_atual || 0);
    if (qtd > 10) buckets.high += 1;
    else if (qtd > 5) buckets.medium += 1;
    else buckets.low += 1;
  });

  nomadeRenderDonut("stockDonut", produtos.length, "Produtos", [
    { value: buckets.high, color: "var(--chart-high)" },
    { value: buckets.medium, color: "var(--chart-medium)" },
    { value: buckets.low, color: "var(--chart-low)" },
  ]);

  const total = Math.max(produtos.length, 1);
  const pcts = [buckets.high, buckets.medium, buckets.low].map((value) => `${Math.round((value / total) * 100)}%`);
  document.querySelectorAll(".legend-row .pct").forEach((el, index) => {
    if (pcts[index] != null) el.textContent = pcts[index];
  });
}

async function renderDashboard() {
  try {
    const [produtos, lotes, movimentacoes] = await Promise.all([
      nomadeApi("/produtos"),
      nomadeApi("/lotes"),
      nomadeApi("/movimentacoes-estoque"),
    ]);

    const cards = document.querySelectorAll(".metric-card .metric-value");
    const totalStock = lotes.reduce((sum, lote) => sum + Number(lote.quantidade_atual || 0), 0);
    const entradas = movimentacoes.filter((mov) => mov.tipo === "Entrada").length;
    const saidas = movimentacoes.filter((mov) => mov.tipo === "Saída").length;

    if (cards[0]) cards[0].textContent = produtos.length;
    if (cards[1]) cards[1].textContent = totalStock;
    if (cards[2]) cards[2].textContent = entradas;
    if (cards[3]) cards[3].textContent = saidas;

    const tbody = document.querySelector(".table-app tbody");
    if (tbody) {
      tbody.innerHTML = produtos.slice(0, 8).map((produto) => `
        <tr>
          <td class="cell-strong">${escHtml(produto.nome)}</td>
          <td class="cell-muted">${escHtml(produto.codigo_produto || "-")}</td>
          <td class="cell-muted">${escHtml(produto.modelo || "-")}</td>
          <td><span class="badge-app badge-info">${escHtml(produto.cor || "Sem cor")}</span></td>
        </tr>`).join("") || `
        <tr><td colspan="4" class="cell-muted text-center">Nenhum produto cadastrado.</td></tr>`;
    }

    renderDashboardCharts(movimentacoes, produtos, lotes);
  } catch (error) {
    showError(error.message);
  }
}

if (nomadeInitInternalPage("dashboard", "Pesquisar estoque...")) {
  renderDashboard();
}
