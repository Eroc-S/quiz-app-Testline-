import React, { useState, useEffect } from "react";
import axios from "axios";
import QuizComponent from "./QuizComponent";
import ResultComponent from "./ResultComponent";
import './App.css';  

const App = () => {
  const [quizData, setQuizData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(60); // Timer starts from 60 seconds
  const [leaderboard, setLeaderboard] = useState([]);
  const [studentName, setStudentName] = useState("");  // Store student's name
  const [quizStarted, setQuizStarted] = useState(false);  // Track if quiz has started
  const [currentStreak, setCurrentStreak] = useState(0);  // Track current streak of correct answers
  const [showRules, setShowRules] = useState(false); // State to control rules modal visibility

  useEffect(() => {
    axios
      .get("/quizData.json") // Fetch quiz data
      .then((response) => {
        setQuizData(response.data.questions);  // Accessing the questions from the response
      })
      .catch((error) => {
        console.error("Error fetching quiz data:", error);
      });
  }, []);

  useEffect(() => {
    if (timer > 0 && !showResults && quizStarted) {
      const intervalId = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    } else if (timer === 0 && !showResults) {
      setShowResults(true);
      handleLeaderboard();
    }
  }, [timer, showResults, quizStarted]);

  const handleAnswerSelect = (answer) => {
    const correctAnswer = quizData[currentQuestionIndex].options.find(
      (option) => option.is_correct
    );
    const isCorrect = answer.id === correctAnswer.id;

    setUserAnswers((prevAnswers) => [...prevAnswers, answer]);

    if (isCorrect) {
      setScore(prevScore => prevScore + (currentStreak > 2 ? 2 : 1)); // Bonus points for streak
      setCurrentStreak(prevStreak => prevStreak + 1);  // Increment streak
    } else {
      setCurrentStreak(0); // Reset streak on wrong answer
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex + 1 < quizData.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
      handleLeaderboard();
    }
  };

  const handleLeaderboard = () => {
    const newLeaderboard = [
      ...leaderboard,
      { name: studentName, score },
    ];
    setLeaderboard(newLeaderboard);
  };

  const startQuiz = () => {
    if (!studentName) {
      alert("Please enter your name to start the quiz.");
      return;
    }
    setShowRules(true); // Show the rules modal when quiz starts
  };

  const continueQuiz = () => {
    setShowRules(false);  // Hide rules modal and start the quiz
    setQuizStarted(true);
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setScore(0);
    setTimer(60); // Reset timer
    setShowResults(false);
    setQuizStarted(false);
    setCurrentStreak(0); // Reset streak
  };

  if (!quizData) return <div>Loading...</div>;

  return (
    <div className="app">
  {/* Rules Modal */}
  {showRules && (
    <div className="rules-modal">
      <div className="modal-content">
        <h2 className="modal-title">Some Rules of this Quiz</h2>
        <div className="info-list">
          <div className="info">
            <span className="rule-number">1.</span> You will have only <span>60 seconds</span> to complete the quiz.
          </div>
          <div className="info">
            <span className="rule-number">2.</span> Marks per question: <span>1 point</span>.
          </div>
          <div className="info">
            <span className="rule-number">3.</span> You cannot undo your answer once selected.
          </div>
          <div className="info">
            <span className="rule-number">4.</span> You cannot select an option once the time is up.
          </div>
          <div className="info">
            <span className="rule-number">5.</span> You cannot exit from the Quiz while playing.
          </div>
          <div className="info">
            <span className="rule-number">6.</span> You'll get points based on your correct answers.
          </div>
        </div>

        <div className="buttons">
          {/* <button onClick={exitQuiz} className="quit">Exit Quiz</button> */}
          <button onClick={continueQuiz} className="restart">Continue</button>
        </div>
      </div>
    </div>

      )}

      {!quizStarted ? (
        <div className="quiz-start">
          <h2>Enter Your Name to Start the Quiz</h2>
          <input
            type="text"
            value={studentName}
            onChange={(e) => setStudentName(e.target.value)}
            placeholder="Enter your name"
            className="name-input"
          />
          <button onClick={startQuiz} className="start-button">
            Start Quiz
          </button>
        </div>
      ) : (
        <div className="quiz-container">
         
          {!showResults ? (
            <>
              <div className="progress-bar-wrapper">
                <div 
                  className="progress-bar"
                  style={{ width: `${(currentQuestionIndex + 1) / quizData.length * 100}%` }}
                />
              </div>
              <QuizComponent
                question={quizData[currentQuestionIndex]}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={nextQuestion}
                currentQuestionIndex={currentQuestionIndex}
                totalQuestions={quizData.length}
              />
            </>
          ) : (
            <ResultComponent
              score={score}
              total={quizData.length}
              onResetQuiz={resetQuiz}
              studentName={studentName} 
            />
          )}
        </div>
      )}

      {/* Timer */}
      <div className="timer-container">
        <span>Time Left: </span><span className="timer">{timer}s</span>
      </div>

      {/* Leaderboard */}
      {showResults && (
        <div className="leaderboard-container">
          <h3>Leaderboard</h3>
          <ul className="leaderboard">
            {leaderboard.map((entry, index) => (
              <li key={index}>
                {entry.name}: {entry.score} points
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default App;
