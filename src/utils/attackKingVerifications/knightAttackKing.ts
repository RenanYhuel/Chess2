import { Square } from "../../context/GameContext";

export default function isKnightAttackKing(fromRow: number, fromCol: number, kingRow: number, kingCol: number, board: (Square | null)[][]) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const rowDiff = Math.abs(fromRow - kingRow);
    const colDiff = Math.abs(fromCol - kingCol);

    if ((rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1)) {
        return true;
    }

    return false;
}
