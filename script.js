const botao = document.getElementById("botaoUpload");
const input = document.getElementById("imagemInput");
const nomeArquivo = document.getElementById("nomeArquivo");
const previewImagem = document.getElementById("previewImagem");
const resultado = document.getElementById("resultado");

if (botao && input && nomeArquivo && previewImagem && resultado) {
  botao.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", () => {
    const file = input.files[0];

    if (file) {
      nomeArquivo.textContent = `Arquivo selecionado: ${file.name}`;

      const url = URL.createObjectURL(file);
      previewImagem.src = url;
      previewImagem.style.display = "block";

      resultado.textContent = "Imagem carregada com sucesso.";
    } else {
      nomeArquivo.textContent = "";
      previewImagem.style.display = "none";
      resultado.textContent = "";
    }
  });
}

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