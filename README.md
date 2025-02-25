# ♟️ Chess2 – The Ultimate Chess Game in React

> *"Never give up, always persevere!"*

## 🚀 About the Project

**Chess2** is a personal challenge and a technical project I developed to showcase my skills and take my **revenge** on an earlier failed attempt at building a chess game. 

At **12 years old**, I created my first chess game with only ([available here soon](https://github.com/RenanYhuel/OldChessProject)) three files: 
- **index.html**
- **style.css**
- **script.js** (which contained a **massive** 1500–2000 lines of unstructured JavaScript 😵).

Although it allowed basic piece movement and turn switching, I soon realized that my **architecture was fundamentally flawed**. It was impossible to properly implement checks, checkmates, or advanced rules. Frustrated, I abandoned the project. But I never forgot it.

Now, at **15 years old**, I took my revenge with **Chess2**, a fully functional and well-structured chess game that supports all the official rules and is designed for future expansion!

## 🎯 Features

✅ **All standard chess rules implemented**  
✅ **En passant** capture  
✅ **Castling (with all conditions checked)**  
✅ **Pawn promotion (automatically to a queen)**  
✅ **Check and checkmate detection**  
✅ **Legal move verification**  
✅ **Smooth drag-and-drop system** with animations (pieces enlarge and follow the mouse)  
✅ **Optimized piece display using Unicode characters** (♙, ♟, ♖, ♜, etc.), instead of images, for better performance and scaling  

## 🛠️ Technologies Used

- **React** with **Vite** 🚀
- **TypeScript** for better code structure
- **CSS** for animations and drag-and-drop effects

## 📂 Code Structure

The project is **modular and optimized**:

📌 **GameContext** → Manages the entire game logic  
📌 **Board.tsx** → Displays the chessboard and handles interactions  
📌 **Square.tsx** → Represents an individual square on the board  
📌 **Piece.tsx** → Displays chess pieces using Unicode characters instead of images  

### 🏗️ Move Validation & Check Detection

📌 **movePiece.ts** → Handles piece movement  
📌 **isInCheck.ts** → Checks if a king is in check or checkmate  
📌 **validateMove.ts** → Validates legal moves using separate files:  
- `validateKnightMove.ts`  
- `validateBishopMove.ts`  
- `validateRookMove.ts`  
- `validateQueenMove.ts`  
- `validateKingMove.ts`  
- `validatePawnMove.ts`  

📌 **canAttackKing.ts** → Checks if a given square is attacked by an opponent’s piece  
📌 **attackKingVerifications/** → Contains files like `bishopAttackKing.ts`, `rookAttackKing.ts`, etc., to determine how each piece type threatens the king  

## 💡 Key Learnings

- **Proper code separation** → Each chess rule has its own file, preventing bloated code
- **Independent functions** → `isInCheck.ts` does not rely on `GameContext`, allowing board simulations for move testing
- **Optimized rendering with Unicode** → Chess symbols scale perfectly without losing quality, improving performance

## 📦 Installation & Running the Project

```sh
git clone https://github.com/TonGitHub/Chess2.git
cd Chess2
npm install
npm run dev
```

➡️ **No backend yet**, but a future version will include WebSockets for multiplayer mode!  

## 🔥 The Biggest Challenge

Starting. Chess has **a huge number of rules and conditions**, which can be overwhelming. But as we say in Brittany:

> *"Once you're in, it's great!"*  

Once you dive into the logic, it becomes an exciting challenge to solve. 

## 💭 Message to Developers

➡️ **Don’t fear big projects—just start!**  
➡️ **Never give up, always persevere.**  

---

### 🎯 Want to improve Chess2?

Feel free to **fork** the repo and submit a **Pull Request** with your improvements! 🚀
