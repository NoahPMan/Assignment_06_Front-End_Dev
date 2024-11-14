document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("trivia-form");
    const questionContainer = document.getElementById("question-container");
    const newPlayerButton = document.getElementById("new-player");

    // Initialize the game
    checkUsername(); // Check if a username is already stored in cookies
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
                )}`;
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
                <input type="radio" name="answer${questionIndex}" value="${answer}" ${answer === correctAnswer ? 'data-correct="true"' : ""}>
                ${answer}
            </label>`
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
        const username = document.getElementById("username").value; // Get the username from the form input

        // Check if the username is provided and not already stored in a cookie
        if (username && !getCookie("username")) {
            setCookie("username", username, 7); // Store the username in a cookie for 7 days
        }

        // Logic to process the form and calculate the score (add later)
        // saveScore(username, score);
    }

    /**
     * Sets a cookie with the specified name, value, and expiration days.
     * 
     * @param {string} name - The name of the cookie.
     * @param {string} value - The value to store in the cookie.
     * @param {number} days - The number of days until the cookie expires.
     */
    function setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000); // Calculate expiration time
        const expires = "expires=" + date.toUTCString(); // Set expiration date
        document.cookie = `${name}=${value}; ${expires}; path=/`; // Set the cookie with path
    }

    /**
     * Retrieves the value of a cookie by its name.
     * 
     * @param {string} name - The name of the cookie.
     * @returns {string|null} The value of the cookie, or null if the cookie is not found.
     */
    function getCookie(name) {
        const nameEQ = name + "="; // Create the search string
        const ca = document.cookie.split(";"); // Split all cookies by semicolon
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i].trim(); // Trim any extra spaces
            if (c.indexOf(nameEQ) === 0) { // If the cookie starts with the name
                return c.substring(nameEQ.length, c.length); // Return the value of the cookie
            }
        }
        return null; // Return null if cookie not found
    }

    /**
     * Checks if a username is stored in the cookies and adjusts the UI.
     */
    function checkUsername() {
        const username = getCookie("username");
        if (username) {
            document.getElementById("username-display").innerText = `Welcome back, ${username}!`;
            // Additional UI logic for a logged-in user
        } else {
            document.getElementById("username-display").innerText = "Please enter your username.";
        }
    }

    /**
     * Resets the game by clearing the username cookie and updating the UI.
     */
    function newPlayer() {
        // Clear the username cookie
        document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";

        // Reset UI (e.g., clear username input, scores, etc.)
        document.getElementById("username").value = ""; // Clear the username input
        displayScores(); // Reset or display the scores (implement logic as needed)
    }

    function displayScores() {
        //... code for displaying scores from localStorage (if needed)
    }
});
