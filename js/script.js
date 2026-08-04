// ===============================
// SFIDA PAROLE v2.0
// script.js
// ===============================


const defaultWords = [

    { t:"ELEFANTE", d:false },
    { t:"TELEFONO", d:false },
    { t:"MONTAGNA", d:false },
    { t:"PIZZA", d:false },

    { t:"STATUA DELLA LIBERTÀ", d:true },
    { t:"RITORNO AL FUTURO", d:true },
    { t:"TORRE DI PISA", d:true }

];



let words =
    JSON.parse(localStorage.getItem("sfidaParole"))
    ||
    defaultWords;



let normalPool = [];
let doublePool = [];

let currentWord = null;

let score = 0;
let time = 60;

let timer = null;

let gameStarted = false;

let waitingAnswer = false;

let nextIsDouble = false;
let currentIsDouble = false;



// ===============================
// MENU
// ===============================


function showSetup(){

    document.getElementById("menu")
        .classList.add("hidden");


    document.getElementById("setup")
        .classList.remove("hidden");

}





// ===============================
// AVVIO PARTITA
// ===============================


function startGame(seconds){


    time = seconds;

    score = 0;

    gameStarted = false;

    waitingAnswer = false;

    doubleActive = false;



    normalPool =
        words
        .filter(w => !w.d)
        .sort(() => Math.random() - 0.5);



    doublePool =
        words
        .filter(w => w.d)
        .sort(() => Math.random() - 0.5);



    document.getElementById("setup")
        .classList.add("hidden");


    document.getElementById("game")
        .classList.remove("hidden");


    document.getElementById("word")
        .innerHTML = "";


    document.getElementById("mainButton")
        .innerHTML = "▶ VIA";


    updateScreen();

}






// ===============================
// PULSANTE PRINCIPALE
// VIA / RIPRENDI
// ===============================


function mainAction(){


    if(!gameStarted){


        gameStarted = true;

        nextWord();

        startTimer();


        document.getElementById("mainButton")
            .innerHTML = "⏸ STOP";


        return;

    }



    if(waitingAnswer){


        waitingAnswer = false;


        nextWord();


        document.getElementById("mainButton")
            .innerHTML = "⏸ STOP";


        return;

    }


}

// ===============================
// TIMER
// ===============================


function startTimer(){


    if(timer){

        clearInterval(timer);

    }


    timer = setInterval(()=>{


        if(gameStarted && !waitingAnswer){


            time--;

            updateScreen();



            if(time <= 0){

                endGame();

            }


        }


    },1000);


}






// ===============================
// GESTIONE PAROLE
// ===============================


function nextWord(){



    let selected;



    if(doubleActive){



        if(doublePool.length === 0){


            doublePool =
                words
                .filter(w => w.d)
                .sort(() => Math.random()-0.5);


        }



        selected = doublePool.shift();



        doubleActive = false;



    }

    else{



        if(normalPool.length === 0){


            normalPool =
                words
                .filter(w => !w.d)
                .sort(() => Math.random()-0.5);


        }



        selected = normalPool.shift();


    }




    currentWord = selected;



    showWord(currentWord.t);



}






function showWord(text){


    document.getElementById("word")
        .innerHTML = text;


}







// ===============================
// RISPOSTE
// ===============================


function correct(){



    if(!gameStarted || waitingAnswer){

        return;

    }



    score += doubleActive ? 2 : 1;



    waitingAnswer = true;



    document.getElementById("mainButton")
        .innerHTML = "▶ RIPRENDI";



    updateScreen();


}







function wrong(){



    if(!gameStarted || waitingAnswer){

        return;

    }



    score -= doubleActive ? 2 : 1;



    if(score < 0){

        score = 0;

    }



    waitingAnswer = true;



    document.getElementById("mainButton")
        .innerHTML = "▶ RIPRENDI";



    updateScreen();



}







function doubleWord(){



    if(!gameStarted || waitingAnswer){

        return;

    }



    doubleActive = true;


}






// ===============================
// USCITA
// ===============================


function exitGame(){



    if(timer){

        clearInterval(timer);

    }



    gameStarted = false;



    document.getElementById("game")
        .classList.add("hidden");



    document.getElementById("menu")
        .classList.remove("hidden");



}







function updateScreen(){



    document.getElementById("timer")
        .innerHTML = "⏱ " + time;



    document.getElementById("score")
        .innerHTML = score;



}

// ===============================
// FINE PARTITA
// ===============================


function endGame(){


    if(timer){

        clearInterval(timer);

    }



    gameStarted = false;



    document.getElementById("game")
        .classList.add("hidden");



    document.getElementById("result")
        .classList.remove("hidden");



    document.getElementById("finalScore")
        .innerHTML = score;



}






// ===============================
// ARCHIVIO
// ===============================


function showArchive(){



    document.getElementById("menu")
        .classList.add("hidden");



    document.getElementById("archive")
        .classList.remove("hidden");



    showWords();



}






function addWord(){



    let text =
        document.getElementById("newWord")
        .value
        .trim();



    let type =
        document.getElementById("newType")
        .value;




    if(text === ""){

        return;

    }



    words.push({

        t:text.toUpperCase(),

        d:type === "true"

    });



    saveWords();



    document.getElementById("newWord")
        .value = "";



    showWords();



}







function saveWords(){



    localStorage.setItem(

        "sfidaParole",

        JSON.stringify(words)

    );


}








function showWords(){



    let box =
        document.getElementById("wordList");



    box.innerHTML = "";



    document.getElementById("wordCount")
        .innerHTML =
        "Parole totali: " + words.length;





    words.forEach((w,i)=>{



        box.innerHTML +=


        "<p>" +

        (i+1) +

        ". " +

        (w.d ? "⭐ " : "") +

        w.t +

        "</p>";



    });



}







function resetArchive(){



    localStorage.removeItem("sfidaParole");



    location.reload();



}







function backMenu(){



    document.getElementById("setup")
        .classList.add("hidden");



    document.getElementById("archive")
        .classList.add("hidden");



    document.getElementById("game")
        .classList.add("hidden");



    document.getElementById("result")
        .classList.add("hidden");



    document.getElementById("menu")
        .classList.remove("hidden");



}







// ===============================
// COLLEGAMENTI HTML
// ===============================


window.showSetup = showSetup;

window.startGame = startGame;

window.mainAction = mainAction;

window.correct = correct;

window.wrong = wrong;

window.doubleWord = doubleWord;

window.exitGame = exitGame;

window.showArchive = showArchive;

window.addWord = addWord;

window.resetArchive = resetArchive;

window.backMenu = backMenu;

window.endGame = endGame;


// ===============================
// FINE SCRIPT.JS
// ===============================
