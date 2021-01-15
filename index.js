const canvas = document.getElementById("canvas");
const boardCtx = canvas.getContext("2d");
const ctx = canvas.getContext("2d");

//card variable
const cardSize = 110;

//board variable
const boardRowCount = 4;
const boardColumnCount = 3;
const boardSize = 130;
const boardOffsetTop = (canvas.height - boardSize * 4) / 2;
const boardOffsetLeft = (canvas.width - boardSize * 3) / 2;

var board = [];
for (var r = 0; r < boardRowCount; r++) {
  board[r] = [];
  for (var c = 0; c < boardColumnCount; c++) {
    var boardX = c * boardSize + boardOffsetLeft;
    var boardY = r * boardSize + boardOffsetTop;
    board[r][c] = { x: boardX, y: boardY, card: 0 };
  }
}
//init card
{
  board[0][0].card = 7;
  board[0][1].card = 6;
  board[0][2].card = 8;
  board[1][1].card = 9;
  board[2][1].card = 4;
  board[3][0].card = 3;
  board[3][1].card = 1;
  board[3][2].card = 2;
}

function drawCard(num, x, y) {
  var img = new Image();
  img.onload = function () {
    ctx.drawImage(img, x, y, cardSize, cardSize);
  };
  img.src = "./assets/" + (num + "") + ".png";
}

function drawBoard() {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      boardCtx.beginPath();
      boardCtx.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
      if (r == 0) {
        boardCtx.fillStyle = "rgba(255,102,102,0.5)";
      } else if (r == 3) {
        boardCtx.fillStyle = "rgba(000,153,000,0.5)";
      } else {
        boardCtx.fillStyle = "rgba(255,204,102,0.5)";
      }
      boardCtx.fill();
      boardCtx.strokeStyle = "#000000";
      boardCtx.strokeRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
      boardCtx.closePath();
      if (board[r][c].card != 0) {
        var cardX = board[r][c].x + (boardSize - cardSize) / 2;
        var cardY = board[r][c].y + (boardSize - cardSize) / 2;
        drawCard(board[r][c].card, cardX, cardY);
      }
    }
  }
}

canvas.addEventListener("click", function (e) {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      var x = e.layerX,
        y = e.layerY;
      var sx = board[r][c].x,
        ex = board[r][c].x + boardSize;
      var sy = board[r][c].y,
        ey = board[r][c].y + boardSize;
      if (sx < x && x < ex && sy < y && y < ey) {
        var cardX = board[r][c].x + (boardSize - cardSize) / 2;
        var cardY = board[r][c].y + (boardSize - cardSize) / 2;
        drawCard(1, cardX, cardY);
        console.log(sx, sy, boardSize);
      }
    }
  }
});

//boardCtx.clearRect(0, 0, canvas.width, canvas.height);
drawBoard();
