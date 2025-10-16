// 🔗 API de meteorologia (exemplo)
const METEOROLOGIA_API = "https://mocate2ds.shardweb.app/meteorologia/5";
const container = document.getElementById("weatherContainer");

// Função para formatar valores com fallback
function formatarValor(valor, unidade = "", fallback = "--") {
  if (valor === null || valor === undefined || valor === "") return fallback;
  return `${valor}${unidade}`;
}

// Função para converter direção do vento em texto
function direcaoVento(graus) {
  if (graus === null || graus === undefined) return "--";
  const direcoes = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const indice = Math.round(((graus % 360) / 45)) % 8;
  return `${graus}° (${direcoes[indice]})`;
}

// Função principal
async function carregarMeteorologia() {
  container.innerHTML = `<p class="loading">⏳ Carregando dados meteorológicos...</p>`;

  try {
    const response = await fetch(METEOROLOGIA_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();

    if (!data.result || data.result.length === 0) {
      container.innerHTML = `<p class="no-data">Nenhum dado meteorológico disponível no momento.</p>`;
      return;
    }

    container.innerHTML = "";

    // Cada elemento de "result" é uma lista de registros de uma estação
    data.result.forEach((registros) => {
      if (!Array.isArray(registros) || registros.length === 0) return;

      // Pega o último registro (mais recente)
      const ultimo = registros[registros.length - 1];

      const estacao = ultimo.mareograph || "Estação desconhecida";
      const dataHora = new Date(ultimo.datetime_ISO).toLocaleString("pt-BR");
      const temperatura = formatarValor(ultimo.temperature_celsius, "°C");
      const umidade = formatarValor(ultimo.humity_percent, "%");
      const pressao = formatarValor(ultimo.atmospheric_pressure_hPa, " hPa");
      const ventoVel = formatarValor(ultimo["wind_speed_m/s"], " m/s");
      const ventoDir = direcaoVento(ultimo.wind_direction_degrees);
      const chuva = formatarValor(ultimo.precipitation_mm, " mm");

      // Cria o card
      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>📍 ${estacao}</h3>
        <p><strong>🕓 Última leitura:</strong> ${dataHora}</p>
        <p><strong>🌡 Temperatura:</strong> ${temperatura}</p>
        <p><strong>💧 Umidade:</strong> ${umidade}</p>
        <p><strong>🌬 Vento:</strong> ${ventoVel} ${ventoDir}</p>
        <p><strong>🌧 Precipitação:</strong> ${chuva}</p>
        <p><strong>🔵 Pressão atmosférica:</strong> ${pressao}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar dados meteorológicos:", error);
    container.innerHTML = `
      <p class="erro">⚠️ Erro ao acessar os dados meteorológicos. Tente novamente mais tarde.</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", carregarMeteorologia);
