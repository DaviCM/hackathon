// 🔗 Substitua pela sua API real de meteorologia:
const METEOROLOGIA_API = "https://mocate2ds.shardweb.app/meteorologia/5";
const container = document.getElementById("weatherContainer");

async function carregarMeteorologia() {
  try {
    const response = await fetch(METEOROLOGIA_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const resultados = data.result || data;

    if (!resultados || resultados.length === 0) {
      container.innerHTML = `<p>Nenhum dado meteorológico disponível no momento.</p>`;
      return;
    }

    container.innerHTML = "";

    resultados.forEach((cidade) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const local = cidade.local || cidade.city || "Local desconhecido";
      const temperatura = cidade.temperatura || cidade.temp || "--";
      const umidade = cidade.umidade || cidade.humidity || "--";
      const vento = cidade.vento || cidade.wind || "--";
      const condicao = cidade.condicao || cidade.condition || "Indisponível";

      card.innerHTML = `
        <h3>${local}</h3>
        <p><strong>Temperatura:</strong> ${temperatura}°C</p>
        <p><strong>Umidade:</strong> ${umidade}%</p>
        <p><strong>Vento:</strong> ${vento} km/h</p>
        <p><strong>Condição:</strong> ${condicao}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar dados meteorológicos:", error);
    container.innerHTML = `
      <p style="color:red;">⚠️ Erro ao acessar os dados meteorológicos.</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", carregarMeteorologia);
