document.addEventListener("DOMContentLoaded", () => {
    // URL to your text file containing words
    const fileUrl = 'words.txt';
    let wordList = []; // Store the list of words from the file

    // Function to fetch and read a text file asynchronously
    async function readTextFile(fileUrl) {
        try {
            const response = await fetch(fileUrl);
            const text = await response.text();
            wordList = text.split('\n').map(word => word.trim());
        } catch (error) {
            console.error("Error reading file:", error);
            throw error;
        }
    }

    // Function to pick a random word from the list of words
    function pickRandomWord() {
        const randomIndex = Math.floor(Math.random() * wordList.length);
        return wordList[randomIndex];
    }

    // Read the file and initialize the game
    readTextFile(fileUrl)
        .then(() => {
            initializeGame();
        })
        .catch((error) => {
            // Handle errors
            console.info("An error occurred:", error);
        });

    // Initialize the game with a random word
    function initializeGame() {
        const currentWord = pickRandomWord();
        console.error("currentWord:", currentWord);
        console.error("word list size:", wordList.length);
        let guessedWord = "_".repeat(currentWord.length); // Initialize the guessed word with underscores
        let rowCount = 0;
        let inputText = ""; // Initialize the input text
        let partialGuessSet = new Set(); // Store partially correct guesses
        let commonElements = new Array();
        let remainingGuesses = 5; // Set the maximum number of guesses
        const inputTextDisplay = document.createElement("div");
        inputTextDisplay.id = "input-text-display";
        document.body.appendChild(inputTextDisplay);
        // Add an event listener to the "Play Again" button
        const playAgainButton = document.getElementById("play-again-button");

        // Function to check if the entire guessed word is correct
        function isWordCorrect() {
            return guessedWord === currentWord;
        }

        // Function to update the guessed word display
        function updateGuessedWordDisplay() {
            const guessedWordElement = document.getElementById("guessed-word");
            guessedWordElement.innerHTML = ''; // Clear the guessed word container
            for (let i = 0; i < guessedWord.length; i++) {
                const letter = guessedWord[i];
                const letterSpan = document.createElement("span");
                letterSpan.textContent = letter;
                if (letter === '_') {
                    letterSpan.classList.add("keyboard-letter");
                } else {
                    letterSpan.classList.add("guessed-letter");
                }
                guessedWordElement.appendChild(letterSpan);
            }
        }

        // Function to handle the end of the game
        function endGame(message) {
            if (message.includes("Congratulations!")) {
                // If the player guessed correctly, show the number of guesses
                const guessesMessage = `\nYou Guessed the word guesses: ${6 - remainingGuesses}`;
                message += guessesMessage;
            }
            alert(message);
            // Disable further input after the game ends
            document.removeEventListener("keydown", handleGuess);
        }

        // Function to show the word-display
        function showWordDisplay() {
            const wordDisplay = document.querySelector(".word-display");
            wordDisplay.style.display = "block"; // Show the word-display
        }

        // Function to check if at least one letter is correct
        function atLeastOneLetterIsCorrect() {
            const inputLetters = inputText.toLowerCase();
            for (let i = 0; i < inputLetters.length; i++) {
                if (currentWord.includes(inputLetters[i])) {
                    return true;
                }
            }
            return false;
        }

        // Function to update the keyboard keys based on user input
        function updateKeyboardKeys() {
            const keyboardKeys = document.querySelectorAll(".keyboard-key");
            for (const key of keyboardKeys) {
                const keyLetter = key.textContent.toLowerCase();
                const keyLetterIndex = currentWord.indexOf(keyLetter);
                const inputLetterIndex = inputText.toLowerCase().indexOf(keyLetter);

                if (inputLetterIndex !== -1) {
                    if (keyLetterIndex === inputLetterIndex) {
                        console.log("key", key);
                        key.classList.add("keyboard-correct"); // Add a class to turn the key green if it's in the correct position
                    } else if (commonElements.includes(keyLetter)) {
                        console.log("commonElements", commonElements);
                        console.log("keyLetter", keyLetter);
                        key.classList.add("keyboard-partial"); // Add a class to turn the key yellow if it's partially correct
                    } else {
                        key.classList.add("keyboard-incorrect"); // Add a class to turn the key yellow if it's partially correct
                    }

                }
            }
        }

        // Function to update the input grid based on user input
        function updateInputGridColors() {
            const inputGrid = document.getElementById("inputGrid");
            const cells = inputGrid.getElementsByTagName("td");

            // Iterate through each cell in the input grid
            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];

                const cellLetter = cell.textContent.toLowerCase();
                const keyLetterIndex = currentWord.indexOf(cellLetter);
                const inputLetterIndex = inputText.toLowerCase().indexOf(cellLetter);
                console.log("(commonElements.includes(cellLetter)", (commonElements.includes(cellLetter)));
                if (inputLetterIndex !== -1 && cellLetter  != "") {
                    if (keyLetterIndex === inputLetterIndex) {
                        console.log("cell-correct"); 
                        cell.classList.add("correct");     
                    } else if (commonElements.includes(cellLetter)) {
                        console.log("commonElements", commonElements);
                        console.log("cellLetter", cellLetter);
                        cell.classList.add("partial"); 
                    } else {
                        cell.classList.add("incorrect");
                    }
                }                             
            }
        }

        // Function to find all indices of a letter in a string
        function findAllLetterIndices(str, letter) {
            const indices = [];
            for (let i = 0; i < str.length; i++) {
                if (str[i] === letter) {
                    indices.push(i);
                }
            }
            return indices;
        }
        // Function to update the guess count display
        function updateGuessCountDisplay() {
            const guessCountElement = document.getElementById("guess-count");
            guessCountElement.textContent = "Guesses remaining: " + remainingGuesses;
        }

        // Function to update the table with the guessed word
        function updateInputGrid(input) {
            const inputGrid = document.getElementById("inputGrid");
            const cells = inputGrid.getElementsByTagName("td");


            // Iterate over the next 5 cells
            for (let i = rowCount; i < rowCount + 6; i++) {
                if (i < cells.length) {
                    cells[i].textContent = input.charAt(i - rowCount);
                }
            }
        }


        // Function to handle user input
        function handleKeyPress(event) {
            if (event.key === "Enter") {
                if (inputText.length === 5)
                    // Check if the entered word exists in the list of words
                    if (wordList.includes(inputText.toLowerCase())) {
                        
                        // Handle Enter key to submit the guess when five letters are typed

                        console.log("atLeastOneLetterIsCorrect:", atLeastOneLetterIsCorrect());

                        const guessedWordArray = guessedWord.split('');
                        
                        let allCorrect = true;

                        for (let i = 0; i < currentWord.length; i++) {
                            const guessedLetter = inputText.charAt(i).toLowerCase();
                            const letterIndices = findAllLetterIndices(currentWord, guessedLetter);

                            if (letterIndices.length > 0) {
                                let letterGuessedCorrectly = false;

                                letterIndices.forEach((letterIndex) => {
                                    if (letterIndex === i) {
                                        guessedWordArray[letterIndex] = guessedLetter;
                                        letterGuessedCorrectly = true;
                                    }
                                });

                                if (!letterGuessedCorrectly) {
                                    allCorrect = false;
                                    partialGuessSet.add(guessedLetter);
                                }
                            } else {
                                allCorrect = false;
                                partialGuessSet.add(guessedLetter);
                            }
                        }


                        guessedWord = guessedWordArray.join('');
                        commonElements = Array.from(currentWord).filter(letter => partialGuessSet.has(letter));
                        console.log("commonElements", commonElements);
                        console.log("currentWord", currentWord);
                        console.log("partialGuessSet", partialGuessSet);
                        updateKeyboardKeys();
                        updateGuessedWordDisplay();
                        updateInputGrid(inputText);
                        updateInputGridColors();

                        if (guessedWord === currentWord) {
                            endGame("Congratulations! You've guessed the word.");
                        } else {
                            remainingGuesses--;
                            updateGuessCountDisplay();

                            if (remainingGuesses === 0) {
                                endGame("Sorry, you've used all your guesses. The word was: " + currentWord);
                            }
                            // Clear the input text and reset it for the next guess
                            inputText = "";
                            rowCount = rowCount +5;
                            updateInputGrid(inputText);

                        }
                    }
                    else {
                        alert("The entered word does not exist in the list of words.");
                    }
            } else if (/[A-Za-z]/.test(event.key) && inputText.length < currentWord.length) {
                // Collect input text if it's a letter and the user hasn't entered the full word yet (case-insensitive)
                inputText += event.key;
                updateInputGrid(inputText);
                console.log("inputText:", inputText);
            }
        }

        // Function to handle user guesses
        function handleGuess(event) {
            const keyPressed = event.key.toLowerCase();
            if (/[A-Z]/.test(keyPressed)) {
                if (!guessedWord.includes(keyPressed)) {
                    const wordArray = guessedWord.split('');
                    for (let i = 0; i < currentWord.length; i++) {
                        if (currentWord[i] === keyPressed) {
                            wordArray[i] = keyPressed;
                        }
                    }
                    guessedWord = wordArray.join('');
                    updateGuessedWordDisplay();
                }
            } else if (event.key === "Backspace") {
                event.preventDefault(); // Prevent the default behavior of Backspace (navigation)
                // Handle Backspace key to delete the last letter of the input
                if (inputText.length > 0) {
                    inputText = inputText.slice(0, -1);
                    updateInputGrid(inputText);
                    console.log("inputText:", inputText);
                }
            }
        }

        // Function to refresh the page when the "Play Again" button is clicked
        function playAgain() {
            location.reload();
        }


        // Add event listeners for user input
        document.addEventListener("keydown", handleGuess);
        document.addEventListener("keypress", handleKeyPress);
        playAgainButton.addEventListener("click", playAgain);

        // Update the initial remaining guesses display
        updateGuessedWordDisplay();
    }
});





