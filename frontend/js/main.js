
function impedirRecarregamento(){

    const formulario = document.getElementById("formulario")
    const botao = document.getElementById("botao")

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
// NOVO: se o Tela2.js mandou a gente de volta pra cá por causa de um
// erro na API, essa mensagem fica guardada no sessionStorage — aqui a
// gente lê e mostra ela no formulário, e depois apaga (senão ela
// ficaria aparecendo pra sempre, mesmo depois de resolvido).
// ===================================================================
function mostrarErroSalvo() {
    const erro = sessionStorage.getItem("erroApi")
    if (erro) {
        document.getElementById("mensagemErro").textContent = erro
        sessionStorage.removeItem("erroApi")
    }
}
 
mostrarErroSalvo()


//  Quartos, Banheiros, Com Suíte e Vagas de Garagem agora são
// grupos de botões (não são mais inputs nem checkboxes). Essa função
// faz eles funcionarem como um "select": só um botão fica marcado por
// vez, dentro do mesmo grupo (data-name="quartos", "banheiros", etc).
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
// (equivalente ao querySelector('input:checked').value da versão com checkbox)
function valorDoGrupo(nomeDoGrupo){
    const grupo = document.querySelector(`.campo-grupo[data-name="${nomeDoGrupo}"]`)
    const botaoAtivo = grupo.querySelector(".btn-opcao.ativo")
    return botaoAtivo ? botaoAtivo.dataset.valor : null
}


// Pega o texto visível de um <select> (com acento), não o value
function textoDoSelect(id) {
    const select = document.getElementById(id)
    return select.selectedOptions[0] ? select.selectedOptions[0].text : ""
}

// VERSÃO antiga (mantida comentada, como já estava) — pode
// apagar quando tiver certeza que não vai precisar voltar pra ela.
//  function montarJSON(){

    //         inputCidade = document.getElementById("cidade").value
    //         inputBairro = document.getElementById("bairro").value
    //         inputImovel = document.getElementById("casa").value

    // /*
    // Explicação do código abaixo:
    
    // input[name="nQuartos"]: procura pelos inputs que possuem o name = quartos
    // :checked: pegua paenas o que estiver marcado
    // .value: extrai o valor inserido pelo usuário

    
    // */
    //         inputQuartos = document.querySelector('input[name="nQuartos"]:checked').value

    //         inputGaragens = document.querySelector('input[name="nGaragens"]:checked').value

    //         inputBanheiros = document.querySelector('input[name="nBanheiros"]:checked').value

    //         inputSuites = document.querySelector('input[name="nSuites"]:checked').value

    //         inputArea = document.getElementById("area").value

    //         const dados = {
         
                
    //                 cidade: inputCidade,
    //                 bairro: inputBairro,
    //                 imovel: inputImovel,
    //                 quartos: inputQuartos,
    //                 garagens: inputGaragens,
    //                 banheiros: inputBanheiros,
    //                 area: inputArea
    

    //         }

    //         console.log(dados)


    //     }

function montarJSON(){
 
    inputBairro = document.getElementById("bairro").value
    inputImovel = document.getElementById("casa").value
    inputTipoConstrucao = document.getElementById("tipoConstrucao").value
    inputArea = document.getElementById("area").value
 
    // Antes: document.getElementById("quartos").value (quando quartos era um input)
    // Agora: pega o botão marcado dentro do grupo, igual o :checked fazia com o checkbox
    inputQuartos = valorDoGrupo("quartos")
    inputGaragens = valorDoGrupo("garagens")
    inputBanheiros = valorDoGrupo("banheiros")
    inputSuites = valorDoGrupo("suites")
 
    // Valida se todos os campos obrigatórios foram preenchidos
    const mensagemErro = document.getElementById("mensagemErro")
    const camposFaltando = []
 
    if (!inputBairro) camposFaltando.push("bairro")
    if (!inputImovel) camposFaltando.push("tipo de casa")
    if (!inputTipoConstrucao) camposFaltando.push("tipo de construção")
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
    // area_m2, quartos, banheiros, vagas, bairro. Por isso imovel,
    // tipo_construcao e suites continuam no formulário (pra bater com o
    // Figma), mas NÃO são enviados no payload ainda. Assim que o
    // schemas.py for atualizado pra aceitar esses campos, é só
    // descomentar as linhas abaixo.
    // ===================================================================
    const dados = {
 
        bairro: inputBairro,
        // imovel: inputImovel,
        // tipo_construcao: inputTipoConstrucao,
        quartos: Number(inputQuartos),
        vagas: Number(inputGaragens),
        banheiros: Number(inputBanheiros),
        // suites: Number(inputSuites),
        area_m2: Number(inputArea)
 
    }

    // Guarda também os campos "visuais" (que não vão pro Backend ainda),
    // pra poder mostrar tudo na tela de resultado mesmo assim
    const dadosParaTela = {
        bairro: inputBairro,
        imovel: textoDoSelect("casa"),
        tipoConstrucao: textoDoSelect("tipoConstrucao"),
        quartos: Number(inputQuartos),
        vagas: Number(inputGaragens),
        banheiros: Number(inputBanheiros),
        suites: Number(inputSuites),
        area: Number(inputArea)
    }

    // NOVO (por causa da separação em páginas): em vez de trocar de
    // "tela" com CSS, guardamos os dados no sessionStorage do navegador
    // e navegamos de verdade pra resultado.html. É a página de resultado
    // quem vai ler esses dados e chamar a API — ver js/Tela2.js
    // ===================================================================
    sessionStorage.setItem("payloadApi", JSON.stringify(dados))
    sessionStorage.setItem("dadosParaTela", JSON.stringify(dadosParaTela))
 
    window.location.href = "Tela2.html"
}
