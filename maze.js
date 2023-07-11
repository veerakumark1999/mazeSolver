let maze = [];
let startRow, startCol, goalRow, goalCol;

// Show the maze on the web page
function showMaze() {
    const fileInput = document.getElementById('mazeInput');
    const mazeContainer = document.getElementById('mazeContainer');
    mazeContainer.innerHTML = '';

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const contents = e.target.result;
        maze = contents.split('\n').map(row => row.trim().split(''));

        renderMaze();
        startRow = getStartRow();
        startCol = getStartCol();
        goalRow = getGoalRow();
        goalCol = getGoalCol();
        solveMaze();
    };

    reader.readAsText(file);
}

// Render the maze on the web page
function renderMaze() {
    const mazeContainer = document.getElementById('mazeContainer');
    mazeContainer.innerHTML = '';

    for (let i = 0; i < maze.length; i++) {
        const row = document.createElement('div');
        row.className = 'maze-row';

        for (let j = 0; j < maze[i].length; j++) {
            const cell = document.createElement('div');
            cell.className = 'maze-cell';

            if (maze[i][j] === '1') {
                cell.style.backgroundColor = 'black';
            } else if (maze[i][j] === 'S') {
                cell.className += ' start';
            } else if (maze[i][j] === 'G') {
                cell.className += ' goal';
            }

            row.appendChild(cell);
        }

        mazeContainer.appendChild(row);
    }
}

// Find the starting row index
function getStartRow() {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'S') {
                return i;
            }
        }
    }
}

// Find the starting column index
function getStartCol() {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'S') {
                return j;
            }
        }
    }
}

// Find the goal row index
function getGoalRow() {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'G') {
                return i;
            }
        }
    }
}

// Find the goal column index
function getGoalCol() {
    for (let i = 0; i < maze.length; i++) {
        for (let j = 0; j < maze[i].length; j++) {
            if (maze[i][j] === 'G') {
                return j;
            }
        }
    }
}

// Solve the maze using depth-first search
function solveMaze() {
    const path = findPath(startRow, startCol, []);
    highlightPath(path);
}

// Find the path from the starting point to the goal using depth-first search
function findPath(row, col, path) {
    if (row < 0 || row >= maze.length || col < 0 || col >= maze[0].length || maze[row][col] === '1') {
        return null; // Invalid path or wall encountered
    }

    if (row === goalRow && col === goalCol) {
        return path.concat([[row, col]]); // Goal reached, return the path
    }

    if (maze[row][col] === 'V') {
        return null; // Already visited this cell, avoid infinite loop
    }

    maze[row][col] = 'V'; // Mark cell as visited

    const neighbors = [
        [row - 1, col], // Up
        [row, col + 1], // Right
        [row + 1, col], // Down
        [row, col - 1]  // Left
    ];

    for (let neighbor of neighbors) {
        const pathResult = findPath(neighbor[0], neighbor[1], path.concat([[row, col]]));
        if (pathResult) {
            return pathResult; // Path found
        }
    }

    return null; // No valid path found
}

// Highlight the path on the maze
function highlightPath(path) {
    if (!path) {
        alert('No valid path found!');
        return;
    }

    let step = 0;
    const interval = setInterval(function () {
        if (step >= path.length) {
            clearInterval(interval);
            return;
        }

        const row = path[step][0];
        const col = path[step][1];
        const cell = document.getElementsByClassName('maze-row')[row].children[col];
        cell.className += ' path';

        step++;
    }, 1000);
}
