from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def rota_raiz():
    return {"message": "API de Precificação de Imóveis"}

@app.post("/precificar")
def precificar_imovel():
    return {
        "preco_previsto": 500000.00,
        "texto_comercial": "Texto comercial de exemplo, ainda fixo."
    }