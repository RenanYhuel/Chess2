import { Square } from "../../context/GameContext";

export default function validateBishopMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Square | null)[][]) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    if (Math.abs(fromRow - toRow) !== Math.abs(fromCol - toCol)) {
        return false;
    }

    const rowDirection = toRow > fromRow ? 1 : -1;
    const colDirection = toCol > fromCol ? 1 : -1;

    let currentRow = fromRow + rowDirection;
    let currentCol = fromCol + colDirection;

    while (currentRow !== toRow && currentCol !== toCol) {
        if (board[currentRow][currentCol]) {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }

    return true;
}
