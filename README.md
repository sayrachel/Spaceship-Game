# Spaceship Asteroid Dodger

A classic arcade-style game where you pilot a spaceship through an asteroid field, dodging incoming asteroids to survive as long as possible.

## 🎮 Game Features

- **Smooth Controls**: Use arrow keys to navigate your spaceship
- **Progressive Difficulty**: Asteroids spawn faster and more frequently as you advance
- **Visual Effects**: Thruster particles, explosion effects, and twinkling stars
- **Scoring System**: Earn points for survival time and avoiding asteroids
- **Lives System**: Start with 3 lives, lose one when hit by an asteroid
- **Invulnerability Frames**: Brief invulnerability after taking damage
- **Responsive Design**: Adapts to different screen sizes

## 🚀 How to Play

1. Open `index.html` in your web browser
2. Click "Start Game" to begin
3. Use the arrow keys to move your spaceship:
   - ⬅️ **Left Arrow**: Move left
   - ➡️ **Right Arrow**: Move right
   - ⬆️ **Up Arrow**: Move up
   - ⬇️ **Down Arrow**: Move down
4. Avoid the asteroids falling from the top of the screen
5. Survive as long as possible to achieve a high score!

## 🛠️ Technical Details

### Technologies Used
- **HTML5 Canvas**: For rendering graphics
- **JavaScript ES6+**: Game logic and object-oriented programming
- **CSS3**: Modern styling with gradients and animations

### Project Structure
```
spaceship-game/
├── index.html          # Main HTML file
├── css/
│   └── style.css       # Game styling
├── js/
│   ├── game.js         # Main game loop and logic
│   ├── spaceship.js    # Spaceship class
│   ├── asteroid.js     # Asteroid class
│   └── utils.js        # Utility functions
└── README.md           # This file
```

### Game Architecture

#### Classes
- **Game**: Main game controller, handles game loop, state management, and UI
- **Spaceship**: Player-controlled spaceship with movement and collision detection
- **Asteroid**: Randomly generated asteroids with physics and rendering

#### Key Features
- **60 FPS Game Loop**: Uses `requestAnimationFrame` for smooth animation
- **Collision Detection**: Bounding box collision system
- **Particle System**: Visual effects for thrusters and explosions
- **State Management**: Menu, playing, paused, and game over states
- **Progressive Difficulty**: Dynamic spawn rates and asteroid counts

## 🎯 Game Mechanics

### Scoring
- **+10 points** for each asteroid that passes off-screen
- **Level progression** every 1000 points
- **Difficulty increase** with each level

### Difficulty Scaling
- **Asteroid spawn rate** decreases (more frequent spawning)
- **Maximum asteroids** on screen increases
- **Level indicator** shows current difficulty

### Visual Effects
- **Thruster particles** when moving
- **Explosion particles** when hit
- **Twinkling stars** background
- **Invulnerability flashing** after taking damage

## 🔧 Development

### Adding New Features
The modular structure makes it easy to extend:

1. **New Asteroid Types**: Modify `asteroid.js` to add different behaviors
2. **Power-ups**: Create new classes and integrate with collision system
3. **Weapons**: Add shooting mechanics to the spaceship
4. **Sound Effects**: Integrate Web Audio API for audio feedback
5. **High Scores**: Add localStorage for persistent high scores

### Performance Considerations
- Particle systems are optimized with object pooling potential
- Collision detection uses simple bounding boxes for performance
- Canvas clearing uses partial transparency for trail effects

## 🎨 Customization

### Visual Customization
- Modify colors in `style.css` for different themes
- Adjust spaceship design in `spaceship.js` `drawSpaceship()` method
- Change asteroid appearance in `asteroid.js` `draw()` method

### Gameplay Customization
- Adjust difficulty scaling in `game.js` `updateDifficulty()` method
- Modify spawn rates and asteroid counts
- Change spaceship speed and invulnerability duration

## 🚀 Future Enhancements

- **Sound Effects**: Engine sounds, explosion audio, background music
- **High Score System**: Local storage for persistent scores
- **Power-ups**: Shield, speed boost, temporary invincibility
- **Weapon System**: Ability to shoot and destroy asteroids
- **Multiple Ship Types**: Different ships with unique abilities
- **Background Parallax**: Moving star field for depth
- **Mobile Support**: Touch controls for mobile devices

## 📱 Browser Compatibility

- **Chrome**: Full support
- **Firefox**: Full support
- **Safari**: Full support
- **Edge**: Full support

Requires a modern browser with HTML5 Canvas support.

---

Enjoy playing Spaceship Asteroid Dodger! 🚀✨ 