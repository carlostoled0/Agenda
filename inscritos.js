const API_KEY = 'AIzaSyB8XtKXTdcxhtq-OgdMaCiFy8hsUrxWQQk';

async function carregarDados() {
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
    const inscritosTotais = parseInt(canal.statistics.subscriberCount);
    const dataCriacao = new Date(canal.snippet.publishedAt);
    const hoje = new Date();

    const diasDesdeCriacao = Math.floor((hoje - dataCriacao) / (1000 * 60 * 60 * 24));

    const labels = [];
    const dados = [];

    for (let i = 0; i <= diasDesdeCriacao; i += Math.ceil(diasDesdeCriacao / 10)) {
      const dataSimulada = new Date(dataCriacao);
      dataSimulada.setDate(dataSimulada.getDate() + i);
      labels.push(dataSimulada.toLocaleDateString('pt-BR'));
      dados.push(Math.round((i / diasDesdeCriacao) * inscritosTotais));
    }

    labels.push(hoje.toLocaleDateString('pt-BR'));
    dados.push(inscritosTotais);

    const ctx = document.getElementById('graficoInscritos').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Evolução dos Inscritos',
          data: dados,
          borderColor: '#6366F1',
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          fill: true,
          tension: 0.4,
          pointRadius: 3,
          pointBackgroundColor: '#6366F1'
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'top' },
          title: { display: true, text: 'Simulação da Evolução dos Inscritos' }
        }
      }
    });

  } else {
    alert('Não foi possível carregar os dados do canal.');
    window.location.href = 'index.html';
  }
}

document.addEventListener('DOMContentLoaded', carregarDados);