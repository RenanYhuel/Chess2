import { LastMove, Square } from "../../context/GameContext";

export default function validatePawnMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Square | null)[][], lastMove: LastMove | null) {
    const piece = board[fromRow][fromCol];
    const target = board[toRow][toCol];

    if (!piece) return false;

    const isWhite = piece.color === "white";
    const direction = isWhite ? -1 : 1;
    const startingRow = isWhite ? 6 : 1;

    if (toCol === fromCol && target === null) {
        if ((toRow === fromRow + direction) || (fromRow === startingRow && toRow === fromRow + 2 * direction)) {
            return true;
        }
    }
    else if ((toCol === fromCol + 1 || toCol === fromCol - 1) && target !== null && (toRow === fromRow + direction)) {
        return true;
    }

    else if (lastMove &&
            lastMove.piece.type === "pawn" &&
            Math.abs(lastMove.fromRow - lastMove.toRow) === 2 &&
            lastMove.toRow === fromRow &&
            Math.abs(lastMove.toCol - fromCol) === 1 &&
            toRow === fromRow + direction &&
            toCol === lastMove.toCol) {
        return true;
    }

    return false;
}