
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
        document.getElementById('pais').textContent = data.pais || 'Não informado';
        document.getElementById('data-criacao').textContent = data.dataCriacao || 'Não informado';
        document.getElementById('media-visualizacoes').textContent = data.mediaVisualizacoes || '0';
        document.getElementById('ultima-publicacao').textContent = data.ultimaPublicacao || 'Não informado';
        document.getElementById('frequencia-postagem').textContent = data.frequenciaPostagem || 'Não informado';
        document.getElementById('taxa-engajamento').textContent = data.taxaEngajamento || '0%';
        document.getElementById('consistencia').textContent = data.consistencia || 'Não informado';
        document.getElementById('top-palavras').textContent = data.topPalavras || 'Não informado';
        document.getElementById('tempo-videos').textContent = data.tempoVideos || 'Não informado';

    } catch (error) {
        console.error(error);
        alert('Erro ao carregar os detalhes do canal.');
    }
});
