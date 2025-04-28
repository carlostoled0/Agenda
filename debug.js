const API_KEY = 'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk';

async function buscarInfoCanal(canal) {
  try {
    const isUsername = canal.includes('@');
    let idCanal;

    if (isUsername) {
      const username = canal.replace('@', '').trim();
      const resBusca = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${username}&key=${API_KEY}`);
      const dadosBusca = await resBusca.json();
      if (!dadosBusca.items || dadosBusca.items.length === 0) throw new Error('Canal não encontrado pelo username.');
      idCanal = dadosBusca.items[0].id;
    } else {
      idCanal = canal.includes('youtube.com/channel/') ? canal.split('/channel/')[1] : canal;
      idCanal = idCanal.trim();
    }

    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${idCanal}&key=${API_KEY}`);
    const dados = await res.json();

    if (!dados.items || dados.items.length === 0) {
      throw new Error('Nenhum canal encontrado para esse ID.');
    }

    document.getElementById('saida').textContent = JSON.stringify(dados, null, 2);
    document.getElementById('resultado').classList.remove('hidden');
  } catch (erro) {
    alert('Erro: ' + erro.message);
    console.error('Detalhes do erro:', erro);
  }
}

document.getElementById('btnTestar').addEventListener('click', () => {
  const canal = document.getElementById('inputCanal').value;
  if (canal) buscarInfoCanal(canal);
});