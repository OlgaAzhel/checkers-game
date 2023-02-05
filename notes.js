
cellState = {
    blue: 1,
    yellow: -1,
    blueKing: 2,
    yellowKnig: -2,
    active: 'a',
    sleeping: 's'
}

player1 = {
    color: 'blue'
}

player1 = {
    color: 'yellow'
}

turn = -1


// need for guard option -  an array of cells divs only
let cells = [...document.querySelectorAll('#board > div')]
// This event listener should be set up on array of els returned from  findActivPieces()
document.getElementById('board').addEventListener('click', allowedMoves)


function allowedMoves(evt) {
    console.log(evt.target)
    // calculate active cells for the picked piece

    // Guard
    if (cells.indexOf(evt.target) === -1 || evt.target.getAttribute('id') === 'board') return
    // Extracting nesessary indexes from element's html id attribute
    let currentElId = evt.target.getAttribute('id')
    // Since all ids are string of format rXcY having length = 4, we can access their X for row and Y for col
    let curRowIdx = parseInt(currentElId[1])
    let curColIdx = parseInt(currentElId[3])
    console.log("This is current cell coordinates:", curRowIdx, curColIdx)
// if current board cell has value 1 or -1
    if (board[curRowIdx][curColIdx] === turn) {
        console.log("this is regular piece's move",)
        let availableMoves = []
        // for being open for the move cell must be empty, be on a next row and have column value +1 and -1 from current:
        //index of the next row in the board array:
        let checkRow = curRowIdx + turn

        // creating an array of two possible for move cells to check 
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        // saving these cells' ids
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        console.log("checking row...", checkCellsIds, checkCellsVals)

        // filtering the array to find a cell that has a value 0 and pushing into available moves
        checkCellsVals.map((cell, idx) => {
            if (cell === 0) {
                availableMoves.push(checkCellsIds[idx])
            }
        })
        // if any of check cells has value of opposite player call function to check for a mandatory jump
        
        console.log(availableMoves)
        // else if () {}for being open for the jump cell must:
        // have row number: current +=turn *2
        // have col number: currentCol + 2 and current col -2
        // board indexOf for all possible cells must be !== -1

    }

    // // if current board cell has value 2 or -2 (King) 
    // if (board[curRowIdx * 2][curColIdx * 2] === turn) {

    // }
    //return array of allowed elemnts' ids
}

let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 1, 0, 0, 0, 1],
    [-1,0,-1, 0,-1, 0,-1, 0],
    [0,-1, 0,-1, 0,-1, 0,-1],
    [-1,0,-1, 0,-1, 0,-1, 0]
]

let cellsToCheck = ['r5c6', 'r5c2']
function mandatoryJump(array) {
    // function have to check if any mandatory jumps must be made 
    // different behavior for regular and kings pieces
    
    let mandatoryJumps = []
    for (let i = 0; i < array.length; i++){
        let curRowIdx = parseInt(array[i][1])
        let curColIdx = parseInt(array[i][3])
        // checking for type of piece
        if (board[curRowIdx][curColIdx] === turn) {
            console.log("this is regular piece's JUMP", array[i])
            //check if any diagonal cells next to current occupied by another player, and if diagonal cells next to them are empty
            let checkRow = curRowIdx + turn
            let checkRowIfEmpty = curRowIdx + (2 * turn)
            let checkOppCells = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx -1]]
            let checkOppIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
            // Check for emptyness only direction/-s with cells that have value of opposit player
            // create array with indexes to check. Will apply these indexes on OP's cells and relevant empty on same index - same direction
            let checkCellsIfEmpty = []
            checkOppCells.forEach((el,idx) => {
                if (el === turn * -1) {
                    checkCellsIfEmpty.push(idx)
                }
            })
            console.log(checkCellsIfEmpty)
            //this is the array of cells that need to be empty for JUMP
            let emptyCheck = [board[checkRowIfEmpty][curColIdx + 2], board[checkRowIfEmpty][curColIdx - 2]]
            let emptyCheckIds = [`r${checkRowIfEmpty}c${curColIdx + 2}`, `r${checkRowIfEmpty}c${curColIdx - 2}`]
            console.log(emptyCheck)
            //choosing cells to highlight for mandatory jump
            checkCellsIfEmpty.forEach((el) => {
                if (checkOppCells[el] = turn * -1 && emptyCheck[el] === 0) {
                    mandatoryJumps.push(emptyCheckIds[el])
                }
            })
        }
        
    }
    console.log(mandatoryJumps)
    // if (board[curRowIdx * 2][curColIdx * 2] === turn) {

    // }
}
mandatoryJump(cellsToCheck)

function boardArrIntoIds(arr) {
    let idBoard = []
    idBoard.push(board.map((el,i) => {
        idBoard[i] = el.map((cell, colIndex) => {
            console.log(`r${i}c${colIndex}`)
            return `r${i}c${colIndex}`
        }) 
    }))
    return idBoard
}

// console.log(boardArrIntoIds(board))