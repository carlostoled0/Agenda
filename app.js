
/* eslint-disable no-unused-vars */

const API_KEYS = [
  // Aqui você pode colar suas 55 chaves reais (omitidas por segurança neste código)
];

let currentKeyIndex = 0;

function getApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

function extrairUsernameOuIdDaURL(url) {
  const matchUsername = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/@([\w-]+)/i);
  if (matchUsername) return { tipo: 'username', valor: matchUsername[1] };

  const matchChannelId = url.match(/(?:https?:\/\/)?(?:www\.)?youtube\.com\/channel\/([\w-]+)/i);
  if (matchChannelId) return { tipo: 'channelId', valor: matchChannelId[1] };

  return null;
}

async function buscarChannelIdPorUsername(username) {
  try {
    const resposta = await fetch(`https://www.youtube.com/@${username}`);
    const texto = await resposta.text();
    const match = texto.match(/"channelId":"(UC[^"]+)"/);
    return match ? match[1] : null;
  } catch (e) {
    return null;
  }
}

async function buscarDadosDoCanal(channelId) {
  try {
    const apiKey = getApiKey();
    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.items || data.items.length === 0) throw new Error("Canal não encontrado.");
    return data.items[0];
  } catch (error) {
    throw new Error("Não conseguimos localizar o canal neste momento. Tente novamente em instantes.");
  }
}

function renderizarDados(canal) {
  const stats = canal.statistics;
  const snippet = canal.snippet;
  const avatar = snippet.thumbnails?.default?.url || "";
  const nome = snippet.customUrl || snippet.title;
  const descricao = snippet.description || "Sem descrição disponível.";
  const pais = snippet.country || "País não informado";
  const dataCriacao = new Date(snippet.publishedAt).toLocaleDateString();
  const inscritosVisiveis = !stats.hiddenSubscriberCount;

  document.getElementById("resultado").innerHTML = `
    <div class="bg-white shadow-md rounded p-6 text-left max-w-xl mx-auto">
      <div class="flex items-center gap-4 mb-4">
        <img src="${avatar}" alt="Avatar" class="w-16 h-16 rounded-full">
        <div><h3 class="text-xl font-bold">${nome}</h3></div>
      </div>
      <p class="text-gray-600 mb-2">${descricao.length > 150 ? descricao.substring(0, 150) + "..." : descricao}</p>
      <p class="text-sm text-gray-500 mb-2">${pais} | Criado em: ${dataCriacao}</p>
      <div class="mt-4 space-y-1">
        ${inscritosVisiveis ? `<p><strong>Inscritos:</strong> ${parseInt(stats.subscriberCount).toLocaleString()}</p>` : `<p><strong>Inscritos:</strong> Oculto</p>`}
        <p><strong>Visualizações:</strong> ${parseInt(stats.viewCount).toLocaleString()}</p>
        <p><strong>Vídeos:</strong> ${parseInt(stats.videoCount).toLocaleString()}</p>
      </div>
    </div>
  `;
}

async function analisarCanal() {
  const input = document.getElementById("urlInput").value.trim();
  const infoExtraida = extrairUsernameOuIdDaURL(input);

  if (!infoExtraida) {
    return mostrarErro("URL inválida. Verifique o formato.");
  }

  try {
    let channelId;

    if (infoExtraida.tipo === 'channelId') {
      channelId = infoExtraida.valor;
    } else if (infoExtraida.tipo === 'username') {
      channelId = await buscarChannelIdPorUsername(infoExtraida.valor);
      if (!channelId) throw new Error("Não conseguimos localizar o canal neste momento. Tente novamente em instantes.");
    }

    const canal = await buscarDadosDoCanal(channelId);
    renderizarDados(canal);
  } catch (erro) {
    mostrarErro(erro.message);
  }
}

function mostrarErro(mensagem) {
  document.getElementById("resultado").innerHTML = `
    <div class="max-w-xl mx-auto mt-6 p-4 border border-red-300 bg-red-50 text-red-700 rounded">
      <strong>❗ Erro:</strong> ${mensagem}
    </div>
  `;
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("analisarBtn").addEventListener("click", analisarCanal);
});
