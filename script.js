const wordContainer=document.getElementById('wordContainer');/*Contenedor de la palabra*/
const starButton=document.getElementById('starButton');/*Boton de empezar*/
const usedLettersElement=document.getElementById('usedLetters');/*Donde van a ir las palabras ya usadas*/

let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');
ctx.canvas.width = 0; /*Ancho del canva*/
ctx.canvas.height = 0;/*Alto del canva*/

const bodyParts= [       /*valores para ir dibujando las partes del cuerpo */
    [4,2,1,1],
    [4,3,1,2],
    [3,5,1,1],
    [5,5,1,1],
    [3,3,1,1],
    [5,3,1,1]
];
/*variables del juego */
let selectedWord; /*PALABRA QUE SE QUIERE ADIVINAR */
let usedLetters; /*LETRAS YA USADAS*/
let mistakes;  /*ACIERTOS*/
let hits;     /*ERRORES*/


const addLetter = letter =>{
    const letterElement = document.createElement('span');
    letterElement.innerHTML = letter.toUpperCase();
    usedLettersElement.appendChild(letterElement); /*Agregar letras  */
}

const addBodyPart = bodyPart =>{
    ctx.fillStyle = '#fff'; /*Color del stikman */
    ctx.fillRect(...bodyPart); /*Pasar los parametros del bodyparts en orden */

};

const wrongLetter = () =>{
    addBodyPart(bodyParts[mistakes]); /*Cuando se comente un error se llama a la funcion addBodypart */
    mistakes++;
    if(mistakes === bodyParts.length) endGame(); /*Si los errores son iguales a la cantidad de partes del juego,se llama a la funcion endGame */

}

const endGame = () => {
    document.removeEventListener('keydown', letterEvent); /*Sacar el eventlistener que le pusimos a las  letras,para que el usuario no pueda seguir ingresando letras*/
    starButton.style.display = 'block'; /*Volvemos a mostrar el start butom para que el usuario pueda volver a empezar la partida*/
    if (mistakes === bodyParts.length) {
        const correctWordElement = document.createElement('p');
        correctWordElement.textContent = `¡Perdiste! La palabra correcta era: ${selectedWord.join('')}`;
        wordContainer.appendChild(correctWordElement);
    }

}

const correctLetter = letter => {
    const { children } = wordContainer;
    for(let i = 0; i < children.length; i++){ /*Mientras que "i" sea menor que todos los children,osea el largo de la letras*/
        if(children[i].innerHTML === letter){ /*Si el spam que estamos viendo es igual a la letra que digito el usuario entonces... */
            children[i].classList.toggle('hidden'); /*Se saca de la clase hiden,para que vea la palabra*/
            hits++;
        }
    }
    if(hits === selectedWord.length) endGame(); /*Si la cantidad de aciertos es igual al largo de la palabra,entonces se llamara a la funcion endgame*/
}

const letterInput = letter => {
    if(selectedWord.includes(letter)){ /*si la palabra que esta tratando de adivinar,tiene esa letra.se llamara a la funcion correctletter*/
        correctLetter(letter);
    }else{
        wrongLetter();
    }
    addLetter(letter);
    usedLetters.push(letter); /*A letras usadas se le agrega letra */
}; 

const letterEvent = event => {
    let newLetter = event.key.toUpperCase(); /*Guardar en la variable newLetter lo que tiene dentro eventkey, que es la letra que toco el usuario*/
    if(newLetter.match(/^[a-zñ]$/i) && !usedLetters.includes(newLetter)){
        letterInput(newLetter);
    };
};

const drawWord = () => { /*Pintar la palabra seleccionada */
    selectedWord.forEach(letter => { 
        const letterElement = document.createElement('span');
        letterElement.innerHTML = letter.toUpperCase();
        letterElement.classList.add('letter');
        letterElement.classList.add('hidden');
        wordContainer.appendChild(letterElement);
    });
};
const selectRandomWord=() => { /*Selector de palabra aleatoria */
    let word = words[Math.floor((Math.random() * words.length))].toUpperCase(); 
    selectedWord = word.split('');
};

const drawHangMan = () =>{ /*Funcion para el dibujo del stickman */
    ctx.canvas.width = 120;
    ctx.canvas.height = 160;
    ctx.scale(20, 20); /*Anchura de los pixeles */
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#d95d39'; /*Color de la madera*/
    ctx.fillRect(0, 7, 4, 1);
    ctx.fillRect(1, 0, 1, 8);
    ctx.fillRect(2, 0, 3, 1);
    ctx.fillRect(4, 1, 1, 1);

    
};

const starGame = () =>{ /*Como esta funcion/bottom lo que hace es volver a iniciar el juego,entonces lo que se hace es dejar vacias todas las variables del juego*/
    usedLetters = [];
    mistakes = 0;
    hits = 0;
    wordContainer.innerHTML = '';
    usedLettersElement.innerHTML= '';
    starButton.style.display = 'none'; /*Lo que hace es que cuando se presione start deparezca,para no volver a presionarlo en la mitad de la partida */
    drawHangMan(); /*Dibujar al ahorcado*/
    selectRandomWord();
    drawWord();
    document.addEventListener('keydown', letterEvent); /*Cuando el usuario apriete cualquier letra llamara a la funcion letterEvent*/

};

starButton.addEventListener('click', starGame); /*Cuando se haga click se llamara en este caso a la funcion startgame */