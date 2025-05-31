class Powerup {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.active = true;
    }

    update() {
        this.y += this.speed;
    }

    draw(ctx) {
        if (!this.active) return;

        ctx.save();
        ctx.translate(this.x + this.width/2, this.y + this.height/2);
        
        // Draw heart shape
        ctx.fillStyle = '#ff0000';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(-10, -10, -15, 0, 0, 15);
        ctx.bezierCurveTo(15, 0, 10, -10, 0, 0);
        ctx.fill();
        
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

    isOffScreen(canvas) {
        return this.y > canvas.height;
    }
} 