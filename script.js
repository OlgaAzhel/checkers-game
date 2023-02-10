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
function generateBoard() {
    let newId = ''
    let sectionBoard = document.getElementById('board') 
    board.forEach((row,rowIdx) => {
        row.forEach((cell, cellIdx) => {
            let newDiv = document.createElement('div')
            newDiv.setAttribute('id', `r${row}c${cellIdx}}`)
            sectionBoard.appendChild(newDiv)
            cellBackground(row,cellIdx,newDiv)
        })
    })
}


function cellBackground(r,c, el) {
    if (r % 2 === 0 && c % 2 === 0) {
        el.style.backgroundColor = " rgb(122, 137, 181);"
    } else if (r % 2 === 1 && c % 2 === 1) {
        el.style.backgroundColor = " rgb(122, 137, 181);"
    }
    
}