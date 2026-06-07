import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppNav from "../components/AppNav";
import { MessageCircle, BookOpen, Phone, Mail, ChevronDown, ExternalLink } from "lucide-react";
import "../styles/track.css";

const FAQS = [
  {
    q: "What is a Tax-Free Savings Account (TFSA)?",
    a: "A TFSA lets you invest up to R36,000/year (R500,000 lifetime) with zero tax on growth, interest, or withdrawals. It's one of the most powerful savings tools in SA — ideal for medium-term goals like a deposit or a 5-year portfolio target.",
  },
  {
    q: "What is the difference between gross and net salary?",
    a: "Gross salary is what your employer pays before deductions. Net (take-home) pay is what arrives in your account after PAYE tax, UIF (1%), and any pension or medical aid deductions. Use the Setup page to enter your gross — we calculate your net automatically using the SARS tax brackets.",
  },
  {
    q: "How does the app calculate my PAYE?",
    a: "We apply the 2024/25 SARS progressive tax brackets, subtract the primary rebate (R17,235/year for those under 65), and divide by 12 for your monthly PAYE. This is an estimate — your actual PAYE may differ due to pension, medical aid credits, or other deductions.",
  },
  {
    q: "What is transfer duty when buying property?",
    a: "Transfer duty is a government tax on resale property above R1,100,000. For example, on a R1.8M property transfer duty is R58,500. New developments from a VAT-registered developer are exempt. Budget 3–5% of the purchase price for transfer duty, bond registration, and conveyancing attorney fees.",
  },
  {
    q: "What is a Retirement Annuity (RA)?",
    a: "An RA is a long-term retirement savings product where contributions are deductible from taxable income (up to 27.5% of income, max R350,000/year). Growth is tax-deferred. You cannot access the funds before age 55. At retirement, the first R550,000 lump sum is tax-free.",
  },
  {
    q: "How do I change my strategy track?",
    a: "Go to your Profile page and tap 'Edit setup'. This takes you back to the Setup page where you can update your income, expenses, and choose a different strategy track. Your new figures will update your Snapshot and track pages.",
  },
  {
    q: "How is my 5-year projection calculated?",
    a: "We take your monthly surplus (net income minus expenses), assume 20% goes toward investing, and compound it monthly at 10% p.a. (a conservative long-run SA equity market average). This is a projection, not a guarantee — actual returns vary.",
  },
];

const CONTACTS = [
  { icon: Phone,  label: "ABSA Customer Care",  value: "0860 008 600",         sub: "Mon–Fri 08:00–17:00" },
  { icon: Mail,   label: "Email Support",        value: "wealthstudio@absa.co.za", sub: "Response within 2 business days" },
  { icon: ExternalLink, label: "ABSA Online Banking", value: "www.absa.co.za",   sub: "Manage accounts and products" },
];

const RESOURCES = [
  { label: "SARS — Tax tables & filing",        sub: "sars.gov.za",       color: "#84a794" },
  { label: "National Credit Regulator (NCR)",    sub: "ncr.org.za",        color: "#d6a85a" },
  { label: "Financial Sector Conduct Authority", sub: "fsca.co.za",        color: "#4facfe" },
  { label: "ASISA — ETF & unit trust info",      sub: "asisa.org.za",      color: "#84a794" },
  { label: "EasyEquities — Start investing",     sub: "easyequities.co.za",color: "#d6a85a" },
];

export default function Support() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="track-page">
      <AppNav />

      <div className="track-container" style={{ maxWidth: 860 }}>

        {/* HEADER */}
        <p className="sim-eyebrow">Support · ABSA Wealth Studio</p>
        <h1 style={{ margin: "4px 0 6px", fontSize: "clamp(1.6rem, 4vw, 2.4rem)", fontWeight: 700, color: "#e8f0ec" }}>
          We're here to help
        </h1>
        <p style={{ color: "#8a9a96", marginBottom: 32, fontSize: "0.92rem" }}>
          Answers to common questions about the app, SA finance, and how your numbers are calculated.
        </p>

        {/* QUICK LINKS */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12, marginBottom: 32 }}>
          {[
            { icon: BookOpen,      label: "Finance School",     sub: "Learn SA finance concepts",     action: () => navigate("/learn") },
            { icon: MessageCircle, label: "FAQs below",         sub: "Common questions answered",     action: () => document.getElementById("faqs")?.scrollIntoView({ behavior: "smooth" }) },
            { icon: Phone,         label: "ABSA Support",       sub: "0860 008 600",                  action: () => {} },
          ].map(({ icon: Icon, label, sub, action }) => (
            <div
              key={label}
              onClick={action}
              style={{ padding: "16px 18px", background: "rgba(132,167,148,0.06)", border: "1px solid rgba(132,167,148,0.15)", borderRadius: 14, cursor: "pointer", transition: "background 0.2s" }}
              onMouseEnter={e => e.currentTarget.style.background = "rgba(132,167,148,0.12)"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(132,167,148,0.06)"}
            >
              <Icon size={18} color="#84a794" style={{ marginBottom: 8 }} />
              <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: "0.88rem", color: "#c0ccc8" }}>{label}</p>
              <p style={{ margin: 0, fontSize: "0.75rem", color: "#556660" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* FAQS */}
        <div id="faqs">
          <h2 style={{ margin: "0 0 16px", fontSize: "1.1rem", fontWeight: 700, color: "#c0ccc8" }}>
            Frequently asked questions
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {FAQS.map((item, i) => (
              <div
                key={i}
                style={{
                  borderRadius: 12,
                  border: `1px solid ${openFaq === i ? "rgba(132,167,148,0.3)" : "rgba(255,255,255,0.07)"}`,
                  background: openFaq === i ? "rgba(132,167,148,0.06)" : "rgba(255,255,255,0.02)",
                  overflow: "hidden",
                  transition: "border-color 0.2s",
                }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  style={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px", background: "none", border: "none", cursor: "pointer", textAlign: "left", gap: 12 }}
                >
                  <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600, color: "#c0ccc8" }}>{item.q}</p>
                  <ChevronDown size={16} color="#8a9a96" style={{ flexShrink: 0, transform: openFaq === i ? "rotate(180deg)" : "none", transition: "transform 0.2s" }} />
                </button>
                {openFaq === i && (
                  <p style={{ margin: 0, padding: "0 18px 16px", fontSize: "0.84rem", color: "#8a9a96", lineHeight: 1.65 }}>
                    {item.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CONTACT */}
        <h2 style={{ margin: "32px 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#c0ccc8" }}>
          Contact &amp; support channels
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 10, marginBottom: 32 }}>
          {CONTACTS.map(({ icon: Icon, label, value, sub }) => (
            <div key={label} style={{ padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12 }}>
              <Icon size={15} color="#84a794" style={{ marginBottom: 6 }} />
              <p style={{ margin: "0 0 2px", fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.07em", color: "#556660" }}>{label}</p>
              <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "0.88rem", color: "#c0ccc8" }}>{value}</p>
              <p style={{ margin: 0, fontSize: "0.72rem", color: "#445550" }}>{sub}</p>
            </div>
          ))}
        </div>

        {/* SA RESOURCES */}
        <h2 style={{ margin: "0 0 14px", fontSize: "1.1rem", fontWeight: 700, color: "#c0ccc8" }}>
          Useful SA financial resources
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 32 }}>
          {RESOURCES.map(({ label, sub, color }) => (
            <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 10 }}>
              <div>
                <p style={{ margin: "0 0 2px", fontWeight: 600, fontSize: "0.85rem", color: "#c0ccc8" }}>{label}</p>
                <p style={{ margin: 0, fontSize: "0.72rem", color: "#556660" }}>{sub}</p>
              </div>
              <ExternalLink size={14} color={color} />
            </div>
          ))}
        </div>

        {/* NUDGE TO FINANCE SCHOOL */}
        <div
          onClick={() => navigate("/learn")}
          style={{ display: "flex", alignItems: "center", gap: 16, padding: "18px 20px", background: "rgba(132,167,148,0.07)", border: "1px solid rgba(132,167,148,0.2)", borderRadius: 14, cursor: "pointer" }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(132,167,148,0.13)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(132,167,148,0.07)"}
        >
          <BookOpen size={22} color="#84a794" />
          <div>
            <p style={{ margin: "0 0 3px", fontWeight: 600, fontSize: "0.9rem", color: "#c0ccc8" }}>Still have questions?</p>
            <p style={{ margin: 0, fontSize: "0.82rem", color: "#8a9a96" }}>Visit Finance School for in-depth lessons on TFSA, RA, tax, debt, and property →</p>
          </div>
        </div>

      </div>
    </div>
  );
}
