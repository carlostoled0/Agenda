document.getElementById('btnAnalisar').addEventListener('click', () => {
  const canal = document.getElementById('inputCanal').value.trim();
  if (canal) {
    document.getElementById('resultado').classList.remove('hidden');
    document.getElementById('seguidores').textContent = '5.200';
    document.getElementById('engajamento').textContent = '82%';
    document.getElementById('consistencia').textContent = '90%';
    document.getElementById('qualidade').textContent = '88%';
    document.getElementById('crescimento').textContent = '75%';
    document.getElementById('recomendacao').textContent = 'Mantenha a consistência de postagens e invista em conteúdo de alta qualidade.';
  }
});