/* eslint-disable no-unused-vars */
const API_KEY = 'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk';

document.getElementById('btnBuscar').addEventListener('click', async () => {
  const inputUrl = document.getElementById('inputUrl').value.trim();
  if (!inputUrl) {
    alert('Por favor, cole a URL do canal.');
    return;
  }

  let channelId = '';
  if (inputUrl.includes('/channel/')) {
    channelId = inputUrl.split('/channel/')[1].split('?')[0];
  } else if (inputUrl.includes('@')) {
    const username = inputUrl.split('@')[1].split('/')[0];

    const searchResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=channel&q=${username}&key=${API_KEY}`);
    const searchData = await searchResponse.json();

    if (searchData.items && searchData.items.length > 0) {
      channelId = searchData.items[0].snippet.channelId || searchData.items[0].id.channelId;
    } else {
      // Tentar buscar diretamente pelo username
      const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${API_KEY}`);
      const channelData = await channelResponse.json();

      if (channelData.items && channelData.items.length > 0) {
        channelId = channelData.items[0].id;
      } else {
        alert('Canal não encontrado pelo username.');
        return;
      }
    }
  } else {
    alert('Formato de URL inválido para canal.');
    return;
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const canal = data.items[0];

    document.getElementById('fotoPerfil').src = canal.snippet.thumbnails.default.url;
    document.getElementById('nomeCanal').innerText = canal.snippet.title;
    document.getElementById('inscritos').innerText = parseInt(canal.statistics.subscriberCount).toLocaleString('pt-BR');
    document.getElementById('visualizacoes').innerText = parseInt(canal.statistics.viewCount).toLocaleString('pt-BR');
    document.getElementById('videos').innerText = canal.statistics.videoCount;
    document.getElementById('dataCriacao').innerText = new Date(canal.snippet.publishedAt).toLocaleDateString('pt-BR');
    document.getElementById('descricao').innerText = canal.snippet.description || '';

    document.getElementById('resultado').classList.remove('hidden');

    localStorage.setItem('canalId', channelId);
  } else {
    alert('Canal não encontrado.');
  }
});
