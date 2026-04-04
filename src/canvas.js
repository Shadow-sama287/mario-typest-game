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

class Circle {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;


        this.draw = () => {
            c.beginPath();
            c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
            c.fillStyle = this.color;
            c.fill();
            c.closePath();
        }

        this.update = () => {
            //Start here

            this.draw();
        }
    }
}

let objects;
function init() {
    objects = [];

    for (let i = 0; i < 1; i++) {
        objects.push(new Circle(canvas.width / 2, canvas.height / 2, 5, 'blue'));
    }

}

function animate() {
    requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.width, canvas.height);

    objects.forEach(object => {
        object.update();
    });

    c.fillText('dattebayo', mouse.x, mouse.y)
}

init();
animate();