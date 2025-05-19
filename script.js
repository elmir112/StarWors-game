
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let rocket = {
  x: width / 2,
  y: height - 100,
  width: 40,
  height: 60,
  speed: 5
};

let bullets = [];
let meteors = [];
let score = 0;
let highScore = localStorage.getItem('highScore') || 0;
document.getElementById('highScore').textContent = highScore;

let sensitivity = 5;
document.getElementById('sensitivity').addEventListener('input', (e) => {
  sensitivity = parseInt(e.target.value);
});

let soundEnabled = true;
document.getElementById('sound').addEventListener('change', (e) => {
  soundEnabled = e.target.checked;
});

canvas.addEventListener('touchmove', function (e) {
  e.preventDefault();
  let touch = e.touches[0];
  rocket.x = touch.clientX - rocket.width / 2;
}, { passive: false });

canvas.addEventListener('touchstart', function (e) {
  e.preventDefault();
  bullets.push({
    x: rocket.x + rocket.width / 2 - 2,
    y: rocket.y,
    width: 4,
    height: 10,
    speed: 7
  });
}, { passive: false });

function spawnMeteor() {
  meteors.push({
    x: Math.random() * (width - 30),
    y: -30,
    width: 30,
    height: 30,
    speed: 2 + Math.random() * 3
  });
}

function update() {
  // Güncəlləmə
  bullets.forEach(b => b.y -= b.speed);
  bullets = bullets.filter(b => b.y > 0);

  meteors.forEach(m => m.y += m.speed);
  meteors = meteors.filter(m => m.y < height);

  // Toqquşma
  bullets.forEach((b, bi) => {
    meteors.forEach((m, mi) => {
      if (b.x < m.x + m.width &&
          b.x + b.width > m.x &&
          b.y < m.y + m.height &&
          b.y + b.height > m.y) {
        meteors.splice(mi, 1);
        bullets.splice(bi, 1);
        score++;
        document.getElementById('score').textContent = score;
        if (soundEnabled) new AudioContext().resume(); // sadə səs placeholder
      }
    });
  });

  // Ölüm yoxlaması
  for (let m of meteors) {
    if (m.x < rocket.x + rocket.width &&
        m.x + m.width > rocket.x &&
        m.y < rocket.y + rocket.height &&
        m.y + m.height > rocket.y) {
      if (score > highScore) {
        localStorage.setItem('highScore', score);
      }
      location.reload();
    }
  }
}

function draw() {
  ctx.clearRect(0, 0, width, height);

  // Arxa fon (ulduzlar)
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, width, height);
  for (let i = 0; i < 100; i++) {
    ctx.fillStyle = 'white';
    ctx.fillRect(Math.random() * width, Math.random() * height, 1, 1);
  }

  // Günəş və Ay
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  ctx.arc(80, 80, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'lightgray';
  ctx.beginPath();
  ctx.arc(width - 60, 60, 20, 0, Math.PI * 2);
  ctx.fill();

  // Raket
  ctx.fillStyle = 'red';
  ctx.fillRect(rocket.x, rocket.y, rocket.width, rocket.height);

  // Güllələr
  ctx.fillStyle = 'cyan';
  bullets.forEach(b => ctx.fillRect(b.x, b.y, b.width, b.height));

  // Meteorlər
  ctx.fillStyle = 'orange';
  meteors.forEach(m => ctx.fillRect(m.x, m.y, m.width, m.height));
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

setInterval(spawnMeteor, 1000);
gameLoop();
