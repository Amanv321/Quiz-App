const username = document.getElementById('username');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const finalScore = document.getElementById('finalScore');
const mostRecentScore = localStorage.getItem('mostRecentScore');
const highScores = JSON.parse(localStorage.getItem('highScores')) || [];
let check = false;

const MAX_HIGH_SCORES = 5;

finalScore.innerText = mostRecentScore;

username.addEventListener("keyup", () => {
    saveScoreBtn.disabled = !username.value;
    saveScoreBtn.disabled = check;
});

let saveHighScore = (e) => {
    // e.preventDefault();
    const score = {
        score: mostRecentScore,
        name: username.value
    };
    
    highScores.push(score);

    //if b score is higher than a then put b score up than a 
    // sorting order - Acending order
    highScores.sort((a, b) => b.score - a.score);

    highScores.splice(5);
    check = true;
    localStorage.setItem("highScores",JSON.stringify(highScores));

    setTimeout(()=>{
        window.location.assign('/');
    },5000)
};