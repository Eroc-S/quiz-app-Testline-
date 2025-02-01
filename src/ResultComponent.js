import React from "react";

const ResultComponent = ({ score, total, onResetQuiz, studentName }) => {
  return (
    <div className="result-container">
      <h2>Quiz Finished</h2>
      <p>Your score: {score} / {total}</p>
      <p>{score === total ? "Perfect score! 🎉" : "Good job! Keep trying."}</p>
      <button className="reset-button" onClick={onResetQuiz}>
        Try Again
      </button>
    </div>
  );
};

export default ResultComponent;
