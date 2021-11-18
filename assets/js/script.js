let screen1 = document.querySelector(".screen-1")
let screen2 = document.querySelector(".screen-2")
let screen3 = document.querySelector(".screen-3")

let ulYourQuizzes = document.querySelectorAll(".your-quizzes li")
let ulAllQuizzes = document.querySelectorAll(".all-quizzes li")

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