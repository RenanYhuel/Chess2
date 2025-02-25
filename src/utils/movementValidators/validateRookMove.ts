import { Square } from "../../context/GameContext";

export default function validateRookMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Square | null)[][]) {
    const piece = board[fromRow][fromCol];

    if (piece === null) return false;

    if (toRow === fromRow) {
        for (let col = Math.min(fromCol, toCol) + 1; col < Math.max(fromCol, toCol); col++) {
            if (board[fromRow][col] !== null) return false;
        }
        return true;
    }

    if (toCol === fromCol) {
        for (let row = Math.min(fromRow, toRow) + 1; row < Math.max(fromRow, toRow); row++) {
            if (board[row][fromCol] !== null) return false;
        }
        return true;
    }

    return false;
}
