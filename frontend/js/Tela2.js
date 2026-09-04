// ===================================================================
// FOTOS DE CAPA — a API não devolve foto nenhuma do imóvel real (a
// Geovana confirmou que o site não mostra o imóvel de verdade, só a
// estimativa de preço). Por isso usamos fotos de banco de imagens
// (Unsplash, uso livre) e sorteamos uma diferente a cada consulta.
// ===================================================================
const FOTOS_CAPA = [
    "https://images.unsplash.com/photo-1760067537293-6b30141d6a52?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1570129477492-45c003edd2be?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1598228723793-52759bba239c?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1523217582562-09d0def993a6?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1628624747186-a941c476b7ef?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1494526585095-c41746248156?fm=jpg&q=70&w=1600&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1592595896616-c37162298647?fm=jpg&q=70&w=1600&auto=format&fit=crop"
]

function sortearFotoCapa() {
    const indice = Math.floor(Math.random() * FOTOS_CAPA.length)
    return FOTOS_CAPA[indice]
}


// ===================================================================
// Ao carregar a página, lê o que o formulário guardou no
// sessionStorage. Se não tiver nada (usuário abriu a página direto,
// sem preencher o formulário), mostra um aviso em vez de quebrar.
// ===================================================================
function iniciar() {

    // "Modo de teste" — usa uma resposta fictícia em vez de chamar a
    // API de verdade. Ver botão "Ver exemplo" no index.html / main.js.
    if (sessionStorage.getItem("modoTeste") === "true") {
        const dadosParaTela = JSON.parse(sessionStorage.getItem("dadosParaTela"))
        const respostaFicticia = JSON.parse(sessionStorage.getItem("respostaFicticiaDaApi"))

        sessionStorage.removeItem("modoTeste")
        sessionStorage.removeItem("respostaFicticiaDaApi")

        exibirResultado(respostaFicticia, dadosParaTela)
        mostrarTela("resultado")
        return
    }

    const payloadSalvo = sessionStorage.getItem("payloadApi")
    const dadosParaTelaSalvo = sessionStorage.getItem("dadosParaTela")

    if (!payloadSalvo || !dadosParaTelaSalvo) {
        mostrarTela("semDados")
        return
    }

    const dados = JSON.parse(payloadSalvo)
    const dadosParaTela = JSON.parse(dadosParaTelaSalvo)

    enviarParaAPI(dados, dadosParaTela)
}


// ===================================================================
// Chama a API e trata sucesso/erro
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
        sessionStorage.setItem("erroApi", "Não foi possível calcular a estimativa agora. Verifique se a API está rodando (uvicorn) e tente novamente.")
        window.location.href = "index.html"
    }
}


// ===================================================================
// Alterna entre "carregando" / "resultado" / "sem dados"
// ===================================================================
function mostrarTela(nome) {
    document.getElementById("telaCarregando").classList.add("oculto")
    document.getElementById("telaResultado").classList.add("oculto")
    document.getElementById("telaSemDados").classList.add("oculto")

    if (nome === "carregando") document.getElementById("telaCarregando").classList.remove("oculto")
    if (nome === "resultado") document.getElementById("telaResultado").classList.remove("oculto")
    if (nome === "semDados") document.getElementById("telaSemDados").classList.remove("oculto")
}


// ===================================================================
// Preenche a tela de resultado com o que a API devolveu + os dados
// que o usuário digitou.
//
// ATENÇÃO: o Backend hoje devolve preco_previsto e texto_comercial.
// Não existe ainda uma "faixa" (mínimo/máximo) vinda da API —
// calculei uma faixa aproximada (±8%) só pra preencher a tela; troque
// pelo valor real assim que o Backend passar a devolver isso.
// ===================================================================
function exibirResultado(resultado, dadosParaTela) {
    const preco = resultado.preco_previsto ?? resultado.preco ?? 0
    const texto = resultado.texto_comercial ?? resultado.texto ?? "Descrição não disponível no momento."

    const faixaMin = preco * 0.92
    const faixaMax = preco * 1.08
    const textoFaixa = `Faixa: ${formatarMoeda(faixaMin)} — ${formatarMoeda(faixaMax)}`

    document.getElementById("resultadoHero").style.backgroundImage =
        `linear-gradient(to top, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 60%), url("${sortearFotoCapa()}")`

    // Bairros agora são do município de Salto, SP (não mais São Paulo capital)
    document.getElementById("resultadoLocal").textContent = `${dadosParaTela.bairro} · Salto, SP`
    document.getElementById("resultadoTitulo").textContent =
        `${dadosParaTela.imovel} · ${dadosParaTela.quartos} quartos · ${dadosParaTela.area} m²`
    document.getElementById("resultadoSubtitulo").textContent =
        `${dadosParaTela.suites} suítes · ${dadosParaTela.vagas} vagas de garagem`

    document.getElementById("resultadoSpecsGrid").innerHTML = `
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18v2M21 18v2"/><path d="M3 12V8a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>${dadosParaTela.quartos} Quartos</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M4 12V6a2 2 0 0 1 3.5-1.3"/><path d="M2 12h18a1 1 0 0 1 1 1v1a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4v-1a1 1 0 0 1 1-1z"/></svg>${dadosParaTela.suites} Suítes</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 9V6a3 3 0 0 1 5.5-1.7"/><path d="M4 9h13a1 1 0 0 1 1 1v1a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-1a1 1 0 0 1 1-1z"/></svg>${dadosParaTela.banheiros} Banheiros</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="13" width="18" height="6" rx="1.2"/><circle cx="7.5" cy="19" r="1.3"/><circle cx="16.5" cy="19" r="1.3"/></svg>${dadosParaTela.vagas} Vagas de Garagem</div>
        <div class="resultado-spec"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="7" width="18" height="10" rx="1"/></svg>${dadosParaTela.area} m² de Área</div>
    `

    document.getElementById("resultadoTexto").textContent = texto

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
// Botões da página
// ===================================================================
function iniciarBotoes() {
    document.getElementById("btnVoltarTopo").addEventListener("click", () => window.location.href = "index.html")
    document.getElementById("btnVoltarSemDados").addEventListener("click", () => window.location.href = "index.html")

    document.getElementById("btnNovaAvaliacao").addEventListener("click", () => {
        sessionStorage.removeItem("payloadApi")
        sessionStorage.removeItem("dadosParaTela")
        window.location.href = "index.html"
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


iniciarBotoes()
iniciar()