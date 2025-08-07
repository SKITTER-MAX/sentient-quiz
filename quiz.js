const questions = [
    {
        question: "What is the core mission of Sentient AGI?",
        options: [
            { text: "To build open, decentralized artificial general intelligence", correct: true },
            { text: "To create social media platforms", correct: false },
            { text: "To develop gaming software", correct: false },
            { text: "To sell hardware devices", correct: false }
        ]
    },
    {
        question: "Sentient AGI aims to ensure AGI is:",
        options: [
            { text: "Community-owned and transparent", correct: true },
            { text: "Closed-source and private", correct: false },
            { text: "Only for enterprises", correct: false },
            { text: "Government-controlled", correct: false }
        ]
    },
    {
        question: "What is the Sentient Chain?",
        options: [
            { text: "A decentralized L1 blockchain built for AI agents", correct: true },
            { text: "A storage device for AGI", correct: false },
            { text: "A video editing tool", correct: false },
            { text: "A crypto wallet", correct: false }
        ]
    },
    {
        question: "What kind of agents does Sentient support?",
        options: [
            { text: "Autonomous, composable agents", correct: true },
            { text: "E-commerce bots", correct: false },
            { text: "IoT devices", correct: false },
            { text: "Remote sensors", correct: false }
        ]
    },
    {
        question: "What does \"agent staking\" mean in Sentient?",
        options: [
            { text: "Users stake AGI agents to prove usefulness and earn rewards", correct: true },
            { text: "Locking money in a vault", correct: false },
            { text: "Buying tokens for voting", correct: false },
            { text: "Sending data to space", correct: false }
        ]
    },
    {
        question: "What is the role of the $SENT token?",
        options: [
            { text: "Powering coordination and governance in Sentient", correct: true },
            { text: "Used only for gaming", correct: false },
            { text: "For storage rental only", correct: false },
            { text: "No utility", correct: false }
        ]
    },
    {
        question: "How are Sentient models trained?",
        options: [
            { text: "Via decentralized training across a network of nodes", correct: true },
            { text: "On one supercomputer", correct: false },
            { text: "By manual coding", correct: false },
            { text: "Using only offline data", correct: false }
        ]
    },
    {
        question: "Sentient AGI promotes what kind of ownership?",
        options: [
            { text: "Community and open-source driven", correct: true },
            { text: "Corporate monopoly", correct: false },
            { text: "Nationalized ownership", correct: false },
            { text: "No ownership", correct: false }
        ]
    },
    {
        question: "What is a Sentient \"agent wallet\"?",
        options: [
            { text: "A wallet managed by autonomous AI agents", correct: true },
            { text: "A cold storage device", correct: false },
            { text: "A fake token", correct: false },
            { text: "A smart contract scam", correct: false }
        ]
    },
    {
        question: "Why is decentralization important to Sentient?",
        options: [
            { text: "To avoid control by any one person or entity", correct: true },
            { text: "To create paid subscriptions", correct: false },
            { text: "To build private servers", correct: false },
            { text: "To sell NFTs only", correct: false }
        ]
    }
];

let currentQuestionIndex = 0;
let score = 0;
let userAnswers = [];
let timer = null;
let timeLeft = 15;
let isAnswered = false;

const currentQuestionEl = document.getElementById('current-question');
const totalQuestionsEl = document.getElementById('total-questions');
const progressBarEl = document.getElementById('progress-bar');
const timerDisplayEl = document.getElementById('timer-display');
const questionTextEl = document.getElementById('question-text');
const answerOptionsEl = document.getElementById('answer-options');
const nextBtnEl = document.getElementById('next-btn');
const submitBtnEl = document.getElementById('submit-btn');
const resultsModalEl = document.getElementById('results-modal');
const resultsContentEl = document.getElementById('results-content');
const finalScoreEl = document.getElementById('final-score');
const totalScoreEl = document.getElementById('total-score');
const scoreMessageEl = document.getElementById('score-message');
const shareBtnEl = document.getElementById('share-btn');
const restartBtnEl = document.getElementById('restart-btn');

const clickSoundEl = document.getElementById('click-sound');
const correctSoundEl = document.getElementById('correct-sound');
const wrongSoundEl = document.getElementById('wrong-sound');
const timeoutSoundEl = document.getElementById('timeout-sound');

function playSound(type) {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        let frequency;
        
        switch(type) {
            case 'click':
                frequency = 800;
                break;
            case 'correct':
                frequency = 1000;
                break;
            case 'wrong':
                frequency = 300;
                break;
            case 'timeout':
                frequency = 200;
                break;
            default:
                frequency = 600;
        }
        
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = frequency;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        console.log('Audio not supported');
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function initQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    userAnswers = [];
    isAnswered = false;
    
    questions.forEach(question => {
        question.shuffledOptions = shuffleArray(question.options);
    });
    
    totalQuestionsEl.textContent = questions.length;
    updateProgress();
    showQuestion();
    startTimer();
}

function updateProgress() {
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
    progressBarEl.style.width = `${progress}%`;
    currentQuestionEl.textContent = currentQuestionIndex + 1;
}

function startTimer() {
    timeLeft = 15;
    isAnswered = false;
    updateTimerDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 5) {
            timerDisplayEl.classList.add('timer-warning');
        }
        
        if (timeLeft <= 2) {
            timerDisplayEl.classList.add('timer-critical');
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    timerDisplayEl.textContent = timeLeft;
    timerDisplayEl.classList.remove('timer-warning', 'timer-critical');
}

function handleTimeout() {
    if (!isAnswered) {
        playSound('timeout');
        userAnswers.push(null);
        
        const correctIndex = questions[currentQuestionIndex].shuffledOptions.findIndex(opt => opt.correct);
        const options = answerOptionsEl.querySelectorAll('.option-btn');
        options[correctIndex].classList.add('correct');
        
        options.forEach(btn => btn.classList.add('disabled'));
        
        setTimeout(() => {
            nextQuestion();
        }, 2000);
    }
}

function showQuestion() {
    const question = questions[currentQuestionIndex];
    
    document.getElementById('question-content').classList.add('question-exit');
    
    setTimeout(() => {
        questionTextEl.textContent = question.question;
        
        answerOptionsEl.innerHTML = '';
        
        question.shuffledOptions.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'option-btn w-full p-4 text-left bg-white border-2 border-slate-200 rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md';
            button.textContent = option.text;
            button.onclick = () => selectOption(index);
            answerOptionsEl.appendChild(button);
        });
        
        document.getElementById('question-content').classList.remove('question-exit');
        document.getElementById('question-content').classList.add('question-enter');
        
        updateNavigationButtons();
        
    }, 150);
}

function selectOption(selectedIndex) {
    if (isAnswered) return;
    
    playSound('click');
    isAnswered = true;
    clearInterval(timer);
    
    const question = questions[currentQuestionIndex];
    const selectedOption = question.shuffledOptions[selectedIndex];
    const isCorrect = selectedOption.correct;
    
    userAnswers.push({
        questionIndex: currentQuestionIndex,
        selectedIndex: selectedIndex,
        isCorrect: isCorrect,
        selectedText: selectedOption.text
    });
    
    if (isCorrect) {
        score++;
        playSound('correct');
    } else {
        playSound('wrong');
    }
    
    const options = answerOptionsEl.querySelectorAll('.option-btn');
    options.forEach((btn, index) => {
        btn.classList.add('disabled');
        
        if (index === selectedIndex) {
            btn.classList.add(isCorrect ? 'correct' : 'wrong');
            btn.classList.add('selected');
        }
        
        if (!isCorrect && question.shuffledOptions[index].correct) {
            btn.classList.add('correct');
        }
    });
    
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const isLastQuestion = currentQuestionIndex === questions.length - 1;
    
    if (isLastQuestion) {
        nextBtnEl.classList.add('hidden');
        submitBtnEl.classList.remove('hidden');
        submitBtnEl.disabled = !isAnswered;
    } else {
        nextBtnEl.classList.remove('hidden');
        submitBtnEl.classList.add('hidden');
        nextBtnEl.disabled = !isAnswered;
    }
}

function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
        currentQuestionIndex++;
        updateProgress();
        showQuestion();
        startTimer();
    }
}

function showResults() {
    clearInterval(timer);
    
    finalScoreEl.textContent = score;
    totalScoreEl.textContent = questions.length;
    
    const percentage = (score / questions.length) * 100;
    let message = '';
    
    if (percentage >= 90) {
        message = "Outstanding! You're a Sentient AGI expert! ";
    } else if (percentage >= 70) {
        message = "Great job! You know your Sentient AGI well! ";
    } else if (percentage >= 50) {
        message = "Good effort! Keep learning about Sentient AGI! ";
    } else {
        message = "Keep exploring! There's more to discover about Sentient AGI! ";
    }
    
    scoreMessageEl.textContent = message;
    
    resultsModalEl.classList.remove('hidden');
    setTimeout(() => {
        resultsContentEl.classList.add('results-show');
    }, 50);
}

function shareResults() {
    const text = `I scored ${score}/${questions.length} on the Sentient AGI Quiz! \n\nAre you aware enough to beat me?\n\n#SentientAGI #AGI #Quiz`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank', 'width=600,height=400');
}

function restartQuiz() {
    resultsModalEl.classList.add('hidden');
    resultsContentEl.classList.remove('results-show');
    initQuiz();
}


nextBtnEl.addEventListener('click', () => {
    playSound('click');
    nextQuestion();
});

submitBtnEl.addEventListener('click', () => {
    playSound('click');
    showResults();
});

shareBtnEl.addEventListener('click', () => {
    playSound('click');
    shareResults();
});

restartBtnEl.addEventListener('click', () => {
    playSound('click');
    restartQuiz();
});


document.addEventListener('DOMContentLoaded', initQuiz);
