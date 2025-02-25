import { Square } from "../../context/GameContext";

export default function validateKnightMove(fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Square | null)[][]) {

    const piece = board[fromRow][fromCol];

    if (!piece) return false;

    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    if ((rowDiff === 1 && colDiff === 2) || (rowDiff === 2 && colDiff === 1)) {
        return true;
    }

    return false;
}
