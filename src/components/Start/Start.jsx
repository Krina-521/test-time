import React from "react";
import "./start.css";
const imgAdd = "/quiz-image.jpg";

const assessmentTitles = [
  "Quiz 1",
  "Quiz 2",
  "Quiz 3",
  "Quick test 1",
  "Quick test 2",
  "Mock up test",
];

const Start = ({ props }) => {
  const startQuiz = () => props(true);

  const getRandomInt = () => {
    return Math.floor(Math.random() * assessmentTitles.length);
  };

  return (
    <div className="start-container">
      <h1 className="assessment-title">{assessmentTitles[getRandomInt()]}</h1>
      <button onClick={startQuiz} className="start-button">
        Start Assement
      </button>
      <div className="image-container">
        <img src={imgAdd} alt="Quiz Illustration" className="quizImage" />
      </div>
    </div>
  );
};

export default Start;
