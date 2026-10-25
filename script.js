// Ambient Construction Dust / Sparks Canvas
const canvas = document.getElementById('sparks-canvas');
const ctx = canvas ? canvas.getContext('2d') : null;

let width, height;
let particles = [];

function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class SparkParticle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 50;
        this.size = Math.random() * 2 + 0.6;
        this.speedY = Math.random() * 0.8 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.6;
        this.opacity = Math.random() * 0.7 + 0.2;
        this.hue = Math.random() > 0.4 ? 185 : 45; // Cyan or subtle gold spark
    }

    update() {
        this.y -= this.speedY;
        this.x += this.speedX + Math.sin(this.y * 0.02) * 0.3;

        if (this.y < -20 || this.x < -20 || this.x > width + 20) {
            this.reset();
        }
    }

    draw() {
        if (!ctx) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.hue === 185 
            ? `rgba(0, 240, 255, ${this.opacity})` 
            : `rgba(255, 200, 100, ${this.opacity * 0.7})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(0, 240, 255, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

if (canvas && ctx) {
    const count = Math.min(45, Math.floor((window.innerWidth * window.innerHeight) / 28000));
    for (let i = 0; i < count; i++) {
        const p = new SparkParticle();
        p.y = Math.random() * height; // initial spread
        particles.push(p);
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// Interactive Crane Mouse Physics
const craneAssembly = document.getElementById('craneAssembly');
const suspendedD = document.getElementById('suspendedLetterD');

let targetTilt = 0;
let currentTilt = 0;
let mouseX = window.innerWidth / 2;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    const centerX = window.innerWidth / 2;
    // Calculate tilt angle based on mouse distance from center (-7deg to +7deg)
    targetTilt = ((mouseX - centerX) / centerX) * 5.5;
});

// Smooth animation loop for crane interactivity
let autoTime = 0;
function updateCranePhysics() {
    autoTime += 0.025;
    
    // Natural oscillation
    const naturalOscillation = Math.sin(autoTime) * 3;
    const combinedTarget = targetTilt + naturalOscillation;

    currentTilt += (combinedTarget - currentTilt) * 0.06;

    if (craneAssembly) {
        craneAssembly.style.transform = `rotate(${currentTilt}deg)`;
    }

    if (suspendedD) {
        // Counter-sway with slight phase shift for realistic cable physics
        const counterSway = -currentTilt * 0.45 + Math.sin(autoTime + 0.8) * 1.5;
        suspendedD.style.transform = `translateX(-50%) rotate(${counterSway}deg)`;
    }

    requestAnimationFrame(updateCranePhysics);
}

// Remove default CSS keyframe sway so JS smooth physics takes over seamlessly
if (craneAssembly) {
    craneAssembly.style.animation = 'none';
}
if (suspendedD) {
    suspendedD.style.animation = 'none';
}
updateCranePhysics();

// Interactive Modal
const modal = document.getElementById('contactModal');
const notifyBtn = document.getElementById('notifyBtn');
const headerCtaBtn = document.getElementById('headerCtaBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const notifyForm = document.getElementById('notifyForm');
const modalSuccess = document.getElementById('modalSuccess');

function openModal() {
    if (modal) {
        modal.classList.add('active');
        const input = document.getElementById('emailInput');
        if (input) setTimeout(() => input.focus(), 150);
    }
}

function closeModal() {
    if (modal) {
        modal.classList.remove('active');
        if (modalSuccess) modalSuccess.classList.remove('show');
    }
}

if (notifyBtn) notifyBtn.addEventListener('click', openModal);
if (headerCtaBtn) headerCtaBtn.addEventListener('click', openModal);
if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);

if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeModal();
    }
});

if (notifyForm) {
    notifyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const input = document.getElementById('emailInput');
        if (input && input.value) {
            notifyForm.style.display = 'none';
            if (modalSuccess) modalSuccess.classList.add('show');
            setTimeout(() => {
                closeModal();
                setTimeout(() => {
                    notifyForm.style.display = 'flex';
                    if (modalSuccess) modalSuccess.classList.remove('show');
                    input.value = '';
                }, 400);
            }, 2500);
        }
    });
}
