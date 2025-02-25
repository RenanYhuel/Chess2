interface PieceProps {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | null;
  color: "white" | "black" | null;
  isDragged?: boolean;
  style?: React.CSSProperties;
}

const Piece = ({ type, color, isDragged, style }: PieceProps) => {
  const pieceSymbols: { [key in NonNullable<PieceProps['type']>]: string } = {
    pawn: color === "white" ? "♙" : "♟",
    rook: color === "white" ? "♖" : "♜",
    knight: color === "white" ? "♘" : "♞",
    bishop: color === "white" ? "♗" : "♝",
    queen: color === "white" ? "♕" : "♛",
    king: color === "white" ? "♔" : "♚",
  };

  return (
    <span
      style={{
        fontSize: isDragged ? "6vw" : "3vw",
        cursor: "pointer",
        backgroundColor: "transparent",
        userSelect: "none",
        ...style,
      }}
    >
      {type ? pieceSymbols[type] : ""}
    </span>
  );
};

export default Piece;