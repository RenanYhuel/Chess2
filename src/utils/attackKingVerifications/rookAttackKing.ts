import { Square } from "../../context/GameContext";

export default function isRookAttackKing(fromRow: number, fromCol: number, kingRow: number, kingCol: number, board: (Square | null)[][]) {
    const piece = board[fromRow][fromCol];
    if (piece === null) return false;

    if (kingRow === fromRow) {
        for (let col = Math.min(fromCol, kingCol) + 1; col < Math.max(fromCol, kingCol); col++) {
            if (board[fromRow][col] !== null) return false;
        }
        return true;
    }

    if (kingCol === fromCol) {
        for (let row = Math.min(fromRow, kingRow) + 1; row < Math.max(fromRow, kingRow); row++) {
            if (board[row][fromCol] !== null) return false;
        }
        return true;
    }

    return false;
}
