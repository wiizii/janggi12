const canvas = document.getElementById("canvas");
const boardCtx = canvas.getContext("2d");
const ctx = canvas.getContext("2d");

//game variable
var turn = 0; //0 : green,  1 : red

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
    if (r == 0) board[r][c].color = "red";
    else if (r == 3) board[r][c].color = "green";
    else board[r][c].color = "yellow";
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

function init() {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      drawTile(board[r][c]);
      if (board[r][c].card != 0) drawCard(board[r][c]);
    }
  }
}

function drawCard(board) {
  var img = new Image();
  var cardX = board.x + (boardSize - cardSize) / 2;
  var cardY = board.y + (boardSize - cardSize) / 2;
  img.onload = function () {
    ctx.drawImage(img, cardX, cardY, cardSize, cardSize);
  };
  img.src = "./assets/" + (board.card + "") + ".png";
}

function drawTile(board) {
  boardCtx.beginPath();
  boardCtx.rect(board.x, board.y, boardSize, boardSize);
  if (board.color == "red") boardCtx.fillStyle = "rgba(255,102,102,0.5)";
  else if (board.color == "green") boardCtx.fillStyle = "rgba(000,153,000,0.5)";
  else boardCtx.fillStyle = "rgba(255,204,102,0.5)";
  boardCtx.fill();
  boardCtx.strokeStyle = "#000000";
  boardCtx.strokeRect(board.x, board.y, boardSize, boardSize);
  boardCtx.closePath();
}

// function drawCardMovement(num) {}

//current selected variable
var isSel = 0;
var selCard = 0;
var selR = 0;
var selC = 0;

canvas.addEventListener("click", function (e) {
  if (!isSel) {
    for (var r = 0; r < boardRowCount; r++) {
      for (var c = 0; c < boardColumnCount; c++) {
        var x = e.layerX;
        var y = e.layerY;
        var sx = board[r][c].x;
        var ex = board[r][c].x + boardSize;
        var sy = board[r][c].y;
        var ey = board[r][c].y + boardSize;
        if (sx < x && x < ex && sy < y && y < ey) {
          if (board[r][c].card) {
            selCard = board[r][c].card;
            board[r][c].card = 0;
            selR = r;
            selC = c;
            isSel = 1;
            break;
          }
        }
      }
    }
  } else {
    for (var r = 0; r < boardRowCount; r++) {
      for (var c = 0; c < boardColumnCount; c++) {
        var x = e.layerX;
        var y = e.layerY;
        var sx = board[r][c].x;
        var ex = board[r][c].x + boardSize;
        var sy = board[r][c].y;
        var ey = board[r][c].y + boardSize;
        if (sx < x && x < ex && sy < y && y < ey) {
          if (selR == r && selC == c) {
            alert("same position");
          } else {
            board[r][c].card = selCard;
            ctx.clearRect(
              board[selR][selC].x,
              board[selR][selC].y,
              boardSize,
              boardSize
            );
            drawTile(board[selR][selC]);
            drawCard(board[r][c]);
            isSel = 0;
            break;
          }
        }
      }
    }
  }
});

init();
