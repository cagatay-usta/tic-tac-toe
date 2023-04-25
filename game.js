const board = (() => {
  let state = [
    ["X", "O", "X"],
    ["X", "O", "X"],
    ["O", "X", "O"],
  ];

  const drawBoard = () => {
    console.table(state);
  };
  const clearBoard = () => {
    state = state.map((r) => [" ", " ", " "]);
  };
  const updateState = (input, symbol) => {
    input = input.split("/");
    state[input[0]][input[1]] = symbol;
  };

  // check if the board is either filled or there is 3-in-a-row. return "X" or "O" for win, "draw", or 0 for "not finished"
  const noLegalMoves = () => {
    for (let s = 0; s < 2; s++) {
      // check both X and O
      s = s === 0 ? "X" : "O";

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

  return { drawBoard, clearBoard, noLegalMoves, updateState };
})();

const UI = (() => {
  const askPlayerOptions = () => {
    const options = "X"; // prompt("pick your symbol, X goes first (X/O)", "X");
    return options;
  };

  const getPlayerInput = (symbol) => {
    let answer = prompt(
      `place your ${symbol}, 0/0 for first cell, 2/2 for last`
    );
    return answer;
  };

  return { askPlayerOptions, getPlayerInput };
})();

const player = (() => {
  let playerCount = 0;
  let name = "Player";

  // factory function that creates player object depending on the options provided by the player
  const createPlayer = (symbol) => {
    if (playerCount === 1) {
      symbol = symbol === "X" ? "O" : "X";
      name = "Computer";
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

  return { createPlayers };
})();

const game = (() => {
  const playRound = (players) => {
    let playOrder = players[0].order;
    board.clearBoard();
    while (!board.noLegalMoves()) {
      console.clear();
      board.drawBoard();
      let input = UI.getPlayerInput(players[playOrder].symbol);
      board.updateState(input, players[playOrder].symbol);
      playOrder = playOrder === 0 ? 1 : 0;
    }
    board.drawBoard();
    console.log(`${board.noLegalMoves()} wins`);
  };

  const startGame = () => {
    const options = UI.askPlayerOptions();
    const players = player.createPlayers(options);
    playRound(players);
  };

  return { startGame };
})();

game.startGame();
