function cadastrar(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value;
  const confirmarSenha = document.getElementById("confirmarSenha").value;
  const erroSenha = document.getElementById("erroSenha");

  if (erroSenha) {
    erroSenha.textContent = "";
  }

  if (!nome || !email || !senha || !confirmarSenha) {
    alert("Preencha todos os campos.");
    return;
  }

  if (senha.length < 8) {
    if (erroSenha) {
      erroSenha.textContent = "A senha deve ter no mínimo 8 caracteres.";
    } else {
      alert("A senha deve ter no mínimo 8 caracteres.");
    }
    return;
  }

  if (senha !== confirmarSenha) {
    if (erroSenha) {
      erroSenha.textContent = "As senhas não coincidem.";
    } else {
      alert("As senhas não coincidem.");
    }
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

  const emailInput = document.getElementById("email");
  const senhaInput = document.getElementById("senha");

  if (!emailInput || !senhaInput) return;

  const email = emailInput.value.trim();
  const senha = senhaInput.value;

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