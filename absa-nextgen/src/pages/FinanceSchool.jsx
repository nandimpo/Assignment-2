import { useState, useEffect, useRef } from "react";
import "../styles/financeSchool.css";
import AppNav from "../components/AppNav";
import confetti from "canvas-confetti";

export default function FinanceSchool() {
  const [view, setView] = useState("path");
  const [activeLesson, setActiveLesson] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);

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
    setQuestionIndex(0);
  };

  const saveLearning = (data) => {
    setLearning(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const submitAnswer = () => {
    const currentQ = activeLesson.quiz[questionIndex];

    if (selected === currentQ.answer) {
      setFeedback("correct");

      const updated = { ...learning, xp: learning.xp + 50 };

      if (updated.xp >= updated.level * 100) {
        updated.level += 1;
        setShowLevelUp(true);
      }

      saveLearning(updated);
      confetti({ particleCount: 100, spread: 70 });

      setTimeout(() => {
        if (questionIndex < activeLesson.quiz.length - 1) {
          setQuestionIndex((q) => q + 1);
          setSelected(null);
          setFeedback(null);
        } else {
          updated.completed.push(activeLesson.id);
          saveLearning(updated);
          setView("path");
          setActiveLesson(null);
        }
      }, 800);
    } else {
      setFeedback("wrong");
    }
  };

  const resumeLearning = () => {
    const next = lessons.find((l) => !learning.completed.includes(l.id));
    if (next) openLesson(next);
  };

  return (
    <div className="learn-page">
      <AppNav />

      <div className="learn-container">
        {" "}
        {/* ✅ FIXED WIDTH */}
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

            {feedback === "wrong" && (
              <p className="feedback wrong-text">❌ Incorrect — try again</p>
            )}

            {feedback === "correct" && (
              <p className="feedback correct-text">✅ Correct! +50 XP</p>
            )}

            <button className="pill" onClick={submitAnswer}>
              Submit
            </button>
          </div>
        )}
        {/* LEVEL UP */}
        {showLevelUp && (
          <div className="level-popup">
            🎉 Level Up! You are now Level {learning.level}
            <button onClick={() => setShowLevelUp(false)}>Continue</button>
          </div>
        )}
      </div>
    </div>
  );
}
