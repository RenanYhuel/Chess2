import { Square } from "../../context/GameContext";

export default function isBishopAttackKing(fromRow: number, fromCol: number, kingRow: number, kingCol: number, board: (Square | null)[][]) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    if (Math.abs(fromRow - kingRow) !== Math.abs(fromCol - kingCol)) {
        return false;
    }

    const rowDirection = kingRow > fromRow ? 1 : -1;
    const colDirection = kingCol > fromCol ? 1 : -1;

    let currentRow = fromRow + rowDirection;
    let currentCol = fromCol + colDirection;


    while (currentRow !== kingRow && currentCol !== kingCol) {
        if (board[currentRow][currentCol]) {
            return false;
        }
        currentRow += rowDirection;
        currentCol += colDirection;
    }

    return true;
}
