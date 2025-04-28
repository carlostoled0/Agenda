/* eslint-disable no-unused-vars */
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
      const resultado = document.getElementById('resultado');
      resultado.innerHTML = `
        <img src="${canal.snippet.thumbnails.default.url}" class="mx-auto mb-4 rounded-full">
        <h2 class="text-2xl font-bold">${canal.snippet.title}</h2>
        <p><strong>Inscritos:</strong> ${parseInt(canal.statistics.subscriberCount).toLocaleString('pt-BR')}</p>
        <p><strong>Visualizações:</strong> ${parseInt(canal.statistics.viewCount).toLocaleString('pt-BR')}</p>
        <p><strong>Vídeos:</strong> ${canal.statistics.videoCount}</p>
        <p><strong>Data de Criação:</strong> ${new Date(canal.snippet.publishedAt).toLocaleDateString('pt-BR')}</p>
      `;
      resultado.classList.remove('hidden');
      localStorage.setItem('canalId', channelId);
    } else {
      throw new Error('Canal não encontrado.');
    }
  } catch (error) {
    localStorage.setItem('erroAtual', error.message || 'Erro inesperado.');
    window.location.href = 'erros.html';
  }
});