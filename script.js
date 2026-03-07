const botao = document.getElementById("botaoUpload");
const input = document.getElementById("imagemInput");
const nomeArquivo = document.getElementById("nomeArquivo");
const previewImagem = document.getElementById("previewImagem");
const resultado = document.getElementById("resultado");

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