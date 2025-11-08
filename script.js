// Variables
let seconds = 25 * 60;
let total = 25 * 60;
let isStudy = true;
let timer = null;
let soundTimer = null;
let audio = null;

// Circle setup
const circle = document.getElementById('progress');
const radius = 120;
const circumference = 2 * Math.PI * radius;
circle.style.strokeDasharray = circumference;
circle.style.strokeDashoffset = 0;

// ALL MOTIVATION MESSAGES (expanded!)

const allMotivation = [
  "You've got this, Thando! 💪",
  "Focus time, princess! ✨",
  "Let's crush this, nana! 🌟",
  "You're doing amazing! 💜",
  "Keep pushing, Mothoaka! 🔥",
  "Believe in yourself, princess! You're brilliant! 👑",
  "One more chapter, Thando! You can do it! 📚",
  "Your future self will thank you, nana! 🌸",
  "Stay strong, babe! Success is coming! ⭐",
  "You're making me so proud, Thando! 💜",
  "Don't give up now, princess! Almost there! 💪",
  "Every minute counts, nana! Keep going! ⏰",
  "You're a warrior, Mothoaka! Fight for your dreams! ⚔️",
  "This exam doesn't stand a chance against you! 🎯",
  "Remember why you started, Thando! 💫",
  "You're stronger than you think, princess! 💪",
  "Take a deep breath, you're doing great, nana! 🌺",
  "Your hard work will pay off, babe! 🏆",
  "I believe in you, Thando! Always! 💜",
  "You're not alone in this, princess! I'm here! 🤝"
];

const studyMsg = [
  "You've got this, Thando! 💪",
  "Focus time, princess! ✨",
  "Let's crush this, nana! 🌟",
  "You're doing amazing! 💜"
];

const breakMsg = [
  "Break time, princess! ☕",
  "Rest well, Thando! 💜",
  "You earned this, nana! 🌸",
  "Relax, Mothoaka! 🌟"
];

// Sounds
const sounds = {
  beep: { type: 'square', notes: [800, 800, 800], time: 0.15 },
  alarm: { type: 'sawtooth', notes: [440, 554, 440, 554], time: 0.2 },
  bell: { type: 'triangle', notes: [659, 523], time: 0.5 },
  siren: { type: 'sine', notes: [300, 800, 300, 800], time: 0.25 },
  buzz: { type: 'sawtooth', notes: [200, 200, 200], time: 0.3 }
};

// Update display and circle
function show() {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  document.getElementById('timer').textContent = 
    (m < 10 ? '0' + m : m) + ':' + (s < 10 ? '0' + s : s);
  
  // Update circle progress
  const progress = (total - seconds) / total;
  const offset = circumference * (1 - progress);
  circle.style.strokeDashoffset = offset;
}

// Random message
function msg(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

//Function to Generate Movitation

function generateMotivation() {
  const randomMsg = allMotivation[Math.floor(Math.random() * allMotivation.length)];
  const messageEl = document.getElementById('message');
  
  // Add animation effect
  messageEl.style.animation = 'none';
  setTimeout(() => {
    messageEl.textContent = randomMsg;
    messageEl.style.animation = 'fadeIn 0.5s';
  }, 10);
}

// Start (don't change message anymore)
function start() {
  if (timer) return;
  
  timer = setInterval(() => {
    seconds--;
    show();
    if (seconds <= 0) {
      clearInterval(timer);
      timer = null;
      playSound();
      confetti();
      switchMode();
    }
  }, 1000);
}

// Pause
function pause() {
  clearInterval(timer);
  timer = null;
  document.getElementById('message').textContent = "Paused ⏸️";
}

// Reset
function reset() {
  clearInterval(timer);
  timer = null;
  stopSound();
  isStudy = true;
  seconds = parseInt(document.getElementById('studyTime').value) * 60;
  total = seconds;
  show();
  document.getElementById('mode').textContent = 'Study Time';
  document.getElementById('message').textContent = "Ready to focus, princess?";
}

// Switch mode
function switchMode() {
  if (isStudy) {
    isStudy = false;
    seconds = parseInt(document.getElementById('breakTime').value) * 60;
    total = seconds;
    document.getElementById('mode').textContent = 'Break Time';
    document.getElementById('message').textContent = msg(breakMsg);
  } else {
    isStudy = true;
    seconds = parseInt(document.getElementById('studyTime').value) * 60;
    total = seconds;
    document.getElementById('mode').textContent = 'Study Time';
    document.getElementById('message').textContent = msg(studyMsg);
  }
  show();
}

// Play sound (loops)
function playSound() {
  stopSound();
  const sound = sounds[document.getElementById('soundType').value];
  const vol = document.getElementById('volume').value / 100;
  
  audio = new AudioContext();
  
  function play() {
    sound.notes.forEach((freq, i) => {
      const osc = audio.createOscillator();
      const gain = audio.createGain();
      osc.connect(gain);
      gain.connect(audio.destination);
      osc.frequency.value = freq;
      osc.type = sound.type;
      const start = audio.currentTime + (i * sound.time);
      gain.gain.setValueAtTime(vol * 0.4, start);
      gain.gain.exponentialRampToValueAtTime(0.01, start + sound.time);
      osc.start(start);
      osc.stop(start + sound.time);
    });
  }
  
  play();
  soundTimer = setInterval(play, 1500);
  document.getElementById('stopBtn').style.display = 'block';
}

// Stop sound
function stopSound() {
  if (soundTimer) clearInterval(soundTimer);
  if (audio) audio.close();
  soundTimer = null;
  audio = null;
  document.getElementById('stopBtn').style.display = 'none';
}

// Test sound
function testSound() {
  playSound();
  setTimeout(stopSound, 5000);
}

// Confetti
function confetti() {
  const canvas = document.getElementById('confetti');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  
  const parts = [];
  const colors = ['#6a1b9a', '#4a148c', '#7b1fa2', '#ffd700'];
  
  for (let i = 0; i < 100; i++) {
    parts.push({
      x: Math.random() * canvas.width,
      y: -20,
      r: Math.random() * 5 + 2,
      c: colors[Math.floor(Math.random() * colors.length)],
      sy: Math.random() * 3 + 2,
      sx: Math.random() * 4 - 2
    });
  }
  
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;
    parts.forEach(p => {
      p.y += p.sy;
      p.x += p.sx;
      if (p.y < canvas.height) {
        active = true;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.c;
        ctx.fill();
      }
    });
    if (active) requestAnimationFrame(draw);
  }
  draw();
}

// Init
show();