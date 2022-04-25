/* -------------------Variáveis--------------------------*/
let click = 0;
let ponto = 0;
let lista;


/* -------------------API--------------------------*/
const pegarTodosOsQuizzes = axios.get("https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes");
pegarTodosOsQuizzes.then(renderizarTodosOsQuizzes);
pegarTodosOsQuizzes.catch(function (){ window.location.reload})
console.log(pegarTodosOsQuizzes)



/* -------------------Tela 1--------------------------*/

function criarQuizz() {
    const tela1 = document.querySelector(".tela01")
    tela1.classList.add("displaynone");

    let selecionado = document.querySelector(".tela03Comeco");
    selecionado.classList.remove("displaynone");

    setTimeout(() => {window.scrollTo({top: 0, behavior: "smooth",})});
}

function renderizarTodosOsQuizzes(resposta) {
    lista = resposta.data;
    console.log(lista)

    let selecionado = document.querySelector(".todosOsQuizzes")
    for(let i = 0; i < lista.length; i++) {
        selecionado.innerHTML += 
        `
        <div class="imagen" onclick="abrindoQuizz(${lista[i].id})">
            <img src="${lista[i].image}" alt="">
            <div class="gradiente">
            <p>${lista[i].title}</p>
        </div>
        `
    }
        userQuizz(resposta)
}

function userQuizz(resposta){
    
    lista = resposta.data;
    console.log(lista)
    let i = 0
    const criarQuizz = document.querySelector(".display")
    for(let i = 0; i < lista.length; i++) {
        criarQuizz.innerHTML += `

            <div class="display-userQuizzes" onclick="criarQuizz() )">         
                <img src="${lista[i].image}" alt="">
                <div class="gradiente-userQuizzes"></div>
                <p>${lista[i].title}</p>
            </div>
        `
    }
}

function abrindoQuizz(acessarId){

    let acessarIdString = acessarId.toString()
    console.log(typeof acessarIdString)
    const buscar = axios.get(`https://mock-api.driven.com.br/api/v6/buzzquizz/quizzes/${acessarIdString}`) //mesma lógica da parte do whatsapp do DrivenEats
    buscar.then(pagina2)
    
}

function pagina2(resposta){
    lista = resposta.data
    console.log(resposta.data)

    document.querySelector(".tela01").classList.add("displaynone")
    document.querySelector(".tela02").classList.remove("displaynone")

    setTimeout(() => {window.scrollTo({top: 0, behavior: "smooth",})});
    headerDoQuizz()
    renderizarPerguntas()
}



/* -------------------Tela 2--------------------------*/

function headerDoQuizz(){
    const headerQuizz = document.querySelector("#titulo-quizz")

    headerQuizz.innerHTML = `
    <div id="titulo-quizz"> 
        <img src="${lista.image}">
        <p> ${lista.title} </p> 
    </div>
    `
    /*document.getElementById("titulo-quizz").style.backgroundImage = URL(lista.image)*/
}

function renderizarPerguntas(){
    let i = 0;

    const perguntas = lista.questions;
    const blocoDasPerguntas = document.querySelector(".bloco");

    perguntas.forEach(pergunta => {
        let cor = pergunta.color
        blocoDasPerguntas.innerHTML += `
        <div class="blocoDeCadaPergunta">
            <div class="pergunta" id="${i}" > 
                <p>${pergunta.title}</p> 
            </div>

            <div class="respostas">${renderizarRespostar(pergunta)}</div>
        </div>
        `

        document.getElementById(`${i}`).style.backgroundColor = cor
        i++
    });

}

function renderizarRespostar(pergunta){
    let blocoDasRespostas = "";
    const respostas = pergunta.answers
    const embaralharRespostas = respostas.sort(() => Math.random() - 0.5)
    console.log(respostas)
    console.log(embaralharRespostas)

    respostas.forEach(resposta => {
        blocoDasRespostas += `
        <div class="resposta ${resposta.isCorrectAnswer}" onclick="escolherResposta(this)"> 
            <img src="${resposta.image}">
            <p>${resposta.text}</p> 
        </div>
        `
    })
    
    return blocoDasRespostas
}

function escolherResposta(elemento){

    let elementoParente = elemento.parentNode;
    let selecionarResposta = elementoParente.querySelectorAll(".resposta");
    let elementoSelecionado;
    let quizResultado = document.querySelector(".resultadoFinal");

    if(!elemento.classList.contains("selecionada")){
        click++

        if(elemento.classList.contains("true")){
            ponto++
        }
        elemento.classList.add("selecionada")
            selecionarResposta.forEach(resposta => {
                elementoSelecionado = resposta.classList.contains("selecionada")
                if (elementoSelecionado == false){
                    resposta.classList.add("naoSelecionada")
                    resposta.setAttribute("onclick", "")
                }
            })

            let parente = elemento.parentNode;
        
            let verdadeiro = parente.querySelector(".true p");
            verdadeiro.style.color="green";
        
            let falso = parente.querySelectorAll(".false p"); 
            falso.forEach(pergunta => {
                pergunta.style.color="red";
            });
    }

    let tamanho = lista.questions
    let numeroDePerguntas = tamanho.length;
    console.log(numeroDePerguntas)
    console.log(click)
    if(click == numeroDePerguntas){
        let pontos = Math.round((ponto / numeroDePerguntas) * 100);
        console.log(pontos)
        let niveis = lista.levels;
        console.log(niveis)

        niveis.forEach(lista => {
            if(pontos >= lista.minValue){
                quizResultado.innerHTML = `
                <div class="topo-resultado">
                    <p> ${pontos}% de acerto: ${lista.title}</p>
                </div>
                
                <div class="bloco-resultado">
                    <img src="${lista.image}">
                    <p>${lista.text}</p>
                </div>
            `
            }
        })
        quizResultado.classList.remove("displaynone")
        setTimeout(() => {
            window.scrollTo({top: document.body.scrollHeight, behavior: "smooth",
            });
          }, 300);
    }
    else {
        setTimeout(() => {
            window.scrollBy({top: elemento.parentElement.parentElement.offsetHeight + 30, behavior: "smooth",
            })
          }, 300)
    }

    if (!quizResultado.classList.contains("displaynone")){
        click = 0
        ponto = 0
        pontos = 0
    }
} 
    


/* -------------------Botões--------------------------*/

function reiniciar(resposta){
    setTimeout(() => {
        window.scrollTo({top: 0, behavior: "smooth",
        });
      }, 200);


    let tirarCor = document.querySelectorAll(".respostas p")
    tirarCor.forEach(p => {
        p.style.color = "black"
    })

    let resetarImagens = document.querySelectorAll(".resposta")
    resetarImagens.forEach(  resposta => {
        resposta.classList.remove("naoSelecionada")
        resposta.classList.remove("selecionada")
        resposta.removeAttribute("onclick", "")
        resposta.setAttribute("onclick", "escolherResposta(this)")
    })

    let resetarResultado = document.querySelector(".resultadoFinal")
    resetarResultado.classList.add("displaynone")

}

function voltar(){
    window.location.reload()
}




/* -------------------Tela 3--------------------------*/

function criarPerguntas() {

    let tituloTela03Comeco = document.querySelector(".tela03").querySelector(".inputs :nth-child(1)").value;
    let urlImagemTela03Comeco = document.querySelector(".tela03").querySelector(".inputs :nth-child(2)").value;
    let qtdPerguntasTela03Comeco = document.querySelector(".tela03").querySelector(".inputs :nth-child(3)").value;
    let qtdNiveisTela03Comeco = document.querySelector(".tela03").querySelector(".inputs :nth-child(4)").value;
    qtdPerguntasTela03Comeco = parseInt(qtdPerguntasTela03Comeco);
    qtdNiveisTela03Comeco = parseInt(qtdNiveisTela03Comeco);

    let dados = {
        title: `${tituloTela03Comeco}`,
        image: `${urlImagemTela03Comeco}`,
        qtdPerg: `${qtdPerguntasTela03Comeco}`,
        qtdNiv: `${qtdNiveisTela03Comeco}`,
    }

 
    console.log(dados)
    console.log(tituloTela03Comeco.length)


let validacao = (tituloTela03Comeco == "" || tituloTela03Comeco.length < 20 || tituloTela03Comeco.length > 65 || urlImagemTela03Comeco == "" || qtdPerguntasTela03Comeco == "" || qtdPerguntasTela03Comeco < 3 || qtdNiveisTela03Comeco == "" || qtdNiveisTela03Comeco < 2);

    if(validacao) {
        document.querySelector(".tela03").querySelector(".inputs :nth-child(1)").value = "";
        document.querySelector(".tela03").querySelector(".inputs :nth-child(2)").value = "";
        document.querySelector(".tela03").querySelector(".inputs :nth-child(3)").value = "";
        document.querySelector(".tela03").querySelector(".inputs :nth-child(4)").value = "";
        alert("Dados Invalidos, tente novamente.\nOBS:\n(1)Titulo entre 20 a 65 caracteres.\n(2)No minimo  3 perguntas.\n(3)No minimo 2 niveis.")



    }
    else {
       
        document.querySelector(".tela03Comeco").classList.add("displaynone");
        document.querySelector(".tela03Perguntas").classList.remove("displaynone");

        let selecionado = document.querySelector(".tela03Perguntas").querySelector(".perguntasDinamica");
        
    
        for(let i = 0; i < qtdPerguntasTela03Comeco; i++) {
        selecionado.innerHTML += `
            <div class="conteudo">
                <p>Pergunta ${i + 1}</p>
                <input type="text" placeholder="Texto da pergunta">
                <input type="color" name="" id="" placeholder="Cor de fundo da pergunta">

                <p>Resposta correta</p>
                <input type="text" placeholder="Resposta correta">
                <input type="url" name="" id="" placeholder="URL da imagem">

                <p>Respostas incorretas</p>
                <input type="text" placeholder="Resposta incorreta 1">
                <input type="url" name="" id="" placeholder="URL da imagem 1">

                <div class="espaco"></div>

                <input type="text" placeholder="Resposta incorreta 2">
                <input type="url" name="" id="" placeholder="URL da imagem 2">

                <div class="espaco"></div>

                <input type="text" placeholder="Resposta incorreta 3">
                <input type="url" name="" id="" placeholder="URL da imagem 3">

            
            </div>
        `
       }
       selecionado.innerHTML += `
       <button onclick="criarNiveis()">Prosseguir para criar níveis</button>
       <div class="espaco"></div>
       `
    }

}

function criarNiveis() {
    document.querySelector(".tela03Perguntas").classList.add("displaynone")
    document.querySelector(".tela03Niveis").querySelector.remove("displaynone")
    

}

function finalizarQuizz() {
    document.querySelector("tela03Niveis").classList.add("displaynone");
    
}