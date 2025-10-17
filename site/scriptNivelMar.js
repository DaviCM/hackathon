// 🔗 API do nível do mar
const NIVELMAR_API = "https://mocate2ds.shardweb.app/nivel_do_mar/5";
const container = document.getElementById("seaLevelContainer");

// 🔧 Cria barra de filtros acima do container
const filtros = document.createElement("div");
filtros.classList.add("filtros");

filtros.innerHTML = `
  <select id="localSelect">
    <option value="">Selecione o local</option>
  </select>
  <input type="date" id="dataInput">
  <input type="time" id="horaInput" step="300">
  <button id="filtrarBtn">Filtrar</button>
`;

container.parentElement.insertBefore(filtros, container);

let gruposGlobais = []; // armazenará os dados da API

async function carregarNivelMar() {
  try {
    const response = await fetch(NIVELMAR_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    gruposGlobais = data.result || [];

    if (!gruposGlobais.length) {
      container.innerHTML = `<p>Nenhum dado disponível no momento.</p>`;
      return;
    }

    // Preenche o seletor de locais automaticamente
    const select = document.getElementById("localSelect");
    select.innerHTML = `<option value="">Selecione o local</option>`;
    gruposGlobais.forEach((grupo) => {
      if (grupo.length > 0) {
        const nome = grupo[0].mareograph;
        const option = document.createElement("option");
        option.value = nome;
        option.textContent = nome;
        select.appendChild(option);
      }
    });

    // Define o evento de clique no botão "Filtrar"
    document.getElementById("filtrarBtn").onclick = () => {
      const local = select.value;
      const dataFiltro = document.getElementById("dataInput").value;
      const horaFiltro = document.getElementById("horaInput").value;
      mostrarDadosFiltrados(local, dataFiltro, horaFiltro);
    };
  } catch (error) {
    console.error("Erro ao carregar dados do nível do mar:", error);
    container.innerHTML = `<p style="color:red;">⚠️ Erro ao acessar os dados do nível do mar.</p>`;
  }
}

function mostrarDadosFiltrados(local, dataFiltro, horaFiltro) {
  container.innerHTML = "";

  if (!local) {
    container.innerHTML = `<p>Selecione um local.</p>`;
    return;
  }

  const grupo = gruposGlobais.find(
    (g) => g.length > 0 && g[0].mareograph === local
  );

  if (!grupo) {
    container.innerHTML = `<p>Local não encontrado.</p>`;
    return;
  }

  // Caso o usuário não escolha data/hora → últimos 5 registros
  if (!dataFiltro && !horaFiltro) {
    const ultimos5 = grupo.slice(-5);
    renderizarCards(ultimos5);
    return;
  }

  // Converter data/hora para um Date
  const alvo = new Date(`${dataFiltro}T${horaFiltro || "00:00"}`);

  // Calcular a diferença de tempo entre cada registro e o alvo
  const registrosOrdenados = grupo
    .map((p) => ({
      ...p,
      diferenca: Math.abs(new Date(p.datetime_ISO) - alvo),
    }))
    .sort((a, b) => a.diferenca - b.diferenca);

  // Pegar os 5 mais próximos
  const proximos5 = registrosOrdenados.slice(0, 5);

  if (proximos5.length === 0) {
    container.innerHTML = `<p>Nenhum dado encontrado.</p>`;
    return;
  }

  renderizarCards(proximos5, true);
}

// 🧱 Função para criar os cards na tela
function renderizarCards(registros, isProximos = false) {
  container.innerHTML = "";

  if (isProximos) {
    const aviso = document.createElement("p");
    aviso.style.color = "#0078d7";
    aviso.style.textAlign = "center";
    aviso.innerHTML =
      "<h3>⚠️ Nenhum registro exato encontrado. Mostrando os 5 horários mais próximos.<\h3><br>";
    container.appendChild(aviso);
  }

  registros.forEach((ponto) => {
    const card = document.createElement("div");
    card.classList.add("card");

    const radar = ponto.radar ?? "N/D";
    const encoder = ponto.encoder ?? "N/D";
    const previsao = ponto.previsao ?? "N/D";
    const horario = ponto.datetime_ISO
      ? new Date(ponto.datetime_ISO).toLocaleString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
          day: "2-digit",
          month: "2-digit",
        })
      : "Sem horário";

    card.innerHTML = `
      <br><h3>${ponto.mareograph}</h3>
      <p><strong>Radar:</strong> ${radar} m</p>
      <p><strong>Encoder:</strong> ${encoder}</p>
      <p><strong>Previsão:</strong> ${previsao} m</p>
      <p><strong>Horário:</strong> ${horario}</p>
    `;

    container.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", carregarNivelMar);
