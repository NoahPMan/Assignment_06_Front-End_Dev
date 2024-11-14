document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    checkUsername(); // Uncomment once completed
    fetchQuestions();
    displayScores();

    /**
     * Fetches trivia questions from the API and displays them.
     */
    function fetchQuestions() {
        showLoading(true); // Show loading state

        fetch("https://opentdb.com/api.php?amount=10&type=multiple")
            .then((response) => response.json())
            .then((data) => {
                displayQuestions(data.results);
                showLoading(false); // Hide loading state
            })
            .catch((error) => {
                console.error("Error fetching questions:", error);
                showLoading(false); // Hide loading state on error
            });
    }

    /**
     * Toggles the display of the loading state and question container.
     *
     * @param {boolean} isLoading - Indicates whether the loading state should be shown.
     */
    function showLoading(isLoading) {
        document.getElementById("loading-container").classList = isLoading
            ? ""
            : "hidden";
        document.getElementById("question-container").classList = isLoading
            ? "hidden"
            : "";
    }

    /**
     * Displays fetched trivia questions.
     * @param {Object[]} questions - Array of trivia questions.
     */
    function displayQuestions(questions) {
        questionContainer.innerHTML = ""; // Clear existing questions
        questions.forEach((question, index) => {
            const questionDiv = document.createElement("div");
            questionDiv.innerHTML = `
                <p>${question.question}</p>
                ${createAnswerOptions(
                    question.correct_answer,
                    question.incorrect_answers,
                    index
                )}
            `;
            questionContainer.appendChild(questionDiv);
        });
    }

    /**
     * Creates HTML for answer options.
     * @param {string} correctAnswer - The correct answer for the question.
     * @param {string[]} incorrectAnswers - Array of incorrect answers.
     * @param {number} questionIndex - The index of the current question.
     * @returns {string} HTML string of answer options.
     */
    function createAnswerOptions(
        correctAnswer,
        incorrectAnswers,
        questionIndex
    ) {
        const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
            () => Math.random() - 0.5
        );
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

    // Event listeners for form submission and new player button
    form.addEventListener("submit", handleFormSubmit);
    newPlayerButton.addEventListener("click", newPlayer);

    /**
     * Handles the trivia form submission.
     * @param {Event} event - The submit event.
     */
    function handleFormSubmit(event) {
        event.preventDefault();

        // Calculate the score based on the selected answers
        const score = calculateScore();

        // Save the score to localStorage
        const username = getCookie("username");
        saveScore(username, score);

        // Refresh the game with new questions
        fetchQuestions();
    }

    /**
     * Checks if a username cookie exists and adjusts the UI accordingly.
     */
    function checkUsername() {
        const username = getCookie("username");
        if (username) {
            // If username exists, hide the form and show the new player button
            document.getElementById("username-container").classList.add("hidden");
            document.getElementById("new-player").classList.remove("hidden");
        }
    }

    /**
     * Sets a cookie with the given name, value, and expiration days.
     * @param {string} name - The name of the cookie.
     * @param {string} value - The value of the cookie.
     * @param {number} days - The number of days until the cookie expires.
     */
    function setCookie(name, value, days) {
        const expires = new Date();
        expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
    }

    /**
     * Retrieves the value of a cookie by its name.
     * @param {string} name - The name of the cookie.
     * @returns {string|null} - The value of the cookie, or null if not found.
     */
    function getCookie(name) {
        const nameEQ = `${name}=`;
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    /**
     * Saves the score to localStorage for the current user.
     * @param {string} username - The username of the player.
     * @param {number} score - The score to save.
     */
    function saveScore(username, score) {
        localStorage.setItem(username, score);
    }

    /**
     * Calculates the score based on the user's selected answers.
     * @returns {number} The total score based on correct answers.
     */
    function calculateScore() {
        let score = 0;
        
        // Get all the radio buttons for the questions
        const answers = document.querySelectorAll('input[type="radio"]:checked');
        
        // Iterate over each selected answer
        answers.forEach((answer) => {
            // Get the name of the question (i.e., the question index)
            const questionIndex = answer.name.replace('answer', '');
            
            // Check if the selected answer is correct
            if (answer.dataset.correct === "true") {
                score++;
            }
        });

        return score;
    }

    /**
     * Initializes a new player session by clearing cookies and updating the UI.
     */
    function newPlayer() {
        // Clear the username cookie
        document.cookie = "username=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/";
        
        // Reset the UI for a new player
        document.getElementById("username-container").classList.remove("hidden");
        document.getElementById("new-player").classList.add("hidden");
    }

    /**
     * Displays the scores of users from localStorage.
     */
    function displayScores() {
        const scoresContainer = document.getElementById("scores-container");
        scoresContainer.innerHTML = ""; // Clear previous scores

        for (let i = 0; i < localStorage.length; i++) {
            const username = localStorage.key(i);
            const score = localStorage.getItem(username);
            const scoreElement = document.createElement("div");
            scoreElement.innerText = `${username}: ${score}`;
            scoresContainer.appendChild(scoreElement);
        }
    }
});
