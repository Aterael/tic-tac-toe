/* eslint-disable react/prop-types */
import { useState } from "react";
import papita from "../papita.png";
import confetti from "canvas-confetti";

const turns = {
	x: "x",
	o: "o",
};

const Square = ({ children, isSelected, updateBoard, index }) => {
	const className = `square ${isSelected ? "is-selected" : ""}`;

	const handleClick = () => {
		updateBoard(index);
	};

	return (
		<>
			<div onClick={handleClick} className={className}>
				{children}
			</div>
		</>
	);
};

const winnerCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6],
];

function App() {
	const [countX, setCountX] = useState(0);
	// const [countX, setCountX] = useState(() => {
	// 	const countXFromStorage = window.localStorage.getItem("countX");

	// 	if (countXFromStorage !== undefined || countXFromStorage !== null) {
	// 		return countXFromStorage;
	// 	} else {
	// 		return 0;
	// 	}
	// });

	// console.log(countX);

	const [countO, setCountO] = useState(0);
	// const [countO, setCountO] = useState(() => {
	// 	const countOFromStorage = window.localStorage.getItem("countO");

	// 	if (countOFromStorage !== undefined || countOFromStorage !== null) {
	// 		return countOFromStorage;
	// 	} else {
	// 		return 0;
	// 	}
	// });

	const [board, setBoard] = useState(() => {
		const boardFromStorage = window.localStorage.getItem("board");

		return boardFromStorage
			? JSON.parse(boardFromStorage)
			: Array(9).fill(null);
	});

	const [turn, setTurn] = useState(() => {
		const turnFromStorage = window.localStorage.getItem("turn");

		return turnFromStorage ?? turns.x;
	});

	const [winner, setWinner] = useState(null);

	const checkWinner = (boardToCheck) => {
		for (const combo of winnerCombos) {
			const [a, b, c] = combo;
			if (
				boardToCheck[a] &&
				boardToCheck[a] === boardToCheck[b] &&
				boardToCheck[a] === boardToCheck[c]
			) {
				return boardToCheck[a];
			}
		}

		return null;
	};

	const resetGame = () => {
		setBoard(Array(9).fill(null));
		setTurn(turns.x);
		setWinner(null);

		window.localStorage.removeItem("board");
		window.localStorage.removeItem("turn");
	};

	const checkEndGame = (newBoard) => {
		return newBoard.every((square) => square !== null);
	};

	const updateBoard = (index) => {
		if (board[index] || winner) return;

		const newBoard = [...board];
		newBoard[index] = turn;
		setBoard(newBoard);

		const newTurn = turn === turns.x ? turns.o : turns.x;
		setTurn(newTurn);

		window.localStorage.setItem("board", JSON.stringify(newBoard));
		window.localStorage.setItem("turn", newTurn);

		const newWinner = checkWinner(newBoard);
		if (newWinner) {
			newWinner === "x" ? setCountX(countX + 1) : setCountO(countO + 1);
			confetti();
			setWinner(newWinner);

			// window.localStorage.setItem("countX", countX);
			// window.localStorage.setItem("countO", countO);
		} else if (checkEndGame(newBoard)) {
			setWinner(false);
		}
	};

	return (
		<main className="board">
			<h1>Tic tac toe</h1>
			<button onClick={resetGame}>Resetear el juego</button>
			<section className="game">
				{board.map((_, index) => {
					return (
						<Square key={index} index={index} updateBoard={updateBoard}>
							{board[index]}
						</Square>
					);
				})}
			</section>

			<section className="turn">
				<Square isSelected={turn === turns.x}>{turns.x}</Square>
				<Square isSelected={turn === turns.o}>{turns.o}</Square>
			</section>

			<section>
				X: {countX} - O: {countO}
			</section>

			{winner !== null && (
				<section className="winner">
					<div className="text">
						<h2>{winner === false ? "Empate" : "Gano"}</h2>

						<header className="win">
							{winner ? (
								<Square>{winner}</Square>
							) : (
								<img className="img" src={papita} alt="papita" />
							)}
						</header>

						<footer>
							<button onClick={resetGame}>Empezar de nuevo</button>
						</footer>
					</div>
				</section>
			)}
		</main>
	);
}

export default App;
