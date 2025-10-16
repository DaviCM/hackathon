const METEOROLOGIA_API = "https://mocate2ds.shardweb.app/meteorologia/5";
const container = document.getElementById("weatherContainer");

function formatarValor(valor, unidade = "", fallback = "--") {
  if (valor === null || valor === undefined || valor === "") return fallback;
  return `${valor}${unidade}`;
}

function direcaoVento(graus) {
  if (graus === null || graus === undefined) return "--";
  const direcoes = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"];
  const indice = Math.round(((graus % 360) / 45)) % 8;
  return `${graus}° (${direcoes[indice]})`;
}

// 🔔 Função para gerar alertas baseados nos valores
function gerarAlertas(dados) {
  let alertas = "";

  // 🌬️ Vento
  if (dados["wind_speed_m/s"] >= 32.8) {
    alertas += `<p style="color:red; font-weight:bold;">🌪️ FURACÃO/TORNADO - RISCO EXTREMO!</p>`;
  } else if (dados["wind_speed_m/s"] >= 25) {
    alertas += `<p style="color:orange; font-weight:bold;">💨 VENTANIA FORTE!</p>`;
  } else if (dados["wind_speed_m/s"] >= 17.2) {
    alertas += `<p style="color:gold; font-weight:bold;">⚠️ VENTANIA!</p>`;
  } else if (dados["wind_speed_m/s"] >= 14) {
    alertas += `<p style="color:yellow; font-weight:bold;">🌬️ VENTO ALTO!</p>`;
  }

  // 🌧️ Precipitação
  if (dados.precipitation_mm >= 50) {
    alertas += `<p style="color:red; font-weight:bold;">☔ CHUVA MUITO FORTE - RISCO DE ALAGAMENTO!</p>`;
  } else if (dados.precipitation_mm >= 25) {
    alertas += `<p style="color:orange; font-weight:bold;">🌧️ CHUVA FORTE - POSSÍVEL ALAGAMENTO!</p>`;
  } else if (dados.precipitation_mm >= 10) {
    alertas += `<p style="color:gold; font-weight:bold;">🌦️ CHUVA MODERADA.</p>`;
  } else if (dados.precipitation_mm > 0) {
    alertas += `<p style="color:green; font-weight:bold;">🌤️ CHUVA FRACA.</p>`;
  }

  // 💧 Umidade
  if (dados.humity_percent >= 60) {
    alertas += `<p style="color:blue; font-weight:bold;">💧 Umidade alta.</p>`;
  } else if (dados.humity_percent >= 40 && dados.humity_percent <= 59) {
    alertas += `<p style="color:green; font-weight:bold;">✅ Umidade ideal.</p>`;
  } else if (dados.humity_percent >= 20 && dados.humity_percent < 40) {
    alertas += `<p style="color:orange; font-weight:bold;">⚠️ Umidade baixa.</p>`;
  } else if (dados.humity_percent < 20) {
    alertas += `<p style="color:red; font-weight:bold;">🚨 Umidade muito baixa!</p>`;
  }

  // 🌡️ Temperatura
  if (dados.temperature_celsius >= 35) {
    alertas += `<p style="color:red; font-weight:bold;">🔥 TEMPERATURA MUITO ALTA!</p>`;
  } else if (dados.temperature_celsius >= 30) {
    alertas += `<p style="color:orange; font-weight:bold;">🌞 TEMPERATURA ALTA.</p>`;
  } else if (dados.temperature_celsius >= 20) {
    alertas += `<p style="color:green; font-weight:bold;">🌤️ Temperatura agradável.</p>`;
  } else if (dados.temperature_celsius >= 15) {
    alertas += `<p style="color:lightblue; font-weight:bold;">🌥️ Temperatura amena.</p>`;
  } else if (dados.temperature_celsius >= 10) {
    alertas += `<p style="color:blue; font-weight:bold;">❄️ Frio.</p>`;
  } else {
    alertas += `<p style="color:darkblue; font-weight:bold;">🥶 Muito frio!</p>`;
  }

  return alertas;
}

async function carregarMeteorologia() {
  container.innerHTML = `<p class="loading">⏳ Carregando dados meteorológicos...</p>`;

  try {
    const response = await fetch(METEOROLOGIA_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const resultados = data.result;

    if (!resultados || resultados.length === 0) {
      container.innerHTML = `<p class="no-data">Nenhum dado meteorológico disponível no momento.</p>`;
      return;
    }

    container.innerHTML = "";

    resultados.forEach((registros) => {
      if (!Array.isArray(registros) || registros.length === 0) return;

      const ultimo = registros[registros.length - 1];
      const estacao = ultimo.mareograph || "Estação desconhecida";
      const dataHora = new Date(ultimo.datetime_ISO).toLocaleString("pt-BR");

      const temperatura = formatarValor(ultimo.temperature_celsius, "°C");
      const umidade = formatarValor(ultimo.humity_percent, "%");
      const pressao = formatarValor(ultimo.atmospheric_pressure_hPa, " hPa");
      const ventoVel = formatarValor(ultimo["wind_speed_m/s"], " m/s");
      const ventoDir = direcaoVento(ultimo.wind_direction_degrees);
      const chuva = formatarValor(ultimo.precipitation_mm, " mm");

      // Gera alertas de risco
      const alertas = gerarAlertas(ultimo);

      const card = document.createElement("div");
      card.classList.add("card");
      card.innerHTML = `
        <h3>📍 ${estacao}</h3>
        <p><strong>🕓 Última leitura:</strong> ${dataHora}</p>
        <p><strong>🌡 Temperatura:</strong> ${temperatura}</p>
        <p><strong>💧 Umidade:</strong> ${umidade}</p>
        <p><strong>🌬 Vento:</strong> ${ventoVel} ${ventoDir}</p>
        <p><strong>🌧 Precipitação:</strong> ${chuva}</p>
        <p><strong>🔵 Pressão:</strong> ${pressao}</p>
        <div class="alertas">${alertas}</div>
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
