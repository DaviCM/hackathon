const NOTICIA_API = "https://mocate2ds.shardweb.app/noticias/5";
const container = document.getElementById("newsContainer");

async function carregarNoticiasPrincipais() {
  try {
    const response = await fetch(NOTICIA_API);
    if (!response.ok) throw new Error(`Erro HTTP: ${response.status}`);

    const data = await response.json();
    const noticias = data.result;

    if (!noticias || noticias.length === 0) {
      container.innerHTML = "<p>Nenhuma notícia encontrada.</p>";
      return;
    }

    container.innerHTML = ""; // limpa antes

    noticias.slice(0, 3).forEach((noticia, index) => {
      const card = document.createElement("div");
      card.classList.add("card");

      const titulo = noticia.title || "Sem título";
      const descricao = noticia.description || "Sem descrição disponível.";
      const imagem = noticia.image || "imagens/placeholder.png";
      const link = noticia.url || "#";

      card.innerHTML = `
        <img src="${imagem}" alt="Imagem da notícia ${index + 1}">
        <h3>${titulo}</h3>
        <p>${descricao}</p>
        <a href="${link}" target="_blank">Ler mais</a>
      `;

      container.appendChild(card);
    });

  } catch (erro) {
    console.error("Erro ao carregar notícias:", erro);
    container.innerHTML = `<p style="color:red;">⚠️ Não foi possível carregar as notícias.</p>`;
  }
}

document.addEventListener("DOMContentLoaded", carregarNoticiasPrincipais);
