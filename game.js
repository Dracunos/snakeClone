
var config = {
    width: 900,
    height: 600,
    parent: "gamediv",
    state: {
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);
var gameState;
var startText;

function create() {
    startText = game.add.text(0, 0, 'Press any key to begin');
    startText.fill = "#FFFFFF";
    startText.setTextBounds(0, 0, game.width, game.height);
    startText.boundsAlignH = "center";
    startText.boundsAlignV = "middle";
    
    gameState = "start";
    
    game.input.keyboard.addCallbacks(this, null, null, keyPress);
}

function update() {
    
}


function keyPress(char) {
    if (gameState == "start") {
        startText.text = "boo";
    }
}