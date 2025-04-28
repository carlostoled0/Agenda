/* eslint-disable no-unused-vars */
const API_KEY = 'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk';

document.addEventListener('DOMContentLoaded', async () => {
  const canalId = localStorage.getItem('canalId');
  if (!canalId) {
    alert('Nenhum ID de canal encontrado. Volte e faça a análise primeiro.');
    window.location.href = 'index.html';
    return;
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${canalId}&key=${API_KEY}`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const canal = data.items[0];

    document.getElementById('fotoPerfil').src = canal.snippet.thumbnails.default.url;
    document.getElementById('nomeCanal').innerText = canal.snippet.title;
    document.getElementById('inscritos').innerText = parseInt(canal.statistics.subscriberCount).toLocaleString('pt-BR');
    document.getElementById('visualizacoes').innerText = parseInt(canal.statistics.viewCount).toLocaleString('pt-BR');
    document.getElementById('videos').innerText = canal.statistics.videoCount;
    document.getElementById('dataCriacao').innerText = new Date(canal.snippet.publishedAt).toLocaleDateString('pt-BR');

    document.getElementById('pais').innerText = canal.snippet.country || 'Não informado';
    const media = parseInt(canal.statistics.viewCount) / parseInt(canal.statistics.videoCount);
    document.getElementById('mediaVisualizacoes').innerText = Math.round(media).toLocaleString('pt-BR');

    buscarAtividadeRecente(canalId);
    buscarAnalisesInteligentes(canalId);

  } else {
    alert('Não foi possível carregar os detalhes do canal.');
    window.location.href = 'index.html';
  }
});

async function buscarAtividadeRecente(canalId) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${canalId}&part=snippet,id&order=date&maxResults=5&type=video`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const datas = data.items.map(item => new Date(item.snippet.publishedAt));
    datas.sort((a, b) => b - a);

    document.getElementById('ultimaPublicacao').innerText = datas[0].toLocaleDateString('pt-BR');

    if (datas.length > 1) {
      let somaDias = 0;
      for (let i = 0; i < datas.length - 1; i++) {
        const diferenca = (datas[i] - datas[i + 1]) / (1000 * 60 * 60 * 24);
        somaDias += diferenca;
      }
      const frequencia = somaDias / (datas.length - 1);
      document.getElementById('frequenciaPostagem').innerText = `${Math.round(frequencia)} dias`;
      document.getElementById('consistencia').innerText = `${Math.round(frequencia)} dias`; // Replicar em Consistência
    } else {
      document.getElementById('frequenciaPostagem').innerText = 'Poucos vídeos';
      document.getElementById('consistencia').innerText = 'Poucos vídeos';
    }
  } else {
    document.getElementById('ultimaPublicacao').innerText = 'Não disponível';
    document.getElementById('frequenciaPostagem').innerText = 'Não disponível';
    document.getElementById('consistencia').innerText = 'Não disponível';
  }
}

async function buscarAnalisesInteligentes(canalId) {
  const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${canalId}&part=id&order=date&maxResults=5&type=video`);
  const searchData = await searchResponse.json();

  if (searchData.items && searchData.items.length > 0) {
    const videoIds = searchData.items.map(item => item.id.videoId).join(',');

    const videosResponse = await fetch(`https://www.googleapis.com/youtube/v3/videos?key=${API_KEY}&id=${videoIds}&part=snippet,statistics,contentDetails`);
    const videosData = await videosResponse.json();

    if (videosData.items && videosData.items.length > 0) {
      let totalLikes = 0;
      let totalComments = 0;
      let totalViews = 0;
      let totalDuration = 0;
      const palavras = [];

      videosData.items.forEach(video => {
        const stats = video.statistics;
        totalLikes += parseInt(stats.likeCount || 0);
        totalComments += parseInt(stats.commentCount || 0);
        totalViews += parseInt(stats.viewCount || 1); // garantir que view não seja 0

        const snippet = video.snippet;
        if (snippet.tags) palavras.push(...snippet.tags);

        const durationISO = video.contentDetails.duration;
        const durationSec = moment.duration(durationISO).asSeconds();
        totalDuration += durationSec;
      });

      const taxaEngajamento = ((totalLikes + totalComments) / totalViews) * 100;
      document.getElementById('taxaEngajamento').innerText = `${taxaEngajamento.toFixed(2)}%`;

      if (palavras.length > 0) {
        const counts = {};
        palavras.forEach(tag => counts[tag] = (counts[tag] || 0) + 1);
        const top3 = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]);
        document.getElementById('topPalavras').innerText = top3.join(', ');
      } else {
        document.getElementById('topPalavras').innerText = 'Não disponível';
      }

      const tempoMedio = totalDuration / videosData.items.length;
      const minutos = Math.floor(tempoMedio / 60);
      const segundos = Math.floor(tempoMedio % 60);
      document.getElementById('tempoMedio').innerText = `${minutos}m ${segundos}s`;
    }
  }
}
