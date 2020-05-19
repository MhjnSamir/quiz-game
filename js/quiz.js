let correctAnswer,
  correctNumber = localStorage.getItem("quiz_game_correct")
    ? localStorage.getItem("quiz_game_correct")
    : 0,
  incorrectNumber = localStorage.getItem("quiz_game_incorrect")
    ? localStorage.getItem("quiz_game_incorrect")
    : 0;

document.addEventListener("DOMContentLoaded", function () {
  loadQuestion();

  eventListener();
});

eventListener = () => {
  document
    .querySelector("#check-answer")
    .addEventListener("click", validateAnswer);

  document
    .querySelector("#clear-storage")
    .addEventListener("click", clearResult);
};

const loadQuestion = () => {
  const url = "https://opentdb.com/api.php?amount=1";
  fetch(url)
    .then((response) => response.json())
    .then((data) => displayQuestion(data.results));
};

displayQuestion = (questions) => {
  const questionHTML = document.createElement("div");
  questionHTML.classList.add("col-12");

  questions.forEach((question) => {
    //read correct answer
    correctAnswer = question.correct_answer;
    // console.log(question);

    //inject the correct answer  in the possible answer
    let possibleAnswers = question.incorrect_answers;
    possibleAnswers.splice(Math.floor(Math.random() * 4), 0, correctAnswer);

    // add the HTMl for current question
    questionHTML.innerHTML = `
    <div class="row justify-content-between heading">
      <p class="category">Category: ${question.category}</p>
      <div class="totals">
        <span class="badge badge-success">${correctNumber}</span>
        <span class="badge badge-danger">${incorrectNumber}</span>
      </div>
    </div>
    <h2 class="text-center">${question.question}</h2>`;

    // generate the HTMl for possible answers
    const answerDiv = document.createElement("div");
    answerDiv.classList.add(
      "questions",
      "row",
      "justify-content-around",
      "ml-4"
    );
    possibleAnswers.forEach((answer) => {
      const answerHTML = document.createElement("li");
      answerHTML.classList.add("col-12", "col-md-5");
      answerHTML.textContent = answer;

      //attach event when answer is clicked
      answerHTML.onclick = selectAnswer;

      answerDiv.appendChild(answerHTML);
    });
    questionHTML.appendChild(answerDiv);

    // render in the HTMl
    document.querySelector("#app").appendChild(questionHTML);
  });
};

//when answer is clicked
selectAnswer = (e) => {
  //remove the previous active class for the answer
  if (document.querySelector(".active")) {
    const activeAnswer = document.querySelector(".active");
    activeAnswer.classList.remove("active");
  }

  // add current answer
  e.target.classList.add("active");
};

// Checks if the answer is correnct and 1 answer is selected
validateAnswer = () => {
  if (document.querySelector(".questions .active")) {
    //everything is fine,check if answer is corrent or not
    checkAnswer();
  } else {
    // user didn't select the answer
    const errorDiv = document.createElement("div");
    errorDiv.classList.add("alert", "alert-danger", "col-md-6");
    errorDiv.textContent = "Please select 1 answer";

    // select the questions div to insert the alert
    const questionDiv = document.querySelector(".questions");
    questionDiv.appendChild(errorDiv);

    setTimeout(() => {
      document.querySelector(".alert-danger").remove();
    }, 3000);
  }
};

// check if the answer is correct or not
checkAnswer = () => {
  const userAnswer = document.querySelector(".questions .active");

  if (userAnswer.textContent == correctAnswer) {
    correctNumber++;
  } else {
    incorrectNumber++;
  }

  // Save into localStorage
  saveIntoStorage();

  // clear previous HTML
  const app = document.querySelector("#app");
  while (app.firstChild) {
    app.removeChild(app.firstChild);
  }

  loadQuestion();
};

// save correct or incorrect totals into storage
saveIntoStorage = () => {
  localStorage.setItem("quiz_game_correct", correctNumber);
  localStorage.setItem("quiz_game_incorrect", incorrectNumber);
};

// Clear the result from storage

clearResult = () => {
  localStorage.setItem("quiz_game_correct", 0);
  localStorage.setItem("quiz_game_incorrect", 0);

  setTimeout(() => {
    window.location.reload();
  }, 500);
};
