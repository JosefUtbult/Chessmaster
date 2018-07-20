export default async function () {


    const canvas = document.createElement("canvas");
    const context = canvas.getContext('2d');

    const windowHeight = 500;
    const windowWidth = 500;
    const offsetX = 50;
    const offsetY = 50;
    const tileSize = 50;

    const piecesFilePath = {
        'blackbishop': 'images/Black bishop.png',
        'blackking': 'images/Black king.png',
        'blackknight': 'images/Black knight.png',
        'blackpawn': 'images/Black pawn.png',
        'blackqueen': 'images/Black queen.png',
        'blackrook': 'images/Black rook.png',
        'whitebishop': 'images/White bishop.png',
        'whiteking': 'images/White king.png',
        'whiteknight': 'images/White knight.png',
        'whitepawn': 'images/White pawn.png',
        'whitequeen': 'images/White queen.png',
        'whiterook': 'images/White rook.png'
    };

    document.body.appendChild(canvas);

    canvas.width = windowWidth;
    canvas.height = windowHeight;
    canvas.style.width = windowWidth + "px";
    canvas.style.height = windowHeight + "px";

    let pieces = await generatePieces(piecesFilePath);
    let backLightGrid = generateBackLight();
    let painter = undefined;

    const standardDeps = {
        canvas,
        context,

        offsetX,
        offsetY,
        tileSize,
        pieces,
        backLightGrid,
        painter
    };


    painter = Painter(standardDeps);

    canvas.addEventListener("mousemove", e => {
        let rect = canvas.getBoundingClientRect();

        mouseLogic(e.clientX, e.clientY, standardDeps);
    });

    canvas.addEventListener('click', e => {
        let rect = canvas.getBoundingClientRect();

        clickLogic(e.clientX, e.clientY, standardDeps);
    });

    const loopFunction = () => {

        painter.paint();
        requestAnimationFrame(loopFunction);
    };

    requestAnimationFrame(loopFunction);

}


function Painter(deps) {

    const offsetX = deps.offsetX;
    const offsetY = deps.offsetY;
    const tileSize = deps.tileSize;
    const canvas = deps.canvas;
    const context = deps.context;
    const pieces = deps.pieces;

    return {
        paint
    };

    function paint() {

        for (let i = 0; i < 64; i++) {

            let posX = i % 8;
            let posY = Math.floor(i / 8);

            if(posX % 2 !== posY % 2) {
                if(deps.backLightGrid[posY][posX]){
                    context.fillStyle = "#d604d5";
                }
                else{
                    context.fillStyle = "#4f4e4e";
                }
            }
            else {
                if(deps.backLightGrid[posY][posX]){
                    context.fillStyle = "#24a923";
                }
                else{
                    context.fillStyle = "#969291";
                }
            }

            context.fillRect(posX * tileSize + offsetX, posY * tileSize + offsetY, tileSize, tileSize);

        }

        for (let i = 0; i < pieces.length; i++) {

            context.drawImage(pieces[i].getPieceImage(), pieces[i].getPosX() * tileSize + offsetX, pieces[i].getPosY() * tileSize + offsetY, tileSize, tileSize);
            //context.drawImage(pieces[i].getPieceImage(), pieces[i].posX * tileSize + offsetX, pieces[i].posY * tileSize + offsetY, tileSize, tileSize)
        }

    }
}

function ChessPiece(deps) {

    let image;
    const player = deps.player;
    const name = deps.name;
    const piecesFilePath = deps.piecesFilePath;

    let posX = deps.posX;
    let posY = deps.posY;

    const getAvailablePath = setAvailablePath(name);

    return {
        init,
        setPosX,
        setPosY,
        getPosX,
        getPosY,
        getPieceImage,
        getName,
        getAvailablePath
    };

    async function init() {
        try {
            image = new Image(deps.tileSize, deps.tileSize);
        } catch (e) {
            console.log(e);
        }

        image.src = piecesFilePath[player + name];
        return new Promise(resolve => {
            image.onload = resolve;
        })
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

    function getPieceImage() {
        return image;
    }

    function getName() {
        return name;
    }

    function setAvailablePath(name) {

        switch (name) {
            case 'pawn':

                return function () {

                    let pieces = [];

                    if(player === 'black' && posY > 0){

                        if(posY === 1){
                            pieces.push({
                                posY: posY + 2,
                                posX: posX
                            })
                        }

                        pieces.push({
                            posY: posY + 1,
                            posX: posX
                        })

                    }
                    else if(player === 'white' && posY < 7){

                        if(posY === 6){
                            pieces.push({
                                posY: posY - 2,
                                posX: posX
                            })
                        }

                        pieces.push({
                            posY: posY - 1,
                            posX: posX
                        })

                    }

                    return pieces;

                };

            case 'rook':

                return function () {

                    let pieces = [];

                    for (let currentPosY = 0; currentPosY < 8; currentPosY++) {
                        pieces.push({
                            posY: currentPosY,
                            posX: posX
                        })
                    }

                    for (let currentPosX = 0; currentPosX < 8; currentPosX++) {

                        pieces.push({
                            posY: posY,
                            posX: currentPosX
                        })

                    }

                    return pieces;

                };

            case 'knight':
                return function (deps) {
                    let pieces = [];

                    pieces.push({
                        posY: posY + 2,
                        posX: posX + 1
                    });

                    pieces.push({
                        posY: posY + 2,
                        posX: posX - 1
                    });

                    pieces.push({
                        posY: posY + 1,
                        posX: posX + 2
                    });

                    pieces.push({
                        posY: posY + 1,
                        posX: posX - 2
                    });

                    pieces.push({
                        posY: posY - 2,
                        posX: posX - 1
                    });

                    pieces.push({
                        posY: posY - 2,
                        posX: posX + 1
                    });

                    pieces.push({
                        posY: posY - 1,
                        posX: posX - 2
                    });

                    pieces.push({
                        posY: posY - 1,
                        posX: posX + 2
                    });

                    return pieces;
                };

            case 'bishop':
                return function () {

                    let pieces = [];

                    for (let i = 0; i < 4; i++) {

                        let deltaX = i === 0 || i === 1 ? 1 : -1;
                        let deltaY = i === 0 || i === 3 ? 1 : -1;

                        let currentPosX = posX + deltaX;
                        let currentPosY = posY + deltaY;

                        while ( currentPosX <= 7 &&
                        currentPosX >= 0 &&
                        currentPosY <= 7 &&
                        currentPosY >= 0){

                            pieces.push({

                                posX: currentPosX,
                                posY: currentPosY

                            });

                            currentPosX += deltaX;
                            currentPosY += deltaY;

                        }

                    }

                    return pieces;

                };

            case 'queen':

                return function () {

                    let pieces = [];

                    for (let i = 0; i < 8; i++) {

                        let deltaX, deltaY;

                        if(i === 0 )

                        let currentPosX = posX + deltaX;
                        let currentPosY = posY + deltaY;

                        while ( currentPosX <= 7 &&
                        currentPosX >= 0 &&
                        currentPosY <= 7 &&
                        currentPosY >= 0){

                            pieces.push({

                                posX: currentPosX,
                                posY: currentPosY

                            });

                            currentPosX += deltaX;
                            currentPosY += deltaY;

                        }

                    }

                    return pieces;

                };


            default:
                return function () {
                    console.log("Ehhh!");

                    return [undefined];
                }

        }

    }


}

async function generatePieces(piecesFilePath) {
    let pieces = [];

    pieces.push(await generatePiece('black', 0, 0, 'rook', piecesFilePath));
    pieces.push(await generatePiece('black', 1, 0, 'knight', piecesFilePath));
    pieces.push(await generatePiece('black', 2, 0, 'bishop', piecesFilePath));
    pieces.push(await generatePiece('black', 3, 0, 'queen', piecesFilePath));
    pieces.push(await generatePiece('black', 4, 0, 'king', piecesFilePath));
    pieces.push(await generatePiece('black', 5, 0, 'bishop', piecesFilePath));
    pieces.push(await generatePiece('black', 6, 0, 'knight', piecesFilePath));
    pieces.push(await generatePiece('black', 7, 0, 'rook', piecesFilePath));

    for (let i = 0; i < 8; i++) {
        pieces.push(await generatePiece('black', i, 1, 'pawn', piecesFilePath));
    }

    pieces.push(await generatePiece('white', 7, 7, 'rook', piecesFilePath));
    pieces.push(await generatePiece('white', 6, 7, 'knight', piecesFilePath));
    pieces.push(await generatePiece('white', 5, 7, 'bishop', piecesFilePath));
    pieces.push(await generatePiece('white', 4, 7, 'queen', piecesFilePath));
    pieces.push(await generatePiece('white', 3, 7, 'king', piecesFilePath));
    pieces.push(await generatePiece('white', 2, 7, 'bishop', piecesFilePath));
    pieces.push(await generatePiece('white', 1, 7, 'knight', piecesFilePath));
    pieces.push(await generatePiece('white', 0, 7, 'rook', piecesFilePath));

    for (let i = 0; i < 8; i++) {
        pieces.push(await generatePiece('white', i, 6, 'pawn', piecesFilePath));
    }
    
    return pieces;
}

async function generatePiece(player, posX, posY, name, piecesFilePath) {

    let chessPiece = ChessPiece({
        player,
        posX,
        posY,
        name,
        piecesFilePath
    });

    await chessPiece.init();

    return chessPiece;
}

function generateBackLight() {
    let backLightGrid = [];

    for(let posY = 0; posY < 8; posY++ ){

        backLightGrid.push([]);

        for (let posX = 0; posX < 8; posX++) {

            backLightGrid[posY].push(false);

        }

    }

    return backLightGrid;
}

function mouseLogic(mouseX, mouseY, deps){

    let currentPiece = goThroughPieces(deps, mouseX, mouseY);

    if(currentPiece !== undefined){

        lightUpTiles([{
            posX: currentPiece.getPosX(),
            posY: currentPiece.getPosY()
        }], deps);

    }
    else{

        lightUpTiles([undefined], deps);

    }

}

function goThroughPieces(deps, mouseX, mouseY) {

    let pieces = deps.pieces;

    for (let i = 0; i < pieces.length; i++) {

        if (pieces[i].getPosX() === Math.floor((mouseX - deps.offsetX) / deps.tileSize) &&
            pieces[i].getPosY() === Math.floor((mouseY - deps.offsetY) / deps.tileSize)) {

            return pieces[i];
        }
    }

}

function clickLogic(mouseX, mouseY, deps) {

    let currentPiece = goThroughPieces(deps, mouseX, mouseY);
    let availablePath;

    try{
        availablePath = currentPiece.getAvailablePath();
    } catch (e) {

        availablePath = [undefined];
    }

    lightUpTiles(availablePath, deps)

}

function lightUpTiles(tiles, deps) {

    for (let posY = 0; posY < deps.backLightGrid.length; posY++) {
        for (let posX = 0; posX < deps.backLightGrid[posY].length; posX++) {
            deps.backLightGrid[posY][posX] = false;
        }
    }

    for (let i = 0; i < tiles.length; i++) {

        try{
            deps.backLightGrid[tiles[i].posY][tiles[i].posX] = true;
        } catch (e) {
        }

    }

}
