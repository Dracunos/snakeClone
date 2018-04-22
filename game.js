
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
var upKey;
var downKey;
var leftKey;
var rightKey;
var player;
var playerBody;
var food;
var playerSize = 25;
var tail = [];

function create() {
    var startText = game.add.text(0, 0, 'Press any key to begin');
    startText.fill = "#FFFFFF";
    startText.setTextBounds(0, 0, game.width, game.height);
    startText.boundsAlignH = "center";
    startText.boundsAlignV = "middle";
    
    gameState = "start";
    
    game.input.keyboard.addCallbacks(this, null, null, startKeyPress);
}

function update() {
    if (gameState == "start") {
        return;
    }
    checkKeys();
    movePlayer();
    checkCollision();
    handleTail();
}

function createPlayer() {
    player = game.add.graphics(game.width/2, game.height/2);
    player.beginFill(0x999999);
    player.drawCircle(0, 0, playerSize);
    player.endFill();
    player.direction = "center";
    player.size = 0;
    player.currentSize = 0;
    game.physics.enable(player);
    player.body.setCircle(playerSize/2, -playerSize/2, -playerSize/2);
}

function movePlayer() {
    if (player.direction == "center") {
        return;
    } else if (player.direction == "left") {
        player.x -= 0.3 * game.time.elapsedMS;
    } else if (player.direction == "right") {
        player.x += 0.3 * game.time.elapsedMS;
    } else if (player.direction == "up") {
        player.y -= 0.3 * game.time.elapsedMS;
    } else if (player.direction == "down") {
        player.y += 0.3 * game.time.elapsedMS;
    }
}

function handleTail() {
    if (player.size <= player.currentSize) {
        createTail();
        return;
    }
    player.currentSize += 0.1;
    // draw circles with rectangle connecting
    // rectangle grows until change direction, then new rectangle grows
    // once player stops growing, tail starts disappearing, in this case
    //  moving the last circle toward the next circle, making the rectangle
    //  smaller
    if (player.changeDir) {
        player.changeDir = false;
        tail.push(game.add.graphics(player.x, player.y));
        var growth = tail[tail.length - 1];
        growth.beginFill(0x999999);
        growth.drawCircle(0, 0, playerSize);
        growth.endFill();
        game.physics.enable(growth);
        growth.body.setCircle(playerSize/2, -playerSize/2, -playerSize/2);
        tail.push(game.add.graphics(player.x, player.y));
        game.physics.enable(growth);
        return;
    }
    createTail();
}

function createTail() {
    for (var i = tail.length - 1; i >= 0; i--) {
        if (i % 2 == 1) {
            continue
        }
        if (i == 0) {
            adjustRect(tail[i+1], player, tail[i]);
        } else {
            adjustRect(tail[i+1], tail[i-1], tail[i]);
        }
        
    }
}

function adjustRect(circ1, circ2, rect) {
    // May need to manually change collision
    if (circ1.x == circ2.x) {
        if (circ2.y < circ1.y) {
            var x = circ2;
            circ2 = circ1;
            circ1 = x;
        }
        rect.x = circ1.x - playerSize;
        rect.y = circ1.y;
        rect.beginFill(0x999999);
        rect.drawRect(0, 0, playerSize*2, circ2.y - circ1.y);
        rect.endFill();
    } else {
        if (circ2.x < circ1.x) {
            var x = circ2;
            circ2 = circ1;
            circ1 = x;
        }
        rect.x = circ1.x;
        rect.y = circ1.y - playerSize;
        rect.beginFill(0x999999);
        rect.drawRect(0, 0, circ2.x - circ1.x, playerSize*2);
        rect.endFill();
    }
}

function checkCollision() {
    if (game.physics.arcade.overlap(player, food)) {
        food.destroy();
        player.size += 1;
        player.changeDir = true; // to start growth process
    }
    if (player.body.checkWorldBounds()) {
        killPlayer();
    }
}

function killPlayer() {
    player.direction = "center";
}

function spawnFood() {
    var posX = 100;
    var posY = 100;
    food = game.add.graphics(posX, posY);
    food.beginFill(0x999999);
    food.drawRect(0, 0, 20, 20);
    food.endFill();
    game.physics.enable(food);
}

function checkKeys() {
    if (upKey.isDown) {
        player.direction = 'up';
        player.changeDir = true;
    } else if (downKey.isDown) {
        player.direction = 'down';
        player.changeDir = true;
    } else if (leftKey.isDown) {
        player.direction = 'left';
        player.changeDir = true;
    } else if (rightKey.isDown) {
        player.direction = 'right';
        player.changeDir = true;
    }
}

function startKeyPress(char) {
    if (gameState == "start") {
        setupGame();
    }
}

function setupGame() {
    gameState = "game";
    game.world.removeAll();
    
    game.input.keyboard.removeCallbacks();
    upKey = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    game.physics.startSystem(Phaser.Physics.ARCADE);
    createPlayer();
    spawnFood();
}