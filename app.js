
/* eslint-disable no-unused-vars */

// Função 1: Atualizar Canal
function atualizarCanal() {
  const input = document.getElementById("canal_url").value.trim();
  const msg = document.getElementById("msg");

  if (input) {
    localStorage.setItem("canal_url_principal", input);
    localStorage.setItem("canal_rede", "youtube");
    msg.innerText = "✅ Entrada salva. Atualizando painel...";
    carregarDadosDoCanal();
  } else {
    msg.innerText = "❌ Insira uma entrada válida.";
  }
}

// Função 2: Fallback para obter Channel ID
async function fallbackChannelId(username) {
  try {
    const response = await fetch(`https://www.youtube.com/@${username}`);
    const html = await response.text();
    const match = html.match(/channelId":"(UC[\w-]+)/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Função auxiliar para buscar Channel ID de um vídeo
async function buscarChannelIdPorVideo(videoId, apiKey) {
  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${apiKey}`);
    const json = await res.json();
    return json.items?.[0]?.snippet?.channelId || null;
  } catch {
    return null;
  }
}

// Função 3: Carregar Dados do Canal Inteligente
async function carregarDadosDoCanal() {
  const entrada = localStorage.getItem("canal_url_principal") || "https://www.youtube.com/@FalaJairinho";
  const canalInfo = document.getElementById("canalInfo");
  const apiKey = "AIzaSyCD27OXrL7tmgDxOg7wQLR5QmRUGJPsqFg";

  canalInfo.innerText = "🔄 Atualizando...";

  let channelId = "";
  let entradaTratada = entrada.toLowerCase();

  if (entradaTratada.includes("/channel/")) {
    channelId = entrada.split("/channel/")[1].split(/[/?]/)[0];
  } else if (entradaTratada.includes("/watch?v=")) {
    const videoId = entrada.split("v=")[1].split("&")[0];
    channelId = await buscarChannelIdPorVideo(videoId, apiKey);
  } else if (entradaTratada.includes("@")) {
    const nomeUsuario = entrada.split("@")[1].split(/[/?]/)[0];
    const busca = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=@${nomeUsuario}&type=channel&key=${apiKey}`);
    const buscaJson = await busca.json();
    channelId = buscaJson.items?.[0]?.snippet?.channelId || buscaJson.items?.[0]?.id?.channelId;

    if (!channelId) {
      channelId = await fallbackChannelId(nomeUsuario);
    }
  } else if (entrada.startsWith("UC")) {
    channelId = entrada;
  } else {
    const busca = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${entrada}&type=channel&key=${apiKey}`);
    const buscaJson = await busca.json();
    channelId = buscaJson.items?.[0]?.snippet?.channelId || buscaJson.items?.[0]?.id?.channelId;

    if (!channelId) {
      channelId = await fallbackChannelId(entrada);
    }
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
      canalInfo.innerHTML = `
        <strong>@${canal.snippet.customUrl || canal.snippet.title}</strong><br/>
        👥 ${parseInt(stats.subscriberCount).toLocaleString()} inscritos<br/>
        👁️ ${parseInt(stats.viewCount).toLocaleString()} visualizações<br/>
        🎬 ${parseInt(stats.videoCount).toLocaleString()} vídeos
      `;
    } else {
      canalInfo.innerText = "⚠️ Canal não encontrado.";
    }
  } catch (error) {
    canalInfo.innerText = "❌ Erro ao conectar à API.";
  }
}

// Evento: Página carregada -> Carregar dados automaticamente
document.addEventListener("DOMContentLoaded", carregarDadosDoCanal);
