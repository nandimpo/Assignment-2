import "../styles/slidein.css";

/**
 * SlideIn — each word slides in from the left one by one.
 * Prominent, rhythmic, typed-but-horizontal feel.
 */
export default function SlideIn({
  tag: Tag = "h1",
  text = "",
  className = "",
  delay = 0,
  style = {},
  stagger = 130,  // ms between each word
}) {
  const words = text.split(" ");

  return (
    <Tag className={`slide-in-wrap ${className}`} style={style}>
      {words.map((word, i) => (
        <span
          key={i}
          className="slide-in-word"
          style={{ animationDelay: `${delay + i * stagger}ms` }}
        >
          {word}
          {i < words.length - 1 ? " " : ""}
        </span>
      ))}
    </Tag>
  );
}
