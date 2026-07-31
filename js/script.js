import { db, collection, getDocs, addDoc } from "../firebase.js";


const defaultWords = [

{t:"ELEFANTE", d:false},
{t:"TELEFONO", d:false},
{t:"MONTAGNA", d:false},
{t:"PIZZA", d:false},

{t:"STATUA DELLA LIBERTÀ", d:true},
{t:"RITORNO AL FUTURO", d:true},
{t:"TORRE DI PISA", d:true}

];


let words =
JSON.parse(localStorage.getItem("sfidaParole"))
||
defaultWords;


let score = 0;

let time = 60;

let interval = null;

let current = null;

let paused = false;

let gameStarted = false;

let doubleActive = false;


let usedNormal = [];

let usedDouble = [];





function showSetup(){

document.getElementById("menu").classList.add("hidden");

document.getElementById("setup").classList.remove("hidden");

}





function startGame(seconds){

time = seconds;

score = 0;

paused = false;

gameStarted = false;

doubleActive = false;


usedNormal = [];

usedDouble = [];


document.getElementById("setup").classList.add("hidden");

document.getElementById("game").classList.remove("hidden");


document.getElementById("word").innerHTML="";

updateScreen();

}





function startTurn(){

if(gameStarted){

return;

}


gameStarted=true;


nextWord();


interval=setInterval(()=>{


if(!paused){

time--;

updateScreen();


if(time<=0){

clearInterval(interval);

endGame();

}

}


},1000);

}





function pauseGame(){

paused=!paused;


let button=document.getElementById("pauseButton");


if(paused){

button.innerHTML="▶ RIPRENDI";

}

else{

button.innerHTML="⏸ STOP";

}


}





function nextWord(){


let list;


if(doubleActive){


list = words.filter(w => w.d && !usedDouble.includes(w.t));


if(list.length===0){

usedDouble=[];

list = words.filter(w=>w.d);

}


current=list[Math.floor(Math.random()*list.length)];

usedDouble.push(current.t);


doubleActive=false;


}


else{


list = words.filter(w => !w.d && !usedNormal.includes(w.t));


if(list.length===0){

usedNormal=[];

list=words.filter(w=>!w.d);

}


current=list[Math.floor(Math.random()*list.length)];

usedNormal.push(current.t);


}



showWord(current.t);


}







function showWord(text){

let box=document.getElementById("word");


box.classList.remove("wordIn");

box.classList.add("wordOut");


setTimeout(()=>{


box.innerHTML=text;


box.classList.remove("wordOut");

box.classList.add("wordIn");


},250);

}








function doubleWord(){

doubleActive=true;

}







function correct(){

score += doubleActive ? 2 : 1;

if(score<0){

score=0;

}


doubleActive=false;

nextWord();

updateScreen();

}






function wrong(){

score -= doubleActive ? 2 : 1;


if(score<0){

score=0;

}


doubleActive=false;

nextWord();

updateScreen();

}







function skip(){

doubleActive=false;

nextWord();

}







function updateScreen(){

document.getElementById("timer").innerHTML="⏱ "+time;

document.getElementById("score").innerHTML=score;

}








function exitGame(){


if(interval){

clearInterval(interval);

}


gameStarted=false;


document.getElementById("game").classList.add("hidden");

document.getElementById("menu").classList.remove("hidden");


}







function endGame(){

if(interval){

clearInterval(interval);

}


document.getElementById("game").classList.add("hidden");

document.getElementById("result").classList.remove("hidden");


document.getElementById("finalScore").innerHTML=score;

}








function showArchive(){

document.getElementById("menu").classList.add("hidden");

document.getElementById("archive").classList.remove("hidden");

showWords();

}







function addWord(){

let text=document.getElementById("newWord").value;

let type=document.getElementById("newType").value;


if(text.trim()==""){

return;

}


words.push({

t:text.toUpperCase(),

d:type=="true"

});


saveWords();


document.getElementById("newWord").value="";


showWords();

}







function saveWords(){

localStorage.setItem(

"sfidaParole",

JSON.stringify(words)

);

}







function showWords(){

let box=document.getElementById("wordList");

box.innerHTML="";


document.getElementById("wordCount").innerHTML=

"Parole totali: "+words.length;



words.forEach((w,i)=>{


box.innerHTML +=

"<p>"+

(i+1)+". "+

(w.d?"⭐ ":"")+

w.t+

"</p>";

});


}








function resetArchive(){

localStorage.removeItem("sfidaParole");

location.reload();

}








function backMenu(){

document.getElementById("archive").classList.add("hidden");

document.getElementById("menu").classList.remove("hidden");

}







window.showSetup=showSetup;

window.startGame=startGame;

window.startTurn=startTurn;

window.pauseGame=pauseGame;

window.correct=correct;

window.wrong=wrong;

window.doubleWord=doubleWord;

window.exitGame=exitGame;

window.showArchive=showArchive;

window.addWord=addWord;

window.resetArchive=resetArchive;

window.backMenu=backMenu;

window.endGame=endGame;
