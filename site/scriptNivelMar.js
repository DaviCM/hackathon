// 🔗 Substitua por sua rota real de API:
const NIVELMAR_API = "https://mocate2ds.shardweb.app/nivel_do_mar/2";
const container = document.getElementById("seaLevelContainer");

async function carregarNivelMar() {
  try {
    const response = await fetch(NIVELMAR_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const resultados = data.result || data; // dependendo do formato da API

    if (!resultados || resultados.length === 0) {
      container.innerHTML = `<p>Nenhum dado disponível no momento.</p>`;
      return;
    }

    container.innerHTML = "";

    resultados.forEach((ponto) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const local = ponto.local || ponto.city || "Local desconhecido";
      const nivel = ponto.nivel_mar || ponto.sea_level || "N/D";
      const hora = ponto.horario || ponto.time || "Sem horário";
      const variacao = ponto.variacao || ponto.trend || "Estável";

      card.innerHTML = `
        <h3>${local}</h3>
        <p><strong>Nível:</strong> ${nivel} m</p>
        <p><strong>Horário:</strong> ${hora}</p>
        <p><strong>Variação:</strong> ${variacao}</p>
      `;

      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar dados do nível do mar:", error);
    container.innerHTML = `
      <p style="color:red;">⚠️ Erro ao acessar os dados do nível do mar.</p>
    `;
  }
}

document.addEventListener("DOMContentLoaded", carregarNivelMar);
