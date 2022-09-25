import React from "react";
import "./congo.css";

const Congo = ({ totalPoints, maxPoints }) => {
  const refreshPage = () => window.location.reload();

  return (
    <div className="congo-container">
      <h1 className="congo-heading">
        {" "}
        Congratulations! You have completed the assessment. 😊{" "}
      </h1>
      <p className="scores">
        Total Score: {totalPoints} / {maxPoints}
      </p>
      <button onClick={refreshPage} className="retry-button">
        Retry
      </button>
    </div>
  );
};

export default Congo;
