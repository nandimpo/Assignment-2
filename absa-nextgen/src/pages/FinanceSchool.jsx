import { useState, useEffect, useRef } from "react";
import "../styles/financeSchool.css";
import AppNav from "../components/AppNav";
import confetti from "canvas-confetti";
import { useUser } from "../context/UserContext";
import Tour from "../components/Tour";

/* ─── LESSONS ────────────────────────────────────────────── */

const lessons = [
  {
    id: "compound",
    title: "Compound Interest",
    desc: "How money multiplies itself over time",
    tag: "Investing",
    color: "#84a794",
    content: {
      title: "The Power of Compounding",
      body: [
        {
          heading: "What is compound interest?",
          text: "Compound interest means you earn returns on your returns — not just on the original amount. R10,000 invested at 10% p.a. becomes R11,000 after Year 1. In Year 2 you earn 10% on R11,000 (not R10,000), giving R12,100. That extra R100 is compounding in action.",
        },
        {
          heading: "The Rule of 72",
          text: "Divide 72 by your annual return rate to estimate how many years it takes to double your money. At 10% p.a., your money doubles roughly every 7.2 years. At 8% it doubles in 9 years. This rule helps you quickly compare investment options.",
        },
        {
          heading: "Why starting early matters so much",
          text: "Investing R1,000/month from age 22 to 30 (8 years, R96,000 total) and then stopping, grows to more by age 65 than investing R1,000/month from age 30 to 65 (35 years, R420,000 total). Time in the market beats timing the market.",
        },
        {
          heading: "SA context: TFSA and RA",
          text: "In South Africa, a Tax-Free Savings Account (TFSA) lets you invest up to R36,000/year (R500,000 lifetime) with zero tax on growth or withdrawals. A Retirement Annuity (RA) lets you deduct up to 27.5% of taxable income — the tax saving itself compounds over your career.",
        },
      ],
    },
    quiz: [
      {
        question: "You invest R10,000 at 10% p.a. compounded annually. How much do you have after 2 years?",
        options: ["R12,000", "R12,100", "R11,000"],
        answer: 1,
        explanation: "Year 1: R10,000 × 1.10 = R11,000. Year 2: R11,000 × 1.10 = R12,100. The extra R100 is compounding.",
      },
      {
        question: "Using the Rule of 72, at 9% p.a. your money doubles in approximately:",
        options: ["6 years", "8 years", "12 years"],
        answer: 1,
        explanation: "72 ÷ 9 = 8 years. Simple and useful for quick comparisons.",
      },
      {
        question: "What is the annual TFSA contribution limit in South Africa?",
        options: ["R27,500", "R36,000", "R50,000"],
        answer: 1,
        explanation: "The TFSA limit is R36,000/year with a R500,000 lifetime cap. Growth and withdrawals are completely tax-free.",
      },
    ],
  },
  {
    id: "tax",
    title: "SA Tax & SARS",
    desc: "PAYE, tax brackets, CGT and what SARS takes",
    tag: "Tax",
    color: "#d6a85a",
    content: {
      title: "Understanding South African Tax",
      body: [
        {
          heading: "How PAYE works",
          text: "Pay-As-You-Earn (PAYE) is deducted from your salary every month by your employer and paid to SARS. South Africa uses a progressive tax system — the more you earn, the higher your marginal rate. The 2024/25 brackets run from 18% (up to R237,100) to 45% (above R1,817,000).",
        },
        {
          heading: "Tax brackets at a glance (2024/25)",
          text: "R0 – R237,100: 18% | R237,101 – R370,500: 26% | R370,501 – R512,800: 31% | R512,801 – R673,000: 36% | R673,001 – R857,900: 39% | R857,901 – R1,817,000: 41% | Above R1,817,000: 45%. Your marginal rate only applies to earnings in that band — not your full salary.",
        },
        {
          heading: "Capital Gains Tax (CGT)",
          text: "When you sell an investment for more than you paid, the profit is a capital gain. In SA, 40% of that gain is included in your taxable income (the 'inclusion rate'). At a 45% marginal rate, the maximum effective CGT rate is 18%. The first R40,000 of capital gains per year is exempt for individuals.",
        },
        {
          heading: "UIF and other deductions",
          text: "Unemployment Insurance Fund (UIF) is 1% of your gross salary (up to a monthly ceiling of R177.12). Medical Aid contributions may qualify for tax credits. Pension and RA contributions are deductible up to 27.5% of the higher of remuneration or taxable income, capped at R350,000/year.",
        },
        {
          heading: "Dividend Withholding Tax",
          text: "Dividends paid to SA residents are taxed at a flat 20% withholding rate, deducted before you receive the dividend. Inside a TFSA, dividends are tax-free. Inside an RA, they are also sheltered.",
        },
      ],
    },
    quiz: [
      {
        question: "In South Africa, PAYE is calculated using:",
        options: ["A flat 25% rate for everyone", "Progressive tax brackets", "Only on salary above R500,000"],
        answer: 1,
        explanation: "SA uses progressive brackets — higher income is taxed at higher rates, but only the portion in each band.",
      },
      {
        question: "The CGT inclusion rate for individuals in SA is:",
        options: ["100%", "40%", "18%"],
        answer: 1,
        explanation: "40% of your capital gain is added to your taxable income. The effective rate depends on your marginal bracket (max 18% at the 45% bracket).",
      },
      {
        question: "What is the individual annual CGT exclusion?",
        options: ["R10,000", "R40,000", "R100,000"],
        answer: 1,
        explanation: "The first R40,000 of capital gains per tax year is excluded for individuals. Useful for managing when you sell investments.",
      },
      {
        question: "RA contributions are tax-deductible up to what percentage of taxable income?",
        options: ["15%", "27.5%", "35%"],
        answer: 1,
        explanation: "Up to 27.5% of the higher of remuneration or taxable income, capped at R350,000/year. This deduction directly reduces your PAYE.",
      },
    ],
  },
  {
    id: "tfsa-ra",
    title: "TFSA vs Retirement Annuity",
    desc: "Which tax wrapper is right for your goals?",
    tag: "Investing",
    color: "#84a794",
    content: {
      title: "TFSA vs RA — Choosing the Right Wrapper",
      body: [
        {
          heading: "Tax-Free Savings Account (TFSA)",
          text: "Contributions are made from after-tax money (no deduction), but all growth — interest, dividends, capital gains — is completely tax-free. Withdrawals are flexible at any time. Annual limit: R36,000. Lifetime limit: R500,000. Exceeding limits triggers a 40% penalty tax on the excess.",
        },
        {
          heading: "Retirement Annuity (RA)",
          text: "Contributions reduce your taxable income by up to 27.5% (max R350,000/year) — you get an immediate tax saving. Growth is tax-deferred (no tax while inside the RA). At retirement you can take a lump sum (first R550,000 tax-free), with the remainder used to buy an annuity (taxed as income). You cannot access RA funds before age 55.",
        },
        {
          heading: "Key trade-offs",
          text: "TFSA: flexible access, no tax saving upfront, but fully tax-free on exit. Best for medium-term goals (property deposit, car, 5-year targets). RA: locked until retirement, but the upfront tax deduction can be reinvested. If your marginal rate is 36%+, the RA deduction is very powerful. Many SA financial planners recommend maxing both before investing in taxable accounts.",
        },
        {
          heading: "Which should you use first?",
          text: "Rule of thumb: if you need the money within 10 years, TFSA first. If you're building a retirement fund and your marginal rate is 31%+, RA first (or alongside). The tax saving from an RA at 36% marginal rate means SARS is effectively co-investing 36 cents for every rand you put in.",
        },
        {
          heading: "SA context: Pension Fund vs RA",
          text: "If your employer offers a pension or provident fund, your contributions already get tax deductions. An RA is useful to top up your retirement savings to the 27.5% limit, or if you're self-employed (no employer fund). Both are governed by the Pension Funds Act.",
        },
      ],
    },
    quiz: [
      {
        question: "The annual contribution limit for a TFSA is:",
        options: ["R27,500", "R36,000", "R50,000"],
        answer: 1,
        explanation: "R36,000 per year, R500,000 lifetime. Exceeding these limits incurs a 40% penalty tax.",
      },
      {
        question: "An RA contribution gives you:",
        options: ["A tax-free withdrawal at any age", "A deduction from taxable income now, taxed on retirement income later", "No tax benefit at all"],
        answer: 1,
        explanation: "RA reduces your current taxable income (immediate tax saving), but retirement income drawn is taxed. The first R550,000 lump sum at retirement is tax-free.",
      },
      {
        question: "When can you access your RA funds?",
        options: ["Any time", "Only after age 55", "Only after age 65"],
        answer: 1,
        explanation: "RA funds are preserved until age 55 (minimum retirement age). This illiquidity is the key trade-off vs a TFSA.",
      },
    ],
  },
  {
    id: "debt",
    title: "Debt Management",
    desc: "Avalanche vs snowball, interest costs, credit scores",
    tag: "Debt",
    color: "#ff9898",
    content: {
      title: "Managing and Eliminating Debt in SA",
      body: [
        {
          heading: "Types of debt in South Africa",
          text: "Secured debt (home loan, vehicle finance) is backed by an asset the bank can repossess. Unsecured debt (credit cards, personal loans, store cards) has no collateral and almost always carries higher rates. Credit card rates in SA typically run 18–22.5% p.a. — roughly double prime. Personal loans from banks average 15–22%.",
        },
        {
          heading: "The Debt Avalanche method",
          text: "Pay minimums on all debts, then throw every extra rand at the highest-interest debt first. Once cleared, redirect that payment to the next highest rate. Mathematically optimal — you minimise total interest paid. Best for disciplined savers who focus on the numbers.",
        },
        {
          heading: "The Debt Snowball method",
          text: "Pay minimums on all debts, then attack the smallest balance first regardless of rate. Each cleared debt is a win that builds momentum. Psychologically powerful — you see accounts closing and get motivated. Research shows many people succeed more consistently with snowball, even though avalanche is cheaper on paper.",
        },
        {
          heading: "The National Credit Act (NCA)",
          text: "South Africa's NCA protects consumers. Lenders must assess your affordability before extending credit. If you're over-indebted you can apply for debt review — a formal process where a debt counsellor restructures your repayments. Under debt review you cannot take on new credit, but you're protected from legal action by creditors.",
        },
        {
          heading: "Credit score in SA",
          text: "Your credit score (TransUnion, Experian, or Compuscan) is based on payment history (most important), utilisation, length of credit history, and new applications. A score above 670 is considered good. Paying on time, every time, is the single most effective action. Checking your own score does not affect it.",
        },
      ],
    },
    quiz: [
      {
        question: "The Debt Avalanche strategy targets:",
        options: ["The smallest balance first", "The highest interest rate first", "The oldest debt first"],
        answer: 1,
        explanation: "Avalanche = highest rate first. It minimises total interest paid — the mathematically optimal approach.",
      },
      {
        question: "Under the NCA, if you are formally declared over-indebted you can apply for:",
        options: ["Debt write-off", "Debt review", "Automatic insolvency"],
        answer: 1,
        explanation: "Debt review restructures repayments through a registered debt counsellor. You can't take new credit during the process but are protected from legal action.",
      },
      {
        question: "What most affects your credit score in SA?",
        options: ["How many accounts you have", "Paying on time every month", "Your total income"],
        answer: 1,
        explanation: "Payment history is the single biggest factor. One missed payment can drop your score significantly and stays on record for two years.",
      },
    ],
  },
  {
    id: "property",
    title: "Property & Home Buying",
    desc: "Bonds, transfer duty, deposits and the true cost",
    tag: "Property",
    color: "#4facfe",
    content: {
      title: "Buying Property in South Africa",
      body: [
        {
          heading: "How a South African home loan works",
          text: "A home loan (bond) is a secured loan where the bank lends you money to buy property and registers a mortgage bond over it. Repayment uses the amortisation formula — each monthly payment covers interest first, then principal. In the early years almost all of your payment is interest. Over 20 years at 11.5%, you'll pay roughly double the purchase price in total.",
        },
        {
          heading: "Transfer Duty",
          text: "Transfer duty is a government tax on property transactions in SA. On a R1.8M property, transfer duty is R58,500. Properties below R1,100,000 are exempt. New developments from developers (VAT-inclusive) also pay no transfer duty. Budget 3–5% of the purchase price for transfer duty, conveyancing attorney fees, and bond registration fees.",
        },
        {
          heading: "The deposit",
          text: "Most SA banks require a 10% deposit. Some first-time buyer schemes (FNB, Standard Bank, Absa) offer 100% bonds but with higher rates. A 20% deposit typically unlocks prime-linked rates (-1% or better) vs 100% bonds which may be prime +1–2%. Larger deposits save significant interest over the term.",
        },
        {
          heading: "Affordability: the 30% rule",
          text: "SA banks typically cap home loan repayments at 30% of gross monthly income (before tax). On a R35,000/month gross salary that's R10,500/month maximum bond repayment — which at 11.75% over 20 years means a bond of roughly R980,000. Your total debt repayments (car, cards, store accounts) also count against this limit.",
        },
        {
          heading: "Additional costs to budget",
          text: "Beyond the deposit: bond initiation fee (approx R6,037), bond registration (varies by bank), conveyancing attorney (R15,000–R35,000 on a R2M property), municipal rates clearance, and homeowners insurance (mandatory with the bond). Moving costs, renovations, and municipal connection deposits also add up.",
        },
      ],
    },
    quiz: [
      {
        question: "Transfer duty applies to which type of property purchase?",
        options: ["New developments from a VAT-registered developer", "Existing (resale) residential property above R1.1M", "Only commercial property"],
        answer: 1,
        explanation: "Transfer duty applies to resale properties above R1,100,000. New developments where the developer is VAT-registered are exempt (VAT is included in the price instead).",
      },
      {
        question: "SA banks typically cap home loan repayments at what percentage of gross income?",
        options: ["20%", "30%", "40%"],
        answer: 1,
        explanation: "The 30% affordability guideline means a R35,000 gross salary supports about R10,500/month in bond repayments.",
      },
      {
        question: "A 20% deposit compared to a 10% deposit typically results in:",
        options: ["A shorter bond term only", "A lower interest rate and lower total repayment", "No practical difference"],
        answer: 1,
        explanation: "Larger deposits reduce lender risk, which often unlocks better rates (-0.5% to -1.5%) and reduces the principal — saving hundreds of thousands in interest over 20 years.",
      },
    ],
  },
  {
    id: "investing",
    title: "ETFs & Unit Trusts",
    desc: "Low-cost SA investing explained simply",
    tag: "Investing",
    color: "#84a794",
    content: {
      title: "Investing in South Africa: ETFs and Unit Trusts",
      body: [
        {
          heading: "What is an ETF?",
          text: "An Exchange-Traded Fund (ETF) is a basket of assets (shares, bonds, property) that trades on the JSE like a single share. The Satrix 40 ETF, for example, holds all 40 companies in the JSE Top 40 index. If you buy one unit, you effectively own a tiny slice of all 40 companies. ETFs are passive — they track an index rather than having a fund manager pick stocks.",
        },
        {
          heading: "Total Expense Ratio (TER)",
          text: "The TER is the annual cost of an investment product, expressed as a percentage of the fund value. A passive ETF like Satrix 40 has a TER of ~0.10–0.15%. Actively managed unit trusts average 1.0–1.5% TER. On R100,000 invested over 20 years, the difference between 0.15% and 1.5% fees can cost you R100,000+ in compounded lost returns.",
        },
        {
          heading: "JSE-listed ETFs for South Africans",
          text: "Popular local ETFs: Satrix 40 (JSE top 40 companies), Satrix MSCI World (global diversification in ZAR), Satrix Property (SA listed property / REITs), Sygnia Itrix S&P 500 (US market). These can all be held inside a TFSA at most major SA brokers (EasyEquities, FNB Share Investing, Absa Stockbrokers).",
        },
        {
          heading: "Unit trusts vs ETFs",
          text: "Unit trusts are pooled funds managed by an asset manager (Allan Gray, Coronation, Ninety One). You buy 'units' at a price set daily. Active unit trusts aim to beat the market but most underperform their benchmark after fees over 10+ years. ETFs trade intraday, unit trusts once a day. Both can be held in TFSA or RA wrappers.",
        },
        {
          heading: "Getting started in SA",
          text: "EasyEquities allows you to start investing with as little as R10 in an ETF, and hosts TFSA accounts directly. No minimum balance, no advisor fee. For a simple first portfolio: Satrix 40 (local equity) + Satrix MSCI World (global) + a money market fund for your emergency fund. This covers SA equity, global equity, and cash in three products.",
        },
      ],
    },
    quiz: [
      {
        question: "A TER of 0.15% vs 1.5% on R100,000 over 20 years at 10% p.a. results in approximately:",
        options: ["The same outcome — fees are small", "A difference of R100,000+ in favour of the lower TER", "Lower returns for the cheaper ETF"],
        answer: 1,
        explanation: "Compounded over 20 years, a 1.35% annual fee difference destroys significant wealth. Low-cost passive investing is one of the strongest evidence-based strategies in personal finance.",
      },
      {
        question: "The Satrix 40 ETF tracks:",
        options: ["The 40 most profitable SA companies", "The JSE Top 40 index (40 largest companies by market cap)", "40 global technology companies"],
        answer: 1,
        explanation: "Satrix 40 passively tracks the JSE Top 40 — the 40 largest companies listed on the Johannesburg Stock Exchange.",
      },
      {
        question: "Which SA platform lets you invest in ETFs from as little as R10?",
        options: ["Old Mutual", "EasyEquities", "Standard Bank Webtrader"],
        answer: 1,
        explanation: "EasyEquities allows fractional investing from R10 and hosts TFSA accounts. It's the most accessible entry point for retail investors in SA.",
      },
    ],
  },
];

/* ─── COMPONENT ──────────────────────────────────────────── */

export default function FinanceSchool() {
  const [view,          setView]          = useState("path");
  const [activeLesson,  setActiveLesson]  = useState(null);
  const [selected,      setSelected]      = useState(null);
  const [feedback,      setFeedback]      = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showLevelUp,   setShowLevelUp]   = useState(false);
  const [levelUpPending, setLevelUpPending] = useState(false);
  const [activeTab,     setActiveTab]     = useState(0);

  const feedbackTimer = useRef(null);

  const [learning, setLearning] = useState({
    completed: [],
    xp:        0,
    level:     1,
    streak:    1,
    lastLogin: null,
  });

  const { user } = useUser();
  const storageKey = user?.id ? `learning_${user.id}` : "learning_guest";

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(storageKey) || "null");
    if (saved) updateStreak(saved);
    else {
      const fresh = { completed: [], xp: 0, level: 1, streak: 1, lastLogin: new Date().toDateString() };
      setLearning(fresh);
      localStorage.setItem(storageKey, JSON.stringify(fresh));
    }
  }, [storageKey]);

  useEffect(() => { return () => clearTimeout(feedbackTimer.current); }, []);

  const updateStreak = (data) => {
    const today = new Date().toDateString();
    let updated = { ...data };
    if (updated.lastLogin !== today) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      updated.streak = updated.lastLogin === yesterday.toDateString() ? updated.streak + 1 : 1;
      updated.lastLogin = today;
    }
    setLearning(updated);
    localStorage.setItem(storageKey, JSON.stringify(updated));
  };

  const saveLearning = (data) => {
    setLearning(data);
    localStorage.setItem(storageKey, JSON.stringify(data));
  };

  const openLesson = (lesson) => {
    setActiveLesson(lesson);
    setActiveTab(0);
    setView("lesson");
  };

  const startQuiz = () => {
    setView("quiz");
    setSelected(null);
    setFeedback(null);
    setFeedbackVisible(false);
    setShowLevelUp(false);
    setLevelUpPending(false);
    setQuestionIndex(0);
  };

  const showFeedback = (type) => {
    clearTimeout(feedbackTimer.current);
    setFeedback(type);
    setFeedbackVisible(true);
    if (type === "correct") {
      feedbackTimer.current = setTimeout(() => {
        setFeedbackVisible(false);
        setTimeout(() => setFeedback(null), 300);
      }, 1400);
    }
  };

  const chooseAnswer = (index) => {
    if (feedback === "correct") return;
    if (feedback === "wrong") {
      clearTimeout(feedbackTimer.current);
      setFeedback(null);
      setFeedbackVisible(false);
    }
    setSelected(index);
  };

  const submitAnswer = () => {
    if (selected === null) return;
    const currentQ = activeLesson.quiz[questionIndex];
    if (selected === currentQ.answer) {
      showFeedback("correct");
      const updated = { ...learning, xp: learning.xp + 50 };
      let didLevelUp = false;
      if (updated.xp >= updated.level * 100) {
        updated.level += 1;
        didLevelUp = true;
        setLevelUpPending(true);
      }
      saveLearning(updated);
      confetti({ particleCount: 80, spread: 60 });
      setTimeout(() => {
        if (questionIndex < activeLesson.quiz.length - 1) {
          setQuestionIndex(q => q + 1);
          setSelected(null);
          setFeedback(null);
          setFeedbackVisible(false);
        } else {
          const finalUpdated = { ...updated };
          if (!finalUpdated.completed.includes(activeLesson.id)) {
            finalUpdated.completed = [...finalUpdated.completed, activeLesson.id];
          }
          saveLearning(finalUpdated);
          setView("path");
          setActiveLesson(null);
          setFeedback(null);
          setFeedbackVisible(false);
          setSelected(null);
          if (didLevelUp || levelUpPending) {
            setTimeout(() => {
              setShowLevelUp(true);
              setLevelUpPending(false);
            }, 250);
          }
        }
      }, 1800);
    } else {
      showFeedback("wrong");
    }
  };

  const tryAgain = () => {
    setFeedbackVisible(false);
    setTimeout(() => { setFeedback(null); setSelected(null); }, 300);
  };

  const resumeLearning = () => {
    const next = lessons.find(l => !learning.completed.includes(l.id));
    if (next) openLesson(next);
  };

  const tags = ["All", ...Array.from(new Set(lessons.map(l => l.tag)))];
  const [filterTag, setFilterTag] = useState("All");

  const visibleLessons = filterTag === "All"
    ? lessons
    : lessons.filter(l => l.tag === filterTag);

  const schoolTourSteps = [
    { text: "Welcome to Finance School 🎓 — learn SA finance concepts and earn XP as you go.", target: "school-header" },
    { text: "Your level and XP progress is tracked here. Keep your streak going daily.", target: "school-progress" },
    { text: "Pick any module to start. Complete the lesson then pass the quiz to earn XP.", target: "school-modules" },
  ];

  return (
    <div className="learn-page">
      <AppNav />

      <div className="learn-container">

        {/* HEADER */}
        <div className="header-row" id="school-header">
          <div>
            <p className="sim-eyebrow">Finance School · SA Financial Literacy</p>
            <h1>Learn. Earn XP. Build wealth.</h1>
            <p className="subtitle">🔥 {learning.streak}-day streak · {learning.completed.length}/{lessons.length} modules complete</p>
          </div>
          <button className="resume-btn" onClick={resumeLearning}>
            {learning.completed.length === lessons.length ? "Review lessons" : "Resume →"}
          </button>
        </div>

        {/* PROGRESS */}
        <div className="card" id="school-progress" style={{ display: "flex", gap: 24, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#8a9a96" }}>Level {learning.level}</p>
              <p style={{ margin: 0, fontSize: "0.78rem", color: "#8a9a96" }}>{learning.xp % 100}/100 XP</p>
            </div>
            <div className="progress">
              <div className="progress-fill" style={{ width: `${learning.xp % 100}%` }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: 12, flexShrink: 0 }}>
            {[
              { label: "XP",       value: learning.xp },
              { label: "Level",    value: learning.level },
              { label: "Complete", value: `${learning.completed.length}/${lessons.length}` },
            ].map(({ label, value }) => (
              <div key={label} style={{ textAlign: "center", padding: "8px 14px", background: "rgba(132,167,148,0.07)", borderRadius: 10, border: "1px solid rgba(132,167,148,0.15)" }}>
                <p style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#84a794" }}>{value}</p>
                <p style={{ margin: 0, fontSize: "0.65rem", color: "#556660", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* TAG FILTER */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", margin: "8px 0" }}>
          {tags.map(tag => (
            <button
              key={tag}
              onClick={() => setFilterTag(tag)}
              style={{
                padding: "5px 14px", borderRadius: 20, fontSize: "0.75rem", cursor: "pointer",
                border: `1px solid ${filterTag === tag ? "#84a794" : "rgba(255,255,255,0.1)"}`,
                background: filterTag === tag ? "rgba(132,167,148,0.15)" : "transparent",
                color: filterTag === tag ? "#84a794" : "#8a9a96",
                transition: "all 0.2s",
              }}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* MODULE GRID */}
        <div className="module-grid" id="school-modules">
          {visibleLessons.map(lesson => {
            const done = learning.completed.includes(lesson.id);
            return (
              <div key={lesson.id} className="card module-card" style={{ borderTop: `3px solid ${lesson.color}`, opacity: done ? 0.8 : 1 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                  <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: lesson.color }}>{lesson.tag}</span>
                  {done && <span style={{ fontSize: "0.7rem", color: "#84a794", fontWeight: 600 }}>✓ Done</span>}
                </div>
                <h3 style={{ margin: "0 0 6px" }}>{lesson.title}</h3>
                <p style={{ margin: "0 0 14px", fontSize: "0.82rem", color: "#8a9a96", lineHeight: 1.4 }}>{lesson.desc}</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "0.72rem", color: "#556660" }}>{lesson.quiz.length} question{lesson.quiz.length !== 1 ? "s" : ""} · +{lesson.quiz.length * 50} XP</span>
                  <button onClick={() => openLesson(lesson)} style={{ background: "none", border: `1px solid ${lesson.color}`, color: lesson.color, padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: "0.78rem" }}>
                    {done ? "Review" : "Start →"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* LESSON VIEW */}
        {view === "lesson" && activeLesson && (
          <div className="card" style={{ maxWidth: 700, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
              <span style={{ fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: activeLesson.color, background: `${activeLesson.color}18`, padding: "4px 10px", borderRadius: 20 }}>{activeLesson.tag}</span>
              <h2 style={{ margin: 0 }}>{activeLesson.content.title}</h2>
            </div>

            {/* section tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 20, flexWrap: "wrap" }}>
              {activeLesson.content.body.map((section, i) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: "5px 12px", borderRadius: 20, fontSize: "0.72rem", cursor: "pointer",
                    border: `1px solid ${activeTab === i ? activeLesson.color : "rgba(255,255,255,0.1)"}`,
                    background: activeTab === i ? `${activeLesson.color}18` : "transparent",
                    color: activeTab === i ? activeLesson.color : "#8a9a96",
                    transition: "all 0.2s",
                  }}
                >
                  {i + 1}. {section.heading.split(":")[0].substring(0, 22)}
                </button>
              ))}
            </div>

            {/* active section */}
            <div style={{ minHeight: 120 }}>
              <h3 style={{ margin: "0 0 10px", color: "#c0ccc8", fontSize: "1rem" }}>{activeLesson.content.body[activeTab].heading}</h3>
              <p style={{ margin: 0, color: "#8a9a96", lineHeight: 1.7, fontSize: "0.88rem" }}>{activeLesson.content.body[activeTab].text}</p>
            </div>

            {/* navigation */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 24 }}>
              <button
                onClick={() => setActiveTab(t => Math.max(0, t - 1))}
                style={{ background: "none", border: "1px solid rgba(255,255,255,0.1)", color: "#8a9a96", padding: "6px 16px", borderRadius: 20, cursor: activeTab === 0 ? "default" : "pointer", opacity: activeTab === 0 ? 0.3 : 1, fontSize: "0.78rem" }}
              >
                ← Back
              </button>

              {activeTab < activeLesson.content.body.length - 1 ? (
                <button
                  onClick={() => setActiveTab(t => t + 1)}
                  style={{ background: `${activeLesson.color}18`, border: `1px solid ${activeLesson.color}`, color: activeLesson.color, padding: "6px 20px", borderRadius: 20, cursor: "pointer", fontSize: "0.78rem" }}
                >
                  Next →
                </button>
              ) : (
                <button
                  className="pill"
                  onClick={startQuiz}
                  style={{ background: activeLesson.color, color: "#0a1210", border: "none", fontWeight: 700 }}
                >
                  Take the Quiz →
                </button>
              )}
            </div>

            <button onClick={() => setView("path")} style={{ marginTop: 16, background: "none", border: "none", color: "#556660", cursor: "pointer", fontSize: "0.78rem" }}>
              ← Back to modules
            </button>
          </div>
        )}

        {/* QUIZ VIEW */}
        {view === "quiz" && activeLesson && (
          <div className="card narrow" style={{ maxWidth: 600, margin: "0 auto" }}>
            <p style={{ fontSize: "0.72rem", color: "#556660", marginBottom: 8 }}>
              Question {questionIndex + 1} of {activeLesson.quiz.length}
            </p>
            <h2 className="quiz-question">{activeLesson.quiz[questionIndex].question}</h2>

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
                    role="button"
                    tabIndex={feedback === "correct" ? -1 : 0}
                    onClick={() => chooseAnswer(i)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        chooseAnswer(i);
                      }
                    }}
                  >
                    {opt}
                  </div>
                );
              })}
            </div>

            {/* explanation shown after correct answer */}
            {feedback === "correct" && activeLesson.quiz[questionIndex].explanation && (
              <div style={{ padding: "12px 14px", background: "rgba(132,167,148,0.08)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 10, marginTop: 12 }}>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#84a794", lineHeight: 1.5 }}>
                  💡 {activeLesson.quiz[questionIndex].explanation}
                </p>
              </div>
            )}

            <div className={`feedback-toast ${feedback === "wrong" ? "feedback-wrong" : "feedback-correct"} ${feedbackVisible ? "feedback-show" : ""}`}>
              {feedback === "wrong" ? (
                <>
                  <span>❌ Incorrect — try again</span>
                  <button className="try-again-btn" onClick={tryAgain}>Try Again</button>
                </>
              ) : (
                <span>✅ Correct! +50 XP</span>
              )}
            </div>

            {feedback !== "correct" && (
              <button className="pill" onClick={submitAnswer}>Submit</button>
            )}

            <button onClick={() => setView("path")} style={{ marginTop: 12, background: "none", border: "none", color: "#556660", cursor: "pointer", fontSize: "0.78rem", display: "block" }}>
              ← Back to modules
            </button>
          </div>
        )}

        {/* LEVEL UP OVERLAY */}
        {showLevelUp && view !== "quiz" && (
          <div className="level-overlay">
            <div className="level-popup">
              <p className="level-emoji">🎉</p>
              <h2>Level Up!</h2>
              <p>You are now Level {learning.level}</p>
              <button className="pill" onClick={() => setShowLevelUp(false)}>Continue</button>
            </div>
          </div>
        )}
      </div>

      <Tour steps={schoolTourSteps} storageKey="schoolTour" />
    </div>
  );
}
