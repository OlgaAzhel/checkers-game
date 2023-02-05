// render function must use cellState object and board array to update board view according to current game state

const cellState = {
    '1': { 'class': 'blue', 'html': "<span></span>" },
    '-1': { 'class': 'yellow', 'html': "<span></span>" },
    '2': { 'class': 'blueKing', 'html': "<span></span>" },
    '-2': { 'class': 'yellowKing', 'html': "<span></span>" },
    'a': {'class': 'active'},
    's': {'class': 'sleeping'}
}

let board = [
    [0, 1, 0, 1, 0, 1, 0, 1],
    [1, 0, 1, 0, 1, 0, 1, 0],
    [0, 1, 0, 1, 0, 1, 0, 1],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 2, 0, 0, 0, 0],
    [-1, 0, -1, 0, -2, 0, -1, 0],
    [0, -1, 0, -1, 0, -1, 0, -1],
    [-1, 0, -1, 0, -1, 0, -1, 0]
]


function render() {
    renderPieces()
    // function highlightCells()
    // function highlightPieces()
}

function renderPieces() {
    
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
            console.log(value)
            // refer to cellState object to get class and inner HTML from it
            let newHTML = cellState[value]["html"]
            let newClass = cellState[value]["class"]
            element.innerHTML = newHTML
            element.firstChild.classList.add(newClass)
        })

    })
}

render()



define(function () {

    return {
        // add here what to export
       renderPieces
    }
});