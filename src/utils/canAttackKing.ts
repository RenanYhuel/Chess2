import { Square } from "../context/GameContext";
import isBishopAttackKing from "./attackKingVerifications/bishopAttackKing";
import isKnightAttackKing from "./attackKingVerifications/knightAttackKing";
import isPawnAttackKing from "./attackKingVerifications/pawnAttackKing";
import isRookAttackKing from "./attackKingVerifications/rookAttackKing";

export default function canAttackKing(row: number, col: number, kingRow: number, kingCol: number, board: (Square | null)[][]) {
    const piece = board[row][col];
    if(!piece) return false;

    switch(piece.type) {
        case 'pawn':
            return isPawnAttackKing(row, col, kingRow, kingCol, board);
        case 'rook':
            return isRookAttackKing(row, col, kingRow, kingCol, board);
        case 'knight':
            return isKnightAttackKing(row, col, kingRow, kingCol, board);
        case 'bishop':
            return isBishopAttackKing(row, col, kingRow, kingCol, board);
        case 'queen':
            return isBishopAttackKing(row, col, kingRow, kingCol, board) || isRookAttackKing(row, col, kingRow, kingCol, board);
        case 'king':
            return false;
        default:
            return false;
    }
}