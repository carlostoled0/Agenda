/* eslint-disable no-unused-vars */
const API_KEYS = [
  'AIzaSyCMkH6eWZQ7KLa8pVY4ZV-_CLMfGX36LbM',
  'AIzaSyDI1FSQjjSzp3G3PFaleTQK6_4JkNXG10s',
  'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk',
  'AIzaSyD7Lt5YDF5rqbibzkIQXaD0RSBONCuhhIg',
  'AIzaSyAwQJN_OeXH-8g_u64xtpgV-npcn6JUIug'
];

let currentKeyIndex = 0;
function getApiKey() {
  const key = API_KEYS[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % API_KEYS.length;
  return key;
}

document.getElementById('btnBuscar').addEventListener('click', async () => {
  const inputUrl = document.getElementById('inputUrl').value.trim();
  if (!inputUrl) {
    alert('Por favor, cole a URL do canal.');
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

      console.log('Resposta bruta da API /search:', searchData);

      if (searchData.error) {
        localStorage.setItem('erroAtual', `Erro na API: ${searchData.error.message}`);
        window.location.href = 'erros.html';
        return;
      }

      if (searchData.items && searchData.items.length > 0) {
        channelId = searchData.items[0].snippet.channelId || searchData.items[0].id.channelId;
      } else {
        throw new Error('Canal não encontrado pelo username.');
      }
    } else {
      throw new Error('Formato de URL inválido para canal.');
    }

    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${getApiKey()}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      const canal = data.items[0];
      document.getElementById('fotoPerfil').src = canal.snippet.thumbnails.default.url;
      document.getElementById('nomeCanal').innerText = canal.snippet.title;
      document.getElementById('inscritos').innerText = parseInt(canal.statistics.subscriberCount).toLocaleString('pt-BR');
      document.getElementById('visualizacoes').innerText = parseInt(canal.statistics.viewCount).toLocaleString('pt-BR');
      document.getElementById('videos').innerText = canal.statistics.videoCount;
      document.getElementById('dataCriacao').innerText = new Date(canal.snippet.publishedAt).toLocaleDateString('pt-BR');
      document.getElementById('resultado').classList.remove('hidden');
      localStorage.setItem('canalId', channelId);
    } else {
      throw new Error('Canal não encontrado.');
    }
  } catch (error) {
    localStorage.setItem('erroAtual', error.message || 'Erro inesperado.');
    window.location.href = 'erros.html';
  }
});

function irParaDetalhes() {
  const canalId = localStorage.getItem('canalId');
  if (canalId) {
    window.location.href = 'detalhes.html';
  } else {
    alert('ID do canal não encontrado. Primeiro faça a análise.');
  }
}