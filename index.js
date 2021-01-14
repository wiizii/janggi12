const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//card variable
const cardWidth = 110;
const cardHeight = 110;

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
    ctx.drawImage(img, x, y, cardWidth, cardHeight);
  };
  img.src = "./assets/" + (num + "") + ".png";
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
      if (board[r][c].card != 0) {
        var cardX = board[r][c].x + (boardWidth - cardWidth) / 2;
        var cardY = board[r][c].y + (boardHeight - cardHeight) / 2;
        drawCard(board[r][c].card, cardX, cardY);
      }
    }
  }
}

function drawInit() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBoard();
}

drawInit();
