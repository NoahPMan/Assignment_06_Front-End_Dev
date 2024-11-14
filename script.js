document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const newPlayerButton = document.getElementById("new-player");
    const usernameInput = document.getElementById("username");
    const scoreTableBody = document.querySelector("#score-table tbody");
    const scoreDisplay = document.getElementById("score-display");
    const scoreSpan = document.getElementById("score");
    const questionContainer = document.getElementById("question-container");
    const loadingContainer = document.getElementById("loading-container");

    // Initialize game session
    checkUsername();
    fetchQuestions();
    displayScores();

    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    function handleFormSubmit(event) {
        event.preventDefault(); // Prevent default form submission behavior

        let username = usernameInput.value.trim();
        const existingUsername = getCookie("username");

        // Set username if it doesn't exist in cookies
        if (username && !existingUsername) {
            setCookie("username", username, 7); // Save for 7 days
        } else if (!username && !existingUsername) {
            username = "Anonymous";
            setCookie("username", username, 7);
        } else if (existingUsername) {
            username = existingUsername;
        }

        // Calculate score, save it, and update display
        const score = calculateScore();
        saveScore(username, score);
        scoreSpan.textContent = score;
        scoreDisplay.classList.remove("hidden");

        // Refresh UI with updated score and reset questions
        displayScores();
        checkUsername();
        fetchQuestions(); // Start a new round with fresh questions
    }

    function newPlayer() {
        setCookie("username", "", -1); // Clear the username cookie
        localStorage.removeItem("scores"); // Clear the saved scores
        usernameInput.value = "";
        checkUsername(); // Update UI for new session
        displayScores(); // Refresh score table to show cleared scores
        fetchQuestions(); // Fetch new questions for a new game round
        scoreDisplay.classList.add("hidden"); // Hide score display for the new player
    }
    
    function checkUsername() {
        const username = getCookie("username");
        if (username) {
            usernameInput.placeholder = `Playing as: ${username}`;
            usernameInput.value = "";
            newPlayerButton.classList.remove("hidden");
        } else {
            usernameInput.placeholder = "Enter your name";
            newPlayerButton.classList.add("hidden");
        }
    }

    function calculateScore() {
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        let score = 0;
        answers.forEach((answer) => {
            if (answer.dataset.correct === "true") {
                score++;
            }
        });
        return score;
    }

    function saveScore(username, score) {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scores.push({ username, score });
        localStorage.setItem("scores", JSON.stringify(scores));
    }

    function displayScores() {
        const scores = JSON.parse(localStorage.getItem("scores")) || [];
        scoreTableBody.innerHTML = ""; // Clear existing rows

        scores.forEach((entry) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${entry.username}</td>
                <td>${entry.score}</td>
            `;
            scoreTableBody.appendChild(row);
        });
    }

    function fetchQuestions() {
        loadingContainer.classList.remove("hidden");
        questionContainer.classList.add("hidden");

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                loadingContainer.classList.add("hidden");
                questionContainer.classList.remove("hidden");
                displayQuestions(data.results);
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
            });
    }

    function displayQuestions(questions) {
        questionContainer.innerHTML = "";
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(question.correct_answer, question.incorrect_answers, index)}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    function createAnswerOptions(correctAnswer, incorrectAnswers, questionIndex) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);
        return allAnswers
            .map(
                (answer) => `
                    <label>
                        <input type="radio" name="answer${questionIndex}" value="${answer}" ${
                    answer === correctAnswer ? 'data-correct="true"' : ""
                }>
                        ${answer}
                    </label>
                `
            )
            .join("");
    }

    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value}; expires=${expires.toUTCString()}; path=/`;
    }

    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(";");
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim();
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length);
        }
        return null;
    }
});