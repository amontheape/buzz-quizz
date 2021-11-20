let screen1 = document.querySelector(".screen-1")
let screen2 = document.querySelector(".screen-2")
let screen3 = document.querySelector(".screen-3")
let form01 = document.querySelector(".form-01")
let form02 = document.querySelector(".form-02")
let form03 = document.querySelector(".form-03")
const quizzBanner = document.querySelector(".quizz-banner");

let globalData =[];
let selectedFromGlobal;
let rightAnswers = 0, wrongAnswers = 0;
let currentOpenQuestion;
let objQuestions = [];
let createQuizzObj = {
    title: "",
    image: "",
    questions: [],
    levels: []
}


function listAllQuizzes() {
    const getQuizzesPromise = axios.get("https://mock-api.driven.com.br/api/v4/buzzquizz/quizzes");

    getQuizzesPromise.then((response)=>{
        renderAllQuizzes(response);
        globalData = response.data;
    });

    getQuizzesPromise.catch(treatError);
}

function renderAllQuizzes({data}) {
    const containerAllQuizzes = document.querySelector(".all-quizzes ul");

    data.forEach(({id, title, image})=>{
        containerAllQuizzes.innerHTML += `
        <li>
          <div class="quizz-background" id="${id}">
            ${title}
          </div>
        </li>
        `
        document.getElementById(`${id}`).style.background = `url(${image})`;
    });

    addClick();
}

function addClick() {
    let ulYourQuizzes = document.querySelectorAll(".your-quizzes li")
    let ulAllQuizzes = document.querySelectorAll(".all-quizzes li")
    
    ulYourQuizzes.forEach( (element) => {
        element.addEventListener("click", selectedQuizz);
    });
    ulAllQuizzes.forEach( (element) => {
        element.addEventListener("click", selectedQuizz);
    });
}

function selectedQuizz(event){
    screen1.classList.add("none");
    screen2.classList.remove("none");

    quizzBanner.classList.remove("none");

    globalData.forEach((element)=>{
        if (element.id == event.target.id){
            selectedFromGlobal = element;
        }
    });

    renderSelectedQuizz(selectedFromGlobal);
}
    
function renderSelectedQuizz({id, image, levels, questions, title}){
   
    quizzBanner.style.backgroundImage = `url(${image})`;
    document.querySelector(".quizz-banner div").innerHTML = `${title}`;

    windowScroller(0);

    const quizzContainer = document.querySelector(".quizz-container");

    let i = 0;

    questions.forEach(({title, color, answers})=>{
       
        quizzContainer.innerHTML += `
            <div class="questions-wrapper">
                <div class="questions-title">${title}</div>
                <div class="answers-wrapper wrapper${i}">

                </div>
            </div>
        `
        const titleHeader = document.querySelectorAll('.questions-title');
        titleHeader[i].style.backgroundColor = `${color}`;

        if(color==='#fff' || color==='#ffffff' || color==='rgb(255,255,255)') {
            titleHeader[i].style.color = '#000';
        }

        const answersWrapper = document.querySelectorAll(".answers-wrapper");

        answers.sort(getRandom);

        answers.forEach(({text, image, isCorrectAnswer})=>{
            answersWrapper[i].innerHTML += `
                <div class="answer" id='${isCorrectAnswer}'>
                    <img src='${image}'/>
                    <span>${text}</span>
                    <div class="fade none"></div>
                </div>
            `
        });

        i++;
    });
    
    document.querySelectorAll(".answer").forEach((answer)=>answer.addEventListener('click', selectingAnswer));

}

function selectingAnswer(event){
    const selectedAnswer = event.currentTarget;

    checkAnswer(selectedAnswer);

    const wrapperIndex = selectedAnswer.parentNode.classList[1][7];
    
    document.querySelectorAll(`.wrapper${wrapperIndex} .answer`).forEach((answer)=>{
        answer.removeEventListener('click', selectingAnswer);

        if (answer !== selectedAnswer) {
            answer.childNodes[5].classList.remove('none');
        }
        
        if (answer.id === 'true'){
            answer.childNodes[3].classList.add('correct');
        } else {
            answer.childNodes[3].classList.add('wrong');
        }
    });

    if (wrapperIndex < 2) {
        setTimeout(()=>{
        const wrapperPos = selectedAnswer.parentNode.offsetTop;
        const wrapperHeight = selectedAnswer.parentNode.offsetHeight;
        windowScroller(wrapperPos+wrapperHeight);
        },2000);
    }
}

function checkAnswer(answer) {
    if(answer.id === 'true') {
        rightAnswers++;
    } else { wrongAnswers++; }

    console.log(answer.id);
    console.log(`respostas corretas: ${rightAnswers}`);
    console.log(`respostas incorretas: ${wrongAnswers}`);

    concludeQuizz(rightAnswers, wrongAnswers, selectedFromGlobal);
}

function concludeQuizz(wins, losses, {questions, levels}){
    const totalAnswers = wins + losses;

    let adequateLevelindex;

    if (totalAnswers === questions.length){
        let accuracy = Math.ceil((wins/totalAnswers)*100).toFixed();

        console.log(`percentual de acerto: ${accuracy}`);

        levels.forEach((level)=>{
            if( accuracy >= Number(level.minValue)){
                adequateLevelindex = levels.indexOf(level); 
            }
        });

        console.log(Number(levels[adequateLevelindex].minValue));
        
        document.querySelector(".quizz-container").innerHTML += `
            <div class="conclusion-wrapper">
                <div class="conclusion-title">${accuracy}% de acerto: ${levels[adequateLevelindex].title}</div>
                <div class="img-description-wrapper">
                    <img src="${levels[adequateLevelindex].image}">
                    <p>${levels[adequateLevelindex].text}</p>
                </div>
            </div>
        `
        // insert items bellow after validating tests
        // <button>Reiniciar Quizz</button>
        // <span>Voltar pra home</span>

        setTimeout(()=>{
            const wrapperPos = document.querySelector(".conclusion-wrapper").offsetTop;
            const wrapperHeight = document.querySelector(".conclusion-wrapper").offsetHeight;
            windowScroller(wrapperPos + wrapperHeight);
        }, 2000);
    }
}

function resetQuizz(){

}

function createQuizz(){
    screen1.classList.add("none");
    screen3.classList.remove("none");
    renderForm1()
}
function renderForm1(){
    form01.innerHTML = `
    <h2>Comece pelo começo</h2>

        <div class="quizz-infos">
            <div id="quizz-title"><input type="text" placeholder="Título do seu quizz"></div>
            <div id="quizz-img"><input type="text" placeholder="URL da imagem do seu quizz"></div>
            <div id="quizz-questions"><input type="text" placeholder="Quantidade de perguntas do quizz"></div>
            <div id="quizz-levels"><input type="text" placeholder="Quantidade de níveis do quizz"></div>
        </div>

    <button onclick="validateForm01()">Prosseguir pra criar perguntas</button>
    `
}
function validateForm01(){
    let form01 = document.querySelector(".form-01")
    let quizzTitle = document.querySelector("#quizz-title")
    let quizzImg = document.querySelector("#quizz-img")
    let quizzQuestions = document.querySelector("#quizz-questions")
    let quizzLevels = document.querySelector("#quizz-levels")
    let title = document.querySelectorAll(".form-01 input")[0].value
    let img = document.querySelectorAll(".form-01 input")[1].value
    let questions = parseInt(document.querySelectorAll(".form-01 input")[2].value)
    let levels = parseInt(document.querySelectorAll(".form-01 input")[3].value)

    if(title.length < 20 || title.length > 65) validateError(quizzTitle, "<h3>O título deve ter entre 20 e 65 caracteres</h3>", title)
    else noneValidateError(quizzTitle)

    if(!validURL(img)) validateError(quizzImg, "<h3>O valor informado não é uma URL válida</h3>", img)
    else noneValidateError(quizzImg)

    if(questions < 3 || isNaN(questions)) validateError(quizzQuestions, "<h3>O quizz deve ter no mínimo 3 perguntas</h3>", questions)
    else noneValidateError(quizzQuestions)
    
    if(levels < 2 || isNaN(levels)) validateError(quizzLevels, "<h3>O quizz deve ter no mínimo 2 níveis</h3>", levels)
    else noneValidateError(quizzLevels)

    if(!form01.querySelector(".validate-error")){
        createQuizzObj.title = title;
        createQuizzObj.image = img;
        createQuizzObj.questions.length = questions;
        createQuizzObj.levels.length = levels;
        renderForm2()
        nextForm(form01, form02);
    }
}
function renderForm2(){
    form02.innerHTML += "<h2>Crie suas perguntas</h2>"
    for(let i = 0; i < createQuizzObj.questions.length; i ++){
        createFormQuestion(`q0${i+1}`)
    }
    form02.innerHTML += "<button onclick='validateForm02()'>Prosseguir pra criar níveis</button>"
    currentOpenQuestion = document.querySelector(".form-02").children[2];
}
function createFormQuestion(idQuestion){
    let numberQuestion = idQuestion[2];
    let questionOpen = ""
    let questionClosed = "none"
    if(numberQuestion !== "1"){
        questionOpen = "none"
        questionClosed = ""
    }
    form02.innerHTML += `
    <div class="question-closed ${questionClosed}" id="${idQuestion}">
        <h2>Pergunta ${numberQuestion}</h2>
        <button onclick="selectedQuestion(this)"><ion-icon name="create-outline"></ion-icon></button>
    </div>
    <div class="question ${questionOpen}" id="${idQuestion}">
        <div class="info-question">
            <h2>Pergunta ${numberQuestion}</h2>
            <div class="text"><input type="text" placeholder="Texto da pergunta"></div>
            <div class="color"><input type="text" placeholder="Cor de fundo da pergunta"></div>
        </div>
        <div class="correct-answer">
            <h2>Resposta correta</h2>
            <div class="answer-text" id="a01"><input type="text" placeholder="Resposta correta"></div>
            <div class="answer-img" id="i01"><input type="text" placeholder="URL da imagem"></div>
        </div>
        <div class="incorrect-answers">
            <h2>Respostas incorretas</h2>
            <div class="answer-text" id="a02"><input type="text" placeholder="Resposta incorreta 1"></div>
            <div class="answer-img" id="i02"><input type="text" placeholder="URL da imagem 1"></div>
            <div class="answer-text" id="a03"><input type="text" placeholder="Resposta incorreta 2"></div>
            <div class="answer-img" id="i03"><input type="text" placeholder="URL da imagem 2"></div>
            <div class="answer-text" id="a04"><input type="text" placeholder="Resposta incorreta 3"></div>
            <div class="answer-img" id="i04"><input type="text" placeholder="URL da imagem 3"></div>
        </div>
    </div>
    `
}
function selectedQuestion(currentClosedQuestion){
    let lastQuestion = currentOpenQuestion.id
    let lastClosedQuestion = document.querySelectorAll(`#${lastQuestion}`)[0]
    let lastOpenQuestion = document.querySelectorAll(`#${lastQuestion}`)[1]
    lastOpenQuestion.classList.add("none")
    lastClosedQuestion.classList.remove("none")

    
    let currentQuestion = currentClosedQuestion.parentNode.id
    currentOpenQuestion = document.querySelectorAll(`#${currentQuestion}`)[1]

    currentClosedQuestion.parentNode.classList.add("none")
    currentOpenQuestion.classList.remove("none")
}
function validateForm02(){
    let allQuestions = document.querySelectorAll(".question")
    
    allQuestions.forEach((element) => {
        validadeQuestions(element)
    });
    createQuizzObj.questions = objQuestions;
    objQuestions = []
    console.log(createQuizzObj)

    if(!document.querySelector(".validate-error")) nextForm(form02, form03)
}
function validadeQuestions(element){
    let questionIndex = parseInt(element.id[2]-1);
    let questionAnswers = element.querySelectorAll(".answer-text input")
    let questionAnswersImages = element.querySelectorAll(".answer-img input")
    let questionText = element.querySelector(".text input")
    let questionColor = element.querySelector(".color input")

    objQuestions.push({
        title: questionText,
        color: questionColor,
        answers:[],
    })

    if(questionText.value.length < 20) validateError(questionText.parentNode, "<h3>O texto deve ter no mínimo 20 caracteres</h3>", questionText.value)
    else {
        noneValidateError(questionText.parentNode)
        objQuestions[objQuestions.length-1].title = questionText.value
    }

    if(!/^#([0-9A-F]{3}){1,2}$/i.test(questionColor.value)) validateError(questionColor.parentNode, "<h3>A cor deve estar em forato hexadecimal</h3>", questionColor.value)
    else {
        noneValidateError(questionColor.parentNode)
        objQuestions[objQuestions.length-1].color = questionColor.value
    }

    for(let i = 0; i < questionAnswers.length; i ++){
        let pair = false;
        if(i === 0){
            validateQuestion(element, questionIndex, questionAnswers[i], questionAnswersImages[i], true, i, pair, "<h3>A resposta correta é obrigatória</h3>")
        }
        else if(i === 1){
            validateQuestion(element, questionIndex, questionAnswers[i], questionAnswersImages[i], false, i, pair, "<h3>Deve haver pelo menos uma resposta incorreta</h3>")
        }else {
            if(questionAnswers[i].value !== ""){
                noneValidateError(element.querySelector(`#a0${i+1}`))
                pair = true;
            }
            if(questionAnswersImages[i].value !== ""){
                if(!pair) validateError(element.querySelector(`#a0${i+1}`), "<h3>Precisa adicionar o texto</h3>", questionAnswers[i].value)
                if(i > objQuestions[questionIndex].answers.length){
                    noneValidateError(element.querySelector(`#a02`))
                    noneValidateError(element.querySelector(`#i02`))
                    validateError(element.querySelector(`#a02`), "<h3>Insira na caixa certa</h3>", "")
                    validateError(element.querySelector(`#i02`), "<h3>Insira na caixa certa</h3>", "")    
                }else if(!validURL(questionAnswersImages[i].value)) validateError(element.querySelector(`#i0${i+1}`), "<h3>O valor informado não é uma URL válida</h3>", questionAnswersImages[i].value)
                    else{
                        noneValidateError(element.querySelector(`#i0${i+1}`))
                        if(pair){
                            objQuestions[questionIndex].answers.push({
                                text: questionAnswers[i].value,
                                image: questionAnswersImages[i].value,
                                isCorrectAnswer: false
                            })
                        }
                    }
            }else if(pair) validateError(element.querySelector(`#i0${i+1}`), "<h3>Precisa adicionar a url da imagem</h3>", questionAnswersImages[i].value)
        }
    }
}
function validateQuestion(element, questionIndex, questionAnswers, questionAnswersImages, isCorrect, i, pair, error){
    if(questionAnswers.value === "") validateError(element.querySelector(`#a0${i+1}`), error, questionAnswers.value)
    else {
        noneValidateError(element.querySelector(`#a0${i+1}`))
        pair = true;
    }
    if(questionAnswersImages.value === "") validateError(element.querySelector(`#i0${i+1}`), error, questionAnswersImages.value)
    else{
        noneValidateError(element.querySelector(`#i0${i+1}`))
        if(!validURL(questionAnswersImages.value)) validateError(element.querySelector(`#i0${i+1}`), "<h3>O valor informado não é uma URL válida</h3>", questionAnswersImages.value)
        else{
            noneValidateError(element.querySelector(`#i0${i+1}`))
            if(pair){
                objQuestions[questionIndex].answers.push({
                    text: questionAnswers.value,
                    image: questionAnswersImages.value,
                    isCorrectAnswer: isCorrect
                })
            }
        }
    } 
}
function validateError(info, error, value){
    if(info.children.length === 1) info.innerHTML += error; 
    info.children[0].classList.add("validate-error")
    info.children[0].value = value;
}
function noneValidateError(info){
    info.children[0].classList.remove("validate-error")
    if(info.children.length === 2) info.children[1].remove()
}
function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
}
function nextForm(current, next){
    current.classList.add("none")
    next.classList.remove("none")
}

function treatError(error){
    console.log(error);
}

function getRandom(){
    return Math.random() - 0.5;
}

listAllQuizzes();
function windowScroller(position) {
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}

listAllQuizzes();
