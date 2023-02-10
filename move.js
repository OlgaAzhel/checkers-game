define([

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


    // need for guard option -  an array of cells divs only
    let cells = [...document.querySelectorAll('#board > div')]

    //////////////// game state variables//////////////

    let highlightCells = [] // empty cells to be highlighted for the chosen piece
    let mustJumpPieces = [] // pieces that must jump
    let mightHaveToJumpPieces = [] // pieces that migh have to continue a jump
    let currentMoveActivePieces = [] // all pieces that can move at this turn
    let chosenPiece = ''
    let chosenCell = ''
    let winner = null
    let turn = 1
    let moveCounter = 0
    // let board = [
    //     [0, 1, 0, 1, 0, 1, 0, 1],
    //     [1, 0, 1, 0, 1, 0, 1, 0],
    //     [0, 1, 0, 1, 0, 1, 0, 1],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [0, 0, 0, 0, 0, 0, 0, 0],
    //     [-1, 0, -1, 0, -1, 0, -1, 0],
    //     [0, -1, 0, -1, 0, -1, 0, -1],
    //     [-1, 0, -1, 0, -1, 0, -1, 0]
    // ]

    // Demonstaration board

    let board = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0],
        [0, 1, 0, 0, 0, 1, 0, 1],
        [-1,0,-1, 0,-1, 0,-1, 0],
        [0,-1, 0, 0, 0,-1, 0,-1],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0,-1, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]
    ]

    /////////////////// Functions ////////////////////
    // function generateBoard() {
    //     let newId = ''
    //     let sectionBoard = document.getElementById('board')
    //     board.forEach((row, rowIdx) => {
    //         row.forEach((cell, cellIdx) => {
    //             let newDiv = document.createElement('div')
    //             newId = `r${rowIdx}c${cellIdx}`
    //             console.log(newDiv)
    //             newDiv.setAttribute('id', newId)
    //             sectionBoard.appendChild(newDiv)
    //             if (rowIdx % 2 === 0 && cellIdx % 2 === 1) {
    //                 newDiv.style.backgroundColor = "rgb(122, 137, 181)"
    //             } else if (rowIdx % 2 === 1 && cellIdx % 2 === 0) {
    //                 newDiv.style.backgroundColor = "rgb(122, 137, 181)"
    //             }
    //         })
    //     })
    // }


    init()
    //start of the game
    function init() {
        // generateBoard()
        if (moveCounter === 40) {
            checkTie()
        }
        checkWinner(board)
        if (winner === turn * -1) {
            renderWin()
            if (winner) {
                winner = null
                turn = null
            }
        } else {
            renderPieces()
            renderControllers()
            turnIndicator(turn)
            turnWordToggle()
            // If last turn was a jump and possibly must be continued
            if (mightHaveToJumpPieces.length > 0) {
                // checking if that's the case...
                let checkIfJumpAgain = mandatoryJumps(mightHaveToJumpPieces)
                // if not, changing turn and restarting init
                if (checkIfJumpAgain.length === 0) {
                    mightHaveToJumpPieces = []
                    currentMoveActivePieces = []
                    turn = turn * -1
                    init()
                // if yes- highlighting the piece that have to jump 
                } else {
                    highlightPieces(mustJumpPieces)
                }
            // If last turn was just a regular move
            } else {
                // cecking for mandatory jumps for a new turn
                let checkBoard = boardToIDarray(board)
                mandatoryJumps(checkBoard)
                if (mustJumpPieces.length > 0) {
                    highlightPieces(mustJumpPieces)

                } else {
                    // Changing turn if current player has nowhere to move/ tie if both players have nowhere to move
                    let currentMovePieces = highlightPieces()
                    if (currentMovePieces.length === 0) {
                        turn = turn*-1
                        let nextMovePieces = highlightPieces()
                        if(nextMovePieces.length === 0) {
                            tie()
                        }
                    }

                }
            }
        }

    }

    function renderPieces() {
        // iterating through board array, acces value of each cell and update the view accordingly
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

    function renderControllers() {
        document.getElementById("rules").addEventListener('click', function () {
            document.getElementById("game-rules").style.visibility = "visible"
            document.getElementById("close-rules").addEventListener('click', function () {
                document.getElementById("game-rules").style.visibility = "hidden"
            })
        })
        document.getElementById("new-game").addEventListener('click', function () {
            board = [
                [0, 1, 0, 1, 0, 1, 0, 1],
                [1, 0, 1, 0, 1, 0, 1, 0],
                [0, 1, 0, 1, 0, 1, 0, 1],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [0, 0, 0, 0, 0, 0, 0, 0],
                [-1, 0, -1, 0, -1, 0, -1, 0],
                [0, -1, 0, -1, 0, -1, 0, -1],
                [-1, 0, -1, 0, -1, 0, -1, 0]
            ]
            turn = 1
            init()
            winStylingRemove()
            tieMsgRemove()
        })
    }



    function renderWin() {
        let winnerEl = document.getElementById(`player${turn * -1}`)
        console.log("RENDER WINNER", document.querySelector(`.sturn${turn*-1}`))

        document.querySelector(`.sturn${turn * -1}`).innerHTML = `&#160WINS !`

        console.log(winnerEl.innerHTML)
        winnerEl.style.minHeight = "5vmin"

        winnerEl.style.border = "4px solid rgb(48, 50, 71)"
        document.getElementById('new-game').style.border = "4px solid rgb(48, 50, 71)"
        document.getElementById('new-game').style.minHeight = "5vmin"


    }

    function winStylingRemove() {
        console.log("Win styling removing...")
        document.getElementById('new-game').style.minHeight = "4vmin"
        document.getElementById('new-game').style.border = "2px solid rgb(48, 50, 71)"
        console.log(document.querySelector(`.player${turn * -1}`))
        document.getElementById(`player${turn*-1}`).style.minHeight = "4vmin"
        document.getElementById(`player${turn * -1}`).style.border = "2px solid rgb(48, 50, 71)"
    }

    function turnIndicator(turn) {
        let indicatorRemove = document.getElementById(`turn${turn * -1}`)
        indicatorRemove.style.visibility = "hidden"
        let indicator = document.getElementById(`turn${turn}`)
        indicator.style.visibility = "visible"
    }


    function turnWordToggle() {
        let turnWordAdd = document.querySelector(`.sturn${turn}`)
        turnWordAdd.style.visibility = "visible"
        let turnWordRemove = document.querySelector(`.sturn${turn * -1}`)
        turnWordRemove.style.visibility = "hidden"

    }

    function checkTie() {
        console.log("It's a tie!!")
        let tieMsg = document.createElement('div')
        tieMsg.innerText = "It's a tie"
        tieMsg.classList.add('tiemsg')
        document.querySelector('body').appendChild(tieMsg)
        tieMsg.style.visibility = "visible"
    }

    function tieMsgRemove() {
        let tieMsg = document.querySelector('.tiemsg')
        console.log("Removing tie msg..", tieMsg)
        if(tieMsg) {
        tieMsg.style.visibility = "hidden"
        }
    }

    function processMove(evt) {
        chosenCell = evt.target.parentNode.getAttribute('id')
        pieceHighlightRemove(currentMoveActivePieces)
        currentMoveActivePieces = []
        emptyCellHighlightRemove(highlightCells)
        highlightCells = []
        boardUpdate(chosenPiece, chosenCell)
    }

    function boardUpdate(cellFrom, cellTo) {
        let currentRow = parseInt(cellFrom[1])
        let newRow = parseInt(cellTo[1])
        if (currentRow + 1 === newRow || currentRow - 1 === newRow) {
            moveOnBoard(cellFrom, cellTo)
            moveCounter += 1
        } else if (currentRow + 2 === newRow || currentRow - 2 === newRow) {
            jumpOnBoard(cellFrom, cellTo)
            moveCounter = 0
        }
    }


    function moveOnBoard(cellFrom, cellTo) {

        let currentRow = parseInt(cellFrom[1])
        let newRow = parseInt(cellTo[1])
        let currentCol = parseInt(cellFrom[3])
        let newCol = parseInt(cellTo[3])
        let currentValue = board[currentRow][currentCol]
        //If piece reaches last row as a result of the move it turns into a king:
        if ((turn === -1 && newRow === 0) || (turn === 1 && newRow === 7)) {
            if (board[currentRow][currentCol] === turn) {
                console.log("TURNING INTO KING!!!")
                board[newRow][newCol] = turn * 2
                console.log(board[newRow][newCol])
            } else if (board[currentRow][currentCol] === turn * 2) {
                console.log("THIS IS KING ALREADY!!!")
                board[newRow][newCol] = currentValue
                board[currentRow][currentCol] = 0
                init()
            }
        } else {
            board[newRow][newCol] = currentValue
        }

        board[currentRow][currentCol] = 0
        turn = turn * -1
        init()
    }

    function jumpOnBoard(cellFrom, cellTo) {
        console.log("Updating BOARD after jump move..", cellFrom, cellTo)
        let currentRow = parseInt(cellFrom[1])
        let newRow = parseInt(cellTo[1])
        let currentCol = parseInt(cellFrom[3])
        let newCol = parseInt(cellTo[3])
        let currentValue = board[currentRow][currentCol]

        let opCol = (newCol - currentCol) / 2 + currentCol
        let opRow = (newRow - currentRow) / 2 + currentRow
        board[opRow][opCol] = 0;
        //If piece reaches last row as a result of the jump it turns into a king:
        if ((turn === -1 && newRow === 0) || (turn === 1 && newRow === 7)) {
            if (board[currentRow][currentCol] === turn) {
                console.log("TURNING INTO KING!!!")
                board[newRow][newCol] = turn * 2
                board[currentRow][currentCol] = 0
                mightHaveToJumpPieces.push(cellTo)
                init()
            } else if (board[currentRow][currentCol] === turn * 2) {
                console.log("THIS IS KING ALREADY!!!")
                board[newRow][newCol] = currentValue
                board[currentRow][currentCol] = 0
                mightHaveToJumpPieces.push(cellTo)
                init()
            }
        } else {
            board[newRow][newCol] = currentValue
            board[currentRow][currentCol] = 0
            mightHaveToJumpPieces.push(cellTo)
            init()
        }


    }

    function highlightPieces(mjArray) {
        console.log("highlightPieces run...")
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
            let activePieces = []
            board.forEach((rowArr, rowIdx) => {
                let currentId
                let r = `${rowIdx}`
                rowArr.map((cell, colIdx) => {
                    if (cell === 0) return
                    if (cell === turn) {
                        let addId = cellState[turn].activePieces
                        let c = `${colIdx}`
                        currentId = 'r' + r + 'c' + c
                        let checkRow = rowIdx + turn  
                        let checkCellsVals = [board[checkRow][colIdx + 1], board[checkRow][colIdx - 1]]
                        let checkCellsIds = [`r${checkRow}c${colIdx + 1}`, `r${checkRow}c${colIdx - 1}`]
                        checkCellsVals.map((maybeEmptyCell, idx) => {
                            if (maybeEmptyCell === 0) {
                                activePieces.push(currentId)
                                let highlightEl = document.getElementById(currentId).childNodes[0]
                                highlightEl.setAttribute('id', addId)
                            }
                        })
                    } else if (cell === turn * 2) {
                        let addId = cellState[turn].active
                        let c = `${colIdx}`
                        currentId = 'r' + r + 'c' + c
                        let checkRows = [[rowIdx + turn], [rowIdx - turn]]
                        let checkCellsVals = []
                        let checkCellsIds = []
                        checkRows.map((el) => {
                            if (el < 0 || el > 7) { return }
                            checkCellsVals.push(board[el][colIdx + 1])
                            checkCellsIds.push(`r${el}c${colIdx + 1}`)
                            checkCellsVals.push(board[el][colIdx - 1])
                            checkCellsIds.push(`r${el}c${colIdx - 1}`)
                        })

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
    }

    function pieceHighlighter(arr) {
        console.log("pieceHighlighter run...., add event listener on span inside:", arr)
        currentMoveActivePieces = arr
        arr.forEach((elId) => {
            let addId = cellState[turn].activePiece
            let highlightEl = document.getElementById(elId).childNodes[0]
            highlightEl.setAttribute('id', addId)
            highlightEl.addEventListener('click', allowedMoves)
        })
    }

    function pieceHighlightRemove(arr) {
        console.log("PiecehighliteRemove run...", arr)
        arr.forEach((elId) => {
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
        return idArray
    }


    function allowedMoves(evt) {
        let availableMoves = []
        let cellCont = evt.target.parentNode
        if (cells.indexOf(cellCont) === -1 || cellCont.getAttribute('id') === 'board') return
        if (highlightCells.length > 0) {
            emptyCellHighlightRemove(highlightCells)
        }
        let currentElId = cellCont.getAttribute('id')
        let curRowIdx = parseInt(currentElId[1])
        let curColIdx = parseInt(currentElId[3])
        if (board[curRowIdx][curColIdx] === turn) {
            let aheadResults = checkMoveAhead(currentElId)
            aheadResults.forEach(el => availableMoves.push(el))
        } else if (board[curRowIdx][curColIdx] === turn * 2) {
            let results = []
            let aheadResults = checkMoveAhead(currentElId)
            let behindResults = checkMoveBehind(currentElId)
            if (aheadResults) {
                aheadResults.forEach(el => availableMoves.push(el))
            }
            if (behindResults) {
                behindResults.forEach(el => availableMoves.push(el))
            }

        }
        let mJumps = mandatoryJumps([currentElId])
        if (mJumps.length == 0) {
            highlightCells = availableMoves
            chosenPiece = currentElId
            availableMoves.forEach((elId) => {
                let currentActiveCell = document.getElementById(elId)

                currentActiveCell.addEventListener('click', processMove)
            })
            emptyCellHighlighter(availableMoves)
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
        return emptyCellsAhead
    }
    function checkMoveBehind(idString) {
        console.log("Check move behind run...", idString)
        let emptyCellsBehind = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])

        if (!board[curRowIdx - turn]) { return }
        let checkRow = curRowIdx - turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === 0) {
                emptyCellsBehind.push(checkCellsIds[idx])
            }
        })
        return emptyCellsBehind
    }
    function checkOpAhead(idString) {
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
        return opCellsAhead
    }

    function checkOpBehind(idString) {
        let opCellsBehind = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])

        if (!board[curRowIdx - turn]) { return }
        let checkRow = curRowIdx - turn
        let checkCellsVals = [board[checkRow][curColIdx + 1], board[checkRow][curColIdx - 1]]
        let checkCellsIds = [`r${checkRow}c${curColIdx + 1}`, `r${checkRow}c${curColIdx - 1}`]
        checkCellsVals.map((cell, idx) => {
            if (cell === turn * -1 || cell === turn * -2) {
                opCellsBehind.push(checkCellsIds[idx])
            }
        })
        return opCellsBehind
    }

    function checkEmptyAheadOneAfter(idString, oppAhead = []) {
        console.log("checkEmptyAheadOneAfter run", idString, oppAhead)
        let mayJump = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        for (let i = 0; i < oppAhead.length; i++) {
            let opRow = parseInt(oppAhead[i][1])
            console.log("opRow:", opRow)
            let opCol = parseInt(oppAhead[i][3])
            console.log("opCol:", opCol)

            if (!board[opRow + turn]) {
                console.log("Guard!!!")
                return
            }
            let checkCol = (opCol - curColIdx) * 2 + curColIdx
            console.log("checkCol", checkCol)
            if (board[opRow + turn][checkCol] !== 0) {
                console.log(board[opRow + turn][checkCol], "Guard!!!")
            } else if (board[opRow + turn][checkCol] === 0) {
                mayJump.push(`r${opRow + turn}c${checkCol}`)
            }
        }
        return mayJump
    }

    function checkEmptyBehindOneAfter(idString, oppBehind) {
        let mayJump = []
        let curRowIdx = parseInt(idString[1])
        let curColIdx = parseInt(idString[3])
        if (!oppBehind) { return }
        for (let i = 0; i < oppBehind.length; i++) {
            let opRow = parseInt(oppBehind[i][1])
            let opCol = parseInt(oppBehind[i][3])
            if (!board[opRow - turn]) { return }
            let checkCol = opCol - curColIdx + opCol
            if (board[opRow - turn][checkCol] !== 0) { return }
            if (board[opRow - turn][checkCol] === 0) {
                mayJump.push(`r${opRow - turn}c${checkCol}`)
            }
        }
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
        let haveToJumpPieces = []
        let mandatoryJumpsArr = []
        for (let i = 0; i < array.length; i++) {
            let curRowIdx = parseInt(array[i][1])
            let curColIdx = parseInt(array[i][3])
            if (board[curRowIdx][curColIdx] === turn) {
                let opAhead = checkOpAhead(array[i])
                let emptyAheadAfterOp = checkEmptyAheadOneAfter(array[i], opAhead)
                if (emptyAheadAfterOp) {
                    emptyAheadAfterOp.forEach(el => {
                        mandatoryJumpsArr.push(el)
                        haveToJumpPieces.push(array[i])
                    })
                }
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
        return mandatoryJumpsArr
    }

    function checkWinner(board) {
        let pieceCounter = 0
        board.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                if (cell === turn || cell === turn * 2) {
                    pieceCounter += 1
                }
            })
        })
        if (pieceCounter === 0) {
            winner = turn * -1
        }
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