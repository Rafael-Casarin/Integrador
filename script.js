const botao = document.getElementById("botaoUpload");
const input = document.getElementById("imagemInput");
const nomeArquivo = document.getElementById("nomeArquivo");
const previewImagem = document.getElementById("previewImagem");
const previewPlaceholder = document.getElementById("previewPlaceholder");
const resultado = document.getElementById("resultado");
const statusAnalise = document.getElementById("statusAnalise");

const menuButton = document.getElementById("menuButton");
const dropdownMenu = document.getElementById("dropdownMenu");
const logoutBtn = document.getElementById("logoutBtn");
const removerBtn = document.getElementById("removerImagem");

// MENU DROPDOWN
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

// SAIR
if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("logado");
  });
}

// BOTÃO REMOVER IMAGEM
if (removerBtn) {
  removerBtn.addEventListener("click", function () {
    input.value = "";
    previewImagem.src = "";
    previewImagem.style.display = "none";

    if (previewPlaceholder) {
      previewPlaceholder.style.display = "block";
    }

    nomeArquivo.textContent = "";
    resultado.textContent = "Nenhuma análise realizada ainda.";

    if (statusAnalise) {
      statusAnalise.textContent = "Aguardando imagem";
    }

    removerBtn.classList.remove("show");
  });
}

// UPLOAD E ANÁLISE
if (botao && input && nomeArquivo && previewImagem && resultado) {
  botao.addEventListener("click", function () {
    input.click();
  });

  input.addEventListener("change", async function () {
    const file = input.files[0];

    if (!file) {
      nomeArquivo.textContent = "";
      previewImagem.src = "";
      previewImagem.style.display = "none";

      if (previewPlaceholder) {
        previewPlaceholder.style.display = "block";
      }

      resultado.textContent = "Nenhuma análise realizada ainda.";

      if (statusAnalise) {
        statusAnalise.textContent = "Aguardando imagem";
      }

      if (removerBtn) {
        removerBtn.classList.remove("show");
      }

      return;
    }

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
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/predict", {
        method: "POST",
        body: formData
      });

      if (!response.ok) {
        throw new Error("Falha na resposta da API");
      }

      const data = await response.json();

      resultado.innerHTML = `
        <strong>Doença identificada:</strong> ${data.classe}<br>
        <strong>Confiança:</strong> ${data.confianca}%<br>
        <strong>Recomendação:</strong> ${data.recomendacao}
      `;

      if (statusAnalise) {
        statusAnalise.textContent = "Resultado pronto";
      }

      if (data.imagem_resultado) {
        previewImagem.src = data.imagem_resultado;
      }
    } catch (error) {
      console.error("Erro ao analisar imagem:", error);
      resultado.textContent = "Erro ao analisar imagem.";

      if (statusAnalise) {
        statusAnalise.textContent = "Erro na análise";
      }
    }
  });
}