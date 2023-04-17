function isDigit(char) {
    return char >= "0" && char <= "9";
}

function loadFromFEN(fenString) {
    let board = new Array();
    let lines = fenString.split(" ")[0].split("/");
    if (lines.length !== 8) throw new Error("Invalid FEN string: " + fenString);

    for (const line of lines) {
        for (const char of line) {
            if (isDigit(char)) {
                for (let i = 0; i < char; i++) {
                    board.push("");
                }
            } else {
                board.push(char);
            }
        }
    }

    if (board.length !== 64) throw new Error("Invalid FEN string: " + fenString);
    return board;
}

export default loadFromFEN;
