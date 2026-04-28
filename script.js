(function () {
  window.LABLEAF_CONFIG = window.LABLEAF_CONFIG || {
    IA_API: "https://uncomplicatedly-promisable-charisse.ngrok-free.dev",
    BACKEND_API: "https://lableaf-backend.onrender.com"
  };

  const IA_API = window.LABLEAF_CONFIG.IA_API.replace(/\/+$/, "");
  const BACKEND_API = window.LABLEAF_CONFIG.BACKEND_API.replace(/\/+$/, "");

  const API_URL = `${IA_API}/predict`;

  function obterElemento(id) {
    return document.getElementById(id);
  }

  async function lerRespostaJson(resposta) {
    try {
      return await resposta.json();
    } catch {
      return {};
    }
  }

  function limparAnalise() {
    const input = obterElemento("imagemInput");
    const nomeArquivo = obterElemento("nomeArquivo");
    const previewImagem = obterElemento("previewImagem");
    const previewPlaceholder = obterElemento("previewPlaceholder");
    const resultado = obterElemento("resultado");
    const statusAnalise = obterElemento("statusAnalise");
    const removerBtn = obterElemento("removerImagem");

    if (input) input.value = "";

    if (previewImagem) {
      previewImagem.src = "";
      previewImagem.style.display = "none";
    }

    if (previewPlaceholder) {
      previewPlaceholder.style.display = "block";
    }

    if (nomeArquivo) {
      nomeArquivo.textContent = "";
    }

    if (resultado) {
      resultado.textContent = "Nenhuma análise realizada ainda.";
    }

    if (statusAnalise) {
      statusAnalise.textContent = "Aguardando imagem";
    }

    if (removerBtn) {
      removerBtn.classList.remove("show");
    }
  }

  async function analisarImagemNaIA(file) {
    const formData = new FormData();
    formData.append("file", file);

    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "ngrok-skip-browser-warning": "1"
      },
      body: formData
    });

    const dados = await lerRespostaJson(resposta);

    if (!resposta.ok) {
      throw new Error(dados.erro || dados.detail || "Erro na API de IA.");
    }

    return dados;
  }

  async function salvarAnaliseNoBackend(resultadoIA, nomeArquivo) {
    const token = localStorage.getItem("token");

    if (!token) {
      console.warn("Sem token. A análise não será salva no backend.");
      return null;
    }

    const payload = {
      nome_arquivo: nomeArquivo,
      classe: resultadoIA.classe || resultadoIA.doenca || resultadoIA.resultado || "",
      confianca: resultadoIA.confianca || resultadoIA.confidence || resultadoIA.probabilidade || null,
      recomendacao: resultadoIA.recomendacao || resultadoIA.recommendation || "",
      resultado_completo: resultadoIA
    };

    const resposta = await fetch(`${BACKEND_API}/analises/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const dados = await lerRespostaJson(resposta);

    if (!resposta.ok) {
      console.error("Erro ao salvar análise no backend:", dados);
      throw new Error(dados.detail || dados.message || "Erro ao salvar análise no banco.");
    }

    return dados;
  }

  function mostrarResultado(resultadoIA) {
    const resultado = obterElemento("resultado");
    const statusAnalise = obterElemento("statusAnalise");

    const classe =
      resultadoIA.classe ||
      resultadoIA.doenca ||
      resultadoIA.resultado ||
      "Não informado";

    const confianca =
      resultadoIA.confianca ||
      resultadoIA.confidence ||
      resultadoIA.probabilidade ||
      "Não informado";

    const recomendacao =
      resultadoIA.recomendacao ||
      resultadoIA.recommendation ||
      "Nenhuma recomendação retornada.";

    if (resultado) {
      resultado.innerHTML = `
        <strong>Doença identificada:</strong> ${classe}<br>
        <strong>Confiança:</strong> ${confianca}%<br>
        <strong>Recomendação:</strong> ${recomendacao}
      `;
    }

    if (statusAnalise) {
      statusAnalise.textContent = "Resultado pronto";
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    const botao = obterElemento("botaoUpload");
    const input = obterElemento("imagemInput");
    const nomeArquivo = obterElemento("nomeArquivo");
    const previewImagem = obterElemento("previewImagem");
    const previewPlaceholder = obterElemento("previewPlaceholder");
    const resultado = obterElemento("resultado");
    const statusAnalise = obterElemento("statusAnalise");

    const menuButton = obterElemento("menuButton");
    const dropdownMenu = obterElemento("dropdownMenu");
    const logoutBtn = obterElemento("logoutBtn");
    const removerBtn = obterElemento("removerImagem");

    if (localStorage.getItem("logado") !== "true" || !localStorage.getItem("token")) {
      window.location.href = "login.html";
      return;
    }

    if (menuButton && dropdownMenu) {
      menuButton.addEventListener("click", function (e) {
        e.stopPropagation();
        dropdownMenu.classList.toggle("show");
      });

      document.addEventListener("click", function () {
        dropdownMenu.classList.remove("show");
      });

      dropdownMenu.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }

    if (logoutBtn && !logoutBtn.dataset.logoutBound) {
      logoutBtn.dataset.logoutBound = "true";

      logoutBtn.addEventListener("click", function (event) {
        event.preventDefault();

        if (typeof window.sair === "function") {
          window.sair();
          return;
        }

        localStorage.removeItem("token");
        localStorage.removeItem("logado");
        localStorage.removeItem("usuarioNome");
        localStorage.removeItem("usuarioEmail");

        window.location.href = "login.html";
      });
    }

    if (removerBtn) {
      removerBtn.addEventListener("click", function () {
        limparAnalise();
      });
    }

    if (botao && input && nomeArquivo && previewImagem && resultado) {
      botao.addEventListener("click", function () {
        input.click();
      });

      input.addEventListener("change", async function () {
        const file = input.files[0];

        if (!file) return;

        nomeArquivo.textContent = `Arquivo selecionado: ${file.name}`;

        const url = URL.createObjectURL(file);
        previewImagem.src = url;
        previewImagem.style.display = "block";

        if (previewPlaceholder) {
          previewPlaceholder.style.display = "none";
        }

        if (removerBtn) {
          removerBtn.classList.add("show");
        }

        resultado.textContent = "Analisando imagem...";

        if (statusAnalise) {
          statusAnalise.textContent = "Analisando";
        }

        try {
          const resultadoIA = await analisarImagemNaIA(file);

          mostrarResultado(resultadoIA);

          try {
            await salvarAnaliseNoBackend(resultadoIA, file.name);

            if (statusAnalise) {
              statusAnalise.textContent = "Resultado salvo";
            }
          } catch (erroBackend) {
            console.warn("A IA funcionou, mas não salvou no backend:", erroBackend);

            if (statusAnalise) {
              statusAnalise.textContent = "Resultado pronto, mas não salvo";
            }
          }
        } catch (erro) {
          console.error("Erro na análise:", erro);

          resultado.textContent = "Erro: " + erro.message;

          if (statusAnalise) {
            statusAnalise.textContent = "Erro na análise";
          }
        }
      });
    }
  });
})();