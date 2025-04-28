
/* eslint-disable no-unused-vars */

document.addEventListener('DOMContentLoaded', function () {
  const canalId = localStorage.getItem('canalId');

  if (!canalId) {
    alert('Nenhum canal ID encontrado.');
    return;
  }

  fetch('https://hook.us2.make.com/jrm8c4yl1lav3e1ye8q86di1iqvphwww', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ canalId: canalId })
  })
    .then(response => response.json())
    .then(data => {
      if (!data || !data.snippet) {
        alert('Erro ao carregar os detalhes do canal.');
        return;
      }

      document.getElementById('fotoPerfil').src = data.snippet.thumbnails.high.url;
      document.getElementById('nomeCanal').textContent = data.snippet.title || '-';
      document.getElementById('inscritos').textContent = data.statistics.subscriberCount || '-';
      document.getElementById('visualizacoes').textContent = data.statistics.viewCount || '-';
      document.getElementById('qtdVideos').textContent = data.statistics.videoCount || '-';
      document.getElementById('pais').textContent = data.snippet.country || '-';
      document.getElementById('mediaVisualizacoes').textContent = calcularMedia(data.statistics) || '-';
      document.getElementById('criadoEm').textContent = formatarData(data.snippet.publishedAt) || '-';
      document.getElementById('ultimaPublicacao').textContent = formatarData(data.lastVideoDate) || '-';
      document.getElementById('frequenciaPostagem').textContent = data.frequenciaPostagem || '-';
      document.getElementById('taxaEngajamento').textContent = data.taxaEngajamento || '-';
      document.getElementById('consistencia').textContent = data.consistencia || '-';
      document.getElementById('topPalavras').textContent = data.topPalavrasChave || '-';
      document.getElementById('tempoVideos').textContent = data.tempoMedioVideos || '-';
    })
    .catch(error => {
      console.error('Erro ao buscar detalhes:', error);
      alert('Erro ao carregar os detalhes do canal.');
    });
});

function calcularMedia(statistics) {
  const views = parseInt(statistics.viewCount, 10);
  const videos = parseInt(statistics.videoCount, 10);
  if (!views || !videos) return '-';
  return Math.round(views / videos).toLocaleString();
}

function formatarData(dataISO) {
  if (!dataISO) return '-';
  const data = new Date(dataISO);
  return data.toLocaleDateString('pt-BR');
}
