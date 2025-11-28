
const canvas = document.getElementById('simCanvas');
const ctx = canvas.getContext('2d');
const behaviorDesc = document.getElementById('behavior-desc');

// Simulation State
let sources = [];
let vehicles = [];
let animationId;

// Configuration
const SENSOR_OFFSET = 15; // Distance of sensor from center
const SENSOR_ANGLE = Math.PI / 4; // 45 degrees
const MAX_SPEED = 4;
const BASE_SPEED = 2; // Base speed for inhibitory vehicles

class Source {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.radius = 10;
        this.intensity = 10000; // Strength of light
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = '#ffff00';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ffff00';
        ctx.fill();
        ctx.shadowBlur = 0;
        ctx.closePath();
    }
}

class Vehicle {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 12;
        this.type = type; // 'fear', 'aggression', 'love', 'explorer'
        
        // Wheel speeds
        this.vl = 0;
        this.vr = 0;
    }

    update(sources) {
        // 1. Calculate Sensor Positions
        const leftSensorX = this.x + Math.cos(this.angle - SENSOR_ANGLE) * SENSOR_OFFSET;
        const leftSensorY = this.y + Math.sin(this.angle - SENSOR_ANGLE) * SENSOR_OFFSET;
        const rightSensorX = this.x + Math.cos(this.angle + SENSOR_ANGLE) * SENSOR_OFFSET;
        const rightSensorY = this.y + Math.sin(this.angle + SENSOR_ANGLE) * SENSOR_OFFSET;

        // 2. Calculate Sensor Stimulation (Input)
        let leftInput = 0;
        let rightInput = 0;

        sources.forEach(source => {
            const distL = Math.hypot(source.x - leftSensorX, source.y - leftSensorY);
            const distR = Math.hypot(source.x - rightSensorX, source.y - rightSensorY);
            
            // Inverse square lawish, capped
            leftInput += source.intensity / (distL * distL);
            rightInput += source.intensity / (distR * distR);
        });

        // Cap inputs
        leftInput = Math.min(leftInput, 5);
        rightInput = Math.min(rightInput, 5);

        // 3. Map Input to Output (Wheel Speeds) based on Type
        // v = base + factor * input
        
        switch (this.type) {
            case 'fear': 
                // 2a: Uncrossed, Excitatory. L->L, R->R.
                // Turns AWAY from source.
                this.vl = leftInput * 2;
                this.vr = rightInput * 2;
                break;
            
            case 'aggression':
                // 2b: Crossed, Excitatory. L->R, R->L.
                // Turns TOWARDS source.
                this.vl = rightInput * 2;
                this.vr = leftInput * 2;
                break;

            case 'love':
                // 3a: Uncrossed, Inhibitory. L-|L, R-|R.
                // Slows down same side. Turns TOWARDS source and STOPS.
                this.vl = MAX_SPEED - (leftInput * 2);
                this.vr = MAX_SPEED - (rightInput * 2);
                break;

            case 'explorer':
                // 3b: Crossed, Inhibitory. L-|R, R-|L.
                // Slows down opposite side. Turns AWAY from source.
                this.vl = MAX_SPEED - (rightInput * 2);
                this.vr = MAX_SPEED - (leftInput * 2);
                break;
        }

        // Clamp speeds
        this.vl = Math.max(0, Math.min(this.vl, MAX_SPEED));
        this.vr = Math.max(0, Math.min(this.vr, MAX_SPEED));

        // 4. Kinematics (Differential Drive)
        const v = (this.vl + this.vr) / 2;
        const omega = (this.vr - this.vl) / (2 * SENSOR_OFFSET); // Angular velocity

        this.x += Math.cos(this.angle) * v;
        this.y += Math.sin(this.angle) * v;
        this.angle += omega;

        // 5. Boundary Wrap
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.angle);

        // Body
        ctx.beginPath();
        ctx.rect(-10, -8, 20, 16);
        ctx.fillStyle = this.getColor();
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.stroke();

        // Sensors
        ctx.fillStyle = '#0f0';
        // Left Sensor
        ctx.beginPath();
        ctx.arc(Math.cos(-SENSOR_ANGLE)*SENSOR_OFFSET, Math.sin(-SENSOR_ANGLE)*SENSOR_OFFSET, 3, 0, Math.PI*2);
        ctx.fill();
        // Right Sensor
        ctx.beginPath();
        ctx.arc(Math.cos(SENSOR_ANGLE)*SENSOR_OFFSET, Math.sin(SENSOR_ANGLE)*SENSOR_OFFSET, 3, 0, Math.PI*2);
        ctx.fill();

        // Wheels
        ctx.fillStyle = '#888';
        ctx.fillRect(-5, -12, 10, 4); // Left
        ctx.fillRect(-5, 8, 10, 4);  // Right

        ctx.restore();
    }

    getColor() {
        switch(this.type) {
            case 'fear': return '#ff4444'; // Red
            case 'aggression': return '#ff8800'; // Orange
            case 'love': return '#ff69b4'; // Pink
            case 'explorer': return '#4444ff'; // Blue
            default: return '#fff';
        }
    }
}

// Initialization
function init() {
    // Add initial source
    sources.push(new Source(canvas.width / 2, canvas.height / 2));

    // Add initial vehicles
    for (let i = 0; i < 5; i++) {
        vehicles.push(new Vehicle(Math.random() * canvas.width, Math.random() * canvas.height, 'fear'));
    }

    loop();
}

// Main Loop
function loop() {
    ctx.fillStyle = 'rgba(34, 34, 34, 0.3)'; // Trails
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Sources
    sources.forEach(source => source.draw(ctx));

    // Update and Draw Vehicles
    vehicles.forEach(vehicle => {
        vehicle.update(sources);
        vehicle.draw(ctx);
    });

    animationId = requestAnimationFrame(loop);
}

// Interaction
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    sources.push(new Source(x, y));
    
    // Limit sources to prevent clutter
    if (sources.length > 5) sources.shift();
});

function setVehicleType(type) {
    // Update active button state
    document.querySelectorAll('.controls button').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`btn-${type}`).classList.add('active');

    // Update description
    let desc = "";
    switch(type) {
        case 'fear': desc = '"Fear": Sensors connected directly to same-side wheels. Gets faster closer to light, turning away from it.'; break;
        case 'aggression': desc = '"Aggression": Crossed connections. Gets faster closer to light, turning towards it (Ramming speed!).'; break;
        case 'love': desc = '"Love": Inhibitory connections. Slows down closer to light, turning towards it and stopping (Adoringly).'; break;
        case 'explorer': desc = '"Explorer": Crossed inhibitory. Slows down closer to light, turning away from it (Prefers the dark).'; break;
    }
    behaviorDesc.textContent = desc;

    // Reset and recreate vehicles with new type
    vehicles = [];
    for (let i = 0; i < 5; i++) {
        vehicles.push(new Vehicle(Math.random() * canvas.width, Math.random() * canvas.height, type));
    }
}

function resetSim() {
    sources = [new Source(canvas.width / 2, canvas.height / 2)];
    setVehicleType('fear'); // Resets vehicles too
}

// Start
init();
