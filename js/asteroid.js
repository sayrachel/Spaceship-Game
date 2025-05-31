class Asteroid {
    constructor(x, y, size = 'large') {
        this.x = x;
        this.y = y;
        this.size = size;
        
        // Set properties based on size
        this.setSizeProperties();
        
        // Movement
        this.vx = randomFloat(-1, 1);
        this.vy = randomFloat(1, 3);
        this.rotation = 0;
        this.rotationSpeed = randomFloat(-0.05, 0.05);
        
        // Visual properties
        this.vertices = this.generateVertices();
        this.color = this.generateColor();
    }
    
    setSizeProperties() {
        switch(this.size) {
            case 'small':
                this.radius = randomBetween(15, 25);
                this.points = 50;
                break;
            case 'medium':
                this.radius = randomBetween(25, 40);
                this.points = 100;
                break;
            case 'large':
            default:
                this.radius = randomBetween(40, 60);
                this.points = 200;
                break;
        }
        
        this.width = this.radius * 2;
        this.height = this.radius * 2;
    }
    
    generateVertices() {
        const vertices = [];
        const numVertices = randomBetween(8, 12);
        
        for (let i = 0; i < numVertices; i++) {
            const angle = (i / numVertices) * Math.PI * 2;
            const radiusVariation = randomFloat(0.7, 1.3);
            const x = Math.cos(angle) * this.radius * radiusVariation;
            const y = Math.sin(angle) * this.radius * radiusVariation;
            vertices.push({ x, y });
        }
        
        return vertices;
    }
    
    generateColor() {
        const colors = [
            '#8b4513', // Brown
            '#696969', // Gray
            '#a0522d', // Sienna
            '#556b2f', // Dark olive green
            '#2f4f4f'  // Dark slate gray
        ];
        return colors[randomBetween(0, colors.length - 1)];
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.rotation += this.rotationSpeed;
        
        // Wrap around horizontally
        if (this.x < -this.radius) {
            this.x = 800 + this.radius;
        } else if (this.x > 800 + this.radius) {
            this.x = -this.radius;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        
        // Draw asteroid shape
        ctx.fillStyle = this.color;
        ctx.strokeStyle = '#444';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            if (i === 0) {
                ctx.moveTo(vertex.x, vertex.y);
            } else {
                ctx.lineTo(vertex.x, vertex.y);
            }
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
        
        // Add some surface details
        this.drawSurfaceDetails(ctx);
        
        ctx.restore();
    }
    
    drawSurfaceDetails(ctx) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        
        // Draw some craters/spots
        for (let i = 0; i < 3; i++) {
            const x = randomFloat(-this.radius * 0.5, this.radius * 0.5);
            const y = randomFloat(-this.radius * 0.5, this.radius * 0.5);
            const size = randomFloat(2, 6);
            
            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
        }
    }
    
    getBounds() {
        return {
            x: this.x - this.radius,
            y: this.y - this.radius,
            width: this.radius * 2,
            height: this.radius * 2
        };
    }
    
    isOffScreen() {
        return this.y > 600 + this.radius;
    }
    
    // Create smaller asteroids when this one is destroyed
    split() {
        const fragments = [];
        
        if (this.size === 'large') {
            // Create 2-3 medium asteroids
            const numFragments = randomBetween(2, 3);
            for (let i = 0; i < numFragments; i++) {
                fragments.push(new Asteroid(
                    this.x + randomFloat(-20, 20),
                    this.y + randomFloat(-20, 20),
                    'medium'
                ));
            }
        } else if (this.size === 'medium') {
            // Create 2-4 small asteroids
            const numFragments = randomBetween(2, 4);
            for (let i = 0; i < numFragments; i++) {
                fragments.push(new Asteroid(
                    this.x + randomFloat(-15, 15),
                    this.y + randomFloat(-15, 15),
                    'small'
                ));
            }
        }
        // Small asteroids don't split further
        
        return fragments;
    }
    
    // Create explosion particles
    createExplosionParticles() {
        const particles = [];
        const numParticles = this.size === 'large' ? 20 : this.size === 'medium' ? 15 : 10;
        
        // Create particles in a circular pattern
        for (let i = 0; i < numParticles; i++) {
            const angle = (i / numParticles) * Math.PI * 2;
            const speed = randomFloat(2, 6);
            const size = randomFloat(2, 6);
            
            particles.push({
                x: this.x,
                y: this.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1.0,
                decay: randomFloat(0.02, 0.05),
                size: size,
                color: this.getExplosionColor()
            });
        }
        
        // Add some additional random particles for more chaos
        for (let i = 0; i < numParticles / 2; i++) {
            particles.push({
                x: this.x + randomFloat(-this.radius, this.radius),
                y: this.y + randomFloat(-this.radius, this.radius),
                vx: randomFloat(-4, 4),
                vy: randomFloat(-4, 4),
                life: 1.0,
                decay: randomFloat(0.02, 0.05),
                size: randomFloat(1, 4),
                color: this.getExplosionColor()
            });
        }
        
        return particles;
    }
    
    getExplosionColor() {
        // Create a fiery explosion effect
        const colors = [
            '#ff6b35', // Orange
            '#ff9f1c', // Light orange
            '#ffbf69', // Light yellow
            '#ff4d4d', // Red
            '#ff8c42'  // Dark orange
        ];
        return colors[randomBetween(0, colors.length - 1)];
    }
} 