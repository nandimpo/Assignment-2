export default function FlipCard({ front, back, className = '', style = {} }) {
  return (
    <div className={`flip-card ${className}`} style={style}>
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        <div className="flip-card-back">{back}</div>
      </div>
    </div>
  );
}
