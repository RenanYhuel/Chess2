import React from "react";
import Piece from "./Piece";
import { Square as SquareType } from "../context/GameContext";

interface SquareProps {
  row: number;
  col: number;
  square: SquareType | null;
  onMouseDown: (e: React.MouseEvent) => void;
  isDragged: boolean;
  isHidden: boolean;
}

const Square: React.FC<SquareProps> = ({ row, col, square, onMouseDown, isDragged, isHidden }) => {
  return (
    <div
      onMouseDown={onMouseDown}
      style={{
        width: "100px",
        height: "100px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: (row + col) % 2 === 0 ? "white" : "gray",
      }}
    >
      {!isHidden && square && (
        <Piece type={square.type} color={square.color} isDragged={isDragged} />
      )}
    </div>
  );
};

export default Square;