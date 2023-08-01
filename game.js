const canvas = document.querySelector('#game')
const game = canvas.getContext('2d')
const btnUp = document.querySelector('#up');
const btnLeft = document.querySelector('#left');
const btnRight = document.querySelector('#right');
const btnDown = document.querySelector('#down');
const spanLives = document.querySelector('#lives');
const spanTime = document.querySelector('#time');
const spanRecord = document.querySelector('#record');
const pResult= document.querySelector('#pResult')
let canvasSize;
let elementsSize;
let level = 2;
let lives = 3;
let timeStart
let timeInterval
let timePlayerRecord;
let timePlayer
const playerPosition = {
  x: undefined,
  y: undefined,
};
const giftPosition = {
  x: undefined,
  y: undefined,
};
let enemyPositions = [];
 window.addEventListener('load',  setCanvasSize)
 window.addEventListener('resize', setCanvasSize);
 window.addEventListener('keydown', moveByKeys);
 btnUp.addEventListener('click', moveUp);
 btnLeft.addEventListener('click', moveLeft);
 btnRight.addEventListener('click', moveRight);
 btnDown.addEventListener('click', moveDown);


 function setCanvasSize() {
   if (window.innerHeight > window.innerWidth) {
     canvasSize = window.innerWidth * 0.7;
   } else {
     canvasSize = window.innerHeight * 0.7;
   }
   
   canvasSize = Number(canvasSize.toFixed(2))
   canvas.setAttribute('width', canvasSize);
   canvas.setAttribute('height', canvasSize);
   
   elementsSize = (canvasSize) / 10;
   playerPosition.x = undefined
   playerPosition.y = undefined
   
 
   startGame();
 }
 
 function startGame() {
  game.font = elementsSize + 'px Verdana';
  game.textAlign = 'end';

  const map = maps[level];
  if (!map) {
    gameWin();
    return;
  }

  if(!timeStart){
    timeStart= Date.now()
    timeInterval = setInterval(showTime, 100)
    showRecord()
  }
  const mapRows = map.trim().split('\n');
  const mapRowCols = mapRows.map(row => row.trim().split(''));
  showLives();
  enemyPositions = [];
  game.clearRect(0,0,canvasSize, canvasSize);
  mapRowCols.forEach((row, rowI) => {
    row.forEach((col, colI) => {
      const emoji = emojis[col];
      const posX = elementsSize * (colI + 1);
      const posY = elementsSize * (rowI + 1);

      if (col == 'O') {
        if (!playerPosition.x && !playerPosition.y) {
          playerPosition.x = posX;
          playerPosition.y = posY;
          console.log({playerPosition});
        }
      } else if (col == 'I') {
        giftPosition.x = posX;
        giftPosition.y = posY;
      } else if (col == 'X') {
        enemyPositions.push({
          x: posX,
          y: posY,
        });
      }
      
      game.fillText(emoji, posX, posY);
    });
  });
  
  movePlayer();
  
  // for (let row = 1; row <= 10; row++) {
  //   for (let col = 1; col <= 10; col++) {
  //     game.fillText(emojis[mapRowCols[row - 1][col - 1]], elementsSize * col, elementsSize * row);
  //   }
  // }
}


function movePlayer() {
  const giftCollisionX = playerPosition.x.toFixed(3) == giftPosition.x.toFixed(3);
  const giftCollisionY = playerPosition.y.toFixed(3) == giftPosition.y.toFixed(3);
  const giftCollision = giftCollisionX && giftCollisionY;
  
  if (giftCollision) {
    levelWin();
  }

  const enemyCollision = enemyPositions.find(enemy => {
    const enemyCollisionX = enemy.x.toFixed(3) == playerPosition.x.toFixed(3);
    const enemyCollisionY = enemy.y.toFixed(3) == playerPosition.y.toFixed(3);
    return enemyCollisionX && enemyCollisionY;
  });
  
  if (enemyCollision) {
    levelFail();
  }
  
  game.fillText(emojis['PLAYER'], playerPosition.x, playerPosition.y);
}
function levelWin() {
  console.log('Subiste de nivel');
  level++;
  startGame();
}

function levelFail() {
  console.log('Chocaste contra un enemigo :(');
  lives--;
 

  console.log(lives);
  
  if (lives <= 0) {
    level = 0;
    lives = 3;
    timeStart = undefined
  }

  playerPosition.x = undefined;
  playerPosition.y = undefined;
  startGame();
}

function gameWin() {
  console.log('¡Terminaste el juego!');
  timePlayer = (Date.now() - timeStart)/1000
  console.log(timePlayer)
  clearInterval(timeInterval)
  timePlayerRecord = localStorage.getItem('playerRecord') 
  if(timePlayerRecord){
    if(timePlayer < timePlayerRecord){
      localStorage.setItem('playerRecord', timePlayer) 
      pResult.innerHTML = "¡Superaste tu record! "
    } else {pResult.innerHTML = "¡Lo siento! sigue intentando "}
  }else{
    localStorage.setItem('playerRecord', timePlayer) 
    pResult.innerHTML = "¡Que bueno, es tu primer intento! "
  }
}

function showLives() {
  spanLives.innerHTML = emojis["HEART"].repeat(lives)
}
function showTime(){
  spanTime.innerHTML = (Date.now() - timeStart)/1000
}
function showRecord(){
  spanRecord.innerHTML= localStorage.getItem('playerRecord')
}
function moveByKeys(event) {
  if (event.key == 'ArrowUp') moveUp();
  else if (event.key == 'ArrowLeft') moveLeft();
  else if (event.key == 'ArrowRight') moveRight();
  else if (event.key == 'ArrowDown') moveDown();
}
function moveUp() {
  console.log('Me quiero mover hacia arriba');

  if ((playerPosition.y - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.y -= elementsSize;
    startGame();
  }
}
function moveLeft() {
  console.log('Me quiero mover hacia izquierda');

  if ((playerPosition.x - elementsSize) < elementsSize) {
    console.log('OUT');
  } else {
    playerPosition.x -= elementsSize;
    startGame();
  }
}
function moveRight() {
  console.log('Me quiero mover hacia derecha');

  if ((playerPosition.x + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.x += elementsSize;
    startGame();
  }
}
function moveDown() {
  console.log('Me quiero mover hacia abajo');
  
  if ((playerPosition.y + elementsSize) > canvasSize) {
    console.log('OUT');
  } else {
    playerPosition.y += elementsSize;
    startGame();
  }
}