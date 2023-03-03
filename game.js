const bonus = 10;
const max_Question = 3;

const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const currentScore = document.getElementById('score');
const questionNum = document.getElementById('question-Counter');
const progressText = document.getElementById('progress-Text');
const progressBar = document.getElementById('bar');
const loader = document.getElementById('loader');
const game = document.getElementById('game');


let current_Question = {};
let accepting_Answer = false;
let score = 0;
let question_Counter = 0;
let available_Question = [];

let questions = [];
fetch('https://opentdb.com/api.php?amount=20&category=18&difficulty=easy&type=multiple')
    .then(res => {
        return res.json();
    })
    .then(quest => {
        questions = quest;
        questions = quest.results.map(loadedQuestion => {
            const formattedQuestion = {
                question: loadedQuestion.question,
            };
            const answerChoices = [...loadedQuestion.incorrect_answers];
            formattedQuestion.answer = Math.floor(Math.random() * 3) + 1;
            answerChoices.splice(formattedQuestion.answer - 1, 0, loadedQuestion.correct_answer);

            answerChoices.forEach((choice, index) => {
                formattedQuestion["choice" + (index + 1)] = choice;
            })
            return formattedQuestion;
        });
        start_Game();
    })
    .catch(error => {
        console.log(error);
    });




/* */

let start_Game = () => {
    question_Counter = 0;
    score = 0;
    available_Question = [...questions];
    get_New_Question();
    game.classList.remove('hidden');
    loader.classList.add('hidden');
};

let get_New_Question = () => {
    if (available_Question.length == 0 || question_Counter >= max_Question) {
        localStorage.setItem('mostRecentScore', score);
        return window.location.href = 'end.html';
        // window.location.assign('/end.html')
    }
    question_Counter++;
    // questionNum.innerText = `${question_Counter}/${max_Question}`;
    //question Text update
    progressText.innerText = `Question: ${question_Counter}/${max_Question}`;

    //update the progress bar
    progressBar.style.width = `${(question_Counter / max_Question) * 100}%`;

    const question_Index = Math.floor(Math.random() * available_Question.length);
    current_Question = available_Question[question_Index];
    question.innerText = current_Question.question;
    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = current_Question['choice' + number];
    });
    available_Question.splice(question_Index, 1);
    accepting_Answer = true;
};
//event at each option
choices.forEach(choice => {
    choice.addEventListener('click', current_Element => {
        if (!accepting_Answer)
            return;

        accepting_Answer = false;
        const selected_Choice = current_Element.target;
        const selected_Answer = selected_Choice.dataset['number'];

        //correct or incorrect answer class
        const class_To_Apply = selected_Answer == current_Question.answer ? 'correct' : 'incorrect';
        selected_Choice.parentElement.classList.add(class_To_Apply);
        if (class_To_Apply == 'correct') {
            increment_Score(bonus);
        }
        setTimeout(() => {
            selected_Choice.parentElement.classList.remove(class_To_Apply);
            get_New_Question();
        }, 1000)
    });
});
//update score on correct answer
let increment_Score = (num) => {
    score += num;
    currentScore.innerText = score;
};

