/* eslint-disable no-unused-vars */
async function fetchChannelIdFromHandle(username) {
  try {
    const response = await fetch(`https://www.youtube.com/@${username}`);
    const html = await response.text();
    const match = html.match(/"channelId":"(UC[\w-]{22})"/);
    if (match && match[1]) {
      return match[1];
    } else {
      throw new Error('❗ Não foi possível extrair o Channel ID.');
    }
  } catch (error) {
    console.error(error);
    throw new Error('❗ Erro ao buscar dados do canal. Verifique a URL.');
  }
}

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
      channelId = await fetchChannelIdFromHandle(username);
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
      throw new Error('❗ Canal não encontrado ou privado.');
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