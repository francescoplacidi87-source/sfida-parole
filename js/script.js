import { db, collection, getDocs, addDoc } from "../firebase.js";


const defaultWords = [
    { t:"ELEFANTE", d:false },
    { t:"TELEFONO", d:false },
    { t:"MONTAGNA", d:false },
    { t:"PIZZA", d:false },

    { t:"STATUA DELLA LIBERTÀ", d:true },
    { t:"RITORNO AL FUTURO", d:true },
    { t:"TORRE DI PISA", d:true }
];


let words = JSON.parse(
    localStorage.getItem("sfidaParole")
) || defaultWords;


let normalQueue = [];
let doubleQueue = [];

let currentWord = "";

let score = 0;
let time = 60;

let timer = null;

let gameStarted = false;
let waitingNext = false;

let doubleNext = false;

let paused = false;



function showSetup(){

    document.getElementById("menu")
        .classList.add("hidden");

    document.getElementById("setup")
        .classList.remove("hidden");

}



function startGame(seconds){

    time = seconds;
    score = 0;

    gameStarted = false;
    waitingNext = false;
    paused = false;
    doubleNext = false;


    normalQueue = words
        .filter(w => !w.d)
        .sort(() => Math.random() - 0.5);


    doubleQueue = words
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



function mainAction(){

    if(!gameStarted){

        gameStarted = true;

        nextWord();

        startTimer();

        return;

    }


    if(waitingNext){

        waitingNext = false;

        document.getElementById("mainButton")
            .innerHTML = "⏸ STOP";


        nextWord();

    }

}



function startTimer(){

    if(timer){

        clearInterval(timer);

    }


    timer = setInterval(()=>{


        if(!paused && gameStarted && !waitingNext){

            time--;

            updateScreen();


            if(time <= 0){

                endGame();

            }

        }


    },1000);


}

function nextWord(){

    let selected;


    if(doubleNext){

        if(doubleQueue.length === 0){

            doubleQueue = words
                .filter(w => w.d)
                .sort(() => Math.random() - 0.5);

        }


        selected = doubleQueue.shift();

        doubleNext = false;

    }

    else{


        if(normalQueue.length === 0){

            normalQueue = words
                .filter(w => !w.d)
                .sort(() => Math.random() - 0.5);

        }


        selected = normalQueue.shift();

    }


    currentWord = selected.t;


    showWord(currentWord);

}





function showWord(text){

    const box = document.getElementById("word");


    box.innerHTML = text;


}





function correct(){

    if(!gameStarted || waitingNext){

        return;

    }


    score += 1;


    waitingNext = true;


    document.getElementById("mainButton")
        .innerHTML = "▶ RIPRENDI";


    updateScreen();

}





function wrong(){

    if(!gameStarted || waitingNext){

        return;

    }


    score -= 1;


    if(score < 0){

        score = 0;

    }


    waitingNext = true;


    document.getElementById("mainButton")
        .innerHTML = "▶ RIPRENDI";


    updateScreen();

}





function doubleWord(){

    if(!gameStarted || waitingNext){

        return;

    }


    doubleNext = true;


}





function pauseGame(){

    paused = !paused;


    const button =
        document.getElementById("pauseButton");


    if(paused){

        button.innerHTML = "▶ CONTINUA";

    }

    else{

        button.innerHTML = "⏸ STOP";

    }

}





function exitGame(){


    if(timer){

        clearInterval(timer);

    }


    gameStarted = false;

    waitingNext = false;


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


function showArchive(){

    document.getElementById("menu")
        .classList.add("hidden");


    document.getElementById("archive")
        .classList.remove("hidden");


    showWords();

}





function addWord(){

    const text =
        document.getElementById("newWord").value.trim();


    const type =
        document.getElementById("newType").value;


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

    const box =
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


    document.getElementById("menu")
        .classList.remove("hidden");

}





window.showSetup = showSetup;

window.startGame = startGame;

window.mainAction = mainAction;

window.pauseGame = pauseGame;

window.correct = correct;

window.wrong = wrong;

window.doubleWord = doubleWord;

window.exitGame = exitGame;

window.endGame = endGame;

window.showArchive = showArchive;

window.addWord = addWord;

window.resetArchive = resetArchive;

window.backMenu = backMenu;
