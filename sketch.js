/* 

Welcome to Boombox Party! An interactive game where the user interacts with a boombox, which influences the character's 
actions. The game opens with the start button, when pressed, a character walks on screen and the boombox pans up onto the
game screen. The user can rewind, play, pause, forward and stop the music with the respective buttons. The user can also 
change the volume with the dial at the top of the boombox.

When the music is paused, or the volume is low, the character stops dancing. The character has four dance moves that go 
in a random order while the music is playing. 

The game has a nine song playlist:

01. Agua de Coco - Marcos Valle
02. Assuntos Banais - Toco
03. Feel Good - Polo & Pan
04. Guajiru - Toco
05. Leão Leonardo - Toco
06. Minha Loucura - Bungalove
07. Mixer - Amber Mark
08. Moonshine - Caravan Palace
09. Wake Up Call - Mel Blue

The stop button brings the user back to the start, tucking away the boombox as the character walks off screen.

*/

var startButton;
var boomBox;
var x;
var y;
let angle = 90;
let activeButton = "";

//game overall dimensions
let cW = 1536;
let cH = 864;

let boxX = 768;
let boxY = 900;
let speedY = 2;

let boxW = 600;
let boxH = 250;

let stopped = false;
let stopY = 820; // the Y value where the box stop
let moving = false;

let buttonClicked = false;

//background image assets
let sky;
let grassFront;
let foliage;


let clouds = [];
let isCloudMoving = false;
let cloudX = -300; // start off screen (left)
let cloudSpeed = 1.5;

let currentCloud = 0;

//boombox image assets
let boomboxBody;

let innerShell;
let ishellFrames = [];
let ishellBoom = 0;

let outerShell;
let oshellFrames = [];
let oshellBoom = 0;

let cassette;
let cassetteFrames = [];
let cassetteTurn = 0;

let volumeX = boxX - 1; //default position of the volume dial
let volumeY = boxY - 147; //y position never moves
let volDragging = false;

let volMinX;
let volMaxX;
let volCurrentX;

//character assets

let standby;

let sheepX = -210;
let sheepY = 450;
let walking = 0;
let walk = [];
let isWalking = false;

let dancing = 0;
let dance = [];
let isDancing = false;

let danceA = [0, 1, 2, 3];
let danceB = [4, 5, 6, 7];
let danceC = [8, 9, 10, 11];
let danceD = [12, 13, 14, 15];

let currentMove = [];
let moveFrame = 0;
let moveTimer = 0;
let framesPerMove = 128;

let isBetweenMoves = false;  // true when standby is showing between moves
let standbyTimer = 0;        // counts how long standby has been showing
let standbyDuration = 32;    // how many frames to show standby (adjust as needed)

//sound assets
let ambientSound;

//need to make a playlist so that the play, pause e.t.c. buttons will work accordingly
let currentSong = 0;
let songs = [];
let isPlaying = false;

//reset
let resetting = false;

function preload(){
  sky = loadImage('Assets/Images/Background/Sky.png');
  grassFront = loadImage('Assets/Images/Background/Grass Front.png');
  foliage = loadImage('Assets/Images/Background/Foliage.png');

  boomboxBody = loadImage('Assets/Images/Boombox/Main Body/Standby.png');
  cassette = loadImage('Assets/Images/Boombox/Cassette/Standby/Standby.png');
  outerShell = loadImage('Assets/Images/Boombox/Speakers/Outer Shell/Standby/Speakers (reg).png');
  innerShell = loadImage('Assets/Images/Boombox/Speakers/Inner Shell/Standby/Conical.png');

  //moving clouds
  clouds[0] = loadImage('Assets/Images/Background/Clouds 1.png');
  clouds[1] = loadImage('Assets/Images/Background/Clouds 2.png');
  clouds[2] = loadImage('Assets/Images/Background/Clouds 3.png');

  //animated cassette
  cassetteFrames[0] = loadImage('Assets/Images/Boombox/Cassette/Animated/1.png');
  cassetteFrames[1] = loadImage('Assets/Images/Boombox/Cassette/Animated/2.png');
  cassetteFrames[2] = loadImage('Assets/Images/Boombox/Cassette/Animated/3.png');
  cassetteFrames[3] = loadImage('Assets/Images/Boombox/Cassette/Animated/4.png');

  //animated speakers
  oshellFrames[0] = loadImage('Assets/Images/Boombox/Speakers/Outer Shell/Animated/1.png');
  oshellFrames[1] = loadImage('Assets/Images/Boombox/Speakers/Outer Shell/Animated/2.png');

  ishellFrames[0] = loadImage('Assets/Images/Boombox/Speakers/Inner Shell/Animated/1.png');
  ishellFrames[1] = loadImage('Assets/Images/Boombox/Speakers/Inner Shell/Animated/2.png');

  //character standby 
  standby = loadImage('Assets/Images/Character/Standby/Standby.png');

  //animated walking frames
  walk[0] = loadImage('Assets/Images/Character/Walking/1.png');
  walk[1] = loadImage('Assets/Images/Character/Walking/2.png');
  walk[2] = loadImage('Assets/Images/Character/Walking/3.png');
  walk[3] = loadImage('Assets/Images/Character/Walking/4.png');

  //animated dancing frames
  dance[0] = loadImage('Assets/Images/Character/Dance/1/1.png');
  dance[1] = loadImage('Assets/Images/Character/Dance/1/2.png');
  dance[2] = loadImage('Assets/Images/Character/Dance/1/3.png');
  dance[3] = loadImage('Assets/Images/Character/Dance/1/4.png');
  dance[4] = loadImage('Assets/Images/Character/Dance/2/1.png');
  dance[5] = loadImage('Assets/Images/Character/Dance/2/2.png');
  dance[6] = loadImage('Assets/Images/Character/Dance/2/3.png');
  dance[7] = loadImage('Assets/Images/Character/Dance/2/4.png');
  dance[8] = loadImage('Assets/Images/Character/Dance/3/1.png');
  dance[9] = loadImage('Assets/Images/Character/Dance/3/2.png');
  dance[10] = loadImage('Assets/Images/Character/Dance/3/3.png');
  dance[11] = loadImage('Assets/Images/Character/Dance/3/4.png');
  dance[12] = loadImage('Assets/Images/Character/Dance/4/1.png');
  dance[13] = loadImage('Assets/Images/Character/Dance/4/2.png');
  dance[14] = loadImage('Assets/Images/Character/Dance/4/3.png');
  dance[15] = loadImage('Assets/Images/Character/Dance/4/4.png');
  
  //music
  ambientSound = loadSound('Assets/Music/Ambience/Nature.mp3');
  songs[0] = loadSound('Assets/Music/Boombox/1.mp3');
  songs[1] = loadSound('Assets/Music/Boombox/2.mp3');
  songs[2] = loadSound('Assets/Music/Boombox/3.mp3');
  songs[3] = loadSound('Assets/Music/Boombox/4.mp3');
  songs[4] = loadSound('Assets/Music/Boombox/5.mp3');
  songs[5] = loadSound('Assets/Music/Boombox/6.mp3');
  songs[6] = loadSound('Assets/Music/Boombox/7.mp3');
  songs[7] = loadSound('Assets/Music/Boombox/8.mp3');
  songs[8] = loadSound('Assets/Music/Boombox/9.mp3');
}

function setup() {
  createCanvas(cW, cH);
   volMinX = boxX - 210;
   volMaxX = boxX + 210;
   volCurrentX = boxX - 10;
}

function draw() {
  background(220);

  // background
  imageMode(CORNER);
  image(sky, 0, 0, cW, cH);

  // clouds
  imageMode(CENTER);
  image(clouds[currentCloud], cloudX, 200);
  cloudX += cloudSpeed;
  if (cloudX > width + 1000) {
    cloudX = -1000;
    currentCloud++;
    if (currentCloud > 2) currentCloud = 0;
  }

  imageMode(CORNER);
  image(foliage, 0, 0, cW, cH);
  image(grassFront, 0, 400, cW, cH);

  // start button
  if (!buttonClicked) {
    startButton(730, 400, 70, 30, "START");
    ambientSound.stop();
  }

  // character
  imageMode(CENTER);
  if (resetting) {

    // walk off screen to the right
    sheepX += 4;
    if (frameCount % 16 === 0) {
      walking = (walking + 1) % walk.length;
    }
    image(walk[walking], sheepX, sheepY);

  } else if (isWalking) {
    sheepX += 4;
    if (frameCount % 16 === 0) {
      walking = (walking + 1) % walk.length;
    }
    if (sheepX >= (cW / 2)) {
      isWalking = false;
    }
    image(walk[walking], sheepX, sheepY);

  } else if (isDancing) {
    if (isBetweenMoves) {
      image(standby, sheepX, sheepY);
      standbyTimer++;
      if (standbyTimer >= standbyDuration) {
        standbyTimer = 0;
        isBetweenMoves = false;
        pickRandomMove();
      }
    } else {
      if (frameCount % 24 === 0) {
        moveFrame = (moveFrame + 1) % 4;
      }
      moveTimer++;
      if (moveTimer >= framesPerMove) {
        moveTimer = 0;
        isBetweenMoves = true;
      }
      image(dance[currentMove[moveFrame]], sheepX, sheepY);
    }

  } else {
    image(standby, sheepX, sheepY);
  }

  // boombox
  boomBox(boxX, boxY);
  drawBoxButtons();

  // boombox moving up
  if (moving && !stopped) {
    boxY -= speedY;
    if (boxY <= stopY) {
      boxY = stopY;
      stopped = true;
      moving = false;
    }
  }

  // auto advance playlist
  if (isPlaying && !songs[currentSong].isPlaying()) {
    if (currentSong < songs.length - 1) {
      playSong(currentSong + 1);
    } else {
      isPlaying = false;
    }
  }

  // boombox moving back down + sheep walking off right
  if (resetting) {
    boxY += speedY;
    if (boxY >= 900 && sheepX >= cW + 210) {
      boxY = 900;
      sheepX = -210;
      resetting = false;
      buttonClicked = false;
    }
  }

}

function playSong(number) {
  // stop whatever is currently playing, making sure multiple songs dont play at once
  for (let i = 0; i < songs.length; i++) {
    songs[i].stop();
  }

  //Constrains the number between 0 and 8 (there are 9 songs but the array starts at 0)
  currentSong = constrain(number, 0, songs.length - 1);
  songs[currentSong].play();
  isPlaying = true;
}

function pickRandomMove() {
  let moves = [danceA, danceB, danceC, danceD];
  let randomIndex = floor(random(moves.length));
  currentMove = moves[randomIndex];
  moveFrame = 0;
  isBetweenMoves = false; // make sure standby doesn't get stuck
  print("Playing move: " + randomIndex);
}

function drawBoxButtons() {
  // A single row of five buttons, all relative to boxX and boxY
  let bW = 36; // button width
  let bH = 35;  // button height
  let gap = 2; // gap between buttons

  //Rewind
  boxButton(boxX-95,boxY-69, bW, bH, "rewind");

  //Play
  boxButton(boxX + -95 + bW + gap,  boxY -69, bW, bH, "play");

  //Pause
  boxButton(boxX - 95 + (bW + gap) * 2, boxY -69, bW, bH, "pause");

  //Forward
  boxButton(boxX - 95 + (bW + gap) * 3, boxY -69, bW, bH, "forward");

  //Stop
  boxButton(boxX - 95 + (bW + gap) * 4, boxY -69, bW, bH, "stop");
}

function boxButton(x, y, w, h, name) {
  if (activeButton === name) {
    fill(26,64,53, 100); // highlighted colour when active
    noStroke();
  } else {
    noFill(); // default colour
    noStroke();
  }
  noStroke();
  rect(x, y, w, h, 5);
}

function startButton(x, y, w, h, label){
  fill(100, 150, 255);
  noStroke();
  rect(x, y, w, h, 5); // 5 = rounded corners

  fill(255);
  textAlign(CENTER, CENTER);
  text(label, x + w / 2, y + h / 2);
}

function mousePressed() {
  // Check clicks relative to box position
  if (mouseInButton(730,400,70,30)) {
    moving = true;
    buttonClicked = true; // button disappears and can't be clicked again
    ambientSound.play(); //background music starts playing
    isWalking = true;
    print("Start button clicked!");
  }

  //volume logic
  if (mouseX > volCurrentX && mouseX < volCurrentX + 16 &&
    mouseY > boxY - 147 && mouseY < boxY - 147 + 35) {
    volDragging = true;
  }

  // Check the five box buttons
  let bW = 36;
  let bH = 35;
  let gap = 2;

  if (mouseInButton(boxX-95,boxY-69, bW, bH)) {
    activeButton = "rewind";
    setTimeout(() => { activeButton = ""; }, 200); // clears after 200ms
    if (currentSong > 0) {
      playSong(currentSong - 1);
    } else {
      songs[currentSong].stop(); // restart if at beginning
      songs[currentSong].play();
    }
    print("Rewind button clicked!");
  }

  if (mouseInButton(boxX + -95 + bW + gap,  boxY -69, bW, bH)) {
    activeButton = "play";
    setTimeout(() => { activeButton = ""; }, 200);
    if (!songs[currentSong].isPlaying()) {
      songs[currentSong].play();
      isPlaying = true;
      isDancing = true;
      pickRandomMove();
    }
    print("Play button clicked!"); 
  }

  if (mouseInButton(boxX - 95 + (bW + gap) * 2, boxY -69, bW, bH)) {
    activeButton = "pause";
    setTimeout(() => { activeButton = ""; }, 200);
    if (songs[currentSong].isPlaying()) {
      songs[currentSong].pause();
      isPlaying = false;
      isDancing = false;
    print("Pause button clicked!");
    }
  }

  if (mouseInButton(boxX - 95 + (bW + gap) * 3, boxY -69, bW, bH)){
    activeButton = "forward";
    setTimeout(() => { activeButton = ""; }, 200);
    if (currentSong < songs.length - 1) {
      playSong(currentSong + 1);
    }
    print("Forward button clicked!");
  }

  if (mouseInButton(boxX - 95 + (bW + gap) * 4, boxY -69, bW, bH)) {
    activeButton = "stop";
    setTimeout(() => { activeButton = ""; }, 200);
    songs[currentSong].stop();
    isPlaying = false;
    isDancing = false;
    print("Stop button clicked!");

    resetSheep();

  }
}

function mouseInButton(x, y, w, h) {
  return mouseX > x && mouseX < x + w &&
         mouseY > y && mouseY < y + h;
}

function mouseReleased() {
  volDragging = false;
}

function mouseDragged() {
  
  if (volDragging && stopped){
    volCurrentX = constrain(mouseX,volMinX,volMaxX);
    let vol = map(volCurrentX,volMinX,volMaxX,0,1);
    songs[currentSong].setVolume(vol);
  

  //character stops dancing when there is no volume 
  if (vol === 0) {
      isDancing = false;
    } else if (isPlaying) {
      isDancing = true; // resume dancing when volume goes back up
    }
  }
}

function boomBox(x, y) { // defining the custom function
  //imageMode(CENTER);
  //image(boomboxBody,768,830);
  noFill();
  imageMode(CENTER);
  image(boomboxBody,boxX, boxY);
  //image(cassette,boxX,boxY+50,148,150);
  //image(outerShell,boxX,boxY);
  //image(innerShell,boxX,boxY);

  if (isPlaying) {

    // cassette animation
    if (frameCount % 16 === 0) {
      cassetteTurn = (cassetteTurn + 1) % cassetteFrames.length;
    }
    image(cassetteFrames[cassetteTurn], boxX, boxY + 50, 148, 150);

    // outer shell animation
    if (frameCount % 24 === 0) {
      oshellBoom = (oshellBoom + 1) % oshellFrames.length;
    }
    image(oshellFrames[oshellBoom], boxX, boxY);

    // inner shell animation
    if (frameCount % 24 === 0) {
      ishellBoom = (ishellBoom + 1) % ishellFrames.length;
    }
    image(ishellFrames[ishellBoom], boxX, boxY);

  } else {
    // show standby images when not playing
    image(cassette, boxX, boxY + 50, 148, 150);
    image(outerShell, boxX, boxY);
    image(innerShell, boxX, boxY);
  }

  //volume dial
  fill(26,64,53);
  rect(volCurrentX, boxY - 147,16,35);

}

//stop button protocol
function resetSheep() {

  resetting = true;

  stopped = false;
  moving = false;

  isWalking = false;
  isDancing = false;
  isBetweenMoves = false;
  moveTimer = 0;
  standbyTimer = 0;

  volCurrentX = boxX - 180;

  for (let i = 0; i < songs.length; i++) {
    songs[i].stop();
  }
  isPlaying = false;
  currentSong = 0;
}