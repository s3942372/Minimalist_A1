const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

ctx.fillStyle = '#000';
ctx.fillRect(0, 0, canvas.width, canvas.height);

let isDrawing = false;
let points = [];
const eraseColor = '#FFF';
const shapes = []; 
const erasedAreas = [];

function getTouchPos(canvasDom, touchEvent) {
    var rect = canvasDom.getBoundingClientRect();
    return {
        x: touchEvent.touches[0].clientX - rect.left,
        y: touchEvent.touches[0].clientY - rect.top
    };
}

canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    points = [];
    addPoint(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        addPoint(e);
        drawCurrentShape();
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        shapes.push(points.slice());
        applyEraser(); 
        drawAllShapes(); 
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    isDrawing = true;
    points = [];
    addPoint(getTouchPos(canvas, e));
}, { passive: false }); 

canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); 
    if (isDrawing) {
        addPoint(getTouchPos(canvas, e));
        drawCurrentShape();
    }
}, { passive: false }); 

canvas.addEventListener('touchend', () => {
    if (isDrawing) {
        isDrawing = false;
        shapes.push(points.slice());
        applyEraser(); 
        drawAllShapes(); 
    }
});

function addPoint(e) {
    const pos = typeof e === 'touchevent' ? getTouchPos(canvas, e) : { clientX: e.clientX, clientY: e.clientY };
    points.push(pos);
}

function addPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    points.push({ x, y });
}

function drawCurrentShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllShapes();

    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[0].x, points[0].y);
    ctx.stroke();
}

function drawAllShapes() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.globalCompositeOperation = 'source-atop';
    erasedAreas.forEach(area => {
        ctx.fillStyle = eraseColor;
        ctx.beginPath();
        ctx.moveTo(area[0].x, area[0].y);
        for (let i = 1; i < area.length; i++) {
            ctx.lineTo(area[i].x, area[i].y);
        }
        ctx.lineTo(area[0].x, area[0].y); 
        ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over'; 
}

function applyEraser() {
    erasedAreas.push(points.slice());
    
    ctx.globalCompositeOperation = 'destination-out';
    shapes.forEach(shape => {
        ctx.beginPath();
        ctx.moveTo(shape[0].x, shape[0].y);
        for (let i = 1; i < shape.length; i++) {
            ctx.lineTo(shape[i].x, shape[i].y);
        }
        ctx.lineTo(shape[0].x, shape[0].y);
        ctx.fill();
    });
    
    ctx.globalCompositeOperation = 'source-over';
}

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawAllShapes();
});
