function obterElemento(id) {
  return document.getElementById(id);
}

function mostrarErroSenha(mensagem = "") {
  const erroSenha = obterElemento("erroSenha");
  if (erroSenha) {
    erroSenha.textContent = mensagem;
  }
}

function cadastrar(event) {
  event.preventDefault();

  const nome = obterElemento("nome")?.value.trim();
  const email = obterElemento("email")?.value.trim().toLowerCase();
  const senha = obterElemento("senha")?.value || "";
  const confirmarSenha = obterElemento("confirmarSenha")?.value || "";

  mostrarErroSenha();

  if (!nome || !email || !senha || !confirmarSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha.length < 8) {
    mostrarErroSenha("A senha deve ter no mínimo 8 caracteres.");
    return;
  }

  if (senha !== confirmarSenha) {
    mostrarErroSenha("As senhas não coincidem.");
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

  const email = obterElemento("email")?.value.trim().toLowerCase();
  const senha = obterElemento("senha")?.value || "";

  const emailSalvo = localStorage.getItem("usuarioEmail");
  const senhaSalva = localStorage.getItem("usuarioSenha");

  if (!emailSalvo || !senhaSalva) {
    alert("Nenhuma conta cadastrada. Faça o cadastro primeiro.");
    return;
  }

  if (email === emailSalvo && senha === senhaSalva) {
    localStorage.setItem("logado", "true");
    window.location.href = "index.html";
    return;
  }

  alert("E-mail ou senha inválidos.");
}

function sair() {
  localStorage.removeItem("logado");
  window.location.href = "login.html";
}

document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = obterElemento("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (event) => {
      event.preventDefault();
      sair();
    });
  }
});