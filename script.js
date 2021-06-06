let origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';

let hcw = false;

const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]


const cells = document.querySelectorAll('.cell');

const startGame = () => {
    hcw = false;
    document.querySelector('.endGame').style.display = "none";
    origBoard = Array.from(Array(9).keys());

    for(let i = 0;i<cells.length;i++)
    {
        cells[i].innerText = "";
        cells[i].style.removeProperty('background-color');
        cells[i].addEventListener('click',turnClick, false);
    }
}

const turnClick = (event) => {

    if(typeof origBoard[event.target.id]  == 'number')
    {
        turn(event.target.id, huPlayer);

        if(!checkTie() && !hcw)
        {
            turn(bestSpot(), aiPlayer);
        }
    }

}

const turn = (squareId, player) => {

    origBoard[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(origBoard, player);
    
    if(gameWon)
    {
        hcw = true; 
        gameOver(gameWon)
    }
}


const checkWin = (board, player) => {

    let plays = board.reduce((a,e,i) => 
        e === player ? a.concat(i): a, []);
    
    let gameWon = null;

    for(let[index, win] of winCombos.entries()) {
        if(win.every(elem => plays.indexOf(elem) > -1))
        {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

const gameOver = (gameWon) => {

    for(let index of winCombos[gameWon.index])
    {
        cells[index].style.backgroundColor = "rgba(205, 133, 63, 0.8)";
    }

    for(let cell of cells)
    {
        cell.removeEventListener('click', turnClick, false);
    }

    declareWinner(gameWon.player === huPlayer? "YOU WIN!": "YOU LOSE!");

}


const checkTie = () => {
    
    if(!hcw)
    {
        if(emptySquares(origBoard).length > 0)
            return false

        for(let cell of cells)
        {
            cell.style.backgroundColor = "#bd7";
            cell.removeEventListener('click', turnClick, false);
            declareWinner("TIE GAME!");
        }
        return true;
    }
    return false;
}

const declareWinner = (text) => {
    const endGame = document.querySelector('.endGame');
    endGame.style.display = "block";
    endGame.innerText = text;
}

const bestSpot = () => {
    let t = minimax(origBoard, aiPlayer).index;
    console.log(t);
    return t;
}

const minimax = (newBoard, player) => {
    
    let availSpots = emptySquares(newBoard);

    if(checkWin(newBoard, huPlayer)){
        return {score: -10};
    } else if(checkWin(newBoard, aiPlayer)) {
        return {score: 20};
    } else if(availSpots.length === 0)
        return {score: 0};
    
    let moves = [];

    for(let spot of availSpots)
    {
        let move = {};
        move.index = newBoard[spot];
        newBoard[spot] = player;

        if(player == aiPlayer)
        {
            let result = minimax(newBoard, huPlayer);
            move.score = result.score;
        }
        else
        {
            let result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[spot] = move.index;
        moves.push(move);
    }

    let bestMove;

    if(player === aiPlayer)
    {
        let bestScore = -10000;

        moves.forEach((move, index) => {

            if(move.score > bestScore)
            {
                bestScore = move.score;
                bestMove = index;
            }

        });
    }
    else
    {
        let bestScore = 10000;

        moves.forEach((move, index) => {

            if(move.score < bestScore)
            {
                bestScore = move.score;
                bestMove = index;
            }

        });
    }

    return moves[bestMove];

}

const emptySquares = (board) => {
    return board.filter(point => typeof point == 'number');
}

startGame();