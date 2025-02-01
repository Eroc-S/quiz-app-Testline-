import React, { useState } from 'react'; // Import useState hook

const QuizComponent = ({
  question,
  onAnswerSelect,
  onNextQuestion,
  currentQuestionIndex,
  totalQuestions,
}) => {
  // Always call useState at the top level, not inside conditionals
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  if (!question) {
    return <div>Loading...</div>; // Show loading if the question is not available yet
  }

  const handleAnswerClick = (option) => {
    setSelectedAnswer(option);
    onAnswerSelect(option);  // Pass the selected option to App.js
  };

  const isNextButtonDisabled = !selectedAnswer;

  return (
    <div>
      <h2>{question.description}</h2> {/* Display question description */}
      <div>
        {question.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleAnswerClick(option)}  // Pass the selected option
            style={{
              backgroundColor: selectedAnswer && selectedAnswer.id === option.id ? 'lightblue' : ''
            }}
          >
            {option.description}
          </button>
        ))}
      </div>

      {/* Next button with conditional styling */}
      <button
        onClick={onNextQuestion}
        disabled={isNextButtonDisabled}
        style={{
          backgroundColor: isNextButtonDisabled ? '#ddd' : '#4CAF50', // Disabled button is grey, else green
          color: 'white',
          padding: '10px 20px',
          borderRadius: '5px',
          cursor: isNextButtonDisabled ? 'not-allowed' : 'pointer',
          transition: 'all 0.3s ease', // Smooth transition for color change
          border: 'none', // Remove border for a cleaner look
        }}
      >
        {currentQuestionIndex + 1 === totalQuestions ? "Submit" : "Next"}
      </button>
    </div>
  );
};

export default QuizComponent;


  
