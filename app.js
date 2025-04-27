const followersCtx = document.getElementById('followersChart').getContext('2d');
const viewsCtx = document.getElementById('viewsChart').getContext('2d');
const engagementCtx = document.getElementById('engagementChart').getContext('2d');

async function fetchRealData() {
  const apiKey = 'SUA_API_KEY_AQUI'; // substitua aqui pela sua chave real
  const channelId = 'ID_DO_CANAL_AQUI'; // substitua aqui pelo ID do canal

  try {
    const res = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${channelId}&key=${apiKey}`);
    const data = await res.json();

    if (data.items && data.items.length > 0) {
      const stats = data.items[0].statistics;
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul'];

      new Chart(followersCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{ label: 'Seguidores', data: [500, 1000, 1500, 2000, 2500, 3000, stats.subscriberCount], borderColor: 'blue', backgroundColor: 'rgba(59,130,246,0.2)', tension: 0.4, fill: true }]
        }
      });

      new Chart(viewsCtx, {
        type: 'bar',
        data: {
          labels: months,
          datasets: [{ label: 'Visualizações', data: [800, 1200, 2000, 3000, 4000, 5000, stats.viewCount], backgroundColor: 'orange' }]
        }
      });

      new Chart(engagementCtx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [{ label: 'Engajamento (%)', data: [10, 15, 18, 20, 22, 24, 26], borderColor: 'green', backgroundColor: 'rgba(34,197,94,0.2)', tension: 0.4, fill: true }]
        }
      });
    }
  } catch (error) {
    console.error('Erro ao buscar dados:', error);
  }
}

// Inicializar ao carregar
fetchRealData();