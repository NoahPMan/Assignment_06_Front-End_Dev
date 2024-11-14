## 1. What Does Your Code Do?

My code runs a trivia game where users can enter their username, answer questions, submit their score, and then view their performance. The "New Player" feature clears everything from the session so players can start fresh.

The handleFormSubmit function checks if a username is provided; if not, it assigns one (or uses "Anonymous"). It then calculates the score, saves it, shows the updated scores, and loads new questions for the next round. The newPlayer function clears the username cookie and resets the interface, starting the session over by calling checkUsername and fetchQuestions. I use cookies to store the username and localStorage for storing the scores, so even if the page is refreshed, the scores are still there. displayScores pulls the scores from localStorage and populates the score table, while fetchQuestions grabs a new set of questions using an API.

## 2. Describe Your Coding Process

I began by breaking the project into smaller tasks like handling form submission, managing sessions, and storing scores. This kept things organized and manageable.

I took an incremental approach, starting with basic functions and testing them one at a time. For example, I first worked on setCookie and getCookie for username handling, then moved on to displayScores to ensure scores were updating correctly. To keep things organized, I worked on a separate branch to test the changes without affecting the main code. During development, I used console logs to verify things like cookie settings and session data. I also manually tested some edge cases, like submitting without a username or trying out the "New Player" function to make sure everything worked as expected.

## 3. Challenges and How You Overcame Them

One issue I ran into was with the "New Player" function. At first, it cleared the username cookie but didn’t reset the scores in localStorage, which meant the scores would carry over when they shouldn’t. To fix that, I added some logic to clear the score data from localStorage as well.

Handling asynchronous API calls was another challenge. Since the trivia questions need to load before the user starts answering, I had to make sure the questions were ready. Adding loading indicators helped make it clear to users that the questions were still loading. Another challenge was maintaining consistency between the UI and session state. To ensure that everything updated correctly based on the user’s data, I centralized the state management in functions like displayScores and checkUsername.

## 4. What Would You Do Differently Now?

If I had the chance to do it again, I’d focus on improving the CSS. I would refine the design to make the game more visually appealing, adding cleaner layouts, animations, and transitions. It would help make the interface more engaging and fun for users, improving the overall experience.

