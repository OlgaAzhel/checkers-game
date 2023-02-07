// render function must use cellState object and board array to update board view according to current game state

const cellState = {
    '1': { 'class': 'blue', 'html': "<span></span>", 'activePiece': 'blueA' },
    '-1': { 'class': 'yellow', 'html': "<span></span>", 'activePiece': 'yellowA' },
    '2': { 'class': 'blueKing', 'html': "<span></span>", 'activePiece': 'blueA' },
    '-2': { 'class': 'yellowKing', 'html': "<span></span>", 'activePiece': 'yellowA' },
    '0': { 'active': 'emptyCellA'},
    's': {'class': 'sleeping'}
}

let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 2, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0,-1, 0, 0, 0, 0, 0,-1],
    [-1,0,-1, 0,-2, 0,-1, 0],
    [0,-1, 0, 0, 0,-1, 0,-1],
    [-1,0,-1, 0,-1, 0,-1, 0]
]
let turn = -1



function render() {
    renderPieces()

    // function highlightPieces()
}

function renderPieces() {

    // iterating through board array to acces value and update the view accordingly
    board.map((rowArr, rowIdx) => {
        let currentId
        let r = `${rowIdx}`
        rowArr.map((cell, colIdx) => {
            if (cell === 0) return
            let c = `${colIdx}`
            currentId = 'r' + r + 'c' + c
            // find element with current id in the HTML
            let element = document.getElementById(currentId)
            // check value of it in board array
            let value = `${cell}`
            // refer to cellState object to get class and inner HTML from it
            let newHTML = cellState[value]["html"]
            let newClass = cellState[value]["class"]
            // adding piece element html 
            element.innerHTML = newHTML
            // applying class 
            element.firstChild.classList.add(newClass)
        })

    })
}

render()


console.log(turn)
console.log(cellState[turn].activePiece)
function highlightPieces(mjArray) {
    console.log("highlightPieces run...")
    // mandatoryJumps must run before each move
    // mandatoryJumps check all current turn pieces,  
    // if mandatiryJumps returns array with length more than 0, this function should return the same array as result
    if (mjArray) {
        console.log("there is mandatory Jump:")
            mjArray.forEach((id) => {
                let span = document.getElementById(id)
                console.log(span)
                span.addEventListener('click', allowedMoves)
            })
        return pieceHighlighter(mjArray)
    }
    // Function will look for pieces that player can choose from to make a new move or to continue jump 
    let activePieces = []
    // To be active in this turn piece must:
    // have value of turn or turn * 2
    // if value of cell = turn

    board.forEach((rowArr, rowIdx) => {
        let currentId
        let r = `${rowIdx}`
        rowArr.map((cell, colIdx) => {
            if (cell === 0) return
            if (cell === turn) {
                let addId = cellState[turn].activePieces
                //have at least one free spot diagonally forward
                // this free spot must have coordinates within the board
                let c = `${colIdx}`
                currentId = 'r' + r + 'c' + c
                let checkRow = rowIdx + turn  //3 + -1 --> 2
                // creating an array of two possible for move cells to check 
                let checkCellsVals = [board[checkRow][colIdx + 1], board[checkRow][colIdx - 1]]
                // saving these cells' ids
                let checkCellsIds = [`r${checkRow}c${colIdx + 1}`, `r${checkRow}c${colIdx - 1}`]
                // filtering the array to find a cell that has a value 0. If any true,we can mark this cell as active
                checkCellsVals.map((maybeEmptyCell, idx) => {
                    if (maybeEmptyCell === 0) {
                        activePieces.push(currentId)
                        let highlightEl = document.getElementById(currentId).childNodes[0]

                        highlightEl.setAttribute('id', addId)
                        console.log(highlightEl)
                    }
                })
            } else if (cell === turn * 2) {
                let addId = cellState[turn].active
                let c = `${colIdx}`
                currentId = 'r' + r + 'c' + c
                console.log("checking this for availabale moves:", currentId)
                let checkRows = [[rowIdx + turn], [rowIdx - turn]]
                // creating an array of two possible for move cells to check 
                let checkCellsVals = []
                // saving these cells' ids
                let checkCellsIds = []
                checkRows.map((el) => {
                    checkCellsVals.push(board[el][colIdx + 1])
                    checkCellsIds.push(`r${el}c${colIdx + 1}`)
                    checkCellsVals.push(board[el][colIdx - 1])
                    checkCellsIds.push(`r${el}c${colIdx - 1}`)
                })

                // filtering the array to find a cell that has a value 0 and pushing into available moves
                checkCellsVals.map((cell, idx) => {
                    if (cell === 0) {
                        activePieces.push(currentId)
                    }
                })

            }
        })
    })
    pieceHighlighter(activePieces)
    // adding event listeners to activePieces
    activePieces.forEach((id) => {
                let span = document.getElementById(id)
                console.log(span)
                span.addEventListener('click', allowedMoves)
    })

    return activePieces

}


function pieceHighlighter(arr) {
    arr.forEach((elId) => {
        let addId = cellState[turn].activePiece
        let highlightEl = document.getElementById(elId).childNodes[0]
        highlightEl.setAttribute('id', addId)
    })
}

// findActivePieces(['r2c3', 'r2c5'])
// highlightPieces()


define(function () {

    return {
        // add here what to export

       cellState,
       board,
       turn, 
       pieceHighlighter

    }
});