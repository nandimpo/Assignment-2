import { useState, useEffect, useRef } from "react";
import "../styles/financeSchool.css";
import AppNav from "../components/AppNav";
import confetti from "canvas-confetti";

export default function FinanceSchool() {
  const [view, setView] = useState("path");
  const [activeLesson, setActiveLesson] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null); // null | "correct" | "wrong"
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

  const feedbackTimer = useRef(null);

  const [learning, setLearning] = useState({
    completed: [],
    xp: 0,
    level: 1,
    streak: 1,
    lastLogin: null,
  });

  const user = JSON.parse(sessionStorage.getItem("user"));
  const storageKey = user?.email ? `learning_${user.email}` : "learning_guest";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey));

    if (saved) updateStreak(saved);
    else {
      const fresh = {
        completed: [],
        xp: 0,
        level: 1,
        streak: 1,
        lastLogin: new Date().toDateString(),
      };
      setLearning(fresh);
      localStorage.setItem(storageKey, JSON.stringify(fresh));
    }
  }, [storageKey]);

  /* Clean up timer on unmount */
  useEffect(() => {
    return () => clearTimeout(feedbackTimer.current);
  }, []);

  const updateStreak = (data) => {
    const today = new Date().toDateString();

    if (data.lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);

      data.streak =
        data.lastLogin === yesterday.toDateString() ? data.streak + 1 : 1;

      data.lastLogin = today;
    }

    setLearning(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const lessons = [
    {
      id: "compound",
      title: "Investing Basics",
      desc: "Learn how investing grows your wealth",
      content: {
        title: "Compound Interest",
        text: "Your money earns returns, and those returns earn more returns.",
      },
      quiz: [
        {
          question: "What is compound interest?",
          options: [
            "Interest only on initial money",
            "Interest on interest over time",
            "A bank fee",
          ],
          answer: 1,
        },
        {
          question: "Why is compounding powerful?",
          options: [
            "It reduces savings",
            "It grows money faster over time",
            "It removes interest",
          ],
          answer: 1,
        },
      ],
    },
    {
      id: "property",
      title: "Property & Home Buying",
      desc: "Understand deposits and bonds",
      content: {
        title: "Transfer Duty",
        text: "A tax paid when buying property in South Africa.",
      },
      quiz: [
        {
          question: "What is transfer duty?",
          options: ["Rent", "Tax when buying", "Interest"],
          answer: 1,
        },
      ],
    },
  ];

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    setView("lesson");
  };

  const startQuiz = () => {
    setView("quiz");
    setSelected(null);
    setFeedback(null);
    setFeedbackVisible(false);
    setQuestionIndex(0);
  };

  const saveLearning = (data) => {
    setLearning(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  /* SHOW FEEDBACK THEN FADE   */

  const showFeedback = (type) => {
    clearTimeout(feedbackTimer.current);
    setFeedback(type);
    setFeedbackVisible(true);

    /* Correct: auto-dismiss after 1.4s then advance */
    if (type === "correct") {
      feedbackTimer.current = setTimeout(() => {
        setFeedbackVisible(false);
        setTimeout(() => setFeedback(null), 300); // wait for fade out
      }, 1400);
    }
    /* Wrong: stays visible — user must click Try Again to dismiss */
  };

  const submitAnswer = () => {
    if (selected === null) return;
    const currentQ = activeLesson.quiz[questionIndex];

    if (selected === currentQ.answer) {
      showFeedback("correct");

      const updated = { ...learning, xp: learning.xp + 50 };

      if (updated.xp >= updated.level * 100) {
        updated.level += 1;
        // delay level-up popup so it doesn't clash with feedback
        setTimeout(() => setShowLevelUp(true), 800);
      }

      saveLearning(updated);
      confetti({ particleCount: 100, spread: 70 });

      setTimeout(() => {
        if (questionIndex < activeLesson.quiz.length - 1) {
          setQuestionIndex((q) => q + 1);
          setSelected(null);
          setFeedback(null);
          setFeedbackVisible(false);
        } else {
          updated.completed.push(activeLesson.id);
          saveLearning(updated);
          setView("path");
          setActiveLesson(null);
        }
      }, 1800);
    } else {
      showFeedback("wrong");
    }
  };

  /* TRY AGAIN                 */

  const tryAgain = () => {
    setFeedbackVisible(false);
    setTimeout(() => {
      setFeedback(null);
      setSelected(null);
    }, 300); // wait for CSS fade
  };

  const resumeLearning = () => {
    const next = lessons.find((l) => !learning.completed.includes(l.id));
    if (next) openLesson(next);
  };

  return (
    <div className="learn-page">
      <AppNav />

      <div className="learn-container">
        {/* HEADER */}
        <div className="header-row">
          <div>
            <h1>Finance School</h1>
            <p className="subtitle">🔥 Streak: {learning.streak} days</p>
          </div>

          <button className="resume-btn" onClick={resumeLearning}>
            Resume Learning
          </button>
        </div>

        {/* PROGRESS */}
        <div className="card">
          <p>Level {learning.level}</p>
          <div className="progress">
            <div
              className="progress-fill"
              style={{ width: `${learning.xp % 100}%` }}
            />
          </div>
        </div>

        {/* MODULES */}
        <div className="module-grid">
          {lessons.map((lesson) => (
            <div key={lesson.id} className="card module-card">
              <h3>{lesson.title}</h3>
              <p>{lesson.desc}</p>
              <button onClick={() => openLesson(lesson)}>Start</button>
            </div>
          ))}
        </div>

        {/* LESSON */}
        {view === "lesson" && activeLesson && (
          <div className="card narrow">
            <h2>{activeLesson.content.title}</h2>
            <p>{activeLesson.content.text}</p>

            <button className="pill" onClick={startQuiz}>
              Start Quiz →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {view === "quiz" && activeLesson && (
          <div className="card narrow">
            <h2 className="quiz-question">
              {activeLesson.quiz[questionIndex].question}
            </h2>

            <div className="options">
              {activeLesson.quiz[questionIndex].options.map((opt, i) => {
                const correct = activeLesson.quiz[questionIndex].answer;

                let state = "";
                if (feedback) {
                  if (i === correct) state = "correct";
                  else if (i === selected) state = "wrong";
                } else if (selected === i) state = "selected";

                return (
                  <div
                    key={i}
                    className={`option ${state}`}
                    onClick={() => !feedback && setSelected(i)}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>

            {/* FEEDBACK TOAST */}
            <div
              className={`feedback-toast ${feedback === "wrong" ? "feedback-wrong" : "feedback-correct"} ${feedbackVisible ? "feedback-show" : ""}`}
            >
              {feedback === "wrong" ? (
                <>
                  <span>❌ Incorrect — try again</span>
                  <button className="try-again-btn" onClick={tryAgain}>
                    Try Again
                  </button>
                </>
              ) : (
                <span>✅ Correct! +50 XP</span>
              )}
            </div>

            {/* Only show Submit when no feedback is active */}
            {!feedback && (
              <button className="pill" onClick={submitAnswer}>
                Submit
              </button>
            )}
          </div>
        )}

        {/* LEVEL UP OVERLAY */}
        {showLevelUp && (
          <div className="level-overlay">
            <div className="level-popup">
              <p className="level-emoji">🎉</p>
              <h2>Level Up!</h2>
              <p>You are now Level {learning.level}</p>
              <button className="pill" onClick={() => setShowLevelUp(false)}>
                Continue
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
