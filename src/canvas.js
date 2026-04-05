// import { randomIntFromRange, randomColor, distance } from './utils/utils.js';
// import { color3 } from './utils/colorArrays.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

// Assets defination
const tileStart = new Image();
tileStart.src = '../assets/floating-platform/Tile_97.png'; // The left "cap"
const tileMiddle = new Image();
tileMiddle.src = '../assets/floating-platform/Tile_96.png'; // The repeating middle
const tileEnd = new Image();
tileEnd.src = '../assets/floating-platform/Tile_95.png';   // The right "cap"

const backgroundImage = new Image();
backgroundImage.src = '../assets/background/5.png'; // The Background 

const groundStart = new Image();
groundStart.src = '../assets/platform/Tile_01.png';
const groundMiddle = new Image();
groundMiddle.src = '../assets/platform/Tile_02.png';
const groundEnd = new Image();
groundEnd.src = '../assets/platform/Tile_03.png';
const groundDirt = new Image();
groundDirt.src = '../assets/platform/Tile_16.png';
// --- //

canvas.width = innerWidth;
canvas.height = innerHeight;

addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
})

var mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

addEventListener('mousemove', (event) => {
    mouse.x = event.clientX;
    mouse.y = event.clientY;
})


//  --- Movement Defination --- //
let scrollOffset = 0;

var keys = {
    left: {
        pressed: false,
    },
    right: {
        pressed: false,
    }
}

addEventListener('keydown', ({ keyCode }) => {
    // console.log(keyCode);

    switch (keyCode) {
        case 87:
        case 38:
            // console.log("W", "w", 87);
            // Only jump if the player is touching the bottom of the screen
            // if (player.position.y + player.radius >= canvas.height) {
            //     player.velocity.y = -20;
            // }
            player.velocity.y -= 20;
            break;

        case 65:
        case 37:
            // console.log("A", "a", 65);
            keys.left.pressed = true;
            break;

        case 83:
        case 40:
            // console.log("S", "s", 83);
            player.velocity.y += 50;
            break;

        case 68:
        case 39:
            // console.log("D", "d", 68);
            keys.right.pressed = true;
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    // console.log(keyCode);

    switch (keyCode) {
        case 87:
        case 38:
            // console.log("W", "w", 87);
            // player.velocity.y -= 20; //FUN-mod: double jump
            break;

        case 65:
        case 37:
            // console.log("A", "a", 65);
            keys.left.pressed = false;
            break;

        case 83:
        case 40:
            // console.log("S", "s", 83);
            break;

        case 68:
        case 39:
            // console.log("D", "d", 68);
            keys.right.pressed = false;
            break;
    }
})

class ScenicObject {
    constructor({ x, y, width }) {
        this.position = { x, y };
        this.width = width;
        this.height = 32;
        this.tileSize = 32;

        this.draw = () => {
            // use scenario/background assets to drawImage

        }
    }
}

class Platform {
    constructor({ x, y, width, height, type }) {
        this.position = { x, y };
        this.width = width;
        this.height = height;
        this.tileSize = 32;
        this.type = type;

        this.draw = () => {
            // --- Use platform assets to drawImage --- //
            const renderX = this.position.x - scrollOffset;  //

            if (this.type === 'floating') {
                // Calculate how many tiles we need to fill the width
                const totalTiles = Math.ceil(this.width / this.tileSize);

                for (let i = 0; i < totalTiles; i++) {
                    let currentImage;

                    // Logic to pick the right "piece" of the platform
                    if (i === 0) {
                        currentImage = tileStart;
                    } else if (i === totalTiles - 1) {
                        currentImage = tileEnd;
                    } else {
                        currentImage = tileMiddle;
                    }

                    // Draw the selected tile at the calculated position
                    c.drawImage(
                        currentImage,
                        renderX + (i * this.tileSize), // Each tile shifts by 32px
                        this.position.y,
                        this.tileSize,
                        this.height
                    );
                }
            } else {
                const columns = Math.ceil(this.width / this.tileSize);
                const rows = Math.ceil(this.height / this.tileSize);

                for (let r = 0; r < rows; r++) {
                    for (let c_idx = 0; c_idx < columns; c_idx++) {
                        let currentImage;
                        if (r === 0) {
                            if (c_idx === 0) currentImage = groundStart;
                            else if (c_idx === columns - 1) currentImage = groundEnd;
                            else currentImage = groundMiddle;
                        } else {
                            currentImage = groundDirt;
                        }

                        c.drawImage(
                            currentImage,
                            renderX + (c_idx * this.tileSize),
                            this.position.y + (r * this.tileSize),
                            this.tileSize,
                            this.tileSize
                        )
                    }
                }
            }
        }
    }
}

const GRAVITY = 1.8;
const ACCELERATION = 10;
const FRICTION = 0.9; //0.9 means it keeps 90% of its speed every frame

const maxSpeed = 40;
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


        this.draw = () => {
            c.beginPath();
            c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
        }

        this.update = () => {
            // horizontal movement
            this.position.x += this.velocity.x;
            // verticle movement
            this.position.y += this.velocity.y;
            this.velocity.y += GRAVITY;

            // After Jump: checks so that player does not stagger below ground
            if (this.position.y + this.radius > canvas.height) {
                this.position.y = canvas.height - this.radius;
                this.velocity.y = 0;
            }

            // Horizontal Movement checks
            this.velocity.x = 0;
            if (keys.right.pressed) {
                player.velocity.x += ACCELERATION;
            } else if (keys.left.pressed) {
                player.velocity.x -= ACCELERATION;
            } else {
                player.velocity.x *= FRICTION;
            }

            // Limit the speed so the player doesn't become a rocket
            if (this.velocity.x > maxSpeed) this.velocity.x = maxSpeed;
            if (this.velocity.x < -maxSpeed) this.velocity.x = -maxSpeed;

            // Small optimization: Stop completely if moving very slowly (prevents infinite sliding)
            if (Math.abs(this.velocity.x) < 0.1) this.velocity.x = 0;
            if (Math.abs(this.velocity.y) < 0.1) this.velocity.y = 0;

            this.draw();
        }
    }
}

let player = new Player(200, canvas.height / 2, 20, 'blue');

const platforms = [
    // --- The Main Ground Section ---
    new Platform({ x: 0, y: canvas.height - 64, width: 800, height: 128, type: 'ground' }),

    // --- A "Death Pit" Gap (Nothing between x: 800 and x: 1000) ---

    // --- Another Ground Section ---
    new Platform({ x: 1000, y: canvas.height - 128, width: 600, height: 128, type: 'ground' }),

    // --- Floating Platforms (Above the pits or ground) ---
    new Platform({ x: 200, y: 400, width: 96, height: 32, type: 'floating' }),
    new Platform({ x: 500, y: 300, width: 128, height: 32, type: 'floating' }),
    new Platform({ x: 850, y: 250, width: 160, height: 32, type: 'floating' }), new Platform({ x: 1200, y: 400, width: 96, height: 32, type: 'floating' }),
];

function init() {

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    // Parallax Effect: Moving Background
    c.drawImage(backgroundImage, 0 - (scrollOffset * 0.5), 0, canvas.width, canvas.height);
    c.drawImage(backgroundImage, (canvas.width - (scrollOffset * 0.5) % canvas.width), 0, canvas.width, canvas.height); //so that the background image loops forever

    platforms.forEach(platform => {
        // Omly draw platform if it's inside visible window || Frustrum Culling to save GPU from rendering objects that player cannot see
        const platformCanvasX = platform.position.x - scrollOffset;
        if (platformCanvasX + platform.width > 0 && platformCanvasX < canvas.width) {
            platform.draw();
        }
    });

    player.update();

    // Scroll 

    if (keys.right.pressed && player.position.x < canvas.width / 2 - 75) {
        // allow player movement
    } else if (keys.left.pressed && player.position.x > 100) {
        // allow player movement
    } else {
        player.velocity.x = 0

        if (keys.right.pressed) {
            scrollOffset += ACCELERATION;
        } else if (keys.left.pressed) {
            scrollOffset -= ACCELERATION;
        }
    }

    // Platform collision detection
    platforms.forEach(platform => {
        const platformCanvasX = platform.position.x - scrollOffset;
        if (player.position.y + player.radius + player.velocity.y > platform.position.y //above the platform
            && player.position.y + player.radius <= platform.position.y //below the platform
            && player.position.x - player.radius <= platformCanvasX + platform.width //right edge of the platform
            && player.position.x + player.radius >= platformCanvasX //left edge of the platform
        ) {
            player.velocity.y = 0
        }
    })

    // 4. Win Condition (Super Clean!)
    if (scrollOffset > 5000) {
        console.log("You reached the end of the level!");
    }

    console.log("scrollOff:", scrollOffset);
    console.log("player position:", player.position.x, player.position.y);
    console.log("----------__-------------");


    c.fillText('dattebayo', mouse.x, mouse.y)
}

init();
animate();