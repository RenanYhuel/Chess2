import { Square, LastMove, CastlingRights } from '../context/GameContext';
import validateBishopMove from "./movementValidators/validateBishopMove";
import validateKingMove from "./movementValidators/validateKingMove";
import validateKnightMove from "./movementValidators/validateKnightMove";
import validatePawnMove from "./movementValidators/validatePawnMove";
import validateRookMove from "./movementValidators/validateRookMove";

export default function validateMove (fromRow: number, fromCol: number, toRow: number, toCol: number, board: (Square | null)[][], lastMove: LastMove | null, castlingRights: CastlingRights) {
    const piece = board[fromRow][fromCol];
    if(!piece) return false;
    if(fromRow === toRow && fromCol === toCol) return false;
    if(board[toRow][toCol] && board[toRow][toCol]?.color === piece.color) return false;
    switch(piece.type) {
        case 'pawn':
            return validatePawnMove(fromRow, fromCol, toRow, toCol, board, lastMove);
        case 'rook':
            return validateRookMove(fromRow, fromCol, toRow, toCol, board);
        case 'knight':
            return validateKnightMove(fromRow, fromCol, toRow, toCol, board);
        case 'bishop':
            return validateBishopMove(fromRow, fromCol, toRow, toCol, board);
        case 'queen':
            return validateBishopMove(fromRow, fromCol, toRow, toCol, board) || validateRookMove(fromRow, fromCol, toRow, toCol, board);
        case 'king':
            return validateKingMove(fromRow, fromCol, toRow, toCol, board, castlingRights);
        default:
            return false;
    }
}