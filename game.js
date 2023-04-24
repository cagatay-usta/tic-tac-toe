const board = (() => {
  let state = ["X", "O", "X", "X", "X", "X", "O", "O", "O"];

  const drawBoard = () => {};

  return { drawBoard };
})();

const UI = (() => {
  const askPlayerOptions = () => {
    const options = prompt("pick symbol (X/O)", "X");
    return options;
  };
  return { askPlayerOptions };
})();

const player = (() => {
  let playerCount = 0;
  const createPlayer = (symbol) => {
    if (playerCount === 1) {
      symbol = symbol === "X" ? "O" : "X";
    }
    const order = symbol === "X" ? 1 : 2;
    playerCount++;
    return { symbol, order };
  };

  // maybe deleted and players will be started using createPlayer in game flow so playerOne wont be players.playerOne
  const createPlayers = (options) => {
    const playerOne = createPlayer(options);
    const playerTwo = createPlayer(options);
    return { playerOne, playerTwo };
  };
  return { createPlayers };
})();

const game = (() => {
  const startGame = () => {
    const options = UI.askPlayerOptions();
    const players = player.createPlayers(options);
    console.table(players);
  };
  return { startGame };
})();

game.startGame();
