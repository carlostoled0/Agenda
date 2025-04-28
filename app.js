/* eslint-disable no-unused-vars */
document.getElementById('btnBuscar').addEventListener('click', async () => {
  const inputUrl = document.getElementById('inputUrl').value.trim();
  if (!inputUrl) {
    alert('❗ Por favor, cole a URL do canal.');
    return;
  }

  let channelId = '';
  try {
    if (inputUrl.includes('/channel/')) {
      channelId = inputUrl.split('/channel/')[1].split('?')[0];
    } else if (inputUrl.includes('@')) {
      const username = inputUrl.split('@')[1].split('/')[0];

      const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${getApiKey()}`);
      const searchData = await searchResponse.json();

      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId || searchData.items[0].id.channelId;
      } else {
        throw new Error('❗ Canal não encontrado. Verifique se o link está correto.');
      }
    } else {
      throw new Error('❗ Formato de URL inválido.');
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${getApiKey()}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const canal = data.items[0];
      document.getElementById('fotoPerfil').src = canal.snippet.thumbnails.default.url;
      document.getElementById('nomeCanal').innerText = canal.snippet.title;
      document.getElementById('descricao').innerText = canal.snippet.description || 'Sem descrição disponível.';
      document.getElementById('inscritos').innerText = parseInt(canal.statistics.subscriberCount).toLocaleString('pt-BR');
      document.getElementById('visualizacoes').innerText = parseInt(canal.statistics.viewCount).toLocaleString('pt-BR');
      document.getElementById('videos').innerText = canal.statistics.videoCount;
      document.getElementById('dataCriacao').innerText = new Date(canal.snippet.publishedAt).toLocaleDateString('pt-BR');
      document.getElementById('resultado').classList.remove('hidden');
      localStorage.setItem('canalId', channelId);
    } else {
      throw new Error('❗ Canal não encontrado. Verifique se o link está correto.');
    }
  } catch (error) {
    console.error(error);
    alert(error.message || '❗ Erro inesperado. Tente novamente.');
  }
});

function irParaDetalhes() {
  const canalId = localStorage.getItem('canalId');
  if (canalId) {
    window.location.href = 'detalhes.html';
  } else {
    alert('❗ ID do canal não encontrado. Faça uma nova busca.');
  }
}