/* NÔMADE — relatorios.js */

const dados = await nomadeApi("/relatorios/estoque");

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

  grid.innerHTML = charts.map((chart, index) => `
    <div class="col-lg-6">
      <div class="panel h-100">
        <div class="panel-header">
          <div class="panel-title">${escHtml(chart.ano)}</div>
          <span class="badge-app badge-neutral">${escHtml(chart.mes)}</span>
        </div>
        <div class="bar-chart" id="rchart-${index}" style="height:160px"></div>
        <div class="panel mt-3" style="background:var(--panel-2);padding:12px">
          <div class="field-label mb-1">Descrição sobre o período</div>
          <p class="small text-muted m-0">${escHtml(chart.desc)}</p>
        </div>
      </div>
    </div>`).join("");

  charts.forEach((chart, index) => {
    nomadeRenderBarChart(`rchart-${index}`, chart.values.map((value, i) => ({ label: `M${i + 1}`, value })));
  });
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
      desc: document.getElementById("cDescricao").value.trim() || "Sem descrição informada.",
      values: [vendas * 0.6, vendas * 0.8, vendas, vendas * 0.7, vendas * 0.9, vendas].map(Math.round),
    };

    const custom = getCustomReports();
    custom.unshift(report);
    saveCustomReports(custom);
    renderReports();

    bootstrap.Modal.getOrCreateInstance(document.getElementById("chartModal")).hide();
    nomadeToast("Gráfico criado com sucesso.");
    form.reset();
  });
}

if (nomadeInitInternalPage("relatorios", "Pesquisar relatórios...")) {
  renderReports();
  bindReportForm();
}
