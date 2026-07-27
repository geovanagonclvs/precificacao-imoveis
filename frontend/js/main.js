
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
    
    inputCidade = document.getElementById("cidade").value
    inputBairro = document.getElementById("bairro").value
    inputImovel = document.getElementById("casa").value
    inputQuartos = document.getElementById("quartos").value
    inputGaragens = document.getElementById("garagens").value
    inputBanheiros = document.getElementById("banheiros").value
    inputSuites = document.getElementById("suites").value
    inputArea = document.getElementById("area").value
    

    const dados = {
         
                
        // cidade: inputCidade,
        bairro: inputBairro,
        // imovel: inputImovel,
        quartos: inputQuartos,
        vagas: inputGaragens,
        banheiros: inputBanheiros,
        area_m2: inputArea

}


    fetch('http://127.0.0.1:8000/precificar', {
        method: 'POST',
        headers: {
            'Contet-Type': 'application/json'


        },
        body: JSON.stringify(dados)

    
        
    })

    console.log(dados)
}