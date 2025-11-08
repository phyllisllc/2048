document.addEventListener('DOMContentLoaded', () => {
    // 游戏常量
    const GRID_SIZE = 4;
    const START_TILES = 2;
    
    // 游戏状态
    let grid = [];
    let score = 0;
    let bestScore = localStorage.getItem('2048-best-score') || 0;
    let totalGames = parseInt(localStorage.getItem('2048-total-games')) || 0;
    let streakCount = parseInt(localStorage.getItem('2048-streak-count')) || 0;
    let maxMoveDistance = parseInt(localStorage.getItem('2048-max-move')) || 0;
    let maxTileValue = parseInt(localStorage.getItem('2048-max-tile')) || 0;
    let gameOver = false;
    let gameWon = false;
    let gameContinued = false;
    
    // DOM 元素
    const gameBoard = document.getElementById('game-board');
    const scoreElement = document.getElementById('score');
    const bestScoreElement = document.getElementById('best-score');
    const gameOverElement = document.getElementById('game-over');
    const gameWonElement = document.getElementById('game-won');
    const newGameButton = document.getElementById('new-game');
    const tryAgainButton = document.getElementById('try-again');
    const continueGameButton = document.getElementById('continue-game');
    const restartGameButton = document.getElementById('restart-game');
    
    // 新加载页和数据看板元素
    const loadingScreen = document.getElementById('loading-screen');
    const loadingBar = document.querySelector('.loading-bar');
    const statsPanel = document.getElementById('stats-panel');
    const showStatsButton = document.getElementById('show-stats');
    const closeStatsButton = document.getElementById('close-stats');
    const totalGamesDisplay = document.getElementById('total-games');
    const statBestScoreDisplay = document.getElementById('stat-best-score');
    const streakCountDisplay = document.getElementById('streak-count');
    const maxMoveDisplay = document.getElementById('max-move');
    const maxTileDisplay = document.getElementById('max-tile');
    
    // 技术水印元素
    const showWatermarkButton = document.getElementById('show-watermark');
    const watermarkModal = document.getElementById('tech-watermark');
    const watermarkCanvas = document.getElementById('watermark-canvas');
    const watermarkCtx = watermarkCanvas.getContext('2d');
    const closeWatermarkButton = document.getElementById('close-watermark');
    const watermarkLoading = document.getElementById('watermark-loading');
    const watermarkLoadingBar = document.querySelector('.watermark-loading-bar');
    
    // 显示加载页面动画
    simulateLoading();
    
    // 初始化游戏
    function startGame() {
        // 初始化游戏
        initGame();
        
        // 更新数据看板显示
        updateStatsPanel();
    }
    

    
    // 模拟加载过程
    function simulateLoading() {
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            loadingBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                // 延迟隐藏加载页
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                        // 开始游戏
                        startGame();
                    }, 1000);
                }, 500);
            }
        }, 20);
    }
    
    // 初始化游戏
    function initGame() {
        // 重置游戏状态
        grid = [];
        score = 0;
        gameOver = false;
        gameWon = false;
        gameContinued = false;
        
        // 更新分数显示
        updateScores();
        
        // 创建空的游戏板
        for (let y = 0; y < GRID_SIZE; y++) {
            grid[y] = [];
            for (let x = 0; x < GRID_SIZE; x++) {
                grid[y][x] = 0;
            }
        }
        
        // 清除游戏板视图
        gameBoard.innerHTML = '';
        
        // 创建游戏格子
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.x = x;
                cell.dataset.y = y;
                gameBoard.appendChild(cell);
            }
        }
        
        // 隐藏游戏结束和游戏获胜界面
        gameOverElement.style.display = 'none';
        gameWonElement.style.display = 'none';
        
        // 生成初始方块
        for (let i = 0; i < START_TILES; i++) {
            generateRandomTile();
        }
    }
    
    // 更新数据看板
    function updateStatsPanel() {
        totalGamesDisplay.textContent = totalGames;
        statBestScoreDisplay.textContent = bestScore;
        streakCountDisplay.textContent = streakCount;
        maxMoveDisplay.textContent = maxMoveDistance;
        maxTileDisplay.textContent = maxTileValue;
    }
    
    // 模拟技术水印加载
    function simulateWatermarkLoading() {
        watermarkLoading.style.display = 'flex';
        watermarkLoading.style.opacity = '1';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += 1;
            watermarkLoadingBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                clearInterval(interval);
                // 延迟隐藏加载页并显示水印
                setTimeout(() => {
                    watermarkLoading.style.opacity = '0';
                    setTimeout(() => {
                        watermarkLoading.style.display = 'none';
                        showWatermark();
                    }, 1000);
                }, 500);
            }
        }, 30);
    }
    
    // 绘制技术水印
    function showWatermark() {
        // 设置canvas大小
        watermarkCanvas.width = 800;
        watermarkCanvas.height = 600;
        
        // 清空画布
        watermarkCtx.clearRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        
        // 绘制背景
        const gradient = watermarkCtx.createLinearGradient(0, 0, 0, watermarkCanvas.height);
        gradient.addColorStop(0, '#0a0e17');
        gradient.addColorStop(1, '#1a1e27');
        watermarkCtx.fillStyle = gradient;
        watermarkCtx.fillRect(0, 0, watermarkCanvas.width, watermarkCanvas.height);
        
        // 绘制3D网格效果
        watermarkCtx.strokeStyle = 'rgba(0, 223, 255, 0.2)';
        watermarkCtx.lineWidth = 1;
        
        // 水平线条
        for (let i = 0; i < 20; i++) {
            watermarkCtx.beginPath();
            watermarkCtx.moveTo(0, i * 30);
            watermarkCtx.lineTo(watermarkCanvas.width, i * 30);
            watermarkCtx.stroke();
        }
        
        // 垂直线条
        for (let i = 0; i < 20; i++) {
            watermarkCtx.beginPath();
            watermarkCtx.moveTo(i * 40, 0);
            watermarkCtx.lineTo(i * 40, watermarkCanvas.height);
            watermarkCtx.stroke();
        }
        
        // 绘制几何图形
        drawGeometricShapes();
        
        // 绘制开发者信息
        watermarkCtx.fillStyle = '#00dfff';
        watermarkCtx.font = 'bold 40px Arial';
        watermarkCtx.textAlign = 'center';
        watermarkCtx.shadowColor = '#00dfff';
        watermarkCtx.shadowBlur = 20;
        watermarkCtx.fillText('Phyllis', watermarkCanvas.width / 2, watermarkCanvas.height / 2);
        
        // 绘制技术信息
        watermarkCtx.fillStyle = '#8884d8';
        watermarkCtx.font = '24px Arial';
        watermarkCtx.fillText('THREE.js RENDER ENGINE', watermarkCanvas.width / 2, watermarkCanvas.height / 2 + 60);
        
        // 绘制版本信息
        watermarkCtx.fillStyle = 'rgba(170, 170, 170, 0.7)';
        watermarkCtx.font = '16px Arial';
        watermarkCtx.fillText('v3.27.0', watermarkCanvas.width / 2, watermarkCanvas.height / 2 + 90);
        
        // 移除阴影
        watermarkCtx.shadowBlur = 0;
        
        // 显示水印模态框
        watermarkModal.style.display = 'flex';
    }
    
    // 绘制几何图形
    function drawGeometricShapes() {
        // 绘制一些随机的几何形状，模拟3D渲染效果
        for (let i = 0; i < 15; i++) {
            const x = Math.random() * watermarkCanvas.width;
            const y = Math.random() * watermarkCanvas.height;
            const size = 10 + Math.random() * 40;
            
            // 随机颜色
            const hue = Math.random() > 0.5 ? '#00dfff' : '#8884d8';
            const alpha = 0.3 + Math.random() * 0.4;
            watermarkCtx.fillStyle = hue + Math.floor(alpha * 255).toString(16).padStart(2, '0');
            
            // 随机形状
            if (Math.random() > 0.5) {
                // 圆形
                watermarkCtx.beginPath();
                watermarkCtx.arc(x, y, size / 2, 0, Math.PI * 2);
                watermarkCtx.fill();
            } else {
                // 方形
                watermarkCtx.fillRect(x - size / 2, y - size / 2, size, size);
            }
        }
        
        // 绘制发光线条
        for (let i = 0; i < 5; i++) {
            const x1 = Math.random() * watermarkCanvas.width;
            const y1 = Math.random() * watermarkCanvas.height;
            const x2 = Math.random() * watermarkCanvas.width;
            const y2 = Math.random() * watermarkCanvas.height;
            
            watermarkCtx.strokeStyle = 'rgba(0, 223, 255, 0.5)';
            watermarkCtx.lineWidth = 2 + Math.random() * 3;
            watermarkCtx.shadowColor = '#00dfff';
            watermarkCtx.shadowBlur = 10;
            
            watermarkCtx.beginPath();
            watermarkCtx.moveTo(x1, y1);
            watermarkCtx.lineTo(x2, y2);
            watermarkCtx.stroke();
            
            watermarkCtx.shadowBlur = 0;
        }
    }
    
    // 记录新游戏并更新统计数据
    function recordNewGame() {
        totalGames++;
        streakCount++;
        localStorage.setItem('2048-total-games', totalGames);
        localStorage.setItem('2048-streak-count', streakCount);
        updateStatsPanel();
    }
    
    // 更新最大方块数值记录
    function updateMaxTileValue() {
        let currentMax = 0;
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] > currentMax) {
                    currentMax = grid[y][x];
                }
            }
        }
        
        if (currentMax > maxTileValue) {
            maxTileValue = currentMax;
            localStorage.setItem('2048-max-tile', maxTileValue);
            updateStatsPanel();
        }
    }
    
    // 生成随机方块
    function generateRandomTile() {
        // 检查是否还有空位置
        const availableCells = [];
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] === 0) {
                    availableCells.push({ x, y });
                }
            }
        }
        
        // 如果没有空位置，返回
        if (availableCells.length === 0) {
            return;
        }
        
        // 随机选择一个空位置
        const randomCell = availableCells[Math.floor(Math.random() * availableCells.length)];
        
        // 90%概率生成2，10%概率生成4
        const value = Math.random() < 0.9 ? 2 : 4;
        
        // 在grid中设置值
        grid[randomCell.y][randomCell.x] = value;
        
        // 创建方块DOM元素
        addTile(randomCell.x, randomCell.y, value);
    }
    
    // 添加方块到视图
    function addTile(x, y, value) {
        const tile = document.createElement('div');
        tile.classList.add('tile', `tile-${value}`, 'tile-new');
        tile.textContent = value;
        
        // 设置方块的位置
        tile.style.left = `${x * (100 / GRID_SIZE)}%`;
        tile.style.top = `${y * (100 / GRID_SIZE)}%`;
        
        // 为方块添加id以便后续操作
        tile.id = `tile-${x}-${y}`;
        
        // 添加到游戏板
        gameBoard.appendChild(tile);
        
        // 移除新方块动画类
        setTimeout(() => {
            tile.classList.remove('tile-new');
        }, 200);
    }
    
    // 更新方块位置
    function updateTilePosition(tile, x, y) {
        tile.style.left = `${x * (100 / GRID_SIZE)}%`;
        tile.style.top = `${y * (100 / GRID_SIZE)}%`;
    }
    
    // 根据移动距离设置振动强度
    function applyVibration(tile, startX, startY, endX, endY) {
        // 计算移动距离
        const distance = Math.max(Math.abs(endX - startX), Math.abs(endY - startY));
        
        // 更新最大移动距离记录
        if (distance > maxMoveDistance) {
            maxMoveDistance = distance;
            localStorage.setItem('2048-max-move', maxMoveDistance);
            updateStatsPanel();
        }
        
        // 根据距离添加不同强度的振动效果
        if (distance === 1) {
            tile.classList.add('vibrate-weak');
        } else if (distance === 2) {
            tile.classList.add('vibrate-medium');
        } else if (distance >= 3) {
            tile.classList.add('vibrate-strong');
        }
        
        // 移除振动类，以便下次移动可以重新添加
        setTimeout(() => {
            tile.classList.remove('vibrate-weak', 'vibrate-medium', 'vibrate-strong');
        }, 300);
    }
    
    // 移动方块
    function moveTiles(direction) {
        let moved = false;
        let hasChanged = false;
        
        // 根据方向确定遍历顺序
        const traverseOrder = getTraverseOrder(direction);
        
        // 重置所有格子的合并状态
        const merged = Array(GRID_SIZE).fill().map(() => Array(GRID_SIZE).fill(false));
        
        // 遍历所有格子
        for (const { x, y } of traverseOrder) {
            // 如果当前格子为空，跳过
            if (grid[y][x] === 0) {
                continue;
            }
            
            // 计算方块在移动方向上的最终位置和是否会与其他方块合并
            const { finalX, finalY, mergedWith } = findFinalPosition(x, y, direction, merged);
            
            // 如果位置发生变化
            if (finalX !== x || finalY !== y) {
                moved = true;
                
                // 更新grid
                grid[finalY][finalX] = grid[y][x];
                
                // 如果合并了，增加分数并更新grid
                if (mergedWith) {
                    grid[finalY][finalX] *= 2;
                    score += grid[finalY][finalX];
                    merged[finalY][finalX] = true;
                    hasChanged = true;
                    
                    // 检查是否获胜
                    if (grid[finalY][finalX] === 2048 && !gameWon) {
                        gameWon = true;
                        gameWonElement.style.display = 'flex';
                    }
                    
                    // 移除被合并的方块
                    const mergedTile = document.getElementById(`tile-${mergedWith.x}-${mergedWith.y}`);
                    if (mergedTile) {
                        mergedTile.classList.add('tile-merged');
                        setTimeout(() => {
                            gameBoard.removeChild(mergedTile);
                        }, 200);
                    }
                } else {
                    hasChanged = true;
                }
                
                // 清空原来的位置
                grid[y][x] = 0;
                
                // 更新视图中的方块位置
                const tile = document.getElementById(`tile-${x}-${y}`);
                if (tile) {
                    // 更新方块id
                    tile.id = `tile-${finalX}-${finalY}`;
                    
                    // 更新方块类
                    if (mergedWith) {
                        tile.classList.remove(`tile-${grid[finalY][finalX] / 2}`);
                        tile.classList.add(`tile-${grid[finalY][finalX]}`, 'tile-merged');
                        tile.textContent = grid[finalY][finalX];
                        setTimeout(() => {
                            tile.classList.remove('tile-merged');
                        }, 200);
                    }
                    
                    // 应用振动效果
                    applyVibration(tile, x, y, finalX, finalY);
                    
                    // 移动方块
                    updateTilePosition(tile, finalX, finalY);
                }
            }
        }
        
        // 如果有移动，生成新方块
        if (moved) {
            // 给整个游戏板添加轻微振动效果
            gameBoard.classList.add('vibrate-weak');
            setTimeout(() => {
                gameBoard.classList.remove('vibrate-weak');
                generateRandomTile();
                updateScores();
                
                // 更新最大方块数值
                updateMaxTileValue();
                
                // 检查游戏是否结束
                if (!hasMovesAvailable() && !gameOver) {
                    gameOver = true;
                    gameOverElement.style.display = 'flex';
                }
            }, 200);
        }
        
        return moved;
    }
    
    // 获取遍历顺序
    function getTraverseOrder(direction) {
        const order = [];
        
        switch (direction) {
            case 'up':
                for (let x = 0; x < GRID_SIZE; x++) {
                    for (let y = 1; y < GRID_SIZE; y++) {
                        order.push({ x, y });
                    }
                }
                break;
            case 'down':
                for (let x = 0; x < GRID_SIZE; x++) {
                    for (let y = GRID_SIZE - 2; y >= 0; y--) {
                        order.push({ x, y });
                    }
                }
                break;
            case 'left':
                for (let y = 0; y < GRID_SIZE; y++) {
                    for (let x = 1; x < GRID_SIZE; x++) {
                        order.push({ x, y });
                    }
                }
                break;
            case 'right':
                for (let y = 0; y < GRID_SIZE; y++) {
                    for (let x = GRID_SIZE - 2; x >= 0; x--) {
                        order.push({ x, y });
                    }
                }
                break;
        }
        
        return order;
    }
    
    // 找到方块移动后的最终位置
    function findFinalPosition(x, y, direction, merged) {
        let finalX = x;
        let finalY = y;
        let mergedWith = null;
        
        while (true) {
            let nextX = finalX;
            let nextY = finalY;
            
            // 计算下一步位置
            switch (direction) {
                case 'up':
                    nextY--;
                    break;
                case 'down':
                    nextY++;
                    break;
                case 'left':
                    nextX--;
                    break;
                case 'right':
                    nextX++;
                    break;
            }
            
            // 检查是否超出边界
            if (nextX < 0 || nextX >= GRID_SIZE || nextY < 0 || nextY >= GRID_SIZE) {
                break;
            }
            
            // 如果下一个位置为空，继续移动
            if (grid[nextY][nextX] === 0) {
                finalX = nextX;
                finalY = nextY;
            }
            // 如果下一个位置的方块值相同且未被合并，进行合并
            else if (grid[nextY][nextX] === grid[y][x] && !merged[nextY][nextX]) {
                finalX = nextX;
                finalY = nextY;
                mergedWith = { x: nextX, y: nextY };
                break;
            }
            // 如果下一个位置有不同值的方块，无法继续移动
            else {
                break;
            }
        }
        
        return { finalX, finalY, mergedWith };
    }
    
    // 检查是否还有可用移动
    function hasMovesAvailable() {
        // 检查是否有空位置
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                if (grid[y][x] === 0) {
                    return true;
                }
            }
        }
        
        // 检查是否有相邻的相同值方块
        for (let y = 0; y < GRID_SIZE; y++) {
            for (let x = 0; x < GRID_SIZE; x++) {
                const value = grid[y][x];
                
                // 检查右侧
                if (x < GRID_SIZE - 1 && grid[y][x + 1] === value) {
                    return true;
                }
                
                // 检查下方
                if (y < GRID_SIZE - 1 && grid[y + 1][x] === value) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    // 更新分数显示
    function updateScores() {
        scoreElement.textContent = score;
        
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('2048-best-score', bestScore);
        }
        
        bestScoreElement.textContent = bestScore;
    }
    
    // 处理键盘输入
    function handleKeyPress(e) {
        // 如果游戏结束且未继续，不响应输入
        if (gameOver || (gameWon && !gameContinued)) {
            return;
        }
        
        let moved = false;
        
        switch (e.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                moved = moveTiles('up');
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                moved = moveTiles('down');
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                moved = moveTiles('left');
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                moved = moveTiles('right');
                break;
        }
        
        // 如果有移动，阻止默认行为
        if (moved) {
            e.preventDefault();
        }
    }
    
    // 处理触摸滑动
    function handleTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        
        gameBoard.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, false);
        
        gameBoard.addEventListener('touchend', (e) => {
            // 如果游戏结束且未继续，不响应输入
            if (gameOver || (gameWon && !gameContinued)) {
                return;
            }
            
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            
            // 计算滑动方向
            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;
            
            // 确保滑动距离足够大
            if (Math.abs(dx) > 20 || Math.abs(dy) > 20) {
                // 判断是水平滑动还是垂直滑动
                if (Math.abs(dx) > Math.abs(dy)) {
                    // 水平滑动
                    if (dx > 0) {
                        moveTiles('right');
                    } else {
                        moveTiles('left');
                    }
                } else {
                    // 垂直滑动
                    if (dy > 0) {
                        moveTiles('down');
                    } else {
                        moveTiles('up');
                    }
                }
            }
        }, false);
    }
    
    // 事件监听器
    document.addEventListener('keydown', handleKeyPress);
    handleTouchEvents();
    
    // 按钮事件
    newGameButton.addEventListener('click', () => {
        recordNewGame();
        initGame();
    });
    
    tryAgainButton.addEventListener('click', () => {
        recordNewGame();
        initGame();
    });
    
    restartGameButton.addEventListener('click', () => {
        recordNewGame();
        initGame();
    });
    
    continueGameButton.addEventListener('click', () => {
        gameContinued = true;
        gameWonElement.style.display = 'none';
    });
    
    // 数据看板按钮事件
    showStatsButton.addEventListener('click', () => {
        statsPanel.style.display = 'block';
    });
    
    // 关闭数据看板按钮点击事件
    closeStatsButton.addEventListener('click', () => {
        statsPanel.style.display = 'none';
    });
    
    // 技术水印按钮点击事件
    showWatermarkButton.addEventListener('click', () => {
        simulateWatermarkLoading();
    });
    
    // 关闭技术水印按钮点击事件
    closeWatermarkButton.addEventListener('click', () => {
        watermarkModal.style.display = 'none';
    });
    
    // 点击水印模态框外部关闭
    watermarkModal.addEventListener('click', (e) => {
        if (e.target === watermarkModal) {
            watermarkModal.style.display = 'none';
        }
    });
    
    // 点击数据看板外部关闭
    statsPanel.addEventListener('click', (e) => {
        if (e.target === statsPanel) {
            statsPanel.style.display = 'none';
        }
    });
    
    // 初始化数据看板显示
    updateStatsPanel();
});