const submitButton = document.querySelector('.submit-button');
const previousButton = document.querySelector('.previous-button');
const questionBodies = document.querySelectorAll('.question-body');
const questionCounter = document.querySelector('.question-counter');

const totalQuestions = questionBodies.length;
let questionIndex = 0;

// add default text
questionCounter.textContent = `Question ${questionIndex + 1} of ${totalQuestions}:`;

// submit the answer
function submitAnswer(el) {

    // remove .question-active
    questionBodies[questionIndex].classList.remove('question-active');

    // increment index
    questionIndex += 1;
  
    // if the last question was just submitted
    if (questionIndex === totalQuestions)
    {
        // calculate score
        const correctRadioButtons = document.getElementsByClassName('correct-answer');
        const userScore = Array.from(correctRadioButtons).reduce((sum, button) => {

            return button.checked ? ++sum : sum;
        }, 0);

        const quizResult = document.createElement('h3');
        quizResult.textContent = `Score: ${userScore}/${totalQuestions}`;
        if (userScore === totalQuestions) {
            quizResult.textContent += "\t Great Job!!"
            quizResult.style.color = "#1bd42b";
        }
        document.getElementsByClassName('question-container')[0].appendChild(quizResult);
      
        // remove buttons, question counter
        submitButton.style.display = "none";
        previousButton.style.display = "none";
        questionCounter.style.display = "none";

        // return from fn
        return;
    } 
    // if the last question is to be displayed
    else if (questionIndex === totalQuestions - 1) {
        // update the next button to say "submit"
        el.textContent = "Submit";
    }

    // otherwise, activate the next question
    questionBodies[questionIndex].classList.add('question-active');

    // activate previous button
    previousButton.style.display = "inline-block";

    // increment question counter
    questionCounter.textContent = `Question ${questionIndex + 1} of ${totalQuestions}:`;
}

function goToPreviousQuestion(el) {
    // remove .question-active
    questionBodies[questionIndex].classList.remove('question-active');
    
    // decrement index
    questionIndex -= 1;

    // if first question, remove display
    if (questionIndex === 0) { // no need to check for lower
        el.style.display = "none";
    }

    // in case the final question was reached, update the submit button's text
    submitButton.textContent = "Next";
  
    // activate previous question
    questionBodies[questionIndex].classList.add('question-active');
}


///////////////////////////////////////
//      OVERRIDE EVENT LISTENERS     //
///////////////////////////////////////
submitButton.addEventListener('click', function(e) {

    // ensure a button was selected
    const answers = document.getElementsByName(`answer${questionIndex + 1}`);

    if (Array.from(answers).some(el => el.checked)) {
        submitAnswer(e.currentTarget);
        return;
    }
    alert('No answer selected!');
});

previousButton.addEventListener('click', function(e) {
    goToPreviousQuestion(e.currentTarget);
});