/* eslint-disable no-unused-vars */
document.addEventListener('DOMContentLoaded', () => {
  const erro = localStorage.getItem('erroAtual');
  const mensagemErro = document.getElementById('mensagemErro');
  if (erro) {
    mensagemErro.innerText = erro;
  } else {
    mensagemErro.innerText = 'Nenhum erro registrado.';
  }
});