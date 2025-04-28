
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const canalId = urlParams.get('canal');

        if (!canalId) {
            alert('ID do canal não fornecido.');
            return;
        }

        const response = await fetch('https://hook.us2.make.com/jrm8c4yl1iav3e1ye8q86di1iqvphwww', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ canalId })
        });

        if (!response.ok) {
            throw new Error('Erro na resposta do servidor');
        }

        const data = await response.json();

        document.getElementById('nome-canal').textContent = data.nome || 'Não informado';
        document.getElementById('foto-canal').src = data.foto || '';
        document.getElementById('inscritos').textContent = data.inscritos || '0';
        document.getElementById('visualizacoes').textContent = data.visualizacoes || '0';
        document.getElementById('videos').textContent = data.videos || '0';

        if (data.visualizacoes && data.videos) {
            const media = parseInt(data.visualizacoes) / parseInt(data.videos);
            document.getElementById('mediaVisualizacoes').textContent = Math.round(media).toLocaleString('pt-BR');
        } else {
            document.getElementById('mediaVisualizacoes').textContent = 'Não disponível';
        }

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar os detalhes do canal.');
    }
});
