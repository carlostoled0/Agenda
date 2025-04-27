
/* eslint-disable no-unused-vars */
async function atualizarCanal() {
  const input = document.getElementById("canal_url").value.trim();
  const msg = document.getElementById("msg");
  if (input) {
    localStorage.setItem("canal_url_principal", input);
    msg.innerText = "✅ Entrada salva. Atualizando painel...";
    carregarDadosDoCanal();
  } else {
    msg.innerText = "❌ Insira uma entrada válida.";
  }
}

async function fallbackChannelId(username) {
  try {
    const proxyUrl = `https://proxy-carlostoledo.vercel.app/api/getChannelId?username=${username}`;
    const response = await fetch(proxyUrl);
    const data = await response.json();
    return data.channelId || null;
  } catch {
    return null;
  }
}

async function buscarChannelIdPorVideo(videoId, apiKey) {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    const json = await res.json();
    return json.items?.[0]?.snippet?.channelId || null;
  } catch {
    return null;
  }
}

async function carregarDadosDoCanal() {
  const entrada = localStorage.getItem("canal_url_principal") || "https://www.youtube.com/@FalaJairinho";
  const canalInfo = document.getElementById("canalInfo");
  const consultaHora = document.getElementById("consultaHora");
  const apiKey = "AIzaSyDjoiEFd5zh_Mje5WbnLj284LNx1QQ-Hqw";

  canalInfo.innerText = "🔄 Atualizando...";
  consultaHora.innerText = "";

  let channelId = "";
  let entradaTratada = entrada.toLowerCase();

  if (entradaTratada.includes("/channel/")) {
    channelId = entrada.split("/channel/")[1].split(/[/?]/)[0];
  } else if (entradaTratada.includes("/watch?v=")) {
    const videoId = entrada.split("v=")[1].split("&")[0];
    channelId = await buscarChannelIdPorVideo(videoId, apiKey);
  } else if (entradaTratada.includes("@")) {
    const nomeUsuario = entrada.split("@")[1].split(/[/?]/)[0];
    channelId = await fallbackChannelId(nomeUsuario);
    if (!channelId) {
      const busca = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${nomeUsuario}&type=channel&key=${apiKey}`);
      const buscaJson = await busca.json();
      channelId = buscaJson.items?.[0]?.snippet?.channelId || buscaJson.items?.[0]?.id?.channelId;
    }
  } else if (entrada.startsWith("UC")) {
    channelId = entrada;
  } else {
    const busca = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${entrada}&type=channel&key=${apiKey}`);
    const buscaJson = await busca.json();
    channelId = buscaJson.items?.[0]?.snippet?.channelId || buscaJson.items?.[0]?.id?.channelId;
  }

  if (!channelId) {
    canalInfo.innerText = "⚠️ Canal não encontrado.";
    return;
  }

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`);
    const json = await res.json();
    const canal = json.items?.[0];

    if (canal) {
      const stats = canal.statistics;
      const snippet = canal.snippet;
      const avatar = snippet.thumbnails?.default?.url || "";
      const nome = snippet.customUrl || snippet.title;
      const descricao = snippet.description || "Sem descrição disponível.";
      const pais = snippet.country || "País não informado";
      const dataCriacao = new Date(snippet.publishedAt).toLocaleDateString();
      const inscritosVisiveis = stats.hiddenSubscriberCount ? false : true;

      canalInfo.innerHTML = `
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
        </div>`;

      const agora = new Date();
      consultaHora.innerText = `Consulta realizada em: ${agora.toLocaleDateString()} às ${agora.toLocaleTimeString()}`;
    } else {
      canalInfo.innerText = "⚠️ Canal não encontrado.";
    }
  } catch (error) {
    canalInfo.innerText = "❌ Erro ao conectar à API.";
  }
}

document.addEventListener("DOMContentLoaded", carregarDadosDoCanal);
