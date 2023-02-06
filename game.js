// Turn of each game will have different phases. Behavior of controllers will depend on phase of the turn.
// Phases
    // Function mandatoryJumps runs if false, function findActivePieces runs adds event listeners to active pieces, changes phase to choosePiece, sets clickCounter variable to 0
    // choosePiece
        // Player clicks on active piece, call availableMoves, the function should add event listeners to available empty cells, highlight cells for the move/jump, change phase to makeAmove/ makeAJump
    // makeAmove
        // player clicks on another active piece:
            // remove empty cell highlight
            // add highlight on another empty cell according to a new piece choice
        // player clicks on highlighted empty cell
            // change phase to moveComplete
            // capture current piece cell id
            // capture new cell id
            // call function that will update board state - current value change to 0,
            // new value change to turn or turn*2
            // remove event listeners from all cells and pieces
    // makeAjump
//}






define(function () {

    return {
        // add here what to export

    }
});