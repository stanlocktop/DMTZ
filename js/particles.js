
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');

// Настройки частиц
const PARTICLE_CONFIG = {
    maxCount: 150,
    sizeRange: [1, 3],
    speedRange: [-1.5, 1.5],
    color: 'rgba(76, 175, 80, 0.5)',
    borderColor: 'rgba(76, 175, 80, 0.5)',
    respawnOnResize: true
};

let particles = [];
let animationFrameId;

class Particle {
    constructor() {
        this.reset();
        this.speedX = Math.random() * 
            (PARTICLE_CONFIG.speedRange[1] - PARTICLE_CONFIG.speedRange[0]) + 
            PARTICLE_CONFIG.speedRange[0];
        this.speedY = Math.random() * 
            (PARTICLE_CONFIG.speedRange[1] - PARTICLE_CONFIG.speedRange[0]) + 
            PARTICLE_CONFIG.speedRange[0];
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 
            (PARTICLE_CONFIG.sizeRange[1] - PARTICLE_CONFIG.sizeRange[0]) + 
            PARTICLE_CONFIG.sizeRange[0];
    }

    update() {
        if (this.x > canvas.width - this.size || this.x < this.size) {
            this.speedX *= -0.8;
        }
        if (this.y > canvas.height - this.size || this.y < this.size) {
            this.speedY *= -0.8;
        }
        
        this.x += this.speedX;
        this.y += this.speedY;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = PARTICLE_CONFIG.color;
        ctx.fill();
        ctx.strokeStyle = PARTICLE_CONFIG.borderColor;
        ctx.stroke();
    }
}

function init() {
    particles = [];
    for (let i = 0; i < PARTICLE_CONFIG.maxCount; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    ctx.strokeStyle = PARTICLE_CONFIG.borderColor;
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });
    
    animationFrameId = requestAnimationFrame(animate);
}

function handleResize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    if (PARTICLE_CONFIG.respawnOnResize) {
        particles.forEach(particle => particle.reset());
    }
}

// Инициализация
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
init();
animate();

// Обработчики событий
window.addEventListener('resize', handleResize);

// Очистка (необязательно, можно удалить если не нужно)
function cleanup() {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
}