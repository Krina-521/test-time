import React, { useState, useEffect } from "react";
import "./quiz.css";
import axios from "axios";
import Congo from "../Congo/Congo";
import Footer from "../Footer/Footer.jsx";

const TOTAL_QUESTION_NUMBER = 5;
const API_KEY = "BsIQHZ4svgivJlZHFOMW77BJXM6DB0yW6fC4yHWE";

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [savedAnswers, updateSavedAnswers] = useState(
    Array(TOTAL_QUESTION_NUMBER).fill("")
  );
  const [currentlySelectedOption, setCurrentlySelectedOption] = useState("");
  const [totalPoints, setTotalPoints] = useState(0);

  const pickAnswer = (e) => {
    // Add logic to so selected option using css
    // add logic for multiple choice
    unfocusOptionsAll();
    focusOptionById(e.target.id);
    setCurrentlySelectedOption(e.target.outerText);
  };

  const isAnswerCorrect = (answerToCheck) => {
    return !quiz[questionIndex].correctAnswers.includes(answerToCheck);
  };

  const evaluatePoints = () => {
    if (
      savedAnswers[questionIndex] &&
      isAnswerCorrect(savedAnswers[questionIndex])
    ) {
      setTotalPoints(totalPoints - 1);
    } else if (isAnswerCorrect(currentlySelectedOption)) {
      setTotalPoints(totalPoints + 1);
    }
  };

  const saveAnswerIfSelected = () => {
    if (
      currentlySelectedOption &&
      currentlySelectedOption !== savedAnswers[questionIndex]
    ) {
      evaluatePoints();
      const answers = [...savedAnswers];
      answers[questionIndex] = currentlySelectedOption;
      updateSavedAnswers(answers);
    }
  };

  const focusOptionById = (optionId) => {
    const optionButton = document.getElementById(optionId);

    if (!optionButton.classList.contains("focused-button")) {
      optionButton.classList.add("focused-button");
    }
    setCurrentlySelectedOption(optionButton.value);
  };

  const unfocusOptionsAll = () => {
    quiz[questionIndex].options.map((option, index) => {
      const optionId = "option-" + index;
      unfocusOptionById(optionId);
    });
  };

  const unfocusOptionById = (optionId) => {
    const optionButton = document.getElementById(optionId);
    if (optionButton.classList.contains("focused-button"))
      optionButton.classList.remove("focused-button");
  };

  const focusAlreadySelectedOptions = () => {
    quiz[questionIndex].options.map((option, index) => {
      const optionId = "option-" + index;
      if (savedAnswers[questionIndex] === option) {
        focusOptionById(optionId);
      } else {
        unfocusOptionById(optionId);
      }
    });
  };

  const saveAnswersAndLoadNewQuestion = (newIndex) => {
    saveAnswerIfSelected();
    setQuestionIndex(newIndex);
  };

  const goToPreviousQuestion = () => {
    saveAnswersAndLoadNewQuestion(questionIndex - 1);
  };

  const goToNextQuestion = () => {
    saveAnswersAndLoadNewQuestion(questionIndex + 1);
  };

  const shuffle = (arr) => arr.sort(() => Math.random() - 0.5);

  const getOptions = (answerOptions) => {
    const options = [];
    for (let optionKey in answerOptions) {
      if (answerOptions[optionKey]) options.push(answerOptions[optionKey]);
    }
    return shuffle(options);
  };

  const getCorrectAnswers = (questionDetails) => {
    const correctAnswersList = [];
    const { correct_answers, answers } = questionDetails;
    for (let optionKey in correct_answers) {
      const keyName = optionKey.slice(0, -8);
      if (correct_answers[optionKey] === "true") {
        correctAnswersList.push(answers[keyName]);
      }
    }
    return correctAnswersList;
  };

  const formatData = (data) => {
    const questionsList = [];
    data.map((questionDetails) =>
      questionsList.push({
        question: questionDetails.question,
        correctAnswers: getCorrectAnswers(questionDetails),
        options: getOptions(questionDetails.answers),
      })
    );
    return questionsList;
  };

  useEffect(() => {
    axios
      .get(
        `https://quizapi.io/api/v1/questions?apiKey=${API_KEY}&limit=${TOTAL_QUESTION_NUMBER}`
      )
      .then((res) => {
        console.log("Response Data", res.data);
        const questionsList = formatData(res.data);
        console.log("questions List", questionsList);
        setQuiz(questionsList);
      })
      .catch((err) => console.error(err));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (quiz.length && questionIndex < TOTAL_QUESTION_NUMBER)
      focusAlreadySelectedOptions();
  }, [questionIndex]);

  return (
    <div className="quiz-container">
      {questionIndex < TOTAL_QUESTION_NUMBER && quiz[questionIndex] ? (
        <div className="quiz-window">
          <span className="question-container">
            {" " + quiz[questionIndex].question}
          </span>
          <div className="options-container">
            {quiz[questionIndex].options.map((item, index) => (
              <button
                className="option-button"
                key={index}
                id={"option-" + index}
                onClick={pickAnswer}
              >
                {" " + item + " "}
              </button>
            ))}
          </div>
          <Footer
            currentQuestionIndex={questionIndex}
            totalQuestions={TOTAL_QUESTION_NUMBER}
            goToPrevious={goToPreviousQuestion}
            goToNext={goToNextQuestion}
          />
        </div>
      ) : (
        <Congo totalPoints={totalPoints} maxPoints={TOTAL_QUESTION_NUMBER} />
      )}
    </div>
  );
};

export default Quiz;

/*

A. Disable clicked option (should not call setOptionSelected once it is selected to avoid redundant calls)
DONE ---> B. Disable Prev and Next btn on page start and end respectively
DONE ---> C. Hide footer at end page

D. Create savedAnswer list to store final answer of the questions
E. <=== when prev / next button clicked ====>

    if optionSelected !== savedAnswer[questionNumber] 
        if savedAnswer[questionNumber]
            if isAnswerCorrect(savedAnswer[questionNumber])
                setPts(pts-1)
            else if isAnswerCorrect(optionSelected)
                setPts(pts+1)
        else if isAnswerCorrect(optionSelected)
            setPts(pts+1)
        
        saveAnswer[questionNumber]=optionSelected

1 <=(option clicked)=> optionSelected  <=(next button clicked)=> answerSaved => nextQues
2 <=(option clicked)=> optionSelected <=(previous button clicked)=> answerSaved => previousQues
1 <=(option clicked)=> optionSelected {changed Option} <=(next button clicked)=> save New Ans => nextQues
2 <=(prev button clicked, no new option not clicked)=> keep ans (not updating answer) => prev
1 

SA -> OS, Other than OS
OS -> CA, WA

CA -> C
SA -> C
OS -> A


SA = ['A', 'B', 'B', '', '']
res.data.map((item) => ({
            question: item.question,
            options: shuffle([...item.answers]),
            answer: item.correct_answers("true"),
          }))


Done---> Selected button color???????
done--scorable options ???????/
done--Assessment title ??????
done--Footer fixed
Disable clicked option (should not call setOptionSelected once it is selected to avoid redundant calls)


*/
