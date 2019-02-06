// Gra polega na tym, ze musisz przejsc kulka do czarnych dziur. Poruszasz sie przechylaniem ekranu,  jesli przechylisz troche ekran
// kulka sie bedzie z taka predkoscia pochylac, jesli chcesz sprawdzic funkcjonalnosc, wejdz w chrome dev tools, nastpenie w sensors
// -> orientaions, jesli dojdzie do kolizji z prostokatami, przgrywasz, w gorynm rogu jest licznik czasu, ile juz grasz

var ball = document.querySelector('.ball')
var canvas = document.querySelector('canvas')
  canvas.width = this.canvas.scrollWidth;
  canvas.height = this.canvas.scrollHeight;
var context = canvas.getContext('2d');
var timeDiv = document.querySelector('.time');

var actualX = canvas.width/2, actualY = canvas.height/2; //aktualna pozycja kulki

let time = new Date().getTime()/1000;

function loop(){ //glowna petla gry
  let tempTime = new Date().getTime()/1000 - time; //obsluga czasu
  timeDiv.innerHTML = Math.floor(tempTime);
  drawEnviroment();
  draw();
  chceckWin();
  window.requestAnimationFrame(loop);
}

let enviromentAmount = 11;
let enviromentArray = [];
createEnviroment();
function createEnviroment(){  //stworzenie przeszkod
  for (var i = 0; i < enviromentAmount; i++) {
    let x = Math.floor(Math.random() * canvas.width),
        y = Math.floor(Math.random() * canvas.height),
        sizeX = Math.floor(40 +Math.random() * 60),
        sizeY = Math.floor(40 +Math.random() * 60);
    enviromentArray.push({x: x, y: y, sizeX: sizeX, sizeY: sizeY}); //dodanie randomwoej wsp, i dlugosci
  }
}
// enviromentArray.forEach(function(data, index) {  //jak wyglada tablica przeszkod
//   console.log(index, data);
// });

function drawEnviroment(){
  for (var i = 0; i < enviromentAmount; i++) {
    context.fillRect(enviromentArray[i].x, enviromentArray[i].y, enviromentArray[i].sizeX, enviromentArray[i].sizeY);
  }
}

let rotateLR = 0, rotateFor=0, upDown =0;
let circleRadius = 10;
function draw(){
  context.beginPath();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.closePath(); //czyszczenie ekranu

  context.fillStyle ="#96faa0";
  drawEnviroment(); //wymaluj przeszkody
  chcekCollision();
  actualY += upDown /10; //do pozycji y dodaj wartosc pochylenia ekranu
  actualX += rotateLR /10;

  drawHoles();

  context.fillStyle ="#96faa0";
  context.moveTo(actualX, actualY);
  context.beginPath();
  context.arc(actualX, actualY, circleRadius ,Math.PI/3.1, true); //wymaluj kolo
  context.closePath();
  context.fill();
  context.stroke();
}
function handleOrientation (event) { //zdarzenia pochylenia ekranu
   rotateLR = event.alpha; //obrot wokol wlasnej osi
   rotateFor = event.gamma; //obrot pod katem
   upDown = event.beta - 90; //gora dol
}

function chcekCollision(){ //srawdznie kolizji, czy kulka zawiera sie w ktoryms z prostokatow
  enviromentArray.forEach(function(bar, index){
      if (actualX > bar.x && actualX < bar.x+bar.sizeX) {
        if (actualY > bar.y && actualY <bar.y+bar.sizeY) {
          let wrapper = document.querySelector('.wrapper');
          let canvas = document.querySelector('#canvas');
          let end = wrapper.removeChild(canvas);
          let score = document.querySelector('.end').style.display = "block";
        }
      }
  });
}

function chceckWin(){ //sprawdznie czy kulka znajduje sie w naroznikach
  let z = false;
  if (actualX < 50 && actualY < 50) {
    z = true;
  }
  else if (actualX > canvas.width-50 && actualY > canvas.height-50) {
    z = true;
  }
  if (z) {
    let wrapper = document.querySelector('.wrapper');
    let canvas = document.querySelector('#canvas');
    let end = wrapper.removeChild(canvas);
    let score = document.querySelector('.win').style.display = "block";
  }
}

function drawHoles(){ //wyrysowanie dziur, czyli koncow
  let size = 50;
  context.fillStyle ="black";
  context.fillRect(0, 0, size, size);
  context.fillRect(canvas.width-size, canvas.height-size, size, size);
}
window.addEventListener('deviceorientation', handleOrientation);
window.requestAnimationFrame(loop); //wywolanie petli
