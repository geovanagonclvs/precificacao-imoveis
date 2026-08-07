#biblioteca capaz de *desserializar* um objeto python
# que seria transformar o arquivo em um objeto novamente.
# o arquivo .pkl é um arquivo binário
import os, pickle

def carregar_modelo():

    with open("preco_imoveis.pkl", 'rb') as arquivo:

        modelo_carregado = pickle.load(arquivo)

        return modelo_carregado


# def transformar_em_objeto():

#     with open("preco_imoveis.pkl", 'rb') as arquivo:
    
#             modelo_transformado = pickle.loads(arquivo)
    
#             return modelo_transformado
    

print(carregar_modelo())