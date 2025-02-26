const rows = 10;
const cols = 10;
const colors = ["red", "blue", "green", "yellow", "purple"];
const board = [];
const gameBoard = document.getElementById("game-board");
let score = 0;
const scoreDisplay = document.getElementById("score");

let selectedCell = null; // 记录玩家选择的方块

// 生成游戏网格
function createBoard() {
    for (let r = 0; r < rows; r++) {
        board[r] = [];
        for (let c = 0; c < cols; c++) {
            let color = getRandomColor();
            board[r][c] = color;
            let cell = document.createElement("div");
            cell.classList.add("cell");
            cell.style.backgroundColor = color;
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.addEventListener("click", () => handleCellClick(r, c)); // 绑定点击事件
            gameBoard.appendChild(cell);
        }
    }
}

// 获取随机颜色
function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

// 处理方块点击
function handleCellClick(r, c) {
    let clickedCell = document.querySelector(`[data-row="${r}"][data-col="${c}"]`);

    if (!selectedCell) {
        selectedCell = clickedCell;
        selectedCell.style.border = "2px solid white"; // 高亮选中
    } else {
        let r1 = parseInt(selectedCell.dataset.row);
        let c1 = parseInt(selectedCell.dataset.col);

        // 确保相邻才能交换
        if ((Math.abs(r1 - r) === 1 && c1 === c) || (Math.abs(c1 - c) === 1 && r1 === r)) {
            swapCells(r1, c1, r, c);
            setTimeout(() => {
                if (!checkAndClear()) {
                    swapCells(r1, c1, r, c); // 如果没有匹配，复原
                }
            }, 200);
        }

        selectedCell.style.border = "none"; // 取消高亮
        selectedCell = null;
    }
}

// 交换两个方块
function swapCells(r1, c1, r2, c2) {
    [board[r1][c1], board[r2][c2]] = [board[r2][c2], board[r1][c1]];
    updateBoard();
}

// 检测是否有可消除的方块
function checkAndClear() {
    let toClear = new Set();

    // 水平检测
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols - 2; c++) {
            if (board[r][c] && board[r][c] === board[r][c + 1] && board[r][c] === board[r][c + 2]) {
                toClear.add(`${r}-${c}`);
                toClear.add(`${r}-${c+1}`);
                toClear.add(`${r}-${c+2}`);
            }
        }
    }

    // 垂直检测
    for (let r = 0; r < rows - 2; r++) {
        for (let c = 0; c < cols; c++) {
            if (board[r][c] && board[r][c] === board[r+1][c] && board[r][c] === board[r+2][c]) {
                toClear.add(`${r}-${c}`);
                toClear.add(`${r+1}-${c}`);
                toClear.add(`${r+2}-${c}`);
            }
        }
    }

    if (toClear.size > 0) {
        score += toClear.size; // 增加积分
        updateScore();
        toClear.forEach(pos => {
            let [x, y] = pos.split("-").map(Number);
            board[x][y] = null; // 清空方块
        });
        updateBoard();
        setTimeout(dropBlocks, 200);
        return true;
    }

    return false;
}

// 更新 UI
function updateBoard() {
    document.querySelectorAll(".cell").forEach(cell => {
        let r = cell.dataset.row;
        let c = cell.dataset.col;
        cell.style.backgroundColor = board[r][c] || "white"; // 为空时显示白色
    });
}

// 方块掉落
function dropBlocks() {
    for (let c = 0; c < cols; c++) {
        let emptyCount = 0;
        for (let r = rows - 1; r >= 0; r--) {
            if (board[r][c] === null) {
                emptyCount++;
            } else if (emptyCount > 0) {
                board[r + emptyCount][c] = board[r][c];
                board[r][c] = null;
            }
        }
        // 顶部填充新的方块
        for (let r = 0; r < emptyCount; r++) {
            board[r][c] = getRandomColor();
        }
    }
    updateBoard();
    setTimeout(checkAndClear, 200);
}

// 更新积分显示
function updateScore() {
    scoreDisplay.textContent = score;
}

// 初始化游戏
createBoard();