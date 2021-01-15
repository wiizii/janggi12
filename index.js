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
  for (var r = 0; r < boardRowCount; r++)
    for (var c = 0; c < boardColumnCount; c++) drawTile(r, c);
}

function drawCard(r, c) {
  var img = new Image();
  var cardX = board[r][c].x + (boardSize - cardSize) / 2;
  var cardY = board[r][c].y + (boardSize - cardSize) / 2;
  img.onload = function () {
    ctx.drawImage(img, cardX, cardY, cardSize, cardSize);
  };
  img.src = "./assets/" + (board[r][c].card + "") + ".png";
}

function drawTile(r, c) {
  boardCtx.beginPath();
  boardCtx.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  if (board[r][c].color == "red") boardCtx.fillStyle = "#FFA07A";
  else if (board[r][c].color == "green") boardCtx.fillStyle = "#9ACD32";
  else if (board[r][c].color == "yellow") boardCtx.fillStyle = "#FAFAD2";
  else boardCtx.fillStyle = "rgba(255,051,255,0.5)";
  boardCtx.fill();
  boardCtx.strokeStyle = "#000000";
  boardCtx.strokeRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  boardCtx.closePath();
  if (board[r][c].card) drawCard(r, c);
}

function drawSelected(r, c) {
  board[r][c].color = "purple";
  drawTile(r, c);
  if (r == 0) board[r][c].color = "red";
  else if (r == 3) board[r][c].color = "green";
  else board[r][c].color = "yellow";
}

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
            drawSelected(r, c);
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
            drawTile(selR, selC);
            drawTile(r, c);
            isSel = 0;
            break;
          }
        }
      }
    }
  }
});

init();
