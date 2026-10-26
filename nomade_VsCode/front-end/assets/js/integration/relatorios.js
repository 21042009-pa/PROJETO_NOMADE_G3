/* NÔMADE — relatorios.js */

const REPORT_STORAGE_KEY = "nomade_relatorios_custom";
const reportSeedCharts = [
  {
    ano: 2024,
    mes: "Anual",
    desc: "Crescimento constante ao longo do ano, com pico em novembro.",
    values: [12, 34, 22, 20, 30, 41],
  },
  {
    ano: 2025,
    mes: "Anual",
    desc: "Expansão da linha de sneakers colaborativas.",
    values: [15, 38, 24, 23, 33, 45],
  },
  {
    ano: 2027,
    mes: "Projeção",
    desc: "Meta conservadora para o novo centro de distribuição.",
    values: [8, 6, 9, 7, 10, 34],
  },
  {
    ano: 2028,
    mes: "Projeção",
    desc: "Cenário otimista com abertura de 2 lojas físicas.",
    values: [10, 8, 12, 9, 13, 40],
  },
];

function getCustomReports() {
  try {
    return JSON.parse(localStorage.getItem(REPORT_STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveCustomReports(reports) {
  localStorage.setItem(REPORT_STORAGE_KEY, JSON.stringify(reports));
}

function allReports() {
  return [...getCustomReports(), ...reportSeedCharts];
}

function renderReports() {
  const charts = allReports();
  const grid = document.getElementById("chartGrid");
  if (!grid) return;

  grid.innerHTML = charts
    .map(
      (chart, index) => `
    <div class="col-lg-6">
      <section class="panel h-100" aria-labelledby="report-title-${index}">
        <header class="panel-header">
          <h2 class="panel-title" id="report-title-${index}">${escHtml(chart.ano)}</h2>
          <span class="badge-app badge-neutral">${escHtml(chart.mes)}</span>
        </header>
        <div class="bar-chart" id="rchart-${index}" style="height:160px"></div>
        <section class="panel mt-3" aria-labelledby="report-description-${index}" style="background:var(--panel-2);padding:12px">
          <h3 class="field-label mb-1 report-description-title" id="report-description-${index}">Descrição sobre o período</h3>
          <p class="small text-muted m-0">${escHtml(chart.desc)}</p>
        </section>
      </section>
    </div>`,
    )
    .join("");

  charts.forEach((chart, index) => {
    nomadeRenderBarChart(
      `rchart-${index}`,
      chart.values.map((value, i) => ({ label: `M${i + 1}`, value })),
    );
  });
}

// Diferente dos gráficos personalizados/ilustrativos, este bloco usa os
// lançamentos reais da API e recebe notificações assim que o estoque muda.
async function renderLiveInventoryReport() {
  try {
    const [movimentacoes, lotes] = await Promise.all([
      nomadeApi("/movimentacoes-estoque"),
      nomadeApi("/lotes"),
    ]);
    const entradas = movimentacoes.filter((mov) => mov.tipo === "Entrada");
    const saidas = movimentacoes.filter((mov) => mov.tipo === "Saída");
    const unidades = lotes.reduce((total, lote) => total + Number(lote.quantidade_atual || 0), 0);
    const resumo = document.getElementById("liveReportSummary");
    if (resumo) resumo.textContent = `Estoque atual: ${unidades} unidades · Entradas registradas: ${entradas.length} · Saídas registradas: ${saidas.length}`;

    const datas = [];
    for (let i = 6; i >= 0; i--) {
      const dia = new Date();
      dia.setHours(12, 0, 0, 0);
      dia.setDate(dia.getDate() - i);
      const chave = [dia.getFullYear(), String(dia.getMonth() + 1).padStart(2, "0"), String(dia.getDate()).padStart(2, "0")].join("-");
      datas.push({ chave, label: `${dia.getDate()}/${dia.getMonth() + 1}` });
    }
    const volumes = new Map();
    for (const movimento of movimentacoes) {
      const dia = String(movimento.data_movimentacao || "").slice(0, 10);
      volumes.set(dia, (volumes.get(dia) || 0) + 1);
    }
    nomadeRenderBarChart("liveMovementChart", datas.map(({ chave, label }) => ({
      label, value: volumes.get(chave) || 0,
    })));
  } catch (erro) {
    const resumo = document.getElementById("liveReportSummary");
    if (resumo) resumo.textContent = `Não foi possível carregar dados reais: ${erro.message}`;
  }
}

function bindReportForm() {
  const form = document.getElementById("chartForm");
  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const vendas = Number(document.getElementById("cVendas").value || 0);
    const report = {
      ano: document.getElementById("cAno").value,
      mes: document.getElementById("cMes").value,
      desc:
        document.getElementById("cDescricao").value.trim() ||
        "Sem descrição informada.",
      values: [
        vendas * 0.6,
        vendas * 0.8,
        vendas,
        vendas * 0.7,
        vendas * 0.9,
        vendas,
      ].map(Math.round),
    };

    const custom = getCustomReports();
    custom.unshift(report);
    saveCustomReports(custom);
    renderReports();

    bootstrap.Modal.getOrCreateInstance(
      document.getElementById("chartModal"),
    ).hide();
    nomadeToast("Gráfico criado com sucesso.");
    form.reset();
  });
}

if (nomadeInitInternalPage("relatorios", "Pesquisar relatórios...")) {
  renderReports();
  bindReportForm();
  renderLiveInventoryReport();
  nomadeLiveSync(renderLiveInventoryReport);
}