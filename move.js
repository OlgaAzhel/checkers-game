define([
    'require',
    'render',
    'game'
], function (require, render) {
    'use strict';
    // render function must use cellState object and board array to update board view according to current game state

    const cellState = {
        '1': { 'class': 'blue', 'html': "<span></span>", 'activePiece': 'blueA' },
        '-1': { 'class': 'yellow', 'html': "<span></span>", 'activePiece': 'yellowA' },
        '2': { 'class': 'blueKing', 'html': "<span></span>", 'activePiece': 'blueA' },
        '-2': { 'class': 'yellowKing', 'html': "<span></span>", 'activePiece': 'yellowA' },
        '0': { 'active': 'emptyCellA' },
        's': { 'class': 'sleeping' }
    }

    let board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 2, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, -1, 0, 0, 0, 0, 0, -1],
        [-1, 0, -1, 0, -2, 0, -1, 0],
        [0, -1, 0, 0, 0, -1, 0, -1],
        [-1, 0, -1, 0, -1, 0, -1, 0]
    ]
    let turn = -1

    // need for guard option -  an array of cells divs only
    let cells = [...document.querySelectorAll('#board > div')]
    // This event listener should be set up on array of els returned from  findActivPieces()
    // document.getElementById('board').addEventListener('click', allowedMoves)

    //////////////// game state variables//////////////

    let highlightCells = [] // cells that should be highlighted
    let mustJumpPieces = [] // pieces that must jump
    let currentMoveActivePieces = []
    /////////////////// Functions ////////////////////

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
        currentMoveActivePieces = activePieces
        return activePieces

    }

    function pieceHighlighter(arr) {
        arr.forEach((elId) => {
            let addId = cellState[turn].activePiece
            let highlightEl = document.getElementById(elId).childNodes[0]
            highlightEl.setAttribute('id', addId)
        })
    }
 

    
    //main logic control of the game
    function handleMove(evt) {
        // looking for mandatory moves on the board
        let checkBoard = boardToIDarray(board)
        mandatoryJumps(checkBoard)

        // if mustJumpPieces.length > 0 - highlight those cells
        if (mustJumpPieces.length > 0) {
            highlightPieces(mustJumpPieces)
        } else {
            highlightPieces() //add event listeners to active pieces
        }  
    // Player clicks on a piece calling event allowedMoves event listener 
 
    }

    function processMove() {
        console.log("PROCESSING A NEW MOVE")
    }


    function boardToIDarray(array) {
        let idArray = []
        array.forEach((row, i) => {
            
            row.forEach((cell, idx) => {
                let newId = `r${i}c${idx}`
                idArray.push(newId)
            })
            
        })
        // console.log("This is ID board", idBoard)
        return idArray

    }
    handleMove()
 



    function allowedMoves(evt) {
        let availableMoves = []

        //since player actually click on span that represent a piece, to access cell id we need access this span's parent
        let cellCont = evt.target.parentNode
        // Prevent calling highlighter if player click on the same cell again and again. 

        console.log("allowedMoves run...")
        // Guard - function must do nothing if not clicked on proper part of board
        if (cells.indexOf(cellCont) === -1 || cellCont.getAttribute('id') === 'board') return

        // Removing previous highlighting if player changes his mind and choses different piece. Highlight cells array in this case already have elements (id)
        if (highlightCells.length > 0) {
            emptyCellHighlightRemove(highlightCells)
        }
        // Accessing and extracting nesessary indexes from chosen piece html id attribute
        let currentElId = cellCont.getAttribute('id')
        // Since all ids are string of format rXcY having length = 4, we can access their X for row and Y for col
        let curRowIdx = parseInt(currentElId[1])
        let curColIdx = parseInt(currentElId[3])
        console.log(`This is chosen piece current coordinates: r${curRowIdx}, c${curColIdx}`)
        // Next logic depend on type of piece...
        // if current board cell has value 1 or -1
        if (board[curRowIdx][curColIdx] === turn) {
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
            // if current board cell has value 2 or -2
        } else if (board[curRowIdx][curColIdx] === turn * 2) {
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
        }
        // checking for mandatory jumps for current cell...
        let mJumps = mandatoryJumps([currentElId])
        // highlighting available cells upon results:
        if (mJumps.length === 0) {
            console.log("CHOOSE YOUR MOVE:", availableMoves)
            // updating highlighted cells array. Will need to remove highlight once another event occurs 
            highlightCells = availableMoves
            emptyCellHighlighter(availableMoves)
            availableMoves.forEach((id) => {
                let span = document.getElementById(id)
                console.log(span)
                span.addEventListener('click', processMove)
            })

            return availableMoves
        } else {
            console.log("YOU MUST JUMP:", mJumps)
            highlightCells = mJumps
            emptyCellHighlighter(mJumps)
            availableMoves.forEach((id) => {
                let span = document.getElementById(id)
                console.log(span)
                span.addEventListener('click', processMove)
            })
            return mJumps
        }


    }



    function emptyCellHighlighter(array) {
        array.forEach((elId) => {
            let addClass = cellState[0].active
            let highlightEl = document.getElementById(elId)
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

    function mandatoryJumps(array) {
        console.log("mandatoryJumps run with argument...", array)

        // function have to check if any mandatory jumps must be made // accepting array of pieces to check. 
        // different behavior for regular and kings pieces
        let haveToJumpPieces = []
        let mandatoryJumpsArr = []
        for (let i = 0; i < array.length; i++) {
            let curRowIdx = parseInt(array[i][1])
            let curColIdx = parseInt(array[i][3])

            // if a regular piece
            if (board[curRowIdx][curColIdx] === turn) {
                console.log("checking for regular piece's JUMP", array[i])
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
                        mandatoryJumpsArr.push(emptyCheckIds[el])
                        mustJumpPieces.push(array[i])
                    }
                })
                // if King
            } else if (board[curRowIdx][curColIdx] === turn * 2) {
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
                        mandatoryJumpsArr.push(emptyCheckIds[el])
                        mustJumpPieces.push(array[i])

                    }
                })
            }

        }
        
        console.log("mandatory jumps return", mandatoryJumpsArr, mustJumpPieces)
        // function must return an array of indexes requiring a jump
        return mandatoryJumpsArr

    }


})


define(function () {

    return {
        // add here what to export
        board,
        cells,
        mandatoryJumps,
        allowedMoves


    }
});