const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//card variable
const cardWidth = 100;
const cardHeight = 100;

//board variable
const boardRowCount = 4;
const boardColumnCount = 3;
const boardWidth = 130;
const boardHeight = 130;
const boardOffsetTop = (canvas.height - boardHeight * 4) / 2;
const boardOffsetLeft = (canvas.width - boardWidth * 3) / 2;

var board = [];
for (var r = 0; r < boardRowCount; r++) {
  board[r] = [];
  for (var c = 0; c < boardColumnCount; c++) {
    var boardX = c * boardWidth + boardOffsetLeft;
    var boardY = r * boardHeight + boardOffsetTop;
    board[r][c] = { x: boardX, y: boardY };
  }
}

function drawCard(num, x, y) {
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, x, y, cardWidth, cardHeight);
    console.log("asdf");
  };
  img.src = "./assets/" + (num + "") + ".png";
  console.log(img.src);
}

function drawBoard() {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      ctx.beginPath();
      ctx.rect(board[r][c].x, board[r][c].y, boardWidth, boardHeight);
      if (r == 0) {
        ctx.fillStyle = "rgba(255,102,102,0.5)";
      } else if (r == 3) {
        ctx.fillStyle = "rgba(000,153,000,0.5)";
      } else {
        ctx.fillStyle = "rgba(255,204,102,0.5)";
      }
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.strokeRect(board[r][c].x, board[r][c].y, boardWidth, boardHeight);
      ctx.closePath();
    }
  }
}

function drawInit() {
  drawBoard();
  drawCard(1, 50, 50);
}

drawInit();
