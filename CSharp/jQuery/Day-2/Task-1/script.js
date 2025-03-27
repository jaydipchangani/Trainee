const resultDisplay = document.getElementById('result');
let currentInput = '';

function appendNumber(number) {
  currentInput += number;
  resultDisplay.textContent = currentInput;
}

function clearDisplay() {
  currentInput = '';
  resultDisplay.textContent = '0';
}

function deleteLastCharacter() {
  currentInput = currentInput.slice(0, -1);
  resultDisplay.textContent = currentInput || '0'; // Display 0 if input is empty
}

function calculate() {
  try {
    // Evaluate the expression with proper handling for modulo
    resultDisplay.textContent = eval(currentInput);
    currentInput = resultDisplay.textContent; // Update currentInput with the result
  } catch (error) {
    resultDisplay.textContent = 'Error';
    currentInput = '';
  }
}

// Handle keyboard input
document.addEventListener('keydown', (event) => {
  const key = event.key;

  if (!isNaN(key) || ['+', '-', '*', '/', '%', '.', '(', ')'].includes(key)) {
    // If the key is a number, operator, or bracket
    appendNumber(key);
  } else if (key === 'Enter') {
    // If Enter key is pressed
    calculate();
  } else if (key === 'Backspace') {
    // If Backspace key is pressed
    deleteLastCharacter();
  } else if (key === 'Escape') {
    // If Escape key is pressed (to clear the display)
    clearDisplay();
  }
});