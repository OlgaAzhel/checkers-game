

console.log(turn)
console.log(cellState[turn].active)
function findActivePieces(mjArray) {
    // mandatoryJumps must run before each move
    // mandatoryJumps check all current turn pieces,  
    // if mandatiryJumps returns array with length more than 0, this function should return the same array as result
    if (mjArray) {
        return highlighter(mjArray)
    }
    // Function will look for pieces that player can choose from to make a new move or to continue jump 
    let activePieces = []
    // To be active in this turn cell must:
    // have value of turn or turn * 2
    // if value of cell = turn

    board.forEach((rowArr, rowIdx) => {
        let currentId
        let addClass

        let r = `${rowIdx}`
        rowArr.map((cell, colIdx) => {
            if (cell === 0) return
            if (cell === turn) {
                let addId = cellState[turn].active
                //have at least one free spot diagonally forward
                // this free spot must have coordinates within the board
                let c = `${colIdx}`
                currentId = 'r' + r + 'c' + c
                console.log("checking this for availabale moves:", currentId)
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
                // else value of cell = turn * 2
                //have at least one free spot dioganally forward or backward
                // this free spot must have coordinates within the board



            }
        })
    })
    highlighter(activePieces)


    console.log(turn, activePieces)


}


function highlighter(arr) {
    arr.forEach((elId) => {
        let addId = cellState[turn].active
        let highlightEl = document.getElementById(elId).childNodes[0]
        highlightEl.setAttribute('id', addId)
    })
}

findActivePieces()

define(function () {

    return {
        // add here what to export
        allowedMovesKing,
        boardArrIntoIds,
        mandatoryJumpsKing,
        findActivePieces
    }
});