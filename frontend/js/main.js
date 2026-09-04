function impedirRecarregamento(){

    const formulario = document.getElementById("formulario")

    /* 
    Explicação do código abaixo:

    Estamos pedindo para o JavaScript "ficar de olho" no elemento formulario, 
    especialmente no evento de 'submit', que acontece quando o usuário preenche os campos e clica no botão.

    Depois, nós damos um nome para essa supervisão, que por padrão é chamada de e ou event.

    E ao final, usamos a função de PREVINIR o comportamento padrão desse elemento, que no caso é de recarregar a página.
     
    */
    formulario.addEventListener('submit', (e) =>{
        e.preventDefault();

        montarJSON()

    });

}

impedirRecarregamento()

// ===================================================================
// Se o Tela2.js mandou a gente de volta pra cá por causa de um erro
// na API, essa mensagem fica guardada no sessionStorage — aqui a
// gente lê e mostra ela no formulário, e depois apaga.
// ===================================================================
function mostrarErroSalvo() {
    const erro = sessionStorage.getItem("erroApi")
    if (erro) {
        document.getElementById("mensagemErro").textContent = erro
        sessionStorage.removeItem("erroApi")
    }
}

mostrarErroSalvo()


// ===================================================================
// "Modo de teste" — simula uma resposta da API com dados fictícios,
// pra dar pra ver a Tela 2 preenchida sem precisar do backend rodando.
// Verifica se o botão existe antes de usar, pra não quebrar o script
// caso ele seja removido do HTML no futuro.
// ===================================================================
function iniciarModoTeste() {
    const botaoTeste = document.getElementById("btnModoTeste")
    if (!botaoTeste) return

    botaoTeste.addEventListener("click", () => {

        const dadosParaTelaFicticios = {
            bairro: "Jardim Panorama",
            imovel: "Casa construída",
            quartos: 3,
            vagas: 2,
            banheiros: 2,
            suites: 1,
            area: 150
        }

        const respostaFicticiaDaApi = {
            preco_previsto: 1254000,
            texto_comercial: "Localizado em uma das regiões mais valorizadas de Salto, este imóvel oferece amplos ambientes, ótima iluminação natural e excelente potencial de valorização. Ideal para quem busca conforto e localização privilegiada."
        }

        sessionStorage.setItem("modoTeste", "true")
        sessionStorage.setItem("dadosParaTela", JSON.stringify(dadosParaTelaFicticios))
        sessionStorage.setItem("respostaFicticiaDaApi", JSON.stringify(respostaFicticiaDaApi))

        window.location.href = "Tela2.html"
    })
}

iniciarModoTeste()


// ===================================================================
// Quartos, Banheiros, Com Suíte e Vagas de Garagem são grupos de
// botões (não são mais inputs nem checkboxes). Essa função faz eles
// funcionarem como um "select": só um botão fica marcado por vez,
// dentro do mesmo grupo (data-name="quartos", "banheiros", etc).
// ===================================================================
function iniciarBotoesDeOpcao(){

    const grupos = document.querySelectorAll(".campo-grupo")

    grupos.forEach((grupo) => {
        const botoes = grupo.querySelectorAll(".btn-opcao")

        botoes.forEach((botao) => {
            botao.addEventListener("click", () => {
                botoes.forEach((b) => b.classList.remove("ativo"))
                botao.classList.add("ativo")
            })
        })
    })
}

iniciarBotoesDeOpcao()

// Pega o valor marcado dentro de um grupo de botões
function valorDoGrupo(nomeDoGrupo){
    const grupo = document.querySelector(`.campo-grupo[data-name="${nomeDoGrupo}"]`)
    const botaoAtivo = grupo.querySelector(".btn-opcao.ativo")
    return botaoAtivo ? botaoAtivo.dataset.valor : null
}


function montarJSON(){

    inputBairro = document.getElementById("bairro").value
    inputArea = document.getElementById("area").value

    // Antes: document.getElementById("quartos").value (quando quartos era um input)
    // Agora: pega o botão marcado dentro do grupo
    inputQuartos = valorDoGrupo("quartos")
    inputGaragens = valorDoGrupo("garagens")
    inputBanheiros = valorDoGrupo("banheiros")
    inputSuites = valorDoGrupo("suites")

    // Valida se todos os campos obrigatórios foram preenchidos
    const mensagemErro = document.getElementById("mensagemErro")
    const camposFaltando = []

    if (!inputBairro) camposFaltando.push("bairro")
    if (!inputArea) camposFaltando.push("área")
    if (!inputQuartos) camposFaltando.push("quartos")
    if (!inputGaragens) camposFaltando.push("vagas de garagem")
    if (!inputBanheiros) camposFaltando.push("banheiros")
    if (!inputSuites) camposFaltando.push("suíte")

    if (camposFaltando.length > 0) {
        mensagemErro.textContent = `Preencha: ${camposFaltando.join(", ")}`
        return
    }

    mensagemErro.textContent = ""

    // ATENÇÃO: o schemas.py do Backend (classe Imovel) usa
    // "extra": "forbid" — só aceita exatamente estes 5 campos:
    // area_m2, quartos, banheiros, vagas, bairro. "imovel" continua
    // fixo (sempre "Casa construída"), mas NÃO é enviado no payload
    // ainda. Assim que o schemas.py aceitar esse campo, é só
    // descomentar a linha abaixo.
    const dados = {

        bairro: inputBairro,
        // imovel: "Casa construída",
        quartos: Number(inputQuartos),
        vagas: Number(inputGaragens),
        banheiros: Number(inputBanheiros),
        area_m2: Number(inputArea)

    }

    // Guarda também os campos "visuais" (que não vão pro Backend ainda),
    // pra poder mostrar tudo na tela de resultado mesmo assim
    const dadosParaTela = {
        bairro: inputBairro,
        imovel: "Casa construída",
        quartos: Number(inputQuartos),
        vagas: Number(inputGaragens),
        banheiros: Number(inputBanheiros),
        suites: Number(inputSuites),
        area: Number(inputArea)
    }

    // Guardamos os dados no sessionStorage do navegador e navegamos de
    // verdade pra Tela2.html. É a página de resultado quem vai ler
    // esses dados e chamar a API — ver js/Tela2.js
    sessionStorage.setItem("payloadApi", JSON.stringify(dados))
    sessionStorage.setItem("dadosParaTela", JSON.stringify(dadosParaTela))

    window.location.href = "Tela2.html"
}