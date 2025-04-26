
const apiKey = "AIzaSyBcwpHelj1HJJ_dV7SKIxhOeNvW6YPcc0Q";

async function buscarCanal() {
    const input = document.getElementById('input').value.trim();

    if (!input) {
        alert("Por favor, insira um Channel ID válido.");
        return;
    }

    const channelId = input.replace("https://www.youtube.com/channel/", "").trim();

    const url = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${apiKey}`;

    try {
        const resposta = await fetch(url);
        const dados = await resposta.json();

        if (dados.items && dados.items.length > 0) {
            const canal = dados.items[0].snippet.title;
            document.getElementById('resultado').innerHTML = `🎯 Canal encontrado: <strong>${canal}</strong>`;
        } else {
            document.getElementById('resultado').innerHTML = `⚠️ Canal não encontrado.`;
        }
    } catch (error) {
        console.error(error);
        document.getElementById('resultado').innerHTML = `❌ Erro na consulta.`;
    }
}
