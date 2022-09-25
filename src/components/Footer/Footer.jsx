import React from "react";
import "./footer.css";

const Footer = ({
  currentQuestionIndex,
  totalQuestions,
  goToPrevious,
  goToNext,
}) => {
  return (
    <div className="footer-container">
      <div className="status">
        <span className="current-question-number">
          {currentQuestionIndex + 1}{" "}
        </span>
        <span className="total-question-number">{" / " + totalQuestions} </span>
      </div>
      <div className="footer-button-list">
        <button
          disabled={currentQuestionIndex === 0}
          onClick={() => goToPrevious()}
          className="previous-button"
        >
          &lt; Previous
        </button>
        <button onClick={() => goToNext()} className="next-button">
          Next &gt;
        </button>
      </div>
    </div>
  );
};

export default Footer;
