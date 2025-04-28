
/* eslint-disable no-unused-vars */

const API_MAKE_URL = 'https://hook.us2.make.com/jrm8c4yl1av3e1ye8q68id1iqvphwwqr';

document.addEventListener('DOMContentLoaded', async () => {
  const canalId = localStorage.getItem('canalId');
  if (!canalId) {
    alert('Nenhum ID de canal encontrado. Volte e faça a análise primeiro.');
    window.location.href = 'index.html';
    return;
  }

  try {
    const response = await fetch(API_MAKE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ canalId })
    });

    if (!response.ok) {
      throw new Error('Erro ao chamar o webhook Make.');
    }

    const data = await response.json();

    // Dados básicos do canal
    document.getElementById('fotoPerfil').src = data.fotoPerfil;
    document.getElementById('nomeCanal').innerText = data.nomeCanal;
    document.getElementById('inscritos').innerText = data.inscritos;
    document.getElementById('visualizacoes').innerText = data.visualizacoes;
    document.getElementById('videos').innerText = data.videos;
    document.getElementById('dataCriacao').innerText = data.dataCriacao;
    document.getElementById('pais').innerText = data.pais || '-';
    document.getElementById('mediaVisualizacoes').innerText = data.mediaVisualizacoes;

    // Análises inteligentes
    document.getElementById('ultimaPublicacao').innerText = data.ultimaPublicacao;
    document.getElementById('frequenciaPostagem').innerText = data.frequenciaPostagem;
    document.getElementById('taxaEngajamento').innerText = data.taxaEngajamento;
    document.getElementById('consistencia').innerText = data.consistencia;
    document.getElementById('topPalavras').innerText = data.topPalavras;
    document.getElementById('tempoMedio').innerText = data.tempoMedio;

  } catch (error) {
    console.error('Erro:', error);
    alert('Erro ao carregar os detalhes do canal.');
    window.location.href = 'index.html';
  }
});
