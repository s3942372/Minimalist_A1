const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Set canvas size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Draw the initial background color
ctx.fillStyle = '#000'; // Black background
ctx.fillRect(0, 0, canvas.width, canvas.height);

// Initialize drawing state and properties
let isDrawing = false;
let points = [];
const eraseColor = '#FFFFFF'; // Red color for erased areas
const shapes = []; // Store multiple shapes
const erasedAreas = []; // Store erased areas

// Handle mouse events
canvas.addEventListener('mousedown', (e) => {
    isDrawing = true;
    points = [];
    addPoint(e);
});

canvas.addEventListener('mousemove', (e) => {
    if (isDrawing) {
        addPoint(e);
        drawCurrentShape(); // Preview current shape
    }
});

canvas.addEventListener('mouseup', () => {
    if (isDrawing) {
        isDrawing = false;
        shapes.push(points.slice()); // Save the current shape
        applyEraser(); // Apply eraser to the shapes
        drawAllShapes(); // Redraw all shapes
    }
});

// Function to add points to the shape
function addPoint(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    points.push({ x, y });
}

// Function to draw the current shape as preview
function drawCurrentShape() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    drawAllShapes(); // Redraw existing shapes

    ctx.strokeStyle = '#FFFFFF'; // White outline color for preview
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    for (let i = 1; i < points.length; i++) {
        ctx.lineTo(points[i].x, points[i].y);
    }
    ctx.lineTo(points[0].x, points[0].y); // Close the shape
    ctx.stroke();
}

// Function to draw all shapes on the canvas
function drawAllShapes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear canvas
    ctx.fillStyle = '#000'; // Black background
    ctx.fillRect(0, 0, canvas.width, canvas.height); // Redraw the background

    ctx.strokeStyle = '#FFFFFF'; // White outline color for shapes
    ctx.lineWidth = 2;
    shapes.forEach(shape => {
        ctx.beginPath();
        ctx.moveTo(shape[0].x, shape[0].y);
        for (let i = 1; i < shape.length; i++) {
            ctx.lineTo(shape[i].x, shape[i].y);
        }
        ctx.lineTo(shape[0].x, shape[0].y); // Close the shape
        ctx.stroke();
    });

    // Redraw erased areas
    ctx.globalCompositeOperation = 'source-atop'; // Set to draw on top of existing content
    erasedAreas.forEach(area => {
        ctx.fillStyle = eraseColor;
        ctx.beginPath();
        ctx.moveTo(area[0].x, area[0].y);
        for (let i = 1; i < area.length; i++) {
            ctx.lineTo(area[i].x, area[i].y);
        }
        ctx.lineTo(area[0].x, area[0].y); // Close the shape
        ctx.fill();
    });
    ctx.globalCompositeOperation = 'source-over'; // Restore normal drawing mode
}

// Function to apply the eraser effect within the shape
function applyEraser() {
    // Add erased area
    erasedAreas.push(points.slice()); // Store the erased shape
    
    // Apply eraser to shapes
    ctx.globalCompositeOperation = 'destination-out'; // Set to erase mode
    shapes.forEach(shape => {
        ctx.beginPath();
        ctx.moveTo(shape[0].x, shape[0].y);
        for (let i = 1; i < shape.length; i++) {
            ctx.lineTo(shape[i].x, shape[i].y);
        }
        ctx.lineTo(shape[0].x, shape[0].y); // Close the shape
        ctx.fill();
    });
    
    // Restore normal drawing mode
    ctx.globalCompositeOperation = 'source-over'; // Restore normal drawing mode
}

// Adjust canvas size on window resize
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Redraw the initial background color
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawAllShapes(); // Redraw all shapes
});