let names = [];
let pairs = [];
let spinning = false;

function addName() {
    const nameInput = document.getElementById('nameInput');
    const name = nameInput.value.trim();
    if (name && !names.includes(name)) {
        names.push(name);
        nameInput.value = '';
        drawWheel();
    }
}

function drawWheel() {
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = canvas.width / 2;
    const anglePerSlice = (2 * Math.PI) / names.length;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    names.forEach((name, index) => {
        const startAngle = index * anglePerSlice;
        const endAngle = startAngle + anglePerSlice;
        ctx.beginPath();
        ctx.moveTo(center.x, center.y);
        ctx.arc(center.x, center.y, radius, startAngle, endAngle);
        ctx.fillStyle = `hsl(${(360 / names.length) * index}, 100%, 50%)`;
        ctx.fill();
        ctx.stroke();

        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate((startAngle + endAngle) / 2);
        ctx.textAlign = "right";
        ctx.fillStyle = "white";
        ctx.font = "bold 16px Arial";
        ctx.fillText(name, radius - 10, 0);
        ctx.restore();
    });
}

function spinWheel() {
    if (spinning) return;

    spinning = true;
    const canvas = document.getElementById('wheelCanvas');
    const ctx = canvas.getContext('2d');
    const center = { x: canvas.width / 2, y: canvas.height / 2 };
    const radius = canvas.width / 2;
    const randomOffset = Math.random() * 2 * Math.PI; // Random start angle offset
    const spinDuration = 4000; // 3 seconds
    const startTime = Date.now();

    function animate() {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = elapsed / spinDuration;
        const easeProgress = Math.pow(progress - 1, 3) + 1; // ease out cubic

        const currentAngle = randomOffset + easeProgress * 10 * Math.PI; // spin 5 times

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.save();
        ctx.translate(center.x, center.y);
        ctx.rotate(currentAngle);
        ctx.translate(-center.x, -center.y);
        drawWheel();
        ctx.restore();

        if (progress < 1) {
            requestAnimationFrame(animate);
        } else {
            spinning = false;
            if (names.length === 1) {
                handleSingleName();
            } else {
                selectPair((currentAngle + randomOffset) % (2 * Math.PI));
            }
        }
    }

    requestAnimationFrame(animate);
}

function handleSingleName() {
    const selectedName = names[0];
    if (pairs.length > 0 && pairs[pairs.length - 1].length === 1) {
        pairs[pairs.length - 1].push(selectedName);
        document.getElementById('pairsList').lastElementChild.textContent += ` & ${selectedName}`;
    } else {
        pairs.push([selectedName]);
        const listItem = document.createElement('li');
        listItem.textContent = selectedName;
        document.getElementById('pairsList').appendChild(listItem);
    }

    names = [];
    drawWheel();
}

function selectPair(angle) {
    const anglePerSlice = (2 * Math.PI) / names.length;
    const selectedIndex = Math.floor(angle / anglePerSlice) % names.length;
    const selectedName = names[selectedIndex];

    if (pairs.length > 0 && pairs[pairs.length - 1].length === 1) {
        pairs[pairs.length - 1].push(selectedName);
        document.getElementById('pairsList').lastElementChild.textContent += ` & ${selectedName}`;
    } else {
        pairs.push([selectedName]);
        const listItem = document.createElement('li');
        listItem.textContent = selectedName;
        document.getElementById('pairsList').appendChild(listItem);
    }

    names.splice(selectedIndex, 1);
    drawWheel();
}

// Adjust canvas size responsively
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function resizeCanvas() {
    const canvas = document.getElementById('wheelCanvas');
    const container = canvas.parentElement;
    canvas.width = container.clientWidth;
    canvas.height = container.clientWidth;
    drawWheel();
}

// Add event listener for "Enter" key press on the input field
const nameInput = document.getElementById('nameInput');
nameInput.addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        addName();
    }
});
