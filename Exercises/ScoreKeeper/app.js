const p1 = {
    score: 0,
    button: document.querySelector("#p1Btn"),
    display: document.querySelector("#p1Score")
}

const p2 = {
    score: 0,
    button: document.querySelector("#p2Btn"),
    display: document.querySelector("#p2Score")
}

function updateScore(player, opponent) {
    if (!isGameOver) {
        player.score++;
        if (player.score === winningScore) {
            isGameOver = true;
            player.display.classList.add("has-text-success");
            opponent.display.classList.add("has-text-danger");
            player.button.disabled = true;
            opponent.button.disabled = true;
        }
        player.display.textContent = player.score;
    }

}

// const p1Btn = document.querySelector("#p1Btn");
// const p2Btn = document.querySelector("#p2Btn");
// const player1 = document.querySelector("#p1Score");
// const player2 = document.querySelector("#p2Score");
const resetBtn = document.querySelector("#resetBtn");
const winningScoreSelect = document.querySelector("#playTo");

// let p1Score = 0;
// let p2Score = 0;
let winningScore = 5;
let isGameOver = false;

// p1Btn.addEventListener("click", function() {
//     if (!isGameOver) {
//         p1Score++;
//         if (p1Score === winningScore) {
//             isGameOver = true;
//             player1.classList.add("has-text-success");
//             player2.classList.add("has-text-danger");
//             p1Btn.disabled = true;
//             p2Btn.disabled = true;
//         }
//         player1.textContent = p1Score;
//     }
// })
// p2Btn.addEventListener("click", function() {
//     if (!isGameOver) {
//         p2Score++;
//         if (p2Score === winningScore) {
//             isGameOver = true;
//             player2.classList.add("has-text-success");
//             player1.classList.add("has-text-danger");
//             p1Btn.disabled = true;
//             p2Btn.disabled = true;
//         }
//         player2.textContent = p2Score;
//     }
// })
p1.button.addEventListener("click", function() {
    updateScore(p1, p2);
})

p2.button.addEventListener("click", function() {
    updateScore(p2, p1);
})

winningScoreSelect.addEventListener("change", function() {
    winningScore = parseInt(this.value);
    reset();
})


//DONT EXECUTE RESET => CALLBACK FUNCTION (WILL CALL THE FUNCTION WHEN IT NEEDS IT)
resetBtn.addEventListener("click", reset);

function reset() {
    p1.score = 0;
    p2.score = 0;
    p1.display.textContent = p1.score;
    p2.display.textContent = p2.score;
    isGameOver = false;
    p1.display.classList.remove("has-text-success", "has-text-danger");
    p2.display.classList.remove("has-text-success", "has-text-danger");
    p1.button.disabled = false;
    p2.button.disabled = false;
}