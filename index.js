const canvas_board = document.getElementById("board");
const canvas_card = document.getElementById("card");
const ctx_board = canvas_board.getContext("2d");
const ctx_card = canvas_card.getContext("2d");

//////////////////////////////////////////////////////////
/////////////////////  draw func  ///////////////////////
//////////////////////////////////////////////////////////
const boardRowCount = 4;
const boardColumnCount = 3;
const boardSize = 130;
const boardOffsetTop = (canvas_board.height - boardSize * 4) / 2;
const boardOffsetLeft = (canvas_board.width - boardSize * 3) / 2;
const cardSize = 110;

var board = [];
for (var r = 0; r < boardRowCount; r++) {
  board[r] = [];
  for (var c = 0; c < boardColumnCount; c++) {
    var boardX = c * boardSize + boardOffsetLeft;
    var boardY = r * boardSize + boardOffsetTop;
    board[r][c] = { x: boardX, y: boardY, card: 0 };
  }
}

function drawTile(r, c) {
  ctx_board.beginPath();
  ctx_board.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  if (r == 0) ctx_board.fillStyle = "rgba(240,60,60,0.5)";
  else if (r == 3) ctx_board.fillStyle = "rgba(90,230,20,0.5)";
  else ctx_board.fillStyle = "rgba(240,240,80,0.5)";
  ctx_board.fill();
  ctx_board.strokeStyle = "#000000";
  ctx_board.strokeRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  ctx_board.closePath();
}

function drawSelected(r, c) {
  ctx_card.beginPath();
  ctx_card.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  ctx_card.fillStyle = "rgba(240,120,220,0.5)";
  ctx_card.fill();
  ctx_card.closePath();
}

function undrawSelected(r, c) {
  ctx_card.clearRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
  drawCard(r, c);
}

function drawCard(r, c) {
  if (board[r][c].card == 0) return;
  var img = new Image();
  var cardX = board[r][c].x + (boardSize - cardSize) / 2;
  var cardY = board[r][c].y + (boardSize - cardSize) / 2;
  img.onload = function () {
    ctx_card.drawImage(img, cardX, cardY, cardSize, cardSize);
  };
  img.src = "./assets/" + (board[r][c].card + "") + ".png";
}

//////////////////////////////////////////////////////////
///////////////////////   init   /////////////////////////
//////////////////////////////////////////////////////////

function init() {
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
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      drawTile(r, c);
      drawCard(r, c);
    }
  }
}

//////////////////////////////////////////////////////////
/////////////////////  game logic  ///////////////////////
//////////////////////////////////////////////////////////

init();

//current status with singleton
var GAMESTAT = {
  turn: 0, //0: green, 1: red
  isSel: 0,
  selCard: 0,
  r: -1,
  c: -1,
};

canvas_card.addEventListener("click", function (e) {
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      var sx = board[r][c].x;
      var ex = board[r][c].x + boardSize;
      var sy = board[r][c].y;
      var ey = board[r][c].y + boardSize;
      if (sx < e.layerX && e.layerX < ex && sy < e.layerY && e.layerY < ey) {
        if (!GAMESTAT.isSel) {
          drawSelected(r, c);
          GAMESTAT.isSel = 1;
        } else {
          undrawSelected(r, c);
          GAMESTAT.isSel = 0;
        }
      }
    }
  }
});
