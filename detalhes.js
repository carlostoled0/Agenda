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

    // Atualizações: País e Média de Visualizações
    document.getElementById('pais').innerText = canal.snippet.country || 'Não informado';
    const media = parseInt(canal.statistics.viewCount) / parseInt(canal.statistics.videoCount);
    document.getElementById('mediaVisualizacoes').innerText = Math.round(media).toLocaleString('pt-BR');

    // NOVO: Atividade Recente
    buscarAtividadeRecente(canalId);

  } else {
    alert('Não foi possível carregar os detalhes do canal.');
    window.location.href = 'index.html';
  }
});

// Função para buscar a Atividade Recente
async function buscarAtividadeRecente(canalId) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${canalId}&part=snippet,id&order=date&maxResults=5&type=video`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const datas = data.items.map(item => new Date(item.snippet.publishedAt));
    datas.sort((a, b) => b - a);

    // Última Publicação
    document.getElementById('ultimaPublicacao').innerText = datas[0].toLocaleDateString('pt-BR');

    if (datas.length > 1) {
      // Cálculo de frequência
      let somaDias = 0;
      for (let i = 0; i < datas.length - 1; i++) {
        const diferenca = (datas[i] - datas[i + 1]) / (1000 * 60 * 60 * 24);
        somaDias += diferenca;
      }
      const frequencia = somaDias / (datas.length - 1);
      document.getElementById('frequenciaPostagem').innerText = `${Math.round(frequencia)} dias`;
    } else {
      document.getElementById('frequenciaPostagem').innerText = 'Poucos vídeos';
    }
  } else {
    document.getElementById('ultimaPublicacao').innerText = 'Não disponível';
    document.getElementById('frequenciaPostagem').innerText = 'Não disponível';
  }
}
