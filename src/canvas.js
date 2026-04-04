// import { randomIntFromRange, randomColor, distance } from './utils/utils.js';
// import { color3 } from './utils/colorArrays.js';

const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

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

var keys = {
    left: {
        pressed: false,
    },
    right: {
        pressed: false,
    }
}

addEventListener('keydown', ({ keyCode }) => {
    console.log(keyCode);

    switch (keyCode) {
        case 87:
        case 38:
            console.log("W", "w", 87);
            // Only jump if the player is touching the bottom of the screen
            // if (player.position.y + player.radius >= canvas.height) {
            //     player.velocity.y = -20;
            // }
            player.velocity.y -= 20;
            break;

        case 65:
        case 37:
            console.log("A", "a", 65);
            keys.left.pressed = true;
            break;

        case 83:
        case 40:
            console.log("S", "s", 83);
            player.velocity.y += 50;
            break;

        case 68:
        case 39:
            console.log("D", "d", 68);
            keys.right.pressed = true;
            break;
    }
})

addEventListener('keyup', ({ keyCode }) => {
    console.log(keyCode);

    switch (keyCode) {
        case 87:
        case 38:
            console.log("W", "w", 87);
            // player.velocity.y -= 20; //FUN-mod: double jump
            break;

        case 65:
        case 37:
            console.log("A", "a", 65);
            keys.left.pressed = false;
            break;

        case 83:
        case 40:
            console.log("S", "s", 83);
            break;

        case 68:
        case 39:
            console.log("D", "d", 68);
            keys.right.pressed = false;
            break;
    }
})

class Platform {
    constructor() {
        this.position = {
            x: canvas.width / 2 + 100,
            y: canvas.height / 2 + 200
        };
        this.width = 200;
        this.height = 10;

        this.draw = () => {
            c.beginPath();
            c.fillStyle = 'red';
            c.fillRect(this.position.x, this.position.y, this.width, this.height);
            c.closePath();
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
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;
            this.velocity.y += GRAVITY;

            if (this.position.y + this.radius > canvas.height) {
                this.position.y = canvas.height - this.radius;
                this.velocity.y = 0;
            }

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

let player = new Player(canvas.width / 2, canvas.height / 2, 20, 'blue');
let platform = new Platform();

function init() {

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);


    platform.draw();
    player.update();

    if (player.position.y + player.radius + player.velocity.y > platform.position.y
        && player.position.y + player.radius <= platform.position.y
        && player.position.x - player.radius <= platform.position.x + platform.width
        && player.position.x + player.radius >= platform.position.x) {
        player.velocity.y = 0
    }

    c.fillText('dattebayo', mouse.x, mouse.y)
}

init();
animate();