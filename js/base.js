var bmp_target = [0];
var best_player = [[0.50, 1], [0.50, 1]];
var city = [1, 0, 0];
var mafia = [1, 0, 0];
var sheriff = [1, 0, 0];
var don = [1, 0, 0];
var first_killed = [0, 0, 0];
var bm_03 = [-1, 0, 0];
var bm_13 = [0, 0, 0];
var bm_23 = [0.25, 0.25, 0];
var bm_33 = [0.5, 0.5, 0];
var bms_03 = [-1, -0.5, 0];
var bms_13 = [0, 1, 0];
var bms_23 = [0.25, 0.25, 0];
var bms_33 = [0.5, 0.5, 0];
var values = [0.10, -1.00, -0.50, 0.50];

let timerInterval;
let remainingTime;
let isPaused = false;

function startTimer(duration) {
    clearInterval(timerInterval);
    remainingTime = duration;
    updateTimerDisplay();
    timerInterval = setInterval(() => {
        if (!isPaused) {
            remainingTime--;
            updateTimerDisplay();
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                document.getElementById('timer-display').classList.add('expired');
            } else if (remainingTime < 10) {
                document.getElementById('timer-display').classList.add('warning');
            }
        }
    }, 1000);
}

function pauseTimer() {
    isPaused = true;
}

function resumeTimer() {
    isPaused = false;
}

function stopTimer() {
    clearInterval(timerInterval);
    remainingTime = 0;
    updateTimerDisplay();
    document.getElementById('timer-display').classList.remove('warning', 'expired');
}

function updateTimerDisplay() {
    const minutes = Math.floor(remainingTime / 60).toString().padStart(2, '0');
    const seconds = (remainingTime % 60).toString().padStart(2, '0');
    const display = document.getElementById('timer-display');
    display.textContent = `${minutes}:${seconds}`;
    display.classList.remove('warning', 'expired');
}

function updateTotal(rowIndex) {
    const points = parseFloat(document.getElementById(`points_${rowIndex}`).value) || 0;
    const addPoints = parseFloat(document.getElementById(`add_points_${rowIndex}`).value) || 0;
    const total = points + addPoints;
    document.getElementById(`bp_${rowIndex}`).textContent = total.toFixed(2);
}

for (let i = 0; i < 10; i++) {
    document.getElementById(`points_${i}`).addEventListener('input', function() {
        updateTotal(i);
    });
    document.getElementById(`add_points_${i}`).addEventListener('input', function() {
        updateTotal(i);
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('ServiceWorker зарегистрирован');
            })
            .catch(error => {
                console.log('Ошибка регистрации ServiceWorker:', error);
            });
    });
}