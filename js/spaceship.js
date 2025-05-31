class Spaceship {
    constructor(x, y, canvas) {
        this.x = x;
        this.y = y;
        this.width = 40;
        this.height = 60;
        this.speed = 5;
        this.canvas = canvas;
        
        // Movement state
        this.keys = {
            left: false,
            right: false,
            up: false,
            down: false,
            shoot: false
        };
        
        // Bullet properties
        this.bullets = [];
        this.bulletSpeed = 10;
        this.bulletSize = 4;
        this.lastShot = 0;
        this.shootCooldown = 250; // milliseconds between shots
        
        // Visual effects
        this.thrusterParticles = [];
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.maxInvulnerabilityTime = 120; // 2 seconds at 60fps
        
        this.setupControls();
    }
    
    setupControls() {
        // Key down events
        document.addEventListener('keydown', (e) => {
            switch(e.code) {
                case 'ArrowLeft':
                    this.keys.left = true;
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    this.keys.right = true;
                    e.preventDefault();
                    break;
                case 'ArrowUp':
                    this.keys.up = true;
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    this.keys.down = true;
                    e.preventDefault();
                    break;
                case 'Space':
                    this.keys.shoot = true;
                    e.preventDefault();
                    break;
            }
        });
        
        // Key up events
        document.addEventListener('keyup', (e) => {
            switch(e.code) {
                case 'ArrowLeft':
                    this.keys.left = false;
                    break;
                case 'ArrowRight':
                    this.keys.right = false;
                    break;
                case 'ArrowUp':
                    this.keys.up = false;
                    break;
                case 'ArrowDown':
                    this.keys.down = false;
                    break;
                case 'Space':
                    this.keys.shoot = false;
                    break;
            }
        });
    }
    
    update() {
        // Handle movement
        if (this.keys.left && this.x > 0) {
            this.x -= this.speed;
        }
        if (this.keys.right && this.x < this.canvas.width - this.width) {
            this.x += this.speed;
        }
        if (this.keys.up && this.y > 0) {
            this.y -= this.speed;
        }
        if (this.keys.down && this.y < this.canvas.height - this.height) {
            this.y += this.speed;
        }
        
        // Handle shooting
        if (this.keys.shoot) {
            this.shoot();
        }
        
        // Update bullets
        this.updateBullets();
        
        // Update invulnerability
        if (this.invulnerable) {
            this.invulnerabilityTime--;
            if (this.invulnerabilityTime <= 0) {
                this.invulnerable = false;
            }
        }
        
        // Create thruster particles when moving
        if (this.keys.up || this.keys.left || this.keys.right || this.keys.down) {
            this.createThrusterParticles();
        }
        
        // Update thruster particles
        this.updateThrusterParticles();
    }
    
    shoot() {
        const currentTime = Date.now();
        if (currentTime - this.lastShot >= this.shootCooldown) {
            this.bullets.push({
                x: this.x + this.width / 2,
                y: this.y,
                size: this.bulletSize
            });
            this.lastShot = currentTime;
        }
    }
    
    updateBullets() {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= this.bulletSpeed;
            
            // Remove bullets that are off screen
            if (bullet.y + bullet.size < 0) {
                this.bullets.splice(i, 1);
            }
        }
    }
    
    checkBulletCollisions(asteroids) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = asteroids.length - 1; j >= 0; j--) {
                const asteroid = asteroids[j];
                const asteroidBounds = asteroid.getBounds();
                
                // Simple circle collision detection
                const dx = bullet.x - (asteroidBounds.x + asteroidBounds.width / 2);
                const dy = bullet.y - (asteroidBounds.y + asteroidBounds.height / 2);
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < bullet.size + asteroid.radius) {
                    // Remove the bullet
                    this.bullets.splice(i, 1);
                    
                    // Create explosion particles
                    const explosionParticles = asteroid.createExplosionParticles();
                    
                    // Split the asteroid into smaller pieces
                    const fragments = asteroid.split();
                    
                    // Remove the hit asteroid
                    asteroids.splice(j, 1);
                    
                    // Return information about the collision
                    return {
                        fragments,
                        explosionParticles,
                        points: asteroid.points
                    };
                }
            }
        }
        return null;
    }
    
    createThrusterParticles() {
        // Create particles at the back of the spaceship
        for (let i = 0; i < 2; i++) {
            this.thrusterParticles.push({
                x: this.x + this.width / 2 + randomFloat(-5, 5),
                y: this.y + this.height,
                vx: randomFloat(-1, 1),
                vy: randomFloat(1, 3),
                life: 1.0,
                decay: randomFloat(0.05, 0.1),
                size: randomFloat(2, 4),
                color: `hsl(${randomBetween(20, 60)}, 100%, 60%)`
            });
        }
    }
    
    updateThrusterParticles() {
        for (let i = this.thrusterParticles.length - 1; i >= 0; i--) {
            const particle = this.thrusterParticles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.thrusterParticles.splice(i, 1);
            }
        }
    }
    
    draw(ctx) {
        // Draw bullets
        this.drawBullets(ctx);
        
        // Draw thruster particles first (behind spaceship)
        this.drawThrusterParticles(ctx);
        
        // Draw spaceship with invulnerability flashing
        if (!this.invulnerable || Math.floor(this.invulnerabilityTime / 5) % 2) {
            this.drawSpaceship(ctx);
        }
    }
    
    drawBullets(ctx) {
        ctx.save();
        ctx.fillStyle = '#ff6b35';
        for (const bullet of this.bullets) {
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    
    drawThrusterParticles(ctx) {
        ctx.save();
        for (const particle of this.thrusterParticles) {
            ctx.globalAlpha = particle.life;
            ctx.fillStyle = particle.color;
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }
    
    drawSpaceship(ctx) {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Main body
        ctx.fillStyle = '#4a90e2';
        ctx.beginPath();
        ctx.moveTo(0, -this.height / 2);
        ctx.lineTo(-this.width / 3, this.height / 2);
        ctx.lineTo(this.width / 3, this.height / 2);
        ctx.closePath();
        ctx.fill();
        
        // Cockpit
        ctx.fillStyle = '#87ceeb';
        ctx.beginPath();
        ctx.arc(0, -this.height / 4, 8, 0, Math.PI * 2);
        ctx.fill();
        
        // Wings
        ctx.fillStyle = '#2c5aa0';
        ctx.fillRect(-this.width / 2, this.height / 4, 15, 8);
        ctx.fillRect(this.width / 2 - 15, this.height / 4, 15, 8);
        
        // Engine glow
        if (this.keys.up || this.keys.left || this.keys.right || this.keys.down) {
            ctx.fillStyle = '#ff6b35';
            ctx.beginPath();
            ctx.arc(0, this.height / 2 + 5, 6, 0, Math.PI * 2);
            ctx.fill();
        }
        
        ctx.restore();
    }
    
    getBounds() {
        return {
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height
        };
    }
    
    takeDamage() {
        if (!this.invulnerable) {
            this.invulnerable = true;
            this.invulnerabilityTime = this.maxInvulnerabilityTime;
            return true; // Damage taken
        }
        return false; // No damage (invulnerable)
    }
    
    reset(x, y) {
        this.x = x;
        this.y = y;
        this.invulnerable = false;
        this.invulnerabilityTime = 0;
        this.thrusterParticles = [];
        this.bullets = [];
        this.lastShot = 0;
    }
} 