// REWROTE TO UNDERSTAND LOGIC

export type Board = string[]

type Game = {
    board: Board
}

export type WinCondition = {
    outcome: 'win' | 'draw' | null,
    winner?: String 
}

type MaybeWinningPosition = number[]

export function checkWinCondition(game: Game): WinCondition{

    //possible winning positions on the board
    const possibleWinPositions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7,], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]
    //evaluates if the board at that possible win position is a winner, if so it returns the first item in that position(so we can know if 
    //winner is x or o)
    function checkIfWinner(possibleWinPosition: MaybeWinningPosition) {
        const firstItem = game.board[possibleWinPosition[0]]
        const secondItem = game.board[possibleWinPosition[1]]
        const thirdItem = game.board[possibleWinPosition[2]]

        if (firstItem && firstItem === secondItem && secondItem === thirdItem) {
            console.log(firstItem)
            return firstItem
            } return "";
        } 

    // now , i want to check whether any of these possible positions on the actual board are winners
    for(let i = 0; i < possibleWinPositions.length; i++) {
        // calls a function to evaluate if the board at that possible win position is filled in, and if so assigns it as the winner 
        const winner = checkIfWinner(possibleWinPositions[i])
        // checks that winner isnt an empty string and if so returns the outcome of WIN 
        if (winner !== "") {
            return { outcome: 'win', winner }
        }
    }
    // if no winner found , check if it's a draw 
    const areThereAnySpaces = game.board.includes("")
    const isDraw = !areThereAnySpaces;
    if (isDraw) {
        return { outcome: 'draw' }
    }
    // if not full and no winner, keep playing
    return { outcome: null }
} 



