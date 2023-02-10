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
    /////////////////// Functions ////////////////////
    function generateBoard() {
        let newId = ''
        let sectionBoard = document.getElementById('board')
        board.forEach((row, rowIdx) => {
            row.forEach((cell, cellIdx) => {
                let newDiv = document.createElement('div')
                newId = `r${rowIdx}c${cellIdx}`
                console.log(newDiv)
                newDiv.setAttribute('id', newId)
                sectionBoard.appendChild(newDiv)
                if (rowIdx % 2 === 0 && cellIdx % 2 === 1) {
                    newDiv.style.backgroundColor = "rgb(122, 137, 181)"
                } else if (rowIdx % 2 === 1 && cellIdx % 2 === 0) {
                    newDiv.style.backgroundColor = "rgb(122, 137, 181)"
                }
            })
        })
    }