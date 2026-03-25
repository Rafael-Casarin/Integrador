const botao = document.getElementById("botaoUpload");
const input = document.getElementById("imagemInput");
const nomeArquivo = document.getElementById("nomeArquivo");
const previewImagem = document.getElementById("previewImagem");
const resultado = document.getElementById("resultado");

if (botao && input && nomeArquivo && previewImagem && resultado) {
  botao.addEventListener("click", () => {
    input.click();
  });

  input.addEventListener("change", async () => {
    const file = input.files[0];

    if (file) {
      nomeArquivo.textContent = `Arquivo selecionado: ${file.name}`;

      // preview da imagem
      const url = URL.createObjectURL(file);
      previewImagem.src = url;
      previewImagem.style.display = "block";

      resultado.textContent = "Analisando imagem...";

      try {
        // 🔥 ENVIO PARA API
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/predict", {
          method: "POST",
          body: formData
        });

        const data = await response.json();

        // 🔥 MOSTRAR RESULTADO
        resultado.innerHTML = `
          🌿 Doença: <b>${data.classe}</b><br>
          📊 Confiança: <b>${data.confianca}%</b><br>
          💡 ${data.recomendacao}
        `;

        // 🔥 MOSTRAR IMAGEM PROCESSADA
        previewImagem.src = data.imagem_resultado;

      } catch (error) {
        console.error(error);
        resultado.textContent = "Erro ao analisar imagem.";
      }

    } else {
      nomeArquivo.textContent = "";
      previewImagem.style.display = "none";
      resultado.textContent = "";
    }
  });
}