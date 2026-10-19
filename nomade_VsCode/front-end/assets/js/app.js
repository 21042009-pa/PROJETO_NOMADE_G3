/* =========================================================
   NÔMADE — app.js

   Funções genéricas utilizadas em várias páginas:
   - Toasts
   - Steppers
   - Filtros de tabela
   - Abas
   - Gráficos
   - Formulários de demonstração
   ========================================================= */


// ==========================================================
// TOAST / NOTIFICAÇÕES
// ==========================================================

function nomadeToast(message, tone = "success") {
  let toast = document.getElementById("nomadeToast");

  // Cria o toast caso ainda não exista
  if (!toast) {
    toast = document.createElement("div");

    toast.id = "nomadeToast";
    toast.className = "toast-app";

    document.body.appendChild(toast);
  }


  // Define o ícone de acordo com o tipo da mensagem
  const icon =
    tone === "success"
      ? NOMADE_ICONS.check
      : NOMADE_ICONS.spark;


  toast.innerHTML = `
    ${icon}
    <span>${message}</span>
  `;


  // Exibe o toast
  toast.classList.add("show");


  // Reinicia o tempo caso outro toast já estivesse aberto
  clearTimeout(toast._t);


  toast._t = setTimeout(() => {
    toast.classList.remove("show");
  }, 2600);
}


// ==========================================================
// STEPPER DE QUANTIDADE
// Entrada / Saída de mercadoria
// ==========================================================

function nomadeInitSteppers() {
  const steppers =
    document.querySelectorAll("[data-stepper]");


  steppers.forEach((wrapper) => {
    const input =
      wrapper.querySelector("input");


    // Se não existir input, ignora
    if (!input) {
      return;
    }


    const min =
      parseInt(
        input.min || "0",
        10
      );


    const buttons =
      wrapper.querySelectorAll("button");


    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {

          let value =
            parseInt(
              input.value || "0",
              10
            );


          if (button.dataset.dir === "up") {
            value++;
          } else {
            value =
              Math.max(
                min,
                value - 1
              );
          }


          input.value = value;


          // Dispara evento para outros scripts
          input.dispatchEvent(
            new Event(
              "change",
              {
                bubbles: true,
              }
            )
          );
        }
      );
    });
  });
}


// ==========================================================
// FILTRO DE TABELA
// ==========================================================

function nomadeInitTableFilter(
  inputId,
  tableSelector
) {

  const input =
    document.getElementById(
      inputId
    );


  const table =
    document.querySelector(
      tableSelector
    );


  if (
    !input ||
    !table
  ) {
    return;
  }


  input.addEventListener(
    "input",
    () => {

      const term =
        input.value
          .trim()
          .toLowerCase();


      const rows =
        table.querySelectorAll(
          "tbody tr"
        );


      rows.forEach((row) => {
        const text =
          row.textContent
            .toLowerCase();


        const found =
          text.includes(term);


        row.style.display =
          found
            ? ""
            : "none";
      });
    }
  );
}


// ==========================================================
// ABAS TIPO PILL
// ==========================================================

function nomadeInitPillTabs() {
  const groups =
    document.querySelectorAll(
      ".pill-tabs"
    );


  groups.forEach((group) => {
    const buttons =
      group.querySelectorAll(
        "button"
      );


    buttons.forEach((button) => {
      button.addEventListener(
        "click",
        () => {

          // Remove o active de todos
          buttons.forEach(
            (item) => {
              item.classList.remove(
                "active"
              );
            }
          );


          // Adiciona no selecionado
          button.classList.add(
            "active"
          );
        }
      );
    });
  });
}


// ==========================================================
// GRÁFICO DE BARRAS
// ==========================================================

function nomadeRenderBarChart(
  containerId,
  data
) {

  const container =
    document.getElementById(
      containerId
    );


  if (!container) {
    return;
  }


  // Caso não existam dados
  if (
    !Array.isArray(data) ||
    data.length === 0
  ) {

    container.innerHTML = "";
    return;
  }


  const max =
    Math.max(
      ...data.map(
        (item) =>
          Number(item.value) || 0
      )
    );


  const peakIndex =
    data.findIndex(
      (item) =>
        Number(item.value) === max
    );


  container.innerHTML =
    data
      .map(
        (item, index) => {

          const value =
            Number(item.value) || 0;


          const height =
            max > 0
              ? Math.max(
                6,
                (value / max) * 100
              )
              : 6;


          const peakClass =
            index === peakIndex
              ? " is-peak"
              : "";


          return `
            <div class="bar-col${peakClass}">

              <div
                class="bar"
                style="height: ${height}%"
              ></div>

              <div class="bar-label">
                ${item.label}
              </div>

            </div>
          `;
        }
      )
      .join("");
}


// ==========================================================
// GRÁFICO DONUT
// ==========================================================

function nomadeRenderDonut(
  wrapId,
  centerValue,
  centerLabel,
  segments
) {

  const wrapper =
    document.getElementById(
      wrapId
    );


  if (!wrapper) {
    return;
  }


  // Caso não existam segmentos
  if (
    !Array.isArray(segments) ||
    segments.length === 0
  ) {

    wrapper.innerHTML = "";
    return;
  }


  const total =
    segments.reduce(
      (sum, segment) =>
        sum +
        (Number(segment.value) || 0),
      0
    );


  // Evita divisão por zero
  if (total <= 0) {
    wrapper.innerHTML = `
      <div class="donut">

        <div class="donut-center">

          <div class="value">
            ${centerValue}
          </div>

          <div class="label">
            ${centerLabel}
          </div>

        </div>

      </div>
    `;

    return;
  }


  let accumulated = 0;


  const stops =
    segments
      .map((segment) => {

        const value =
          Number(
            segment.value
          ) || 0;


        const start =
          (accumulated / total) *
          360;


        accumulated += value;


        const end =
          (accumulated / total) *
          360;


        return `
          ${segment.color}
          ${start}deg
          ${end}deg
        `.trim();

      })
      .join(", ");


  wrapper.innerHTML = `
    <div
      class="donut"
      style="
        --donut-gradient:
        ${stops};
      "
    >

      <div class="donut-center">

        <div class="value">
          ${centerValue}
        </div>

        <div class="label">
          ${centerLabel}
        </div>

      </div>

    </div>
  `;
}


// ==========================================================
// FORMULÁRIO DE DEMONSTRAÇÃO
// ==========================================================

function nomadeBindDemoForm(
  formId,
  message
) {

  const form =
    document.getElementById(
      formId
    );


  if (!form) {
    return;
  }


  form.addEventListener(
    "submit",
    (event) => {

      event.preventDefault();


      // Validação padrão do HTML
      if (!form.checkValidity()) {

        form.reportValidity();
        return;

      }


      nomadeToast(
        message ||
        "Salvo com sucesso."
      );


      form.reset();
    }
  );
}


// ==========================================================
// INICIALIZAÇÃO
// ==========================================================

document.addEventListener(
  "DOMContentLoaded",
  () => {

    nomadeInitSteppers();

    nomadeInitPillTabs();

  }
);