import { createContext, ReactNode, useState } from "react";
import { movePiece } from "../utils/movePiece";
import validateMove from "../utils/validateMove";
import isInCheck, { isCheckmate } from "../utils/IsInCheck";

export interface Square {
  type: "pawn" | "rook" | "knight" | "bishop" | "queen" | "king" | null;
  color: "white" | "black";
  line: number;
  column: number;
}

export interface LastMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: Square;
}

export interface CastlingRights {
  whiteKingMoved: boolean;
  blackKingMoved: boolean;
  whiteRookKingSideMoved: boolean;
  whiteRookQueenSideMoved: boolean;
  blackRookKingSideMoved: boolean;
  blackRookQueenSideMoved: boolean;
}


type CheckState = "white" | "black" | null;
type CheckmateState = "white" | "black" | null;
type NullState = "stalemate" | "insufficient" | "pat" | null;

const PIECE_VALUES = {
  pawn: 1,
  knight: 3,
  bishop: 3,
  rook: 5,
  queen: 9,
  king: 0
};

const initialBoard: (Square | null)[][] = [
  [
    { type: "rook", color: "black", line: 0, column: 0 },
    { type: "knight", color: "black", line: 0, column: 1 },
    { type: "bishop", color: "black", line: 0, column: 2 },
    { type: "queen", color: "black", line: 0, column: 3 },
    { type: "king", color: "black", line: 0, column: 4 },
    { type: "bishop", color: "black", line: 0, column: 5 },
    { type: "knight", color: "black", line: 0, column: 6 },
    { type: "rook", color: "black", line: 0, column: 7 },
  ],
  [
    { type: "pawn", color: "black", line: 1, column: 0 },
    { type: "pawn", color: "black", line: 1, column: 1 },
    { type: "pawn", color: "black", line: 1, column: 2 },
    { type: "pawn", color: "black", line: 1, column: 3 },
    { type: "pawn", color: "black", line: 1, column: 4 },
    { type: "pawn", color: "black", line: 1, column: 5 },
    { type: "pawn", color: "black", line: 1, column: 6 },
    { type: "pawn", color: "black", line: 1, column: 7 },
  ],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [
    { type: "pawn", color: "white", line: 6, column: 0 },
    { type: "pawn", color: "white", line: 6, column: 1 },
    { type: "pawn", color: "white", line: 6, column: 2 },
    { type: "pawn", color: "white", line: 6, column: 3 },
    { type: "pawn", color: "white", line: 6, column: 4 },
    { type: "pawn", color: "white", line: 6, column: 5 },
    { type: "pawn", color: "white", line: 6, column: 6 },
    { type: "pawn", color: "white", line: 6, column: 7 },
  ],
  [
    { type: "rook", color: "white", line: 7, column: 0 },
    { type: "knight", color: "white", line: 7, column: 1 },
    { type: "bishop", color: "white", line: 7, column: 2 },
    { type: "queen", color: "white", line: 7, column: 3 },
    { type: "king", color: "white", line: 7, column: 4 },
    { type: "bishop", color: "white", line: 7, column: 5 },
    { type: "knight", color: "white", line: 7, column: 6 },
    { type: "rook", color: "white", line: 7, column: 7 },
  ],
];


interface GameContextProps {
  board: (Square | null)[][];
  setBoard: React.Dispatch<React.SetStateAction<(Square | null)[][]>>;
  movePiece: (fromRow: number, fromCol: number, toRow: number, toCol: number) => void;
  currentTurn: "white" | "black";
  capturedPieces: {
    white: Square[],
    black: Square[]
  };
  getPlayerScore: (color: "white" | "black") => number;
  getScoreDifference: () => number;
  check: CheckState;
  checkmate: CheckmateState;
  null_state: NullState;
  lastMove: LastMove | null;
  castlingRights: CastlingRights;
}

export const GameContext = createContext<GameContextProps | null>(null);

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [board, setBoard] = useState(initialBoard);
  const [currentTurn, setCurrentTurn] = useState<"white" | "black">("white");
  const [capturedPieces, setCapturedPieces] = useState<{
    white: Square[],
    black: Square[]
  }>({
    white: [],
    black: []
  });
  const [check, setCheck] = useState<CheckState>(null);
  const [checkmate, setCheckmate] = useState<CheckmateState>(null);
  const [null_state, setNullState] = useState<NullState>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [castlingRights, setCastlingRights] = useState<CastlingRights>({
    whiteKingMoved: false,
    blackKingMoved: false,
    whiteRookKingSideMoved: false,
    whiteRookQueenSideMoved: false,
    blackRookKingSideMoved: false,
    blackRookQueenSideMoved: false,
  });

  const handleMovePiece = (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.color !== currentTurn) return;
    if (!validateMove(fromRow, fromCol, toRow, toCol, board, lastMove, castlingRights)) return;

    let kingRow = -1, kingCol = -1;
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const square = board[row][col];
        if (square?.type === 'king' && square.color === currentTurn) {
          kingRow = row;
          kingCol = col;
          break;
        }
      }
    }

    const simulatedBoard = movePiece(board, fromRow, fromCol, toRow, toCol);
    let simulatedKingRow = kingRow, simulatedKingCol = kingCol;
    if (piece.type === 'king') {
      simulatedKingRow = toRow;
      simulatedKingCol = toCol;
    }

    if (isInCheck(simulatedKingRow, simulatedKingCol, simulatedBoard, currentTurn === 'white')) {
      console.log("Ce coup ne protège pas votre roi de l'échec !");
      return;
    }

    if(board[toRow][toCol]?.color === (currentTurn === "white" ? "black" : "white")) {
      const capturedPiece = board[toRow][toCol]!;
      setCapturedPieces(prev => ({
        ...prev,
        [currentTurn]: [...prev[currentTurn], capturedPiece]
      }));
    }

    let boardToVerify = board

    if (piece.type === "pawn" &&
      lastMove &&
      Math.abs(fromCol - toCol) === 1 &&
      board[toRow][toCol] === null &&
      lastMove.piece.type === "pawn" &&
      Math.abs(lastMove.fromRow - lastMove.toRow) === 2) {
      const newBoardCopy = [...board.map(row => [...row])];
      newBoardCopy[lastMove.toRow][lastMove.toCol] = null;
      const capturedPiece = board[lastMove.toRow][lastMove.toCol]!;
      setCapturedPieces(prev => ({
          ...prev,
          [currentTurn]: [...prev[currentTurn], capturedPiece]
      }));
      boardToVerify = newBoardCopy;
    }

    setLastMove({
      fromRow,
      fromCol,
      toRow,
      toCol,
      piece: board[fromRow][fromCol]!
    });

    const newBoard = movePiece(boardToVerify, fromRow, fromCol, toRow, toCol);
    if (piece?.type === "pawn") {
      if (piece.color === "white" && toRow === 0) {
          newBoard[toRow][toCol] = {
              type: "queen",
              color: "white",
              line: toRow,
              column: toCol
          };
      }
      else if (piece.color === "black" && toRow === 7) {
          newBoard[toRow][toCol] = {
              type: "queen",
              color: "black",
              line: toRow,
              column: toCol
          };
      }
    }
    setBoard(newBoard);

    if (piece.type === 'king') {
      if (piece.color === 'white') {
          setCastlingRights(prev => ({ ...prev, whiteKingMoved: true }));
          if (fromCol === 4 && fromRow === 7) {
              if (toCol === 6) {
                  const rookNewBoard = movePiece(newBoard, 7, 7, 7, 5);
                  setBoard(rookNewBoard);
              } else if (toCol === 2) {
                  const rookNewBoard = movePiece(newBoard, 7, 0, 7, 3);
                  setBoard(rookNewBoard);
              }
          }
      } else {
          setCastlingRights(prev => ({ ...prev, blackKingMoved: true }));
          if (fromCol === 4 && fromRow === 0) {
              if (toCol === 6) {
                  const rookNewBoard = movePiece(newBoard, 0, 7, 0, 5);
                  setBoard(rookNewBoard);
              } else if (toCol === 2) {
                  const rookNewBoard = movePiece(newBoard, 0, 0, 0, 3);
                  setBoard(rookNewBoard);
              }
          }
      }
    } else if (piece.type === 'rook') {
      if (piece.color === 'white') {
          if (fromRow === 7 && fromCol === 0) {
              setCastlingRights(prev => ({ ...prev, whiteRookQueenSideMoved: true }));
          } else if (fromRow === 7 && fromCol === 7) {
              setCastlingRights(prev => ({ ...prev, whiteRookKingSideMoved: true }));
          }
      } else {
          if (fromRow === 0 && fromCol === 0) {
              setCastlingRights(prev => ({ ...prev, blackRookQueenSideMoved: true }));
          } else if (fromRow === 0 && fromCol === 7) {
              setCastlingRights(prev => ({ ...prev, blackRookKingSideMoved: true }));
          }
      }
    }

    setCurrentTurn(currentTurn === "white" ? "black" : "white");

    let newKingRow = -1, newKingCol = -1;
    for (let row = 0; row < newBoard.length; row++) {
      for (let col = 0; col < newBoard[row].length; col++) {
        const square = newBoard[row][col];
        if (square?.type === 'king' && square.color !== currentTurn) {
          newKingRow = row;
          newKingCol = col;
          break;
        }
      }
    }

    console.log("Current turn: ", currentTurn === "white" ? "black" : "white");

    if (isInCheck(newKingRow, newKingCol, newBoard, currentTurn === 'black')) {
      const opposingColor = currentTurn === 'white' ? 'black' : 'white';
      setCheck(opposingColor);
      if (isCheckmate(newKingRow, newKingCol, newBoard, currentTurn === 'black', lastMove, castlingRights)) {
        setCheckmate(opposingColor);
        console.log("Échec et mat !");
      } else {
        console.log("Échec !");
      }
    } else {
      setCheck(null);
      setCheckmate(null);

      if (isInsufficientMaterial(newBoard)) {
        setNullState("insufficient");
        console.log("Match nul par matériel insuffisant !");
        return;
      }

      const nextColor = currentTurn === "white" ? "black" : "white";
      if (isStalemate(newBoard, nextColor)) {
        setNullState("pat");
        console.log("Match nul par pat !");
        return;
      }

      setNullState(null);
    }
  };

  const getPlayerScore = (color: "white" | "black"): number => {
    return capturedPieces[color].reduce((total, piece) => {
      return total + (PIECE_VALUES[piece.type as keyof typeof PIECE_VALUES] || 0);
    }, 0);
  };

  const getScoreDifference = (): number => {
    return getPlayerScore("white") - getPlayerScore("black");
  };

  const isInsufficientMaterial = (board: (Square | null)[][]): boolean => {
    const pieces = {
      white: [] as Square[],
      black: [] as Square[]
    };

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const piece = board[row][col];
        if (piece && piece.type !== 'king') {
          pieces[piece.color].push(piece);
        }
      }
    }

    return pieces.white.length === 0 && pieces.black.length === 0;
  };

  const isStalemate = (board: (Square | null)[][], color: "white" | "black"): boolean => {
    for (let fromRow = 0; fromRow < board.length; fromRow++) {
      for (let fromCol = 0; fromCol < board[fromRow].length; fromCol++) {
        const piece = board[fromRow][fromCol];
        if (piece && piece.color === color) {
          for (let toRow = 0; toRow < board.length; toRow++) {
            for (let toCol = 0; toCol < board[toRow].length; toCol++) {
              if (validateMove(fromRow, fromCol, toRow, toCol, board, lastMove, castlingRights)) {
                const simulatedBoard = movePiece(board, fromRow, fromCol, toRow, toCol);
                let kingRow = -1, kingCol = -1;
                for (let r = 0; r < simulatedBoard.length; r++) {
                  for (let c = 0; c < simulatedBoard[r].length; c++) {
                    const square = simulatedBoard[r][c];
                    if (square?.type === 'king' && square.color === color) {
                      kingRow = r;
                      kingCol = c;
                      break;
                    }
                  }
                }
                if (!isInCheck(kingRow, kingCol, simulatedBoard, color === 'white')) {
                  return false;
                }
              }
            }
          }
        }
      }
    }
    return true;
  };



  return (
    <GameContext.Provider value={{
      board,
      setBoard,
      movePiece: handleMovePiece,
      currentTurn,
      capturedPieces,
      getPlayerScore,
      getScoreDifference,
      check,
      checkmate,
      null_state,
      lastMove,
      castlingRights
    }}>
      {children}
    </GameContext.Provider>
  );
};
