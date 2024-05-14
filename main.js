let category = document.querySelector('.category>span');
let questionsCount = document.querySelector('.count>span');
let questionArea = document.querySelector('.question-area');
let answersArea = document.querySelector('.answers-area');
let submitButton = document.querySelector('.submit-button');
let bullets = document.querySelector('.bullets');
let bulletsSpansContainer = document.querySelector('.bullets>.spans');
let countDownContainer = document.querySelector('.count-down');
let resultContainer = document.querySelector('.results');

let currentQuestion = 0;
let rightAnswers = 0;
let countDownInterval;

function getQuestions() {
    let myRequest = new XMLHttpRequest();
    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let quizData = JSON.parse(this.responseText);
            let questionsCount = quizData.length;

            // Create Bullets & Add The Count Of The Questions
            createBullets(questionsCount);

            // Add A Question To The Questions Area & Add The Answers To The Answers Area
            addQuestionData(quizData[currentQuestion], questionsCount);

            // Start CountDown
            countDown(3, questionsCount);

            // Check Answer When Clicked On Submit Button
            submitButton.onclick = function () {
                // Check The Answer 
                checkAnswer(quizData[currentQuestion]['right_answer']);

                // Display The Next Question
                currentQuestion++;
                addQuestionData(quizData[currentQuestion], questionsCount);

                // Handle The Bullets
                handleBullets();

                // Show Results After Finishing The Quiz
                showResult(questionsCount);

                // Start CountDown
                clearInterval(countDownInterval);
                countDown(3, questionsCount);
            }
        }
    }

    myRequest.open('GET', 'quiz.json', true);
    myRequest.send();
}

function createBullets(objsLength) {
    // Add Questions Count
    questionsCount.textContent = objsLength;
    // Create Bullets And Add Class on To The First One
    for (let i = 0; i < objsLength; i++) {
        let theBullet = document.createElement('span');
        i === 0 && theBullet.classList.add('on');
        bulletsSpansContainer.appendChild(theBullet)
    }
}

function addQuestionData(obj, qCount) {
    if (currentQuestion < qCount) {
        // Add Question To Question Area
        let questionTitle = document.createElement('h2');
        let questionText = document.createTextNode(obj.title);
        questionTitle.appendChild(questionText);
        questionArea.appendChild(questionTitle);

        for (let i = 1; i <= 4; i++) {
            // Create Answer Div
            let ansDiv = document.createElement('div');
            ansDiv.className = 'answer';

            // Create Input And Add Its Data
            let ansInput = document.createElement('input');
            ansInput.name = 'answers';
            ansInput.type = 'radio';
            ansInput.id = `answer_${i}`;
            ansInput.dataset.answer = obj[`answer_${i}`];

            ansDiv.appendChild(ansInput);

            // Create Label And Add Its Content
            let ansLabel = document.createElement('label');
            ansLabel.textContent = obj[`answer_${i}`];
            ansLabel.htmlFor = `answer_${i}`;
            ansDiv.appendChild(ansLabel);

            // Append Answer Div To Answers Area
            answersArea.appendChild(ansDiv);

            // Checked First Answer
            i === 1 && (ansInput.checked = true);

        }
    }
}

function checkAnswer(rAnswer) {
    let inputs = document.querySelectorAll('.answers-area input');
    let theChoosenAnswer;
    // Which Answer Is Checked
    inputs.forEach(input => {
        if (input.checked) {
            theChoosenAnswer = input.dataset.answer;
        }
    })
    // If The Checked Answer Is Right Increase rightAnswers
    theChoosenAnswer === rAnswer && rightAnswers++;

    // Remove Previous Question And Its Answers
    questionArea.innerHTML = '';
    answersArea.innerHTML = '';
}

function handleBullets() {
    let bulletsCont = document.querySelectorAll('.bullets .spans span');
    bulletsCont.forEach((span, index) => {
        // Add Class On To Cuurrent And Finished Questions Bullets
        if (currentQuestion === index) span.className = 'on';
    })
}

function showResult(count) {
    let theResult;
    if (count === currentQuestion) {
        // Remove Main Elements
        questionArea.remove();
        answersArea.remove();
        submitButton.remove();
        bullets.remove();

        // Check Right Answers And Show Results
        if (rightAnswers === count) {
            theResult = `<span class="perfect">Perfect</span> You Answered ${rightAnswers} From 10`;
        } else if (rightAnswers > count / 2) {
            theResult = `<span class="good">Good</span> You Answered ${rightAnswers} From 10`;
        } else {
            theResult = `<span class="bad">Bad</span> You Answered ${rightAnswers} From 10`;
        }
        resultContainer.innerHTML = theResult;
    }
}

function countDown(duration, qCount) {
    if (currentQuestion < qCount) {
        countDownInterval = setInterval(function () {
            let minutes = parseInt(duration / 60);
            let seconds = parseInt(duration % 60);
            minutes = minutes < 10 && `0${minutes}`;
            seconds = seconds < 10 && `0${seconds}`;
            countDownContainer.innerHTML = `${minutes} : ${seconds}`;
            if (--duration < 0) {
                clearInterval(countDownInterval);
                submitButton.click();
            }
        }, 1000)
    }
}

getQuestions()
