
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

// NOVO: Quartos, Banheiros, Com Suíte e Vagas de Garagem agora são
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
 
    enviarParaAPI(dados, dadosParaTela)
}
 
 
// Pega o texto visível de um <select> (com acento), não o value
function textoDoSelect(id) {
    const select = document.getElementById(id)
    return select.selectedOptions[0] ? select.selectedOptions[0].text : ""
}
 
 
// ===================================================================
// Envia pra API e trata a resposta (sucesso ou erro)
// ===================================================================
async function enviarParaAPI(dados, dadosParaTela) {
    mostrarTela("carregando")
 
    try {
        const resposta = await fetch('http://127.0.0.1:8000/precificar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(dados)
        })
 
        if (!resposta.ok) {
            throw new Error(`API respondeu com status ${resposta.status}`)
        }
 
        const resultado = await resposta.json()
        exibirResultado(resultado, dadosParaTela)
        mostrarTela("resultado")
 
    } catch (erro) {
        console.error("Erro ao chamar a API:", erro)
        mostrarTela("formulario")
        document.getElementById("mensagemErro").textContent =
            "Não foi possível calcular a estimativa agora. Verifique se a API está rodando (uvicorn) e tente novamente."
    }
}
 
 
// ===================================================================
// Alterna entre as 3 telas (formulário / carregando / resultado)
// ===================================================================
function mostrarTela(nome) {
    document.getElementById("telaFormulario").classList.add("oculto")
    document.getElementById("telaCarregando").classList.add("oculto")
    document.getElementById("telaResultado").classList.add("oculto")
    document.getElementById("btnVoltarTopo").classList.add("oculto")
 
    if (nome === "formulario") document.getElementById("telaFormulario").classList.remove("oculto")
    if (nome === "carregando") document.getElementById("telaCarregando").classList.remove("oculto")
    if (nome === "resultado") {
        document.getElementById("telaResultado").classList.remove("oculto")
        document.getElementById("btnVoltarTopo").classList.remove("oculto")
    }
 
    window.scrollTo({ top: 0, behavior: "smooth" })
}
 
 
// ===================================================================
// Preenche a tela de resultado com o que a API devolveu + os dados
// que o usuário digitou.
//
// ATENÇÃO: o Backend (rotas.py) hoje devolve preco_previsto e
// texto_comercial (confirmado no schemas.py/rotas.py). Não existe
// ainda uma "faixa" (mínimo/máximo) vinda da API — calculei uma faixa
// aproximada (±8%) só pra preencher a tela; troque pelo valor real
// assim que o Backend passar a devolver isso.
// ===================================================================
function exibirResultado(resultado, dadosParaTela) {
    const preco = resultado.preco_previsto ?? resultado.preco ?? 0
    const texto = resultado.texto_comercial ?? resultado.texto ?? "Descrição não disponível no momento."
 
    const faixaMin = preco * 0.92
    const faixaMax = preco * 1.08
    const textoFaixa = `Faixa: ${formatarMoeda(faixaMin)} — ${formatarMoeda(faixaMax)}`
 
    // ---- Foto de capa + preço em destaque ----
    document.getElementById("resultadoPreco").textContent = formatarMoeda(preco)
    document.getElementById("resultadoFaixa").textContent = textoFaixa
 
    // ---- Coluna principal ----
    document.getElementById("resultadoLocal").textContent = `${dadosParaTela.bairro} · São Paulo, SP`
    document.getElementById("resultadoTitulo").textContent =
        `${dadosParaTela.imovel} · ${dadosParaTela.quartos} quartos · ${dadosParaTela.area} m²`
    document.getElementById("resultadoSubtitulo").textContent =
        `${dadosParaTela.tipoConstrucao} · ${dadosParaTela.suites} suítes · ${dadosParaTela.vagas} vagas`
 
    document.getElementById("resultadoSpecsGrid").innerHTML = `
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18v2M21 18v2"/><path d="M3 12V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>${dadosParaTela.quartos} Quartos</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12V6a2 2 0 0 1 3.5-1.3"/><path d="M2 12h18a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1z"/></svg>${dadosParaTela.suites} Suítes</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9V6a3 3 0 0 1 5.5-1.7"/><path d="M4 9h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>${dadosParaTela.banheiros} Banheiros</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="13" width="18" height="6" rx="1.2"/><circle cx="7.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/></svg>${dadosParaTela.vagas} Vagas de Garagem</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="10" rx="1"/></svg>${dadosParaTela.area} m² de Área</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 12h18"/></svg>${dadosParaTela.tipoConstrucao}</div>
    `
 
    document.getElementById("resultadoTexto").textContent = texto
 
    // ---- Card lateral ----
    document.getElementById("resultadoPrecoCard").textContent = formatarMoeda(preco)
    document.getElementById("resultadoFaixaCard").textContent = textoFaixa
    document.getElementById("resultadoPrecoM2").textContent = formatarMoeda(preco / dadosParaTela.area) + "/m²"
    document.getElementById("resultadoAreaTotal").textContent = `${dadosParaTela.area} m²`
    document.getElementById("resultadoBairroCard").textContent = dadosParaTela.bairro
    document.getElementById("resultadoTipoCard").textContent = dadosParaTela.imovel
}
 
function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL",
        maximumFractionDigits: 0
    })
}
 
 
// ===================================================================
// Botões da tela de resultado
// ===================================================================
function iniciarBotoesDeResultado() {
    document.getElementById("btnVoltarTopo").addEventListener("click", () => mostrarTela("formulario"))
 
    document.getElementById("btnNovaAvaliacao").addEventListener("click", () => {
        document.getElementById("formulario").reset()
        document.querySelectorAll(".btn-opcao.ativo").forEach((b) => b.classList.remove("ativo"))
        mostrarTela("formulario")
    })
 
    // "Falar com um corretor" ainda não tem destino definido — por
    // enquanto só avisa. Confirmar com a Geovana se isso vira link de
    // WhatsApp, telefone, ou formulário de contato.
    document.getElementById("btnFalarCorretor").addEventListener("click", () => {
        alert("Em breve: contato com um corretor.")
    })
 
    document.getElementById("btnCompartilhar").addEventListener("click", async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            alert("Link copiado!")
        } catch (erro) {
            console.error("Não foi possível copiar o link:", erro)
        }
    })
}
 
iniciarBotoesDeResultado()


    fetch('http://127.0.0.1:8000/precificar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'


        },
        body: JSON.stringify(dados)

    
        
    })

    console.log(dados)
