let screen1 = document.querySelector(".screen-1")
let screen2 = document.querySelector(".screen-2")
let screen3 = document.querySelector(".screen-3")

const headerHeight = 186;

let globalData =[];

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

const quizzBanner = document.querySelector(".quizz-banner");

function selectedQuizz(event){
    screen1.classList.add("none");
    screen2.classList.remove("none");

    quizzBanner.classList.remove("none");

    let selectedFromGlobal;

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

    windowScroller(338);

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

function createQuizz(){
    screen1.classList.add("none");
    screen3.classList.remove("none");
}
function validateForm01(){
    let form01 = document.querySelector(".form-01")
    let info01 = document.querySelector(".info-1")
    let info02 = document.querySelector(".info-2")
    let info03 = document.querySelector(".info-3")
    let info04 = document.querySelector(".info-4")
    let quizzTitle = document.querySelectorAll(".form-01 input")[0].value
    let quizzImg = document.querySelectorAll(".form-01 input")[1].value
    let quizzQuentions = parseInt(document.querySelectorAll(".form-01 input")[2].value)
    let quizzLevels = parseInt(document.querySelectorAll(".form-01 input")[3].value)

    if(quizzTitle.length < 20 || quizzTitle.length > 65) validateError(info01, "<h2>O título deve ter entre 20 e 65 caracteres</h2>", quizzTitle)
    else noneValidateError(info01)

    if(!quizzImg.startsWith("http")) validateError(info02, "<h2>O valor informado não é uma URL válida</h2>", quizzImg)
    else noneValidateError(info02)

    if(quizzQuentions < 3 || isNaN(quizzQuentions)) validateError(info03, "<h2>O quizz deve ter no mínimo 3 perguntas</h2>", quizzQuentions)
    else noneValidateError(info03)
    
    if(quizzLevels < 2 || isNaN(quizzLevels)) validateError(info04, "<h2>O quizz deve ter no mínimo 2 níveis</h2>", quizzLevels)
    else noneValidateError(info04)

    if(!form01.querySelector(".validate-error")) alert("erro")
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

function treatError(error){
    console.log(error);
}

function getRandom(){
    return Math.random() - 0.5;
}

function windowScroller(position) {
    window.scrollTo({
        top: position,
        behavior: 'smooth'
    });
}

listAllQuizzes();