from fastapi import APIRouter
from api.schemas import Imovel


router = APIRouter()

@router.get("/")
def inicio():
    return {"message": "API de Precificação de Imóveis"}

@router.post("/precificar")
def precificar_imovel(imovel: Imovel):
    return {
        "preco_previsto": 500000.00,
        "texto_comercial": "Texto comercial de exemplo, ainda fixo.",
        "dados_recebidos": imovel
        }
