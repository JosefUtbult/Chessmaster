export default function () {


    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');

    const windowHeight = 500;
    const windowWidth = 500;
    const offsetX = 50;
    const offsetY = 50;
    const tileSize = 50;

    const piecesFilePath = {
        'blackBishop': 'images/Black bishop.png',
        'blackKing': 'images/Black king.png',
        'blackKnight': 'images/Black knight.png',
        'blackPawn': 'images/Black pawn.png',
        'blackQueen': 'images/Black queen.png',
        'blackRook': 'images/Black rook.png',
        'whiteBishop': 'images/White bishop.png',
        'whiteKing': 'images/White king.png',
        'whiteKnight': 'images/White knight.png',
        'whitePawn': 'images/White pawn.png',
        'whiteQueen': 'images/White queen.png',
        'whiteRook': 'images/White rook.png'
    };

    document.body.appendChild(canvas);

    canvas.width = windowWidth;
    canvas.height = windowHeight;
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowHeight + "px";

    let painter = Painter({
        canvas,
        context,

        offsetX,
        offsetY,
        tileSize
    });

    pieces = generatePices();

    painter.paint();

}


function Painter(deps) {

    const offsetX = deps.offsetX;
    const offsetY = deps.offsetY;
    const tileSize = deps.tileSize;
    const canvas = deps.canvas;
    const context = deps.context;
    const chessPices = deps.chessPices;
    const player = deps.player;

    return {
        paint
    };

    function paint() {

        for (let i = 0; i < 64; i++) {

            let posX = i % 8;
            let posY = Math.floor(i / 8);

            if(posX % 2 !== posY % 2) {
                context.fillStyle = "black";
            }
            else {
                context.fillStyle = "grey";
            }

            context.fillRect(posX * tileSize + offsetX, posY * tileSize + offsetY, tileSize, tileSize);

        }

    }
}

function ChessPiece(deps) {

    const player = deps.player;

    let posX = deps.posX;
    let posY = deps.posY;

    try {
        const image = new Image(deps.filePath);
    } catch (e) {
        console.log(e);
    }

    return {
        render
    };

    function render() {

    }

    function setPosX(newPosX) {
        posX = newPosX;
    }

    function setPosY(newPosY) {
        posY = newPosY;
    }

    function getPosX() {
        return posX;
    }

    function getPosY() {
        return posY;
    }

}

function generatePieces(filePath) {


    let pieces = [];

    pieces.push(ChessPiece({

        player: 1,
        posX: 0,
        posY: 0,
        filePath: filePath.get('blackBishop')

    }));

    return pieces;

}