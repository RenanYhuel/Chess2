import { Square } from "../context/GameContext";

export const movePiece = (
    board: (Square | null)[][],
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number
): (Square | null)[][] => {

    const newBoard = structuredClone(board);
    newBoard[toRow][toCol] = newBoard[fromRow][fromCol];
    newBoard[fromRow][fromCol] = null;

    return newBoard;
};
