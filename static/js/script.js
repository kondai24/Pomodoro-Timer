let currentCycle = 1;
let isWorkTime = true;
let isShortBreakTime = false
let timer;
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
        startButton.classList.add('visually-hidden');
        resetButton.classList.add('visually-hidden');
        stopButton.classList.remove('visually-hidden');
        if(isWorkTime){
            totalSeconds = workTime * 60 * 1000;
        }else if(isShortBreakTime){
            totalSeconds = shortBreakTime * 60 * 1000
        }else{
            totalSeconds = longBreakTime * 60 * 1000;
        }
        totalSeconds = (isWorkTime ? workTime : breakTime) * 60;
        timer = setInterval(updateTimer, 1000);

    });

    stopButton.addEventListener('click', function() {
       
        stopButton.classList.add('visually-hidden');
        startButton.classList.remove('visually-hidden');
        resetButton.classList.remove('visually-hidden');
        clearInterval(timer);
        pauseTime = new Date(); // ポーズした時刻を記録
            
    });

    resetButton.addEventListener('click', function() {
        resetButton.classList.add('visually-hidden');
        stopButton.classList.add('visually-hidden');
        startButton.classList.remove('visually-hidden');
        clearInterval(timer);
        currentCycle = 1;
        isWorkTime = true;
        startTime = null;
        elapsedPausedTime = 0;
        document.getElementById('pomodoro_cycles').textContent = currentCycle.toString();
        updateDisplay(workTime * 60);

    });

    updateDisplay(workTime * 60);  // 初期表示の更新
});

function updateTimer() {
    let currentTime = new Date();
    // 1ms単位なので、/1000
    let elapsedTime = (currentTime - startTime - elapsedPausedTime);
    let remainingTime = Math.floor((totalSeconds - elapsedTime) / 1000);

    if (remainingTime <= 0) {
        // 勉強時間が終わった時
        if (isWorkTime) {
            currentCycle++;
            // サイクルが終わった時、長休憩に入る
            if (currentCycle > cycles) {
                document.getElementById('pomodoro_state').textContent = "Long Break Time"
                currentCycle = 1
                StartNewTimer(longBreakTime);
                isWorkTime = false;
                isShortBreakTime = false;
                PushComplete();

            // 小休憩(5分休憩)に入る
            }else{
                document.getElementById('pomodoro_state').textContent = "Short Break Time"
                isWorkTime = false;
                isShortBreakTime = true;
                StartNewTimer(shortBreakTime);
                PushEnd();
            }
            
        // 小休憩(5分休憩)が終わった時
        } else if (isShortBreakTime){
            document.getElementById('pomodoro_cycles').textContent = currentCycle.toString();
            document.getElementById('pomodoro_state').textContent = "Study Time"
            isWorkTime = true;
            isShortBreakTime = false;
            StartNewTimer(workTime);
            PushStart();
            

        // 長休憩(15分休憩)が終わった時
        } else {
            document.getElementById('pomodoro_cycles').textContent = currentCycle.toString();
            document.getElementById('pomodoro_state').textContent = "Study Time"
            isWorkTime = true;
            // startTime = new Date();
            // elapsedPausedTime = 0;
            // totalSeconds = workTime * 60;
            StartNewTimer(workTime);
            PushStart();
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

function StartNewTimer(Time){
    startTime = new Date();
    elapsedPausedTime = 0;
    totalSeconds = Time * 60;
}

function PushStart(){
    if(Push.Permission.has()){
        Push.create("Pomodoro Timer",
            {
                body: "Start Study Time"
            }
        )
    }
}

function PushEnd(){
    if(Push.Permission.has()){
        Push.create("Pomodoro Timer",
            {
                body: "Finish Study Time"
            }
        )
    }
}

function PushComplete(){
    if(Push.Permission.has()){
        Push.create("Pomodoro Timer",
            {
                body: "1 Cycle Complete"
            }
        )
    }
}
