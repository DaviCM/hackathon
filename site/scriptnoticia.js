const NOTICIA_API = "https://mocate2ds.shardweb.app/noticias/5";
const container = document.querySelector(".principal");

async function noticia_print() {
  try {
    const response = await fetch(NOTICIA_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const resultados = data.result;

    // Verifica se há resultados
    if (!resultados || resultados.length === 0) {
      container.innerHTML = `<p>Nenhuma notícia disponível no momento.</p>`;
      return;
    }

    // Limpa o container antes de inserir
    container.innerHTML = "";

    // Cria dinamicamente os cards de notícia
    resultados.slice(0, 3).forEach((noticia, index) => {
      const card = document.createElement("div");
      card.classList.add("box");

      // Garante que a imagem e o texto existam
      const titulo = noticia.title || "Sem título";
      const descricao = noticia.description || "Sem descrição disponível.";
      const imagem = noticia.urlToImage || "imagens/placeholder.png";
      const link = noticia.url || "#";

      card.innerHTML = `
        <img src="${imagem}" alt="Imagem da notícia ${index + 1}">
        <h2>${titulo}</h2>
        <p>${descricao}</p>
        <a href="${link}" target="_blank">Ler mais</a>
      `;

      container.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao consumir a API:", error);
    container.innerHTML = `
      <p style="color:red; text-align:center; font-weight:bold;">
        ⚠️ Erro ao carregar as notícias. Tente novamente mais tarde.
      </p>
    `;
  }
}

// Executa ao carregar a página
document.addEventListener("DOMContentLoaded", noticia_print);
