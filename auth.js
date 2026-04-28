(function () {
  window.LABLEAF_CONFIG = window.LABLEAF_CONFIG || {
    IA_API: "https://uncomplicatedly-promisable-charisse.ngrok-free.dev",
    BACKEND_API: "https://lableaf-backend.onrender.com"
  };

  const BACKEND_API = window.LABLEAF_CONFIG.BACKEND_API.replace(/\/+$/, "");

  function obterElemento(id) {
    return document.getElementById(id);
  }

  function mostrarErroSenha(mensagem = "") {
    const erroSenha = obterElemento("erroSenha");

    if (erroSenha) {
      erroSenha.textContent = mensagem;
    }
  }

  async function lerRespostaJson(resposta) {
    try {
      return await resposta.json();
    } catch {
      return {};
    }
  }

  async function cadastrar(event) {
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

    try {
      const resposta = await fetch(`${BACKEND_API}/auth/cadastro`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          nome: nome,
          email: email,
          senha: senha
        })
      });

      const dados = await lerRespostaJson(resposta);

      if (!resposta.ok) {
        console.error("Erro no cadastro:", dados);
        alert(dados.detail || dados.message || "Erro ao cadastrar usuário.");
        return;
      }

      alert("Cadastro realizado com sucesso!");
      window.location.href = "login.html";
    } catch (erro) {
      console.error("Erro ao conectar com o backend:", erro);
      alert("Não foi possível conectar com o servidor.");
    }
  }

  async function entrar(event) {
    event.preventDefault();

    const email = obterElemento("email")?.value.trim().toLowerCase();
    const senha = obterElemento("senha")?.value || "";

    if (!email || !senha) {
      alert("Preencha e-mail e senha.");
      return;
    }

    try {
      const resposta = await fetch(`${BACKEND_API}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          email: email,
          senha: senha
        })
      });

      const dados = await lerRespostaJson(resposta);

      if (!resposta.ok) {
        console.error("Erro no login:", dados);
        alert(dados.detail || dados.message || "E-mail ou senha inválidos.");
        return;
      }

      const token =
        dados.access_token ||
        dados.token ||
        dados.accessToken ||
        dados.jwt;

      if (!token) {
        console.error("A API não retornou token:", dados);
        alert("Login feito, mas o backend não retornou token.");
        return;
      }

      localStorage.setItem("token", token);
      localStorage.setItem("logado", "true");
      localStorage.setItem("usuarioEmail", email);

      if (dados.usuario) {
        localStorage.setItem("usuarioNome", dados.usuario.nome || "");
        localStorage.setItem("usuarioEmail", dados.usuario.email || email);
      }

      window.location.href = "index.html";
    } catch (erro) {
      console.error("Erro ao conectar com o backend:", erro);
      alert("Não foi possível conectar com o servidor.");
    }
  }

  function sair() {
    localStorage.removeItem("token");
    localStorage.removeItem("logado");
    localStorage.removeItem("usuarioNome");
    localStorage.removeItem("usuarioEmail");

    window.location.href = "login.html";
  }

  window.cadastrar = cadastrar;
  window.entrar = entrar;
  window.sair = sair;

  document.addEventListener("DOMContentLoaded", () => {
    const logoutBtn = obterElemento("logoutBtn");

    if (logoutBtn && !logoutBtn.dataset.logoutBound) {
      logoutBtn.dataset.logoutBound = "true";

      logoutBtn.addEventListener("click", (event) => {
        event.preventDefault();
        sair();
      });
    }
  });
})();