export default function FlipCard({ front, back, className = '', style = {}, noFlip = false }) {
  return (
    <div className={`flip-card ${className}${noFlip ? ' flip-card--no-flip' : ''}`} style={style}>
      <div className="flip-card-inner">
        <div className="flip-card-front">{front}</div>
        {!noFlip && <div className="flip-card-back">{back}</div>}
      </div>
    </div>
  );
}
