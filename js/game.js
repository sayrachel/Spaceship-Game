class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        
        // Game state
        this.gameState = 'menu'; // 'menu', 'playing', 'paused', 'gameOver'
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.frameCount = 0;
        
        // Game objects
        this.spaceship = new Spaceship(
            this.canvas.width / 2 - 20,
            this.canvas.height - 100,
            this.canvas
        );
        this.asteroids = [];
        this.particles = [];
        this.stars = [];
        this.explosionParticles = [];
        this.powerups = [];
        
        // Game settings
        this.asteroidSpawnRate = 120; // frames between spawns
        this.maxAsteroids = 8;
        this.powerupSpawnRate = 600; // frames between powerup spawns
        this.powerupChance = 0.3; // 30% chance to spawn a powerup when conditions are met
        
        // UI elements
        this.scoreElement = document.getElementById('score');
        this.livesElement = document.getElementById('lives');
        this.gameOverElement = document.getElementById('gameOver');
        this.finalScoreElement = document.getElementById('finalScore');
        
        this.setupEventListeners();
        this.generateStars();
        this.gameLoop();
    }
    
    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        document.getElementById('pauseBtn').addEventListener('click', () => {
            this.togglePause();
        });
        
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.resetGame();
        });
        
        document.getElementById('restartBtn').addEventListener('click', () => {
            this.startGame();
        });
        
        // Prevent arrow keys from scrolling the page
        document.addEventListener('keydown', (e) => {
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    generateStars() {
        for (let i = 0; i < 100; i++) {
            this.stars.push({
                x: randomBetween(0, this.canvas.width),
                y: randomBetween(0, this.canvas.height),
                size: randomFloat(0.5, 2),
                brightness: randomFloat(0.3, 1),
                twinkleSpeed: randomFloat(0.01, 0.03)
            });
        }
    }
    
    startGame() {
        this.gameState = 'playing';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.frameCount = 0;
        this.asteroids = [];
        this.particles = [];
        
        this.spaceship.reset(
            this.canvas.width / 2 - 20,
            this.canvas.height - 100
        );
        
        this.updateUI();
        this.gameOverElement.classList.add('hidden');
        
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
    }
    
    togglePause() {
        if (this.gameState === 'playing') {
            this.gameState = 'paused';
            document.getElementById('pauseBtn').textContent = 'Resume';
        } else if (this.gameState === 'paused') {
            this.gameState = 'playing';
            document.getElementById('pauseBtn').textContent = 'Pause';
        }
    }
    
    resetGame() {
        this.gameState = 'menu';
        this.score = 0;
        this.lives = 3;
        this.level = 1;
        this.frameCount = 0;
        this.asteroids = [];
        this.particles = [];
        
        this.spaceship.reset(
            this.canvas.width / 2 - 20,
            this.canvas.height - 100
        );
        
        this.updateUI();
        this.gameOverElement.classList.add('hidden');
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        document.getElementById('pauseBtn').textContent = 'Pause';
    }
    
    gameOver() {
        this.gameState = 'gameOver';
        this.finalScoreElement.textContent = this.score;
        this.gameOverElement.classList.remove('hidden');
        
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
    }
    
    update() {
        if (this.gameState !== 'playing') return;
        
        this.frameCount++;
        
        // Update spaceship
        this.spaceship.update();
        
        // Spawn asteroids
        if (this.frameCount % this.asteroidSpawnRate === 0 && this.asteroids.length < this.maxAsteroids) {
            this.spawnAsteroid();
        }

        // Spawn powerups
        if (this.frameCount % this.powerupSpawnRate === 0 && Math.random() < this.powerupChance) {
            this.spawnPowerup();
        }
        
        // Update asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            asteroid.update();
            
            // Remove asteroids that are off screen
            if (asteroid.isOffScreen()) {
                this.asteroids.splice(i, 1);
                this.score += 10; // Points for survival
            }
        }

        // Update powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            powerup.update();
            
            // Remove powerups that are off screen
            if (powerup.isOffScreen(this.canvas)) {
                this.powerups.splice(i, 1);
            }
        }
        
        // Update explosion particles
        this.updateExplosionParticles();
        
        // Update other particles
        this.updateParticles();
        
        // Check collisions
        this.checkCollisions();
        
        // Update stars
        this.updateStars();
        
        // Increase difficulty over time
        this.updateDifficulty();
        
        // Update UI
        this.updateUI();
    }
    
    spawnAsteroid() {
        const x = randomBetween(0, this.canvas.width);
        const y = -60;
        const size = ['small', 'medium', 'large'][randomBetween(0, 2)];
        this.asteroids.push(new Asteroid(x, y, size));
    }
    
    spawnPowerup() {
        const x = randomBetween(0, this.canvas.width - 30);
        const y = -60;
        this.powerups.push(new Powerup(x, y));
    }
    
    updateParticles() {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            if (particle.life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    updateExplosionParticles() {
        for (let i = this.explosionParticles.length - 1; i >= 0; i--) {
            const particle = this.explosionParticles[i];
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= particle.decay;
            
            // Add some gravity effect
            particle.vy += 0.1;
            
            if (particle.life <= 0) {
                this.explosionParticles.splice(i, 1);
            }
        }
    }
    
    updateStars() {
        for (const star of this.stars) {
            star.brightness += Math.sin(this.frameCount * star.twinkleSpeed) * 0.01;
            star.brightness = clamp(star.brightness, 0.3, 1);
        }
    }
    
    checkCollisions() {
        const spaceshipBounds = this.spaceship.getBounds();
        
        // Check bullet collisions first
        const collision = this.spaceship.checkBulletCollisions(this.asteroids);
        if (collision) {
            // Add explosion particles
            this.explosionParticles.push(...collision.explosionParticles);
            // Add new asteroid fragments
            this.asteroids.push(...collision.fragments);
            // Update score
            this.score += collision.points;
        }
        
        // Check spaceship collisions with asteroids
        for (let i = this.asteroids.length - 1; i >= 0; i--) {
            const asteroid = this.asteroids[i];
            const asteroidBounds = asteroid.getBounds();
            
            if (checkCollision(spaceshipBounds, asteroidBounds)) {
                // Spaceship hit
                if (this.spaceship.takeDamage()) {
                    this.lives--;
                    
                    // Create explosion particles
                    this.explosionParticles.push(...asteroid.createExplosionParticles());
                    
                    // Remove asteroid
                    this.asteroids.splice(i, 1);
                    
                    if (this.lives <= 0) {
                        this.gameOver();
                        return;
                    }
                }
            }
        }

        // Check spaceship collisions with powerups
        for (let i = this.powerups.length - 1; i >= 0; i--) {
            const powerup = this.powerups[i];
            const powerupBounds = powerup.getBounds();
            
            if (checkCollision(spaceshipBounds, powerupBounds)) {
                // Collect powerup
                this.lives = Math.min(this.lives + 1, 5); // Max 5 lives
                this.powerups.splice(i, 1);
                this.updateUI();
            }
        }
    }
    
    updateDifficulty() {
        // Increase level every 1000 points
        const newLevel = Math.floor(this.score / 1000) + 1;
        if (newLevel > this.level) {
            this.level = newLevel;
            // Increase spawn rate and max asteroids
            this.asteroidSpawnRate = Math.max(60, 120 - (this.level * 10));
            this.maxAsteroids = Math.min(15, 8 + this.level);
        }
    }
    
    updateUI() {
        this.scoreElement.textContent = this.score;
        this.livesElement.textContent = this.lives;
    }
    
    draw() {
        // Clear canvas
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw stars
        this.drawStars();
        
        // Draw game objects
        if (this.gameState !== 'menu') {
            this.spaceship.draw(this.ctx);
            
            for (const asteroid of this.asteroids) {
                asteroid.draw(this.ctx);
            }

            for (const powerup of this.powerups) {
                powerup.draw(this.ctx);
            }
            
            // Draw explosion particles
            this.drawExplosionParticles();
            
            // Draw other particles
            this.drawParticles();
        }
        
        // Draw UI overlays
        this.drawUI();
    }
    
    drawStars() {
        this.ctx.save();
        for (const star of this.stars) {
            this.ctx.globalAlpha = star.brightness;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    drawParticles() {
        this.ctx.save();
        for (const particle of this.particles) {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    drawExplosionParticles() {
        this.ctx.save();
        for (const particle of this.explosionParticles) {
            this.ctx.globalAlpha = particle.life;
            this.ctx.fillStyle = particle.color;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        }
        this.ctx.restore();
    }
    
    drawUI() {
        if (this.gameState === 'paused') {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('PAUSED', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.restore();
        }
        
        if (this.gameState === 'menu') {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '36px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Press Start to Begin', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.restore();
        }
        
        // Draw level indicator
        if (this.gameState === 'playing') {
            this.ctx.save();
            this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            this.ctx.font = '20px Arial';
            this.ctx.textAlign = 'right';
            this.ctx.fillText(`Level ${this.level}`, this.canvas.width - 20, 30);
            this.ctx.restore();
        }
    }
    
    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Start the game when the page loads
window.addEventListener('load', () => {
    new Game();
}); 