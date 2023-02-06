


define([
    'require',
    'render',
    'active-pieces',
    'game'
], function (require, render) {
    'use strict';
    highlightCells = render.highlightCells
    turn = render.turn
    console.log("HIGHLIGHT CELLS ARE AVAILABLE NOW:",highlightCells, turn)


    // need for guard option -  an array of cells divs only
    let cells = [...document.querySelectorAll('#board > div')]
    // This event listener should be set up on array of els returned from  findActivPieces()
    document.getElementById('board').addEventListener('click', allowedMovesKing)

    function allowedMovesKing(evt) {
        console.log("allowedMovesKing run...")
        //since player actually click on span that represent piece, to access cell id we need access this span's parent
        let cellCont = evt.target.parentNode
        // calculate active cells for the picked King piece
        // Guard
        if (cells.indexOf(evt.target.parentNode) === -1 || evt.target.parentNode.getAttribute('id') === 'board') return
        cells.map((cell) => {
            cell.classList.remove('active')
        })
        // Extracting nesessary indexes from element's html id attribute
        let currentElId = cellCont.getAttribute('id')
        console.log(currentElId)


        if (highlightCells.length > 0) {
            emptyCellHighlightRemove(highlightCells)
        }
        // Since all ids are string of format rXcY having length = 4, we can access their X for row and Y for col
        let curRowIdx = parseInt(currentElId[1])
        let curColIdx = parseInt(currentElId[3])

        // if current board cell has value 2 or -2
        if (board[curRowIdx][curColIdx] === turn * 2) {
            let availableMoves = []
            console.log("Its a KING")
            console.log(`This is King's current coordinates: r${curRowIdx}, c${curColIdx}`)
            // for being open for the move cell must be empty, be on a next or pevious row and have column value +1 and -1 from current:
            //index of the next row in the board array:
            let checkRows = [[curRowIdx + turn], [curRowIdx - turn]]
            // creating an array of two possible for move cells to check 
            let checkCellsVals = []
            // saving these cells' ids
            let checkCellsIds = []
            checkRows.map((el) => {
                checkCellsVals.push(board[el][curColIdx + 1])
                checkCellsIds.push(`r${el}c${curColIdx + 1}`)
                checkCellsVals.push(board[el][curColIdx - 1])
                checkCellsIds.push(`r${el}c${curColIdx - 1}`)
            })

            // filtering the array to find a cell that has a value 0 and pushing into available moves
            checkCellsVals.map((cell, idx) => {
                if (cell === 0) {
                    availableMoves.push(checkCellsIds[idx])
                }
            })
            // if any of check cells has value of opposite player call function to check for a mandatory jump
            let mJumps = mandatoryJumpsKing([currentElId])

            if (mJumps.length === 0) {
                console.log("YOU CHOOSE MOVE:", availableMoves)
                highlightCells = availableMoves
                emptyCellHighlighter(availableMoves)
                return availableMoves
            } else {
                console.log("YOU MUST JUMP:", mJumps)
                highlightCells = availableMoves
                emptyCellHighlighter(mJumps)
                return mJumps
            }


        }

        // // if current board cell has value 2 or -2 (King) 
        // if (board[curRowIdx * 2][curColIdx * 2] === turn) {

        // }

    }

    function emptyCellHighlighter(array) {
        console.log("emptyCellHighlighter run...")
        array.forEach((elId) => {
            let addClass = cellState[0].active
            let highlightEl = document.getElementById(elId)
            console.log(highlightEl)
            let dashedCircle = document.createElement('span')
            dashedCircle.classList.add(addClass)
            highlightEl.appendChild(dashedCircle)


        })

    }

    function emptyCellHighlightRemove(array) {
        console.log("emptyCellHiglightRemove run ...", array)
        array.map((cell) => {
            console.log('removing highlighting:', cell)
            let currentActiveCell = document.getElementById(cell)
            console.log(currentActiveCell.childNodes[0])
            currentActiveCell.innerHTML = ''

        })
    }


    function mandatoryJumpsKing(array) {
        console.log("mandatoryJumpsKing run...")
        // function have to check if any mandatory jumps must be made for CURRENT CHOSEN PIECE/PIECES if the beginning of move 
        // different behavior for regular and kings pieces

        let mandatoryJumps = []
        for (let i = 0; i < array.length; i++) {
            let curRowIdx = parseInt(array[i][1])
            let curColIdx = parseInt(array[i][3])
            // checking for type of piece
            if (board[curRowIdx][curColIdx] === turn * 2) {
                //check if any diagonal cells next to current occupied by another player, and if diagonal cells next to them are empty
                let checkRows = [[curRowIdx + turn], [curRowIdx - turn]]
                let checkRowsIfEmpty = [[curRowIdx + (2 * turn)], [curRowIdx - (2 * turn)]]
                let checkOppCells = []
                let checkOppIds = []
                checkRows.map((el) => {
                    checkOppCells.push(board[el][curColIdx + 1])
                    checkOppIds.push(`r${el}c${curColIdx + 1}`)
                    checkOppCells.push(board[el][curColIdx - 1])
                    checkOppIds.push(`r${el}c${curColIdx - 1}`)
                })

                // Check for emptyness only direction/-s with cells that have value of opposit player
                // create array with indexes to check. Will apply these indexes on OP's cells and relevant empty on same index - same direction
                let checkCellsIfEmpty = []
                checkOppCells.forEach((el, idx) => {
                    //check array checkOppCells (4 diagonal cells next to current piece). Check them for opponent's pieces and write down thir indexes into checkCellsIfEmpty array.
                    if (el === turn * -1 || el === turn * -2) {
                        checkCellsIfEmpty.push(idx)
                    }
                })
                console.log(checkCellsIfEmpty)
                //create arrays of 4 diagonall cells next + 1 to current piece that need to be empty in order to JUMP. One has to be with values and another with indexes 
                let emptyCheck = []
                let emptyCheckIds = []
                checkRowsIfEmpty.map((el) => {
                    emptyCheck.push(board[el][curColIdx + 2])
                    emptyCheck.push(board[el][curColIdx - 2])
                    emptyCheckIds.push(`r${el}c${curColIdx + 2}`)
                    emptyCheckIds.push(`r${el}c${curColIdx - 2}`)
                })

                console.log("these are cells to be empty for jump", emptyCheck, emptyCheckIds)
                //iterating throught array if indexes to check applying the indexes on "diag next cells" and "diag next+1 cells" checking both conditions to match. choosing cells to highlight for mandatory jump
                checkCellsIfEmpty.forEach((el) => {
                    // if cell at current index in array next cells belongs to opponent and same index in next +1 array is empty - this is a mandatory jump
                    if (checkOppCells[el] = turn * -1 && emptyCheck[el] === 0 && emptyCheck[el] !== undefined) {
                        mandatoryJumps.push(emptyCheckIds[el])
                    }
                })
            }

        }
        // returning array of indexes for mandatory jump
        console.log("these are mandatory jumps:", mandatoryJumps)
        return mandatoryJumps
        // if (board[curRowIdx * 2][curColIdx * 2] === turn) {

        // }
    }
    // mandatoryJump(boardArrIntoIds(board))

    function boardArrIntoIds(arr) {
        let idBoard = []
        board.map((el, i) => {
            el.map((cell, colIndex) => {
                console.log(`r${i}c${colIndex}`)
                idBoard.push(`r${i}c${colIndex}`)
            })
        })
        console.log("this is idBOARD", idBoard)
        return idBoard
    }

    // console.log(boardArrIntoIds(board))

})

//exports////////////////////////////////////////////////////////////////////////

define(function () {

    return {
        // add here what to export
        allowedMovesKing,
        boardArrIntoIds,
        mandatoryJumpsKing
    }
});
