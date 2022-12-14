import React, { useState, useEffect } from "react";
import "./quiz.css";
import axios from "axios";
import Congo from "../Congo/Congo";
import Footer from "../Footer/Footer.jsx";

const TOTAL_QUESTION_NUMBER = 10;
const API_KEY = "BsIQHZ4svgivJlZHFOMW77BJXM6DB0yW6fC4yHWE";

const Quiz = () => {
  const [quiz, setQuiz] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [savedAnswers, setSavedAnswers] = useState(
    Array(TOTAL_QUESTION_NUMBER).fill([])
  );
  const [currentlySelectedOption, setCurrentlySelectedOption] = useState([]);
  const [totalPoints, setTotalPoints] = useState(0);

  const removeValueFromArray = (arr, value) => {
    return arr.filter((item) => {
      return item !== value;
    });
  };

  const toggleOptionFocusById = (e) => {
    const optionId = e.target.id;
    const optionButton = document.getElementById(optionId);
    let newOptionList = [...currentlySelectedOption];

    if (!optionButton.classList.contains("focused-button")) {
      newOptionList.push(optionButton.innerText);
      optionButton.classList.add("focused-button");
    } else {
      newOptionList = removeValueFromArray(
        currentlySelectedOption,
        optionButton.innerText
      );
      optionButton.classList.remove("focused-button");
    }
    setCurrentlySelectedOption([...newOptionList]);
  };

  const focusOptionById = (optionId, newOptionList) => {
    const optionButton = document.getElementById(optionId);

    if (!optionButton.classList.contains("focused-button")) {
      newOptionList.push(optionButton.innerText);
      optionButton.classList.add("focused-button");
    }
  };

  const unfocusOptionById = (optionId) => {
    const optionButton = document.getElementById(optionId);

    if (optionButton.classList.contains("focused-button")) {
      optionButton.classList.remove("focused-button");
    }
  };

  const areArraysEqual = (arrayToCheck, answersList) => {
    if (arrayToCheck.length !== answersList.length) {
      return false;
    }

    for (let answerToCheck of arrayToCheck) {
      if (!answersList.includes(answerToCheck)) {
        return false;
      }
    }
    return true;
  };

  const isAnswerCorrect = (answersListToCheck) => {
    return areArraysEqual(
      answersListToCheck,
      quiz[questionIndex].correctAnswers
    );
  };

  const evaluatePoints = () => {
    if (
      savedAnswers[questionIndex].length &&
      isAnswerCorrect(savedAnswers[questionIndex])
    ) {
      setTotalPoints(totalPoints - 1);
    } else if (isAnswerCorrect(currentlySelectedOption)) {
      setTotalPoints(totalPoints + 1);
    }
  };

  const saveAnswerIfSelected = () => {
    if (
      currentlySelectedOption.length &&
      !areArraysEqual(currentlySelectedOption, savedAnswers[questionIndex])
    ) {
      evaluatePoints();
      const answers = [...savedAnswers];
      answers[questionIndex] = [...currentlySelectedOption];
      setSavedAnswers(answers);
    }
  };

  const focusAlreadySelectedOptions = () => {
    const newOptionList = [];
    quiz[questionIndex].options.map((option, index) => {
      const optionId = "option-" + index;
      if (savedAnswers[questionIndex].includes(option))
        focusOptionById(optionId, newOptionList);
      else {
        unfocusOptionById(optionId);
      }
    });
    setCurrentlySelectedOption(newOptionList);
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
                onClick={toggleOptionFocusById}
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
