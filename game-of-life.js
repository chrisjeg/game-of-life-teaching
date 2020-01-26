const GRID_SIZE = 50; // We define the width and the height of the game here in rows
const MILLISECONDS_BETWEEN_FRAMES = 500;

// Find the elements in the html that we use as the game and the start button
const table = document.getElementById("game-of-life");
const startGameButton = document.getElementById("start-game");

function getCellId(x, y) {
  return `cell-${x}-${y}`;
}

function createGameOfLifeCell(x, y) {
  const cell = document.createElement("td"); // td stands for "table data"
  cell.id = getCellId(x, y);
  cell.className = "dead";
  // When a cell is clicked, it should toggle between dead and alive
  cell.onclick = function() {
    const isAlive = cell.className === "alive";
    cell.className = isAlive ? "dead" : "alive";
  };
  return cell;
}

function calculateRulesForCell(x, y) {
  // Count the living neighbours
  let livingNeighbours = 0;
  for (let neighbourX = x - 1; neighbourX <= x + 1; neighbourX++) {
    for (let neighbourY = y - 1; neighbourY <= y + 1; neighbourY++) {
      const isANeighbour = neighbourX !== x || neighbourY !== y;
      const neighbour = document.getElementById(
        getCellId(neighbourX, neighbourY)
      );
      if (
        isANeighbour &&
        neighbour !== null && // Happens if we are checking an offgrid neighbour
        neighbour.className === "alive"
      ) {
        livingNeighbours++;
      }
    }
  }

  // Work out next state
  const isAlive =
    document.getElementById(getCellId(x, y)).className === "alive";
  const willSurvive = isAlive && livingNeighbours >= 2 && livingNeighbours <= 3;
  const willReproduce = !isAlive && livingNeighbours === 3;
  return willSurvive || willReproduce ? "alive" : "dead";
}

// Look at the grid, calculate the next state and set the grid to that state.
function calculateNextTick() {
  const stateStore = [];
  for (let x = 0; x < GRID_SIZE; x++) {
    stateStore[x] = []; // Create a nested array so we can store cell values
    for (let y = 0; y < GRID_SIZE; y++) {
      stateStore[x][y] = calculateRulesForCell(x, y);
    }
  }

  // We do this in two steps because if we changed values as we went along, the value of the next cell would be calculated incorrectly
  for (let x = 0; x < GRID_SIZE; x++) {
    for (let y = 0; y < GRID_SIZE; y++) {
      document.getElementById(getCellId(x, y)).className = stateStore[x][y];
    }
  }
}

// Build the grid for the game of life
for (let x = 0; x < GRID_SIZE; x++) {
  const row = document.createElement("tr"); // tr stands for "table row"
  for (let y = 0; y < GRID_SIZE; y++) {
    const cell = createGameOfLifeCell(x, y);
    row.appendChild(cell);
  }
  table.appendChild(row);
}

// Create a timer object, so we can create and destroy a timer for the game
let timer;
startGameButton.onclick = () => {
  if (timer) {
    clearInterval(timer);
    timer = null;
    return;
  }
  timer = setInterval(calculateNextTick, MILLISECONDS_BETWEEN_FRAMES);
};
