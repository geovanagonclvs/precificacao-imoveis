
function impedirRecarregamento(){

    const formulario = document.getElementById("formulario")
    const botao = document.getElementById("botao")

    formulario.addEventListener('submit', (e) =>{
        e.preventDefault();

        console.log("O formulário foi enviado");

    });
    

}

pegarDados()


function montarJSON(){

}