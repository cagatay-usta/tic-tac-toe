const board = (() => {
  let state = [
    ["X", "O", "X"],
    ["X", "O", "X"],
    ["O", "X", "O"],
  ];

  const drawBoard = () => {
    const flatState = state.flat();
    for (let i = 0; i < flatState.length; i++) {
      document.getElementById(i).innerHTML = flatState[i];
    }
  };
  const clearBoard = () => {
    state = state.map((r) => [" ", " ", " "]);
  };
  const updateState = (input, symbol) => {
    if (input.length !== "2") {
      input = input.split("/");
    }
    state[input[0]][input[1]] = symbol;
  };

  const checkValidMove = (input) => {
    if (!input) return false;
    input = input.split("/");
    if (input.length !== 2) return false;
    if (
      +input[0] > 2 ||
      +input[0] < 0 ||
      +input[1] > 2 ||
      +input[1] < 0
    )
      return false;
    return state[input[0]][input[1]] === " " ? true : false;
  };

  // check if the board is either filled or there is 3-in-a-row. return "X" or "O" for win, "draw", or 0 for "not finished"
  const noLegalMoves = () => {
    let s;
    for (let i = 0; i < 2; i++) {
      // check both X and O
      if (i == 0) s = "O";
      if (i == 1) s = "X";

      // check diagonal
      if (
        (state[0][0] == s && state[1][1] == s && state[2][2] == s) ||
        (state[0][2] == s && state[1][1] == s && state[2][0] == s)
      ) {
        return s;
      }
      // check rows
      for (let r = 0; r < 3; r++) {
        if (
          state[r][0] === s &&
          state[r][1] === s &&
          state[r][2] === s
        ) {
          return s;
        }
      }
      // check columns
      for (let c = 0; c < 3; c++) {
        if (
          state[0][c] === s &&
          state[1][c] === s &&
          state[2][c] === s
        ) {
          return s;
        }
      }
    }
    // if state doesnt have any empty spaces return draw, else 0 for "not finished"
    return state.flat().includes(" ") ? 0 : "draw";
  };

  return {
    drawBoard,
    clearBoard,
    checkValidMove,
    noLegalMoves,
    updateState,
  };
})();

const UI = (() => {
  const askPlayerOptions = () => {
    const options = ["X", "Bot"]; // prompt("pick your symbol, X goes first (X/O)", "X") // human or bot?;
    return options;
  };

  const getPlayerInput = (players, e) => {
    let answer = e.target.dataset.cellid;
    if (players.name === "Bot") {
      do {
        answer = player.easyAI();
      } while (!board.checkValidMove(answer));
      return answer;
    }
  };
  
  const updateScores = (players) => {
    const xScore = document.querySelector(".x-score");
    const oScore = document.querySelector(".o-score");
    if (players[0].symbol === "X") {
      xScore.innerHTML = players[0].wins;
      oScore.innerHTML = players[1].wins;
      return;
    } else {
      xScore.innerHTML = players[1].wins;
      oScore.innerHTML = players[0].wins;
    }
  };
  // const DisplayWinScreen

  return { askPlayerOptions, getPlayerInput, updateScores };
})();

const player = (() => {
  let playerCount = 0;
  let name = "Player One";

  // factory function that creates player object depending on the options provided by the player
  const createPlayer = (options) => {
    let symbol = options[0];
    if (playerCount === 1) {
      symbol = options[0] === "X" ? "O" : "X";
      options[1] === "human" ? (name = "Player Two") : (name = "Bot");
    }
    const order = symbol === "X" ? 0 : 1; // 0 goes first, 1 goes second
    playerCount++;

    return { symbol, order, name, wins: 0 };
  };

  const createPlayers = (options) => {
    const playerOne = createPlayer(options);
    const playerTwo = createPlayer(options);
    return [playerOne, playerTwo]; // returns a list of objects
  };

  // returns a random human-like input
  const easyAI = () => {
    let row = Math.floor(Math.random() * 3);
    let col = Math.floor(Math.random() * 3);
    return `${row}/${col}`;
  };

  return { createPlayers, easyAI };
})();

const game = (() => {
  const endRound = (players) => {
    const result = board.noLegalMoves();
    board.drawBoard();
    if (result === "draw") return;
    result === players[0].symbol
      ? players[0].wins++
      : players[1].wins++;

    console.table(players);

    // check if the win conditions met to end the game
    if (players[0].wins === 2 || players[1].wins === 2) {
      players[0].wins > players[1].wins
        ? console.log(`${players[0].name} wins`)
        : console.log(`${players[1].name} wins`);
      UI.updateScores(players);
    } else {
      // else restart the game preserving wins stored in player objects
      game.startGame(options, players);
    }
  };

  const playRound = (players, e) => {
    // check if player move is valid
    if (!board.checkValidMove(e.target.dataset.cellid)) return false;
    let playerInput = e.target.dataset.cellid;
    board.updateState(playerInput, players[0].symbol);
    board.drawBoard();
    // check if the game is over after each move
    if (board.noLegalMoves()) {
      endRound(players);
      return;
    }
    let robotInput = UI.getPlayerInput(players[1], e);
    board.updateState(robotInput, players[1].symbol);
    setTimeout(board.drawBoard, 1000);

    if (board.noLegalMoves()) {
      endRound(players);
    }
  };

  const startGame = (options, players) => {
    board.clearBoard();
    UI.updateScores(players);
    board.drawBoard();
    const clickHandler = (e) => {
      playRound(players, e);
    };
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
      cell.addEventListener("click", clickHandler);
    });
  };

  return { startGame };
})();

const options = UI.askPlayerOptions();
const players = player.createPlayers(options);
game.startGame(options, players);
