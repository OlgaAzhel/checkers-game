define([
    'game'
], function (require, render) {
    'use strict';
    // render function must use cellState object and board array to update board view according to current game state

    const cellState = {
        '1': { 'class': 'blue', 'html': "<span></span>", 'activePiece': 'blueA' },
        '-1': { 'class': 'yellow', 'html': "<span></span>", 'activePiece': 'yellowA' },
        '2': { 'class': 'blueKing', 'html': "<span></span>", 'activePiece': 'blueA' },
        '-2': { 'class': 'yellowKing', 'html': "<span></span>", 'activePiece': 'yellowA' },
        '0': { 'class': 'emptyCellA' },
        's': { 'class': 'sleeping' }
    }
    function renderPieces() {

        // iterating through board array to acces value and update the view accordingly
        board.map((rowArr, rowIdx) => {
            let currentId
            let r = `${rowIdx}`
            rowArr.map((cell, colIdx) => {
                if (cell === 0) {
                    let c = `${colIdx}`
                    currentId = 'r' + r + 'c' + c
                    // find element with current id in the HTML
                    let element = document.getElementById(currentId)
                    element.innerHTML = ''

                } else {
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
                }

            })

        })
    }

    let board = [
        [0, 1, 0, 1, 0, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 1, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, -1],
        [0, 0, -1, 0, -2, 0, -1, 0],
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
    let mightHavToJumpPieces = []
    let currentMoveActivePieces = []
    let chosenPiece = ''
    let chosenCell = ''
    /////////////////// Functions ////////////////////


    init()
    //start of the game
    function init() {
        console.log("CURRENT TURN", turn)
        renderPieces()
        if (mightHavToJumpPieces.length > 0) {
            // if any pieces left to continue jump
            console.log("CONTINUE JUMP SITUATION....")
            let checkIfJumpAgain = mandatoryJumps(mightHavToJumpPieces)

            if (checkIfJumpAgain.length === 0) {
                mightHavToJumpPieces = []
                currentMoveActivePieces = []
                turn = turn * -1
                init()
            }
            

        } else {
            // looking for mandatory moves on the board
            let checkBoard = boardToIDarray(board)
            console.log("NEW MOVE SITUATION....")
            mandatoryJumps(checkBoard)
            if (mustJumpPieces.length > 0) {
                highlightPieces(mustJumpPieces)

            } else {
                highlightPieces()
                //and add event listeners to active pieces
            }
        }

        // if mustJumpPieces.length > 0 - highlight those cells

        
        // Player clicks on a piece calling event allowedMoves event listener   
        // ------>
    }




    function processMove(evt) {

        chosenCell = evt.target.parentNode.getAttribute('id')

        console.log("PROCESSING A NEW MOVE",
            "current active ALL:", currentMoveActivePieces,
            "actingPiece:", chosenPiece,
            "highlighted cells:", highlightCells
        )

        // removing highlights and event listeners from currentMoveActivePieces
        pieceHighlightRemove(currentMoveActivePieces)
        // reset array af highlighted pieces
        currentMoveActivePieces = []
        // remove event listeners highlited empty cells
        emptyCellHighlightRemove(highlightCells)
        highlightCells = []

        console.log(" NEED TO UPDATE BOARD:", chosenPiece, chosenCell)
        boardUpdate(chosenPiece, chosenCell)
        // if no more mandatory jumps - change turn 
        
    }

    function boardUpdate(cellFrom, cellTo) {
        console.log("boardUpdate run...")
        let currentRow = parseInt(cellFrom[1])
        let newRow = parseInt(cellTo[1])
        if (currentRow + 1 === newRow || currentRow - 1 === newRow){
            moveOnBoard(cellFrom, cellTo)
        } else if (currentRow + 2 === newRow || currentRow - 2 === newRow) {
            jumpOnBoard(cellFrom, cellTo)
        }
            
       
            console.log("Its a King board update...")
        }


        function moveOnBoard(cellFrom, cellTo) {

            console.log("Updating BOARD after regular move..", cellFrom, cellTo)
            let currentRow = parseInt(cellFrom[1])
            let newRow = parseInt(cellTo[1])
            let currentCol = parseInt(cellFrom[3])
            let newCol = parseInt(cellTo[3])

            currentMoveActivePieces = []
            //If piece reaches last row as a result of the move it turns into a king:
            if (board[newRow][newCol] === turn && ((turn === -1 && board[newRow] === 0) || (turn === 1 && board[newRow] === 7)) )  {
                board[newRow][newCol] = turn*2
                
            } 
            board[currentRow][currentCol] = 0
            board[newRow][newCol] = turn
        
            turn = turn * -1
            console.log('Switching TURN to:', turn)
            init()
    

            
        }    

        function jumpOnBoard(cellFrom, cellTo) {
            console.log("Updating BOARD after jump move..", cellFrom, cellTo)
        let currentRow = parseInt(cellFrom[1])
        let newRow = parseInt(cellTo[1])
        let currentCol = parseInt(cellFrom[3])
        let newCol = parseInt(cellTo[3])
        let currentValue = board[currentRow][currentCol]
        console.log("THIS IS CURRENT VALUE:", currentValue)

            let opCol = (newCol - currentCol) / 2 + currentCol
            let opRow = (newRow - currentRow) / 2 + currentRow
            board[opRow][opCol] = 0;
            //If piece reaches last row as a result of the jump it turns into a king:
            if (board[newRow][newCol] === turn && ((turn === -1 && board[newRow] === 0) || (turn === 1 && board[newRow] === 7))) {
                board[newRow][newCol] = turn * 2
                board[currentRow][currentCol] = 0

            } else {
                board[newRow][newCol] = currentValue
                board[currentRow][currentCol] = 0
                mightHavToJumpPieces.push(cellTo)

            }
            init()

        




    }






    function highlightPieces(mjArray) {
        console.log("highlightPieces run...")
        // mandatoryJumps must run before each move
        // mandatoryJumps check all current turn pieces,  
        // if mandatiryJumps returns array with length more than 0, this function should return the same array as result
        if (mjArray) {
            console.log("there is mandatory Jump:", mjArray)
            mjArray.forEach((id) => {
                let div = document.getElementById(id)
                console.log(div)
                div.addEventListener('click', allowedMoves)
            })
            pieceHighlighter(mjArray)
            return
        } else {
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
            return activePieces
        }


        // highlight active pieces and add event listeners to activePieces


    }

    function pieceHighlighter(arr) {
        console.log("pieceHighlighter run...., add event listener on span inside:", arr)
        currentMoveActivePieces = arr
        arr.forEach((elId) => {
            let addId = cellState[turn].activePiece
            let highlightEl = document.getElementById(elId).childNodes[0]
            console.log(highlightEl)

            highlightEl.setAttribute('id', addId)
            highlightEl.addEventListener('click', allowedMoves)
        })
    }
    function pieceHighlightRemove(arr) {
        console.log("PiecehighliteRemove run...", arr)
        arr.forEach((elId) => {
            console.log(document.getElementById(elId).childNodes[0])
            let span = document.getElementById(elId).childNodes[0]
            document.getElementById(elId).removeEventListener('click', allowedMoves)
            span.removeAttribute('id')
        })
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
        
        
        // checking for mandatory jumps for current cell...
 
        
        // if current board cell has value 1 or -1
        if (board[curRowIdx][curColIdx] === turn) {
            console.log("Its a regular piece")
            let aheadResults = checkMoveAhead(currentElId)
            aheadResults.forEach(el => availableMoves.push(el))
            // if current board cell has value 2 or -2
        } else if (board[curRowIdx][curColIdx] === turn * 2) {
            console.log("Its a KING")
            let results = []
            let aheadResults = checkMoveAhead(currentElId)
            let behindResults = checkMoveBehind(currentElId)
            aheadResults.forEach(el => availableMoves.push(el))
            behindResults.forEach(el => availableMoves.push(el))
        }


        let mJumps = mandatoryJumps([currentElId])
        // highlighting available cells upon results:
        if (mJumps.length == 0) {
            console.log("CHOOSE YOUR MOVE:", availableMoves)
            // updating highlighted cells array. Will need to remove highlight once another event occurs 

            highlightCells = availableMoves
            chosenPiece = currentElId
            availableMoves.forEach((elId) => {
                let currentActiveCell = document.getElementById(elId)

                currentActiveCell.addEventListener('click', processMove)
            })

            emptyCellHighlighter(availableMoves)
            console.log("Allowed moves return")

            return availableMoves
        } else {
            console.log("YOU MUST JUMP:", mJumps)
            highlightCells = mJumps
            chosenPiece = currentElId
            emptyCellHighlighter(mJumps)
            mJumps.forEach((elId) => {
                let currentActiveCell = document.getElementById(elId)
                console.log(chosenPiece)
                currentActiveCell.addEventListener('click', processMove)
            })

            console.log("Allowed moves return, HAVE TO JUMP")
            return mJumps
        } 
        


    }


    function checkMoveAhead(idString) {
        console.log("Check move ahead run...", idString)
        let emptyCellsAhead = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        // outsideBoard Guard
        if (!board[curRowIdx + turn]) { return }
        let checkRow = curRowIdx + turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === 0) {
                emptyCellsAhead.push(checkCellsIds[idx])
            }
        })
        // Return empty cells for move inside the board
        console.log("CheckmoveAhead return...", emptyCellsAhead)
        return emptyCellsAhead
    }
    function checkMoveBehind(idString) {
        console.log("Check move behind run...", idString)
        let emptyCellsBehind = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])

        if (!board[curRowIdx - turn]) { retrun }
        let checkRow = curRowIdx - turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === 0) {
                emptyCellsBehind.push(checkCellsIds[idx])
            }
        })
        // Return empty cells for move inside the board
        console.log("Check move behind return...", emptyCellsBehind)
        return emptyCellsBehind
    }
    function checkOpAhead(idString) {
        console.log("Check move ahead run...", idString)
        let opCellsAhead = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        // outsideBoard Guard
        if (!board[curRowIdx + turn]) { return }
        let checkRow = curRowIdx + turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === turn * -1 || cell === turn * -2) {
                opCellsAhead.push(checkCellsIds[idx])
            }
        })
        // Return empty cells for move inside the board
        console.log("CheckOpAhead return...", opCellsAhead)
        return opCellsAhead
    }

    function checkOpBehind(idString) {
        console.log("Check move behind run...", idString)
        let opCellsBehind = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])

        if (!board[curRowIdx - turn]) { retrun }
        let checkRow = curRowIdx - turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === turn * -1 || cell === turn * -2) {
                opCellsBehind.push(checkCellsIds[idx])
            }
        })
        // Return empty cells for move inside the board
        console.log("Check move behind return...", opCellsBehind)
        return opCellsBehind
    }

    function checkEmptyAheadOneAfter(idString, oppAhead = []) {
        console.log("checkEmptyAheadOneAfter run", idString, oppAhead)
        let mayJump = []
        // currentId(idString) = 'r5c2'
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        // opAhead = ['r4c3']
        for (let i = 0; i < oppAhead.length; i++) {
            let opRow = parseInt(oppAhead[i][1])
            console.log("opRow:", opRow)
            let opCol = parseInt(oppAhead[i][3])
            console.log("opCol:", opCol)

            if (!board[opRow + turn]) { 
                console.log("Guard!!!")
                return }
            let checkCol = (opCol - curColIdx)* 2 + curColIdx
            console.log("checkCol", checkCol)
            if (board[opRow + turn][checkCol] !== 0) { 
                console.log(board[opRow + turn][checkCol], "Guard!!!")
                return }
            if (board[opRow + turn][checkCol] === 0) {
                mayJump.push(`r${opRow + turn}c${checkCol}`)
            }
        }
        console.log("checkEmptyAheadOneAfter return, may jump here:", mayJump)
        return mayJump
    }

    function checkEmptyBehindOneAfter(idString, oppBehind) {
        console.log("ccheckEmptyBehindOneAfter run", idString, oppBehind)
        let mayJump = []
        // currentId(idString) = 'r5c2'
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        // opAhead = ['r4c3']
        for (let i = 0; i < oppBehind.length; i++) {
            let opRow = parseInt(oppBehind[i][1])
            let opCol = parseInt(oppBehind[i][3])
            if (!board[opRow - turn]) { retrun }
            let checkCol = opCol - curColIdx + opCol
            if (board[opRow - turn][checkCol] !== 0) { return }
            if (board[opRow - turn][checkCol] === 0) {
                mayJump.push(`r${opRow - turn}c${checkCol}`)
            }
        }
        console.log("checkEmptyBehindOneAfter return, may jump here:", mayJump)
        return mayJump
    }



    function emptyCellHighlighter(array) {
        array.forEach((elId) => {
            let addClass = cellState[0].class
            let currentActiveCell = document.getElementById(elId)
            let dashedCircle = document.createElement('span')
            dashedCircle.classList.add(addClass)
            currentActiveCell.appendChild(dashedCircle)

        })

    }
    function emptyCellHighlightRemove(array) {
        console.log("emptyCellHiglightRemove run ...", array)
        array.map((cell) => {
            console.log('removing highlighting:', cell)
            let currentActiveCell = document.getElementById(cell)
            console.log(currentActiveCell)
            currentActiveCell.innerHTML = ''
            currentActiveCell.removeEventListener('click', processMove)


        })
    }

    function mandatoryJumps(array) {
        console.log("mandatoryJumps run with argument...", array, turn)

        // function have to check if any mandatory jumps must be made // accepting array of pieces to check. 
        // different behavior for regular and kings pieces
        let haveToJumpPieces = []
        let mandatoryJumpsArr = []
        for (let i = 0; i < array.length; i++) {
            let curRowIdx = parseInt(array[i][1])
            let curColIdx = parseInt(array[i][3])


            // if a regular piece
            if (board[curRowIdx][curColIdx] === turn) {
                //check if any diagonal cells next to current occupied by another player, and if diagonal cells next to them are empty
                let opAhead =  checkOpAhead(array[i])
                let emptyAheadAfterOp = checkEmptyAheadOneAfter(array[i], opAhead)
                if (emptyAheadAfterOp) {
                    emptyAheadAfterOp.forEach(el => {
                        mandatoryJumpsArr.push(el)
                        haveToJumpPieces.push(array[i])
                    })
                }
                // if King
            } else if (board[curRowIdx][curColIdx] === turn * 2) {
                let opAhead = checkOpAhead(array[i])
                let emptyAheadAfterOp = checkEmptyAheadOneAfter(array[i], opAhead)
                let opBehind = checkOpBehind(array[i])
                let emptyBehindAfterOp = checkEmptyBehindOneAfter(array[i], opBehind)
                if (emptyAheadAfterOp) {
                    emptyAheadAfterOp.forEach(el => {
                        mandatoryJumpsArr.push(el)
                        haveToJumpPieces.push(array[i])
                    })
                }
                if (emptyBehindAfterOp) {
                    emptyBehindAfterOp.forEach(el => {
                        mandatoryJumpsArr.push(el)
                        haveToJumpPieces.push(array[i])
                    })
                }
            }

        }
        mustJumpPieces = haveToJumpPieces

        console.log("mandatory jumps return", mandatoryJumpsArr, haveToJumpPieces)
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