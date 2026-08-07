from pydantic import BaseModel, Field


class Imovel(BaseModel):

    model_config = {
        "extra": "forbid"
    }

    area_m2: float = Field(..., gt=0, description="Tamanho do imóvel em m²")
    quartos: int = Field(..., ge=0, description="Quantidade de quartos")
    banheiros: int = Field(..., ge=0, description="Quantidade de banheiros")
    vagas: int = Field(..., ge=0, description="Quantidade de vagas de garagem")
    bairro: str = Field(..., min_length=1, description="Bairro do imóvel")