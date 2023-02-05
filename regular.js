define([
    'require',
    'kings'
], function (require, allowedMovesKing, mandatoryJumpsKing, boardArrIntoIds) {
    'use strict';
        allowedMovesKing,
        mandatoryJumpsKing,
        boardArrIntoIds



    const cellState = {
        blue: 1,
        yellow: -1,
        blueKing: 2,
        yellowKnig: -2,
        active: 'a',
        sleeping: 's'
    }

    let board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 0, 1],
        [-1, 0, -1, 0, -2, 0, -1, 0],
        [0, -1, 0, -1, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0]
    ]

    let player1 = {
        color: 'blue'
    }

    player1 = {
        color: 'yellow'
    }

    let turn = -1


    // need for guard option -  an array of cells divs only
    let cells = [...document.querySelectorAll('#board > div')]
    // This event listener should be set up on array of els returned from  findActivPieces()
    let clickListen = document.getElementById('board').addEventListener('click', allowedMoves)


    function allowedMoves(evt) {
        console.log(evt.target)
        // calculate active cells for the picked piece

        // Guard - function must do nothing if not clicked on proper part of board
        if (cells.indexOf(evt.target) === -1 || evt.target.getAttribute('id') === 'board') return
        // Accessing and extracting nesessary indexes from element's html id attribute
        let currentElId = evt.target.getAttribute('id')
        // Since all ids are string of format rXcY having length = 4, we can access their X for row and Y for col
        let curRowIdx = parseInt(currentElId[1])
        let curColIdx = parseInt(currentElId[3])
        console.log(`This is chosen piece current coordinates: r${curRowIdx}, c${curColIdx}`)
        // if current board cell has value 1 or -1
        if (board[curRowIdx][curColIdx] === turn) {
            let availableMoves = []
            console.log("Its a regular piece")
            // for being open for the move cells must be empty, be on the next row and have columns values + 1 and -1 from current:
            //index of the next row in the board array:
            let checkRow = curRowIdx + turn

            // creating an array of two possible for move cells to check 
            let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
            // saving these cells' ids
            let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
            // filtering the array to find a cell that has a value 0 and pushing into available moves
            checkCellsVals.map((cell, idx) => {
                if (cell === 0) {
                    availableMoves.push(checkCellsIds[idx])
                }
            })
            // if any of check cells has value of opposite player call function to check for a mandatory jump
            let mJumps = mandatoryJumps([currentElId])
            if (mJumps.length === 0) {
                console.log("YOU CHOOSE MOVE:", availableMoves)
                return availableMoves
            } else {
                console.log("YOU MUST JUMP:", mJumps)
                return mJumps
            }


        }
        // function returns and array of indexes available for moves or mandatory jumps if any
    }


    function mandatoryJumps(array) {
        // function have to check if any mandatory jumps must be made // accepting array of pieces to check. 
        // different behavior for regular and kings pieces

        let mandatoryJumps = []
        for (let i = 0; i < array.length; i++) {
            let curRowIdx = parseInt(array[i][1])
            // console.log('this is current row:', curRowIdx)
            let curColIdx = parseInt(array[i][3])
            // console.log('this is current col:', curColIdx)
            // checking for type of piece
            if (board[curRowIdx][curColIdx] === turn) {
                console.log("this is regular piece's JUMP", array[i])
                //check if any diagonal cells next to current occupied by another player, and if diagonal cells next to them are empty
                let checkRow = curRowIdx + turn
                let checkRowIfEmpty = curRowIdx + (2 * turn)
                let checkOppCells = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
                let checkOppIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
                // Check for emptyness only direction/-s with cells that have value of opposit player
                // create array with indexes to check. Will apply these indexes on OP's cells and relevant empty on same index - same direction
                let checkCellsIfEmpty = []
                checkOppCells.forEach((el, idx) => {
                    if (el === turn * -1 || el === turn * -2) {
                        checkCellsIfEmpty.push(idx)
                    }
                })
                console.log(checkCellsIfEmpty)
                //this is the array of cells that need to be empty for JUMP
                let emptyCheck = [board[checkRowIfEmpty][curColIdx + 2], board[checkRowIfEmpty][curColIdx - 2]]
                let emptyCheckIds = [`r${checkRowIfEmpty}c${curColIdx + 2}`, `r${checkRowIfEmpty}c${curColIdx - 2}`]
                console.log(emptyCheck, emptyCheckIds)
                //choosing cells to highlight for mandatory jump
                checkCellsIfEmpty.forEach((el) => {
                    if (checkOppCells[el] = turn * -1 && emptyCheck[el] === 0 && emptyCheck[el] !== undefined) {
                        mandatoryJumps.push(emptyCheckIds[el])
                    }
                })
            }

        }
        // function must return an array of indexes requiring a jump
        return mandatoryJumps

    }

    // function to convert board array into array of relevant string ids
    function boardArrIntoIds(arr) {
        let idBoard = []
        board.map((el, i) => {
            el.map((cell, colIndex) => {
                idBoard.push(`r${i}c${colIndex}`)
            })
        })

        return idBoard
    }
    console.log(boardArrIntoIds(board))

});

define(function () {

    return {
        // add here what to export
        board,
        clickListen,
        turn,
        cells
    }
});