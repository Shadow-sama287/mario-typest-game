# Mario Platform Game

A simple 2D platformer game built with HTML5 Canvas and vanilla JavaScript. This project demonstrates core game development concepts including physics, gravity, collision detection, and keyboard input handling.

## Overview

This is a beginner-friendly platformer where you control a player character (currently a blue circle) that can move left/right and jump. The game features gravity, which pulls the player down, and collision detection with the ground.

**Perfect for learning:**

- Canvas rendering
- Game physics (velocity, acceleration, gravity)
- Event handling (keyboard input)
- Game loop and animation
- Collision detection

---

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Edge, Safari)
- A text editor (VS Code, Sublime, etc.)
- Live Server extension (for VS Code) or any local server

### Installation & Running

1. **Clone or download** this repository
2. **Open the project folder** in your editor
3. **Start Live Server:**
   - In VS Code: Right-click on `src/index.html` → "Open with Live Server"
   - Or navigate to `http://localhost:5500/src/index.html` (or your server port)
4. **The game should load** in your browser

---

## Game Controls

| Key                      | Action     |
| ------------------------ | ---------- |
| **W** or **Up Arrow**    | Jump       |
| **A** or **Left Arrow**  | Move Left  |
| **D** or **Right Arrow** | Move Right |

---

## Project Structure

```
mario-game/
├── src/
│   ├── index.html          # Main HTML file
│   ├── canvas.js           # Game logic and rendering
│   └── utils/              # (Optional) Utility functions
├── assets/                 # Images, sounds, etc.
└── README.md               # This file
```

---

## How the Game Works

### The Player

The player is created as a circle with a certain radius. Here's the basic structure in `canvas.js`:

```javascript
class Player {
  constructor(x, y, radius, color) {
    this.position = { x: x, y: y };
    this.radius = radius;
    this.velocity = { x: 0, y: 10 };
    // ... draw() and update() methods
  }
}
```

**Key properties:**

- `position`: X and Y coordinates on the canvas
- `velocity`: How fast the player moves per frame (in pixels)
- `radius`: Size of the player circle

### Gravity and Physics

Gravity is applied each frame to make the player fall:

```javascript
const GRAVITY = 1.8; // Acceleration downward

this.velocity.y += GRAVITY; // Increases falling speed
this.position.y += this.velocity.y; // Moves player down
```

### Ground Collision

When the player reaches the bottom of the canvas, they stop:

```javascript
if (this.position.y + this.radius > canvas.height) {
  this.position.y = canvas.height - this.radius; // Snap to ground
  this.velocity.y = 0; // Stop falling
}
```

---

## Adding Double or Triple Jump

Want your player to jump mid-air? Follow this guide to add **double jump** (or triple jump) functionality.

### How It Works

Instead of only allowing a jump when the player touches the ground, we track a **jump counter**:

- Give the player a limit (e.g., 2 for double jump, 3 for triple jump)
- Every jump increments the counter
- When they touch the ground, reset the counter to 0

This way, the player can jump again before hitting the ground!

### Step 1: Add Jump Properties to Player Class

In `canvas.js`, locate the **Player constructor** (around line 95). Add these two properties after `this.velocity`:

```javascript
class Player {
    constructor(x, y, radius, color) {
        this.position = {
            x: x,
            y: y,
        }
        this.radius = radius;
        this.color = color;
        this.velocity = {
            x: 0,
            y: 10,
        }

        // ADD THESE TWO LINES:
        this.jumpCount = 0;        // Tracks current jumps
        this.maxJumps = 2;         // Set to 2 for double jump, 3 for triple jump

        this.draw = () => {
            // ... existing draw code ...
        }
```

### Step 2: Reset Jump Counter on Ground Contact

In the **`update()` method**, locate the ground collision code (around line 118). Modify it to reset the jump counter:

**Find this:**

```javascript
if (this.position.y + this.radius > canvas.height) {
  this.position.y = canvas.height - this.radius;
  this.velocity.y = 0;
}
```

**Replace with this:**

```javascript
if (this.position.y + this.radius > canvas.height) {
  this.position.y = canvas.height - this.radius;
  this.velocity.y = 0;
  this.jumpCount = 0; // RESET the jump counter when touching ground
}
```

### Step 3: Update Jump Logic in Keydown Event

In the **`addEventListener('keydown')` section**, locate the jump case (around line 42).

**Find this:**

```javascript
case 87:
case 38:
    console.log("W", "w", 87);
    // Only jump if the player is touching the bottom of the screen
    if (player.position.y + player.radius >= canvas.height) {
        player.velocity.y = -20;
    }
    break;
```

**Replace with this:**

```javascript
case 87:
case 38:
    console.log("W", "w", 87);
    // Check if the player has jumps remaining
    if (player.jumpCount < player.maxJumps) {
        player.velocity.y = -20;      // Apply jump force
        player.jumpCount++;            // Increment jump counter
    }
    break;
```

### Step 4: Test It!

1. Reload your browser (or Live Server will auto-refresh)
2. Press **W** or **Up Arrow** in mid-air
3. You should now jump a second time!

### Customize Jump Count

In the Player constructor (Step 1), change `this.maxJumps`:

- `this.maxJumps = 2;` → Double Jump
- `this.maxJumps = 3;` → Triple Jump
- `this.maxJumps = 4;` → Quad Jump!

---

## Optional Tweaks

### Adjust Jump Strength

Higher negative values = more powerful jump:

```javascript
player.velocity.y = -20; // Change -20 to -30 for higher jumps
```

### Adjust Gravity

Higher values = faster falling:

```javascript
const GRAVITY = 1.8; // Change to 2.5 for stronger gravity
```

### Adjust Movement Speed

Fastest horizontal movement (1-5 is typical):

```javascript
this.velocity.x = -2; // Left movement
this.velocity.x = 2; // Right movement
```

---

## Troubleshooting

### Player Not Appearing?

- Check browser console for errors (F12)
- Make sure `index.html` is linked to `canvas.js` with `<script type="module" src="canvas.js"></script>`

### Jumping Not Working?

- Ensure the keydown event listener is properly set up
- Check that `player` is defined before the game starts

### Too Fast/Slow?

- Adjust `GRAVITY` constant
- Adjust velocity multipliers in movement code
- Adjust jump force (`velocity.y = -20`)

---

## Next Steps

Once you have the basics working, try adding:

- ✅ Double/Triple Jump (see above)
  <!-- - 🎨 Change player appearance (square, image, or sprite) -->
  <!-- - 🎯 Add platforms at different heights -->
  <!-- - 🌍 Add enemy collision -->
  <!-- - 🎮 Add score/lives system -->
  <!-- - 🔊 Add sound effects -->

---

## Learning Resources

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
- [JavaScript Event Handling](https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener)
- [Game Physics Basics](https://gamedev.stackexchange.com/questions/1089/when-should-i-use-fixed-or-variable-time-steps)

---

## License

This project is open source and available for educational purposes. Feel free to fork, modify, and build upon it!

**Parameters:**

- `x1` (number) - X coordinate of first point
- `y1` (number) - Y coordinate of first point
- `x2` (number) - X coordinate of second point
- `y2` (number) - Y coordinate of second point

**Returns:** Distance between the two points (number)

---
