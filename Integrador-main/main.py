from fastapi import FastAPI, File, UploadFile
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from ultralytics import YOLO
import shutil
import os

app = FastAPI()

# Criar pastas
os.makedirs("static", exist_ok=True)
os.makedirs("uploads", exist_ok=True)
os.makedirs("templates", exist_ok=True)

# Carregar modelo
model = YOLO("best.pt")

# Servir arquivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# 🔥 MAPA CORRETO (BASEADO NAS SUAS PASTAS)
mapa_classes = {
    "bacterial_blight": "Queima Bacteriana",
    "brown_spot": "Mancha Parda",
    "crestamento": "Crestamento",
    "ferrugem": "Ferrugem",
    "Mosaic Virus": "Vírus do Mosaico",
    "powdery_mildew": "Oídio",
    "septoria": "Septoriose",
    "Southern blight": "Podridão do Sul",
    "Sudden Death Syndrome": "Síndrome da Morte Súbita",
    "Yellow Mosaic": "Mosaico Amarelo"
}

# 🔥 RECOMENDAÇÕES
recomendacoes = {
    "Queima Bacteriana": "Aplicar bactericida e evitar alta umidade.",
    "Mancha Parda": "Uso de fungicidas.",
    "Crestamento": "Remover partes afetadas.",
    "Ferrugem": "Aplicar fungicidas específicos.",
    "Vírus do Mosaico": "Controlar insetos vetores.",
    "Oídio": "Aplicar enxofre.",
    "Septoriose": "Uso de fungicidas.",
    "Podridão do Sul": "Melhorar drenagem.",
    "Síndrome da Morte Súbita": "Rotação de culturas.",
    "Mosaico Amarelo": "Controle de pragas."
}

# Página principal
@app.get("/", response_class=HTMLResponse)
def home():
    with open("templates/index.html", "r", encoding="utf-8") as f:
        return f.read()

# Predição
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    file_path = os.path.join("uploads", file.filename)

    # Salvar imagem
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Rodar modelo
    results = model(file_path)

    # Salvar imagem com resultado
    results[0].save(filename="static/resultado.jpg")

    # 🔥 PEGAR PROBABILIDADE
    probs = results[0].probs

    classe_id = int(probs.top1)
    confianca = float(probs.top1conf)

    nome_original = model.names[classe_id]

    # Traduzir
    nome_tratado = mapa_classes.get(nome_original, nome_original)

    # Recomendação
    recomendacao = recomendacoes.get(nome_tratado, "Sem recomendação.")

    return {
        "classe": nome_tratado,
        "confianca": round(confianca * 100, 2),
        "recomendacao": recomendacao,
        "imagem_resultado": "/static/resultado.jpg"
    }