function cadastrar(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;

  if (!nome || !email || !senha || !confirmarSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha !== confirmarSenha) {
    alert("As senhas não coincidem.");
    return;
  }

  localStorage.setItem("usuarioNome", nome);
  localStorage.setItem("usuarioEmail", email);
  localStorage.setItem("usuarioSenha", senha);

  alert("Cadastro realizado com sucesso!");
  window.location.href = "login.html";
}

function entrar(event) {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;

  const emailSalvo = localStorage.getItem("usuarioEmail");
  const senhaSalva = localStorage.getItem("usuarioSenha");

  if (email === emailSalvo && senha === senhaSalva) {
    localStorage.setItem("logado", "true");
    window.location.href = "index.html";
  } else {
    alert("E-mail ou senha inválidos.");
  }
}

function sair() {
  localStorage.removeItem("logado");
  window.location.href = "login.html";
}