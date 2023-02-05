////////////////////////// Pseudo code ////////////////////////

//User click 'New Game' button:
//function init() invoke, ask user to input their names into players' fields and click "Start game"
// render() game using default game state variables and names inputs
// run function to check if any mandatory jumps (mandatoryJump())(
// render 'active pieces' (function findActivePieces())
// add event listeners to them with renderBoard() as a callback
//Player choose the piece (pieceEl)
//Update board (renderBoard() called)
// highlight available cells for the move (function allowedMoves(pieceEl). Logic must depend on type of piece (regular or King)
// add event listeners to those cells
// Player make a move
// invoke handleMove() {
// update board array
// if the players move actually was a "jump" --->
// afterLastJumpMovesCounter = 0
//--->check if any further mandatory jumps (mandatoryJump()) ---> if true ---> renderBoard() -----> highlight available cells for the move (function allowedMoves(pieceEl). Logic must depend on type of piece (regular or King) ---->Player makes another jump---> call mandatoryJump() --->
// if "jump" has been made, call checkWinner() 
// else ---> (if simple move was done) --->
// afterLastJumpMovesCounter++
// check if the piece reached the last row, if true ---> change cellState to King value
// check if a tie when none has anymore spots to move
// switch turn
// render()
//}


// ////////////////////// constants ///////////////////
// cellState = {
//     blue: 1,
//     yellow: -1,
//     blueKing: 2,
//     yellowKnig: -2,
//     active: 'a',
//     sleeping: 's'
// }

// /////////////////////// variables /////////////////////
// let board
// let turn = 1
// let winner = null;
// let currentPhase = null;  //// 'choose a Piece' / 'make a Move'
// let afterLastJumpMovesCounter = 0. /// tie situation when kings just run away from each other all the time

///////////////////// cached elements /////////////////////
// boardCells
// play again button
// message1
// message2 
// rules button


////////////////////// event listeners ////////////////////
// New game / play again button
// rules button
// boardCells

///////////////////// functions//////////////////////////// 

function init() // - initialize all game state and call render
// function that will ask to key in players names and press start game 
//  set all game state variables to default values
turn = 1
board = [ // NEED TO THINK MORE WHAT TYPE OF ARRAY TO USE FOR BOARD AND WHAT'S BETTER HTML STRUCTURE FOR THE CELLS
    [0, 1, 0, 1, 0, 1, 0, 1]
    [1, 0, 1, 0, 1, 0, 1, 0]
    [0, 1, 0, 1, 0, 1, 0, 1]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [0, 0, 0, 0, 0, 0, 0, 0]
    [-1, 0, -1, 0, -1, 0, -1, 0]
    [0, -1, 0, -1, 0, -1, 0, -1]
    [-1, 0, -1, 0, -1, 0, -1, 0]
]
// call render()
function render() // - visualize game state
// switch turn pointer position
// change message at players fields to tell who's turn is now 
// render board
function renderBoard()
// visualize board state
// visualize active pieces if currentPhase = 'choose a Piece'

function findActivePieces()  // calculate each cell state and provide data for render board
// visualize active cells if currentPhase = 'make a Move'
function allowedMoves(currentPieceEl) {
    // calculate active cells for the picked piece
    let currentElId = currentPieceEl.getArrribute('id')
    let curRowIdx = currentElId[1]
    let curColIdx = currentElId[3]
    // if current board cell has value 1 or -1
    if (board[curRowIdx][curColIdx] === 1 || board[curRowIdx][curColIdx] === - 1 ) {

    }


    // if current board cell has value 2 or -2 (King) 
    if (board[curRowIdx][curColIdx] === 2 || board[curRowIdx][curColIdx] === - 2) {

    }
    //return array of allowed elemnts' ids
}


function handleMove(evt) // - function is an event listener's callback. 
//Process results of player's choice, update board array based on it, switch turn or celebrate a win situation. Call render() if no win 

// player clicks on a cell
// get cell index through evt.target
// update board state

// call render()

function mandatoryJump()  //check if mandatory further jump and if there is an option for player to chose


function checkWinner() // invoke if "jump" has been made --->check if no more opponent's pieces left (iterate through board array) ---> if true ---> 
	// update players field messages
	// (maybe) add "dancing" animation on winners pieces
	// change visualization of a "New game button" (make it bigger and brighter)



