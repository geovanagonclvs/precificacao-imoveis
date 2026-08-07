import pickle, os

objeto = {
    'nome': "nome",
    'idade': 2
}

lista = [1, 2, 3]


with open("preco_imoveis.pkl", 'wb') as arquivo:

    pickle.dump(lista, arquivo)





