let screen1 = document.querySelector(".screen-1")
let screen2 = document.querySelector(".screen-2")
let screen3 = document.querySelector(".screen-3")
let form01 = document.querySelector(".form-01")
let form02 = document.querySelector(".form-02")
let form03 = document.querySelector(".form-03")

let ulYourQuizzes = document.querySelectorAll(".your-quizzes li")
let ulAllQuizzes = document.querySelectorAll(".all-quizzes li")

let currentOpenQuestion = document.querySelector(".form-02").children[2];

let createQuizzObj = {
    title: "",
    image: "",
    questions: [],
    levels: []
}
let objQuestions = [];

ulYourQuizzes.forEach( (element) => {
    element.addEventListener("click", selectedQuizz);
});
ulAllQuizzes.forEach( (element) => {
    element.addEventListener("click", selectedQuizz);
});

function selectedQuizz(){
    screen1.classList.add("none");
    screen2.classList.remove("none");
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

    if(quizzTitle.length < 20 || quizzTitle.length > 65) validateError(info01, "<h3>O título deve ter entre 20 e 65 caracteres</h3>", quizzTitle)
    else noneValidateError(info01)

    if(!validURL(quizzImg)) validateError(info02, "<h3>O valor informado não é uma URL válida</h3>", quizzImg)
    else noneValidateError(info02)

    if(quizzQuentions < 3 || isNaN(quizzQuentions)) validateError(info03, "<h3>O quizz deve ter no mínimo 3 perguntas</h3>", quizzQuentions)
    else noneValidateError(info03)
    
    if(quizzLevels < 2 || isNaN(quizzLevels)) validateError(info04, "<h3>O quizz deve ter no mínimo 2 níveis</h3>", quizzLevels)
    else noneValidateError(info04)

    if(!form01.querySelector(".validate-error")){
        createQuizzObj.title = quizzTitle;
        createQuizzObj.image = quizzImg;
        createQuizzObj.questions.length = quizzQuentions;
        createQuizzObj.levels.length = quizzLevels;
        nextForm(form01, form02);
    } 
    console.log(createQuizzObj)
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
function selectedQuestion(currentClosedQuestion){
    let lastQuestion = currentOpenQuestion.classList[1]
    let lastClosedQuestion = document.querySelectorAll(`.${lastQuestion}`)[0]
    let lastOpenQuestion = document.querySelectorAll(`.${lastQuestion}`)[1]
    lastOpenQuestion.classList.add("none")
    lastClosedQuestion.classList.remove("none")

    
    let currentQuestion = currentClosedQuestion.parentNode.classList[1]
    currentOpenQuestion = document.querySelectorAll(`.${currentQuestion}`)[1]

    currentClosedQuestion.parentNode.classList.add("none")
    currentOpenQuestion.classList.remove("none")
}
function validateForm02(){
    let allQuestions = document.querySelectorAll(".question")
    allQuestions.forEach((element) => {
        validadeQuestion(element)
    });
}
function validadeQuestion(element){
    let questionAnswers = element.querySelectorAll(".answer input")
    let questionAnswersImages = element.querySelectorAll(".answer-img input")
    let questionIndex = parseInt(element.classList[1][2])-1;

    let questionText = element.querySelector(".text input").value
    let questionColor = element.querySelector(".color input").value

    objQuestions.push({
        title: questionText,
        color: questionColor,
        answers:[],
    })
    
    for(let i = 0; i < questionAnswers.length; i ++){
        
        if(questionAnswers[i].value === "")console.log("null")
        else {
            objQuestions[questionIndex].answers.push({
                text: questionAnswers[i].value,
                image: "",
                isCorrectAnswer: undefined
            })
            console.log(objQuestions[questionIndex].answers[i])
        }
        if(questionAnswersImages[i].value === "")console.log("null")
        else {
            objQuestions[questionIndex].answers[i].image = questionAnswersImages[i].value
            if(i === 0) objQuestions[questionIndex].answers[i].isCorrectAnswer = true;
            else objQuestions[questionIndex].answers[i].isCorrectAnswer = false;
        }
    }
    console.log(objQuestions)
    
}


