import "../styles/transition.css";

export default function TransitionOverlay({ active, phase, variant = "green", message = null }) {
  if (!active && phase === "idle") return null;

  return (
    <div className={`page-transition page-transition--${phase} page-transition--${variant}`}>
      <div className="pt-scanlines" />

      {/* Vortex rings */}
      <div className="pt-vortex">
        <div className="pt-vortex-ring pt-vortex-ring--1" />
        <div className="pt-vortex-ring pt-vortex-ring--2" />
        <div className="pt-vortex-ring pt-vortex-ring--3" />
        <div className="pt-vortex-ring pt-vortex-ring--4" />
      </div>

      {/* Elegant symmetrical tree — hidden when welcome message shown */}
      <svg className={`pt-tree ${message ? "pt-tree--hidden" : ""}`} viewBox="0 0 160 220" fill="none" xmlns="http://www.w3.org/2000/svg">

        {/* ── Trunk ── */}
        <path className="pt-path pt-trunk" d="M80 220 L80 148" />

        {/* ── Root flare ── */}
        <path className="pt-path pt-roots" d="M80 210 Q68 216 58 212 M80 210 Q92 216 102 212" />

        {/* ── Level 1: 3 main branches ── */}
        <path className="pt-path pt-b1" d="M80 162 C74 152 56 142 38 130" />
        <path className="pt-path pt-b2" d="M80 162 C86 152 104 142 122 130" />
        <path className="pt-path pt-b3" d="M80 148 C80 138 80 124 80 108" />

        {/* ── Level 2: sub-branches ── */}
        <path className="pt-path pt-s1" d="M38 130 C30 120 18 108 10 94"  />
        <path className="pt-path pt-s2" d="M38 130 C42 120 52 110 60 98"  />
        <path className="pt-path pt-s3" d="M122 130 C130 120 142 108 150 94" />
        <path className="pt-path pt-s4" d="M122 130 C118 120 108 110 100 98" />
        <path className="pt-path pt-s5" d="M80 108 C72 98 60 88 52 76"   />
        <path className="pt-path pt-s6" d="M80 108 C88 98 100 88 108 76"  />

        {/* ── Level 3: fine branches ── */}
        <path className="pt-path pt-t1"  d="M10 94 C6 84 4 72 6 60"    />
        <path className="pt-path pt-t2"  d="M10 94 C14 84 20 74 24 64"  />
        <path className="pt-path pt-t3"  d="M60 98 C56 87 52 76 50 64"  />
        <path className="pt-path pt-t4"  d="M60 98 C64 87 70 78 74 66"  />
        <path className="pt-path pt-t5"  d="M150 94 C154 84 156 72 154 60" />
        <path className="pt-path pt-t6"  d="M150 94 C146 84 140 74 136 64" />
        <path className="pt-path pt-t7"  d="M100 98 C104 87 108 76 110 64" />
        <path className="pt-path pt-t8"  d="M100 98 C96 87 90 78 86 66"  />
        <path className="pt-path pt-t9"  d="M52 76 C46 65 42 54 42 42"   />
        <path className="pt-path pt-t10" d="M52 76 C56 65 62 56 66 46"   />
        <path className="pt-path pt-t11" d="M108 76 C114 65 118 54 118 42" />
        <path className="pt-path pt-t12" d="M108 76 C104 65 98 56 94 46"  />
        <path className="pt-path pt-t13" d="M80 108 C80 94 80 80 80 64"   />

        {/* ── Tips: small glowing dots ── */}
        <circle className="pt-tip" cx="6"   cy="58"  r="2" />
        <circle className="pt-tip" cx="24"  cy="62"  r="2" />
        <circle className="pt-tip" cx="50"  cy="62"  r="2" />
        <circle className="pt-tip" cx="74"  cy="64"  r="2" />
        <circle className="pt-tip" cx="154" cy="58"  r="2" />
        <circle className="pt-tip" cx="136" cy="62"  r="2" />
        <circle className="pt-tip" cx="110" cy="62"  r="2" />
        <circle className="pt-tip" cx="86"  cy="64"  r="2" />
        <circle className="pt-tip" cx="42"  cy="40"  r="2" />
        <circle className="pt-tip" cx="66"  cy="44"  r="2" />
        <circle className="pt-tip" cx="118" cy="40"  r="2" />
        <circle className="pt-tip" cx="94"  cy="44"  r="2" />
        <circle className="pt-tip" cx="80"  cy="62"  r="2.5" style={{fill:"#d6a85a", stroke:"#d6a85a"}} />
      </svg>

      {/* Particles */}
      <div className="pt-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`pt-particle pt-particle--${i + 1}`} />
        ))}
      </div>

      {/* Welcome message */}
      {message && (
        <div className="pt-welcome">
          <p className="pt-welcome-text">{message}</p>
        </div>
      )}

      <div className="pt-fill" />
    </div>
  );
}
