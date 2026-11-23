// Wraps each word in a mask so headings can rise in word by word when revealed
export default function SplitText({ children }) {
  return String(children)
    .split(" ")
    .map((word, i, all) => (
      <span className="w" key={i}>
        <span style={{ "--wi": i }}>{word}</span>
        {i < all.length - 1 ? " " : ""}
      </span>
    ));
}
