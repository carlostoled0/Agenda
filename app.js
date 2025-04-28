const API_KEY = 'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk';

function salvarUrlERedirecionar(pagina) {
  const url = document.getElementById('inputUrl').value.trim();
  if (!url) {
    alert('Cole a URL primeiro.');
    return;
  }
  localStorage.setItem('youtubeUrl', url);
  window.location.href = pagina;
}

async function buscarDadosCanal() {
  const url = localStorage.getItem('youtubeUrl');
  if (!url) return alert('Nenhuma URL encontrada.');

  let id = '';
  if (url.includes('/channel/')) {
    id = url.split('/channel/')[1].split('?')[0];
  } else {
    alert('Formato inválido para canal.');
    return;
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${id}&key=${API_KEY}`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const canal = data.items[0];
    const div = document.getElementById('canalDados');
    div.innerHTML = `
      <p><strong>Nome:</strong> ${canal.snippet.title}</p>
      <p><strong>Descrição:</strong> ${canal.snippet.description}</p>
      <p><strong>Inscritos:</strong> ${canal.statistics.subscriberCount}</p>
      <p><strong>Visualizações:</strong> ${canal.statistics.viewCount}</p>
      <p><strong>Vídeos:</strong> ${canal.statistics.videoCount}</p>
    `;
  } else {
    alert('Canal não encontrado.');
  }
}

async function buscarDadosVideo() {
  const url = localStorage.getItem('youtubeUrl');
  if (!url) return alert('Nenhuma URL encontrada.');

  let id = '';
  if (url.includes('watch?v=')) {
    id = url.split('watch?v=')[1].split('&')[0];
  } else {
    alert('Formato inválido para vídeo.');
    return;
  }

  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${API_KEY}`);
  const data = await response.json();

  if (data.items && data.items.length > 0) {
    const video = data.items[0];
    const div = document.getElementById('videoDados');
    div.innerHTML = `
      <p><strong>Título:</strong> ${video.snippet.title}</p>
      <p><strong>Descrição:</strong> ${video.snippet.description}</p>
      <p><strong>Visualizações:</strong> ${video.statistics.viewCount}</p>
      <p><strong>Likes:</strong> ${video.statistics.likeCount}</p>
      <p><strong>Comentários:</strong> ${video.statistics.commentCount}</p>
    `;
  } else {
    alert('Vídeo não encontrado.');
  }
}

// Detecção automática de qual página está aberta
if (window.location.pathname.includes('canal.html')) {
  buscarDadosCanal();
}
if (window.location.pathname.includes('video.html')) {
  buscarDadosVideo();
}