let currentCycle = 0;
let isWorkTime = true;
let timer;
let isRunning = false;
let startTime = null;
let totalSeconds;
let elapsedPausedTime = 0;
const startButton = document.getElementById('start');
const stopButton = document.getElementById('stop');
const resetButton = document.getElementById('reset');

document.addEventListener('DOMContentLoaded', (event) => {
    Push.Permission.request(
        () => console.log('許可されました！'),
        () => console.log('許可されませんでした。')
    );

    startButton.addEventListener('click', function() {
        if (!startTime) { // 初めてスタートする場合
            startTime = new Date();
        } else { // ポーズから再開する場合
            elapsedPausedTime += (new Date() - pauseTime);
        }
        isRunning = true;
        startButton.classList.add('visually-hidden');
        resetButton.classList.add('visually-hidden');
        stopButton.classList.remove('visually-hidden');
        totalSeconds = (isWorkTime ? workTime : breakTime) * 60;
        timer = setInterval(updateTimer, 1000);

    });

    stopButton.addEventListener('click', function() {
        if (isRunning) {
            stopButton.classList.add('visually-hidden');
            startButton.classList.remove('visually-hidden');
            resetButton.classList.remove('visually-hidden');
            clearInterval(timer);
            isRunning = false;
            pauseTime = new Date(); // ポーズした時刻を記録
            
        }
    });

    resetButton.addEventListener('click', function() {
        resetButton.classList.add('visually-hidden');
        stopButton.classList.add('visually-hidden');
        startButton.classList.remove('visually-hidden');
        clearInterval(timer);
        isRunning = false;
        currentCycle = 0;
        isWorkTime = true;
        startTime = null;
        elapsedPausedTime = 0;
        updateDisplay(workTime * 60);
    });

    updateDisplay(workTime * 60);  // 初期表示の更新
});

function updateTimer() {
    let currentTime = new Date();
    let elapsedTime = Math.floor((currentTime - startTime - elapsedPausedTime) / 1000);
    let remainingTime = totalSeconds - elapsedTime;

    if (remainingTime <= 0) {
        if (isWorkTime) {
            currentCycle++;
            if (currentCycle >= cycles) {
                clearInterval(timer);
                isRunning = false;
                if(Push.Permission.has()){
                    Push.create("Pomodoro Timer",
                        {
                            body: "1 Cycle Complete"
                        }
                    )
                }
                return;
            }
            isWorkTime = false;
            startTime = new Date();
            elapsedPausedTime = 0;
            totalSeconds = breakTime * 60;
        } else {
            isWorkTime = true;
            startTime = new Date();
            elapsedPausedTime = 0;
            totalSeconds = workTime * 60;
        }
        remainingTime = totalSeconds;
    }

    updateDisplay(remainingTime);
}

function updateDisplay(totalSeconds) {
    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;
    document.getElementById('minutes').textContent = minutes < 10 ? '0' + minutes : minutes.toString();
    document.getElementById('seconds').textContent = seconds < 10 ? '0' + seconds : seconds.toString();
}
