document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('animated-bg-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;
    
    let particles = [];
    let animationFrameId;
    
    // --- Neural Network Animation ---
    const networkAnimation = {
        particles: [],
        particleCount: 100,
        maxDistance: 150,
        
        Particle: class {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.radius = Math.random() * 1.5 + 1;
            }
            update() {
                this.x += this.vx;
                this.y += this.vy;
                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }
            draw(color) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = color;
                ctx.fill();
            }
        },
        
        init: function() {
            this.particles = [];
            for (let i = 0; i < this.particleCount; i++) {
                this.particles.push(new this.Particle());
            }
        },
        
        animate: function() {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            const particleColor = isDarkMode ? 'rgba(148, 163, 184, 0.5)' : 'rgba(100, 116, 139, 0.5)';
            const lineColor = isDarkMode ? 'rgba(148, 163, 184, 0.2)' : 'rgba(100, 116, 139, 0.2)';
            
            ctx.clearRect(0, 0, width, height);
            this.particles.forEach(p => {
                p.update();
                p.draw(particleColor);
            });
            
            for (let i = 0; i < this.particles.length; i++) {
                for (let j = i + 1; j < this.particles.length; j++) {
                    const dx = this.particles[i].x - this.particles[j].x;
                    const dy = this.particles[i].y - this.particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    if (distance < this.maxDistance) {
                        ctx.beginPath();
                        ctx.moveTo(this.particles[i].x, this.particles[i].y);
                        ctx.lineTo(this.particles[j].x, this.particles[j].y);
                        ctx.strokeStyle = lineColor;
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }
    };
    
    // --- Matrix (Digital Rain) Animation ---
    const matrixAnimation = {
        columns: [],
        fontSize: 16,
        
        init: function() {
            const columnCount = Math.floor(width / this.fontSize);
            this.columns = [];
            for (let i = 0; i < columnCount; i++) {
                this.columns[i] = 1;
            }
        },
        
        animate: function() {
            const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
            const rainColor = isDarkMode ? '#22c55e' : '#16a34a'; // Accent color
            
            ctx.fillStyle = 'rgba(15, 23, 42, 0.05)'; // Dark background with fade effect
            if (!isDarkMode) {
                ctx.fillStyle = 'rgba(248, 250, 252, 0.08)'; // Light background with fade
            }
            ctx.fillRect(0, 0, width, height);
            
            ctx.fillStyle = rainColor;
            ctx.font = this.fontSize + 'px monospace';
            
            const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
            const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
            const chars = katakana + latin;
            
            for (let i = 0; i < this.columns.length; i++) {
                const text = chars.charAt(Math.floor(Math.random() * chars.length));
                ctx.fillText(text, i * this.fontSize, this.columns[i] * this.fontSize);
                
                if (this.columns[i] * this.fontSize > height && Math.random() > 0.975) {
                    this.columns[i] = 0;
                }
                this.columns[i]++;
            }
        }
    };
    
    let currentAnimation = networkAnimation;
    
    function switchAnimation(style) {
        cancelAnimationFrame(animationFrameId);
        if (style === 'matrix') {
            currentAnimation = matrixAnimation;
        } else {
            currentAnimation = networkAnimation;
        }
        currentAnimation.init();
        loop();
    }
    
    function loop() {
        currentAnimation.animate();
        animationFrameId = requestAnimationFrame(loop);
    }
    
    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
        currentAnimation.init();
    });
    
    // Listen for custom event to switch animation
    document.addEventListener('switch-bg-animation', (e) => {
        switchAnimation(e.detail.style);
    });
    
    // Initial load
    const savedStyle = localStorage.getItem('backgroundStyle') || 'network';
    switchAnimation(savedStyle);
});