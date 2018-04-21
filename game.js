

function setupCanvas() {

    var canvas = document.getElementById("game");

    var ctx = canvas.getContext("2d");

    var canvasHeight = window.innerHeight - 3;

    ctx.canvas.height = canvasHeight;
    ctx.canvas.width = 1.5*canvasHeight;
    canvas.style.border = "1px solid";
}

console.log("test")

setupCanvas();
window.addEventListener('resize', function(){setupCanvas();}, true);