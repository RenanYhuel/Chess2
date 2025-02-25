import { CastlingRights, Square } from "../../context/GameContext";
import isInCheck from "../IsInCheck";
import { movePiece } from "../movePiece";

function canCastle(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    board: (Square | null)[][],
    castlingRights: CastlingRights
): boolean {
    const piece = board[fromRow][fromCol];
    if (!piece || piece.type !== 'king') return false;

    const isWhite = piece.color === 'white';
    const baseRow = isWhite ? 7 : 0;

    if (fromRow !== baseRow || fromCol !== 4 || toRow !== baseRow || (toCol !== 2 && toCol !== 6)) {
        return false;
    }

    if (isWhite && castlingRights.whiteKingMoved || !isWhite && castlingRights.blackKingMoved) {
        return false;
    }

    if (toCol === 6) {
        if (isWhite && castlingRights.whiteRookKingSideMoved || !isWhite && castlingRights.blackRookKingSideMoved) {
            return false;
        }
        if (board[baseRow][5] !== null || board[baseRow][6] !== null) {
            return false;
        }
        if (isInCheck(baseRow, 4, board, isWhite) ||
            isInCheck(baseRow, 5, board, isWhite) ||
            isInCheck(baseRow, 6, board, isWhite)) {
            return false;
        }
        return true;
    }

    if (toCol === 2) {
        if (isWhite && castlingRights.whiteRookQueenSideMoved || !isWhite && castlingRights.blackRookQueenSideMoved) {
            return false;
        }
        if (board[baseRow][1] !== null || board[baseRow][2] !== null || board[baseRow][3] !== null) {
            return false;
        }
        if (isInCheck(baseRow, 4, board, isWhite) ||
            isInCheck(baseRow, 3, board, isWhite) ||
            isInCheck(baseRow, 2, board, isWhite)) {
            return false;
        }
        return true;
    }

    return false;
}

function areKingsAdjacent(kingRow: number, kingCol: number, board: (Square | null)[][]): boolean {
    for (let rowOffset = -1; rowOffset <= 1; rowOffset++) {
        for (let colOffset = -1; colOffset <= 1; colOffset++) {
            if (rowOffset === 0 && colOffset === 0) continue;

            const checkRow = kingRow + rowOffset;
            const checkCol = kingCol + colOffset;

            if (checkRow >= 0 && checkRow < 8 && checkCol >= 0 && checkCol < 8) {
                const square = board[checkRow][checkCol];
                if (square && square.type === 'king' && square.color !== board[kingRow][kingCol]?.color) {
                    return true;
                }
            }
        }
    }
    return false;
}

export default function validateKingMove(
    fromRow: number,
    fromCol: number,
    toRow: number,
    toCol: number,
    board: (Square | null)[][],
    castlingRights: CastlingRights
) {
    const piece = board[fromRow][fromCol];
    if (!piece) return false;

    const isWhite = piece.color === "white";

    const rowDiff = Math.abs(fromRow - toRow);
    const colDiff = Math.abs(fromCol - toCol);

    const simulatedBoard = movePiece(board, fromRow, fromCol, toRow, toCol);

    if (rowDiff <= 1 && colDiff <= 1) {
        if (isInCheck(toRow, toCol, simulatedBoard, isWhite)) {
            return false;
        }
        if (areKingsAdjacent(toRow, toCol, simulatedBoard)) {
            return false;
        }
        return true;
    }

    if (canCastle(fromRow, fromCol, toRow, toCol, board, castlingRights)) {
        return true;
    }

    return false;
}
