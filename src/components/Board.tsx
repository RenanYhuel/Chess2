import React, { useContext, useState } from "react";
import { GameContext, Square } from "../context/GameContext";
import SquareComponent from "./Square";
import Piece from "./Piece";

const Board: React.FC = () => {
    const context = useContext(GameContext);
    if (!context) throw new Error("GameContext must be used within a GameProvider");

    const { board, movePiece, currentTurn, capturedPieces, getScoreDifference, check, checkmate, null_state } = context;
    const [draggedPiece, setDraggedPiece] = useState<Square | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ row: number; col: number } | null>(null);
    const [mousePosition, setMousePosition] = useState<{ x: number; y: number } | null>(null);
    const [hoveredSquare, setHoveredSquare] = useState<{ row: number; col: number } | null>(null);

    const handleMouseDown = (e: React.MouseEvent, row: number, col: number) => {
        const piece = board[row][col];
        if (piece) {
            setDraggedPiece(piece);
            setDraggedPosition({ row, col });
            setMousePosition({ x: e.clientX, y: e.clientY });
        }
    };

    const handleMouseUp = (row: number, col: number) => {
        if (draggedPiece && draggedPosition) {
            movePiece(draggedPosition.row, draggedPosition.col, row, col);
            resetDragState();
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!draggedPiece) return;
        setMousePosition({ x: e.clientX, y: e.clientY });
        const rect = e.currentTarget.getBoundingClientRect();
        setHoveredSquare({
            row: Math.floor((e.clientY - rect.top) / 100),
            col: Math.floor((e.clientX - rect.left) / 100),
        });
    };

    const resetDragState = () => {
        setDraggedPiece(null);
        setDraggedPosition(null);
        setMousePosition(null);
        setHoveredSquare(null);
    };

    return (
        <div className="container" style={{
            display: "flex",
            gap: "2rem",
            padding: "2rem",
            alignItems: "flex-start"
        }}>
            <div
                style={{ display: "grid", gridTemplateColumns: "repeat(8, 1fr)", width: "800px", height: "800px", position: "relative" }}
                onMouseMove={handleMouseMove}
            >
                {board.map((row, rowIndex) =>
                    row.map((square, colIndex) => (
                        <div key={`${rowIndex}-${colIndex}`} onMouseUp={() => handleMouseUp(rowIndex, colIndex)} style={{ position: "relative", filter: hoveredSquare?.row === rowIndex && hoveredSquare?.col === colIndex ? "blur(3px)" : "none"}}>
                            <SquareComponent
                                row={rowIndex}
                                col={colIndex}
                                square={square}
                                onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                                isDragged={!!draggedPiece && draggedPosition?.row === rowIndex && draggedPosition?.col === colIndex}
                                isHidden={!!draggedPiece && draggedPosition?.row === rowIndex && draggedPosition?.col === colIndex}
                            />
                        </div>
                    ))
                )}
                {draggedPiece && mousePosition && (
                    <Piece
                        type={draggedPiece.type}
                        color={draggedPiece.color}
                        isDragged={true}
                        style={{ position: "absolute", left: mousePosition.x - 75, top: mousePosition.y - 75, pointerEvents: "none", cursor: "pointer" }}
                    />
                )}
            </div>
            <div className="game-details" style={{
                backgroundColor: "#f5f5f5",
                padding: "2rem",
                borderRadius: "8px",
                width: "100%",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)"
            }}>
                <h2 style={{
                    textAlign: "center",
                    marginBottom: "1.5rem",
                    color: "#333",
                    borderBottom: `4px solid ${currentTurn === "black" ? "#000" : "#fff"}`,
                    paddingBottom: "0.5rem"
                }}>
                    {currentTurn === "white" ? "White's turn" : "Black's turn"}
                </h2>

                <div style={{ marginBottom: "2rem" }}>
                    <h3 style={{ marginBottom: "1rem" }}>Captured Pieces</h3>
                    <div style={{ marginBottom: "1.5rem" }}>
                        <h4 style={{ marginBottom: "0.5rem" }}>White's captures:</h4>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            minHeight: "40px",
                            padding: "0.5rem",
                            backgroundColor: "#fff",
                            borderRadius: "4px"
                        }}>
                            {capturedPieces.white.map((piece, index) => (
                                <Piece
                                    key={index}
                                    type={piece.type}
                                    color={piece.color}
                                    style={{ width: "10px !important", height: "10px !important" }}
                                />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: "0.5rem" }}>Black's captures:</h4>
                        <div style={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: "0.5rem",
                            minHeight: "40px",
                            padding: "0.5rem",
                            backgroundColor: "#fff",
                            borderRadius: "4px"
                        }}>
                            {capturedPieces.black.map((piece, index) => (
                                <Piece
                                    key={index}
                                    type={piece.type}
                                    color={piece.color}
                                    style={{ width: "10px !important", height: "10px !important" }}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {getScoreDifference() !== 0 && (
                    <div style={{
                        textAlign: "center",
                        padding: "1rem",
                        backgroundColor: "#e8e8e8",
                        borderRadius: "4px",
                        marginTop: "1rem"
                    }}>
                        <p style={{
                            fontWeight: "bold",
                            color: getScoreDifference() > 0 ? "#000" : "#333"
                        }}>
                            {getScoreDifference() > 0 ? "White" : "Black"} is winning by{" "}
                            <span style={{ color: "#d32f2f" }}>
                                +{Math.abs(getScoreDifference())} points
                            </span>
                        </p>
                    </div>
                )}
                {(check || checkmate) && (
                    <div style={{
                        textAlign: "center",
                        padding: "1rem",
                        backgroundColor: "#ff000020",
                        borderRadius: "4px",
                        marginBottom: "1.5rem",
                        border: "2px solid #ff0000"
                    }}>
                        {checkmate ? (
                            <p style={{
                                fontWeight: "bold",
                                color: "#d32f2f",
                                fontSize: "1.2rem"
                            }}>
                                Checkmate! {checkmate === "white" ? "The white king" : "The black king"} has lost!
                            </p>
                        ) : check && (
                            <p style={{
                                fontWeight: "bold",
                                color: "#d32f2f"
                            }}>
                                Check! {check === "white" ? "The white king" : "The black king"} is in danger!
                            </p>
                        )}
                    </div>
                )}
                {null_state && (
                    <div style={{
                        textAlign: "center",
                        padding: "1rem",
                        backgroundColor: "#4A90E220",
                        borderRadius: "4px",
                        marginBottom: "1.5rem",
                        border: "2px solid #4A90E2"
                    }}>
                        <p style={{
                            fontWeight: "bold",
                            color: "#4A90E2",
                            fontSize: "1.2rem"
                        }}>
                            {null_state === "pat" && "Draw by stalemate! No legal moves are possible."}
                            {null_state === "insufficient" && "Draw! Only kings remain on the board."}
                            {null_state === "stalemate" && "Draw by stalemate! The player cannot move anymore."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Board;