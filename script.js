const holes = document.querySelectorAll('.hole');
const scoreBoard = document.querySelector('.score');
const startBtn = document.querySelector('.start-btn');
const moles = document.querySelectorAll('.mole');
const showRulesBtn = document.querySelector('.rules-btn')
const showPlayersBtn = document.querySelector('.player-btn')
const closeBtn = document.querySelector('.close-btn')
const close2Btn = document.querySelector('.close2-btn')
const rulesModal = document.getElementById('rules-modal')
const playerModal = document.getElementById('player-modal')
let lastHole;
let timeUp = false;
let score = 0;
let countdownInterval;

function openModal() {
  rulesModal.style.display = 'block'
  startBtn.disabled = true;
}

function closeModal() {
  rulesModal.style.display = 'none'
  startBtn.disabled = false;
}

function openPModal() {
  playerModal.style.display = 'block'
  startBtn.disabled = true;
}

function closePModal() {
  playerModal.style.display = 'none'
  startBtn.disabled = false;
}

// Create audio element for background music
const music = new Audio('bg.mp3'); // Replace with your actual music file
music.loop = true; // Loop the music
let prev = '';

const missSound = new Audio('miss-sound.mp3');

function randomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function randomHole(holes) {
  const idx = Math.floor(Math.random() * holes.length);
  const hole = holes[idx];
  if (hole === lastHole) {
    return randomHole(holes);
  }
  lastHole = hole;
  return hole;
}

function randomPerson(count, id) {
  let idx = Math.floor(Math.random() * 10);
  if(id != -1){
    idx = id;
  }  
  let cur = '';
  if(idx == 1 || idx == 3){
    cur = 'senthil';    
  } else if (idx == 0 || idx == 4 ){
    cur = 'meesho';
  } else if (idx == 2 || idx == 5 ){
    cur = 'bangali';
  } else if (idx == 6 || idx == 9){
    cur = 'nothing';
  }else{
   cur = 'me';
  }
  if(prev === cur){
      return randomPerson(0, (id+1)%count);
  }
  prev = cur;
  return cur;
}

function peep() {
  const time = randomTime(500, 1500);
  const hole = randomHole(holes);
  const ad = randomPerson(4, -1);
  hole.getElementsByClassName('mole')[0].classList.add(ad);
  hole.classList.add('up');
  
  setTimeout(() => {
    hole.classList.remove('up');
    hole.getElementsByClassName('mole')[0].classList.remove(ad);
    hole.class
    if (!timeUp) peep();
  }, time);
}

function startGame() {
  startBtn.disabled = true;
  showRulesBtn.disabled = true;
  scoreBoard.textContent = 0;
  timeUp = false;
  score = 0;

  // Start the music
  music.currentTime = 3; // Set the music start time
  music.play();

  // Add event listeners for holes
  holes.forEach(hole => hole.addEventListener('click', miss));
  moles.forEach(mole => mole.addEventListener('click', bonk));

  let countdown = 60; // 30 seconds countdown
  startBtn.textContent = `Time Left: ${countdown}s`;
  startBtn.style.color = ''; // Reset color in case of restart
  
  peep();

  // Countdown logic
  countdownInterval = setInterval(() => {
    countdown--;

    // Change text color to red for the last 10 seconds
    if (countdown <= 10) {
      startBtn.style.color = 'red';
    } else {
      startBtn.style.color = ''; // Default color
    }

    startBtn.textContent = `Time Left: ${countdown}s`;

    if (countdown <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);

  setTimeout(() => {
    clearInterval(countdownInterval);
    endGame();
  }, 60000); // Game runs for 30 seconds
}

function endGame() {
  startBtn.disabled = false;
  showRulesBtn.disabled = false;
  timeUp = true;

  // Stop the music
  music.pause();

  // Remove event listeners for holes
  holes.forEach(hole => hole.removeEventListener('click', miss));
  moles.forEach(mole => mole.removeEventListener('click', bonk));

  // Get the current high score from local storage
  let highScore = localStorage.getItem('highScore') || 0;

  // Check if the current score is higher than the high score
  if (score > highScore) {
    localStorage.setItem('highScore', score); // Update the high score
    highScore = score; // Set high score to current score
  }

  // Display the final score and high score in the alert
  alert(`Game ended! Your final score is: ${score}\nYour highest score is: ${highScore}`);
  
  startBtn.textContent = 'Start Game';
  startBtn.style.color = ''; // Reset the button color back to normal
}

function bonk(e) {
  if (!e.isTrusted) return; // cheater!
  score++;
  this.parentNode.classList.remove('up');
  scoreBoard.textContent = score;
}

function miss(e) {
  if ((e.target.classList.contains('hole') && e.target.classList.contains('up'))
    || e.target.classList.contains('meesho')
    || e.target.classList.contains('me')
    || e.target.classList.contains('senthil')
    || e.target.classList.contains('bangali')
    || e.target.classList.contains('nothing'))
   {
    
      score++;
      // this.classList.remove('up');
      scoreBoard.textContent = score;    
  } else{
    
    score++;
    scoreBoard.textContent = score;
    missSound.play();
    showMissedAnimation(e.target);
  }
}

function showMissedAnimation(hole) {
  const missText = document.createElement('div');
  missText.textContent = 'Missed!';
  missText.className = 'missed';
  hole.appendChild(missText);

  setTimeout(() => {
    hole.removeChild(missText);
  }, 500); // 0.5 seconds
}

//Add event listeners to close and open the modal
showRulesBtn.addEventListener('click', openModal)
closeBtn.addEventListener('click', closeModal)
rulesModal.addEventListener('click', closeModal)

//Add event listeners to close and open the modal
showPlayersBtn.addEventListener('click', openPModal)
close2Btn.addEventListener('click', closePModal)
playerModal.addEventListener('click', closePModal)
