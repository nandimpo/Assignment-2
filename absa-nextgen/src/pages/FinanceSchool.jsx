import { useState, useEffect, useRef } from "react";
import "../styles/financeSchool.css";
import AppNav from "../components/AppNav";
import confetti from "canvas-confetti";

export default function FinanceSchool() {
  const [view, setView] = useState("path");
  const [activeLesson, setActiveLesson] = useState(null);
  const [selected, setSelected] = useState(null);
  const [feedback, setFeedback] = useState(null);

  const pathRef = useRef([]);

  const [learning, setLearning] = useState({
    completed: [],
    xp: 0,
    level: 1,
  });

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("learning"));
    if (saved) setLearning(saved);
  }, []);

  const lessons = [
    {
      id: "compound",
      title: "Investing Basics",
      desc: "Learn how investing grows your wealth",
      content: {
        title: "Compound Interest",
        text: "Your money earns returns, and those returns earn more returns over time.",
      },
      quiz: {
        question: "What is compound interest?",
        options: [
          "Interest only on initial money",
          "Interest on interest over time",
          "A bank fee",
        ],
        answer: 1,
      },
    },
    {
      id: "property",
      title: "Property & Home Buying",
      desc: "Understand deposits, bonds and affordability",
      content: {
        title: "Transfer Duty",
        text: "A tax paid when buying property in South Africa.",
      },
      quiz: {
        question: "What is transfer duty?",
        options: [
          "Monthly rent",
          "Tax paid when buying property",
          "Bank interest",
        ],
        answer: 1,
      },
    },
  ];

  const openLesson = (lesson, index) => {
    const unlocked =
      index === 0 || learning.completed.includes(lessons[index - 1].id);

    if (!unlocked) return;

    setActiveLesson(lesson);
    setView("lesson");
  };

  const startQuiz = () => {
    setView("quiz");
    setSelected(null);
    setFeedback(null);
  };

  const submitAnswer = () => {
    if (selected === null) return;

    if (selected === activeLesson.quiz.answer) {
      setFeedback("correct");

      const updated = { ...learning };

      if (!updated.completed.includes(activeLesson.id)) {
        updated.completed.push(activeLesson.id);
        updated.xp += 50;

        if (updated.xp >= updated.level * 100) {
          updated.level += 1;
        }

        setLearning(updated);
        localStorage.setItem("learning", JSON.stringify(updated));
      }

      confetti({ particleCount: 120, spread: 80 });

      setTimeout(() => {
        setView("path");
        setActiveLesson(null);
        scrollToNextLesson(updated);
      }, 1200);
    } else {
      setFeedback("wrong");
    }
  };

  const scrollToNextLesson = (data = learning) => {
    const nextIndex = lessons.findIndex((l) => !data.completed.includes(l.id));

    if (nextIndex !== -1 && pathRef.current[nextIndex]) {
      pathRef.current[nextIndex].scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  };

  const resumeLearning = () => {
    scrollToNextLesson();
  };

  return (
    <div className="learn-page">
      <AppNav />

      <div className="learn-container">
        <h1>Finance School</h1>
        <p className="subtitle">Learn, explore, and master your money</p>

        {/* PROGRESS */}
        <div className="card progress-card">
          <h4>YOUR LEARNING PROGRESS</h4>
          <p>
            Courses Completed: {learning.completed.length}/{lessons.length}
          </p>

          <div className="progress">
            <div
              className="progress-fill"
              style={{
                width: `${(learning.completed.length / lessons.length) * 100}%`,
              }}
            />
          </div>
        </div>

        {/* MODULES */}
        <div className="module-grid">
          {lessons.map((lesson, index) => {
            const completed = learning.completed.includes(lesson.id);

            return (
              <div key={lesson.id} className="card module-card">
                <h3>{lesson.title}</h3>
                <p>{lesson.desc}</p>

                <button
                  className={completed ? "done" : ""}
                  onClick={() => openLesson(lesson, index)}
                >
                  {completed ? "Continue" : "Start"}
                </button>
              </div>
            );
          })}
        </div>

        {/* QUICK + ACHIEVEMENTS */}
        <div className="bottom-grid">
          <div className="card">
            <h4>QUICK LESSONS</h4>
            <ul className="quick-list">
              <li>What is compound interest?</li>
              <li>How does tax work?</li>
              <li>What is an emergency fund?</li>
            </ul>
          </div>

          <div className="card">
            <h4>ACHIEVEMENTS</h4>
            <div className="achievements">
              <div className="badge">🏆 First Lesson</div>
              {learning.completed.length > 0 && (
                <div className="badge">📈 Getting Started</div>
              )}
            </div>
          </div>
        </div>

        {/* RESUME */}
        <button className="resume-btn" onClick={resumeLearning}>
          Resume Learning
        </button>

        {/* PATH */}
        <div className="path-container">
          {lessons.map((lesson, index) => {
            const completed = learning.completed.includes(lesson.id);
            const unlocked =
              index === 0 || learning.completed.includes(lessons[index - 1].id);

            return (
              <div
                key={lesson.id}
                className="path-step"
                ref={(el) => (pathRef.current[index] = el)}
              >
                {index !== 0 && <div className="path-line" />}

                <div
                  className={`path-node 
                  ${completed ? "completed" : ""} 
                  ${!unlocked ? "locked" : ""}`}
                  onClick={() => openLesson(lesson, index)}
                >
                  {completed ? "✓" : index + 1}
                </div>

                <p className="path-label">{lesson.title}</p>
              </div>
            );
          })}
        </div>

        {/* LESSON */}
        {view === "lesson" && activeLesson && (
          <div className="card lesson-card">
            <h2>{activeLesson.content.title}</h2>
            <p className="lesson-text">{activeLesson.content.text}</p>

            <button className="pill" onClick={startQuiz}>
              Take Quiz →
            </button>
          </div>
        )}

        {/* QUIZ */}
        {view === "quiz" && activeLesson && (
          <div className="card quiz-card">
            <h2>{activeLesson.quiz.question}</h2>

            <div className="options">
              {activeLesson.quiz.options.map((opt, i) => (
                <div
                  key={i}
                  className={`option 
                  ${selected === i ? "selected" : ""}
                  ${
                    feedback === "correct" && i === activeLesson.quiz.answer
                      ? "correct"
                      : ""
                  }
                  ${feedback === "wrong" && selected === i ? "wrong" : ""}`}
                  onClick={() => setSelected(i)}
                >
                  {opt}
                </div>
              ))}
            </div>

            {feedback === "correct" && (
              <p className="correct-text">✅ Correct! +50 XP</p>
            )}
            {feedback === "wrong" && <p className="wrong-text">❌ Try again</p>}

            <button className="pill" onClick={submitAnswer}>
              Submit Answer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
