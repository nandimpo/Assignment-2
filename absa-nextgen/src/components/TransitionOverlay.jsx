import "../styles/transition.css";

export default function TransitionOverlay({ active, phase, variant = "green" }) {
  if (!active && phase === "idle") return null;

  return (
    <div className={`page-transition page-transition--${phase} page-transition--${variant}`}>

      {/* Scan lines */}
      <div className="pt-scanlines" />

      {/* Vortex spinning rings */}
      <div className="pt-vortex">
        <div className="pt-vortex-ring pt-vortex-ring--1" />
        <div className="pt-vortex-ring pt-vortex-ring--2" />
        <div className="pt-vortex-ring pt-vortex-ring--3" />
        <div className="pt-vortex-ring pt-vortex-ring--4" />
      </div>

      {/* Growing tree */}
      <svg
        className="pt-tree"
        viewBox="0 0 200 280"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Root flare */}
        <path className="pt-path pt-roots"  d="M100 270 Q82 275 68 270 M100 270 Q118 275 132 270" />

        {/* Trunk */}
        <path className="pt-path pt-trunk"  d="M100 270 C100 240 100 210 100 165" />

        {/* Main branches — curved outward like a vortex unfolding */}
        <path className="pt-path pt-b1" d="M100 175 C90 168 72 158 48 142" />
        <path className="pt-path pt-b2" d="M100 175 C110 168 128 158 152 142" />
        <path className="pt-path pt-b3" d="M100 165 C98 150 97 135 96 115" />

        {/* Sub-branches — spiral outward */}
        <path className="pt-path pt-s1" d="M48 142 C36 130 26 115 20 96" />
        <path className="pt-path pt-s2" d="M48 142 C52 128 60 116 68 104" />
        <path className="pt-path pt-s3" d="M152 142 C164 130 174 115 180 96" />
        <path className="pt-path pt-s4" d="M152 142 C148 128 140 116 132 104" />
        <path className="pt-path pt-s5" d="M96 115 C88 104 76 92 64 80" />
        <path className="pt-path pt-s6" d="M96 115 C104 104 116 92 128 80" />

        {/* Tertiary twigs — spiralling tips */}
        <path className="pt-path pt-t1"  d="M20 96 C14 84 12 70 14 56" />
        <path className="pt-path pt-t2"  d="M20 96 C24 83 30 72 36 62" />
        <path className="pt-path pt-t3"  d="M68 104 C62 91 58 76 58 62" />
        <path className="pt-path pt-t4"  d="M68 104 C72 90 78 78 84 66" />
        <path className="pt-path pt-t5"  d="M180 96 C186 84 188 70 186 56" />
        <path className="pt-path pt-t6"  d="M180 96 C176 83 170 72 164 62" />
        <path className="pt-path pt-t7"  d="M132 104 C138 91 142 76 142 62" />
        <path className="pt-path pt-t8"  d="M132 104 C128 90 122 78 116 66" />
        <path className="pt-path pt-t9"  d="M64 80 C58 67 56 52 58 38" />
        <path className="pt-path pt-t10" d="M64 80 C68 66 74 54 80 44" />
        <path className="pt-path pt-t11" d="M128 80 C134 67 136 52 134 38" />
        <path className="pt-path pt-t12" d="M128 80 C124 66 118 54 112 44" />
        <path className="pt-path pt-t13" d="M96 115 C94 98 94 80 96 62" />

        {/* Tip glows — tiny dots at branch ends (no circles) */}
        <circle className="pt-tip" cx="14"  cy="54"  r="2.5" />
        <circle className="pt-tip" cx="36"  cy="60"  r="2"   />
        <circle className="pt-tip" cx="58"  cy="60"  r="2.5" />
        <circle className="pt-tip" cx="84"  cy="64"  r="2"   />
        <circle className="pt-tip" cx="186" cy="54"  r="2.5" />
        <circle className="pt-tip" cx="164" cy="60"  r="2"   />
        <circle className="pt-tip" cx="142" cy="60"  r="2.5" />
        <circle className="pt-tip" cx="116" cy="64"  r="2"   />
        <circle className="pt-tip" cx="58"  cy="36"  r="2"   />
        <circle className="pt-tip" cx="80"  cy="42"  r="2.5" />
        <circle className="pt-tip" cx="134" cy="36"  r="2"   />
        <circle className="pt-tip" cx="112" cy="42"  r="2.5" />
        <circle className="pt-tip" cx="96"  cy="60"  r="3"   style={{fill:"#d6a85a", stroke:"#d6a85a"}} />
      </svg>

      {/* Floating particles */}
      <div className="pt-particles">
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} className={`pt-particle pt-particle--${i + 1}`} />
        ))}
      </div>

      {/* Screen fill */}
      <div className="pt-fill" />
    </div>
  );
}
