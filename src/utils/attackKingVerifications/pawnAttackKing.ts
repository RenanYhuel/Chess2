import { Square } from "../../context/GameContext";

export default function isPawnAttackKing(row: number, col: number, kingRow: number, kingCol: number, board: (Square | null)[][]) {
    const piece = board[row][col];
    if (!piece) return false;

    const isWhite = piece.color === 'white';
    const attackRow = isWhite ? row - 1 : row + 1;

    return (
        attackRow === kingRow && (col - 1 === kingCol || col + 1 === kingCol)
    );
}
