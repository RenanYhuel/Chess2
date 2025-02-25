import { CastlingRights, LastMove, Square } from '../context/GameContext';
import canAttackKing from "./canAttackKing";
import validateKingMove from "./movementValidators/validateKingMove";
import { movePiece } from "./movePiece";
import validateMove from "./validateMove";

export function isCheckmate(kingRow: number, kingCol: number, board: (Square | null)[][], isWhite: boolean, lastMove: LastMove | null, castlingRights: CastlingRights): boolean {
  const deltas = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],           [0, 1],
    [1, -1],  [1, 0],  [1, 1]
  ];

  for (const [deltaRow, deltaCol] of deltas) {
    const newRow = kingRow + deltaRow;
    const newCol = kingCol + deltaCol;

    if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) {
      continue;
    }

    if (validateKingMove(kingRow, kingCol, newRow, newCol, board, castlingRights)) {
      const simulatedBoard = movePiece(board, kingRow, kingCol, newRow, newCol);
      console.log(simulatedBoard[newRow][newCol]?.color !== (isWhite ? 'white' : 'black'));
      if (!isInCheck(newRow, newCol, simulatedBoard, isWhite) && (board[newRow][newCol]?.color !== (isWhite ? 'white' : 'black') || !board[newRow][newCol])) {
        return false;
      }
    }
  }

  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === (isWhite ? 'white' : 'black') && piece.type !== 'king') {
        for (let toRow = 0; toRow < 8; toRow++) {
          for (let toCol = 0; toCol < 8; toCol++) {
            if (validateMove(row, col, toRow, toCol, board, lastMove, castlingRights)) {
              const simulatedBoard = movePiece(board, row, col, toRow, toCol);
              if (!isInCheck(kingRow, kingCol, simulatedBoard, isWhite)) {
                return false;
              }
            }
          }
        }
      }
    }
  }

  return true;
}

export default function isInCheck(kingRow: number, kingCol: number, board: (Square | null)[][], isWhite: boolean) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = board[row][col];
      if (square && square.color !== (isWhite ? 'white' : 'black')) {
        if (canAttackKing(row, col, kingRow, kingCol, board)) {
          return true;
        }
      }
    }
  }
  return false;
}