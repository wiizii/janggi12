const canvas_board = document.getElementById("board");
const canvas_card = document.getElementById("card");
const ctx_board = canvas_board.getContext("2d");
const ctx_card = canvas_card.getContext("2d");

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

//////////////////////////////////////////////////////////
/////////////////////  draw func  ///////////////////////
//////////////////////////////////////////////////////////

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

function undraw(r, c) {
  ctx_card.clearRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
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
//////////////////////  utility  ////////////////////////
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

function getPos(e) {
  var pos = { r, c };
  for (var r = 0; r < boardRowCount; r++) {
    for (var c = 0; c < boardColumnCount; c++) {
      var sx = board[r][c].x;
      var ex = board[r][c].x + boardSize;
      var sy = board[r][c].y;
      var ey = board[r][c].y + boardSize;
      if (sx < e.layerX && e.layerX < ex && sy < e.layerY && e.layerY < ey)
        (pos.r = r), (pos.c = c);
    }
  }
  return pos;
}

function enableCardMove(r, c) {
  var dr = [-1, -1, 0, 1, 1, 1, 0, -1];
  var dc = [0, -1, -1, -1, 0, 1, 1, 1];
  var num = GAMESTAT.selCard;
  var nnum = board[r][c].card;
  var sel = num % 5 ? num % 5 : 5;
  switch (sel) {
    case 1:
      for (var i = 0; i < 8; i++) {
        var nr = GAMESTAT.pos.r + dr[i];
        var nc = GAMESTAT.pos.c + dc[i];
        if (
          ((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) &&
          nr == r &&
          nc == c
        )
          return true;
      }
      break;
    case 2:
      for (var i = 0; i < 8; i++) {
        if (i & 1) continue;
        var nr = GAMESTAT.pos.r + dr[i];
        var nc = GAMESTAT.pos.c + dc[i];
        if (
          ((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) &&
          nr == r &&
          nc == c
        )
          return true;
      }
      break;
    case 3:
      for (var i = 0; i < 8; i++) {
        if ((i & 1) == 0) continue;
        var nr = GAMESTAT.pos.r + dr[i];
        var nc = GAMESTAT.pos.c + dc[i];
        if (
          ((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) &&
          nr == r &&
          nc == c
        )
          return true;
      }
      break;
    case 4:
      var nr, nc;
      if (GAMESTAT.selCard == 4) {
        nr = GAMESTAT.pos.r + dr[0];
        nc = GAMESTAT.pos.c + dc[0];
      } else if (GAMESTAT.selCard == 9) {
        nr = GAMESTAT.pos.r + dr[4];
        nc = GAMESTAT.pos.c + dc[4];
      }
      if (
        ((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) &&
        nr == r &&
        nc == c
      )
        return true;
      break;
    case 5:
      var r1, r2;
      if (GAMESTAT.selCard == 5) {
        r1 = 3;
        r2 = 5;
      } else if (GAMESTAT.selCard == 10) {
        r1 = 1;
        r2 = 7;
      }
      for (var i = 0; i < 8; i++) {
        if (i == r1 || i == r2) continue;
        var nr = GAMESTAT.pos.r + dr[i];
        var nc = GAMESTAT.pos.c + dc[i];
        if (
          ((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) &&
          nr == r &&
          nc == c
        )
          return true;
      }
      break;
    default:
      break;
  }
  return false;
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
  pos: { r, c },
};

canvas_card.addEventListener("click", function (e) {
  var pos = getPos(e);
  if (pos.r == undefined || pos.c == undefined) return;
  if (!GAMESTAT.isSel) {
    if (!board[pos.r][pos.c].card) return;
    GAMESTAT.isSel = 1;
    drawSelected(pos.r, pos.c);
    GAMESTAT.pos = pos;
    GAMESTAT.selCard = board[pos.r][pos.c].card;
  } else {
    if (GAMESTAT.pos.r == pos.r && GAMESTAT.pos.c == pos.c) {
      undraw(pos.r, pos.c);
      drawCard(pos.r, pos.c);
      GAMESTAT.isSel = 0;
    } else {
      if (enableCardMove(pos.r, pos.c)) {
        board[GAMESTAT.pos.r][GAMESTAT.pos.c].card = 0;
        board[pos.r][pos.c].card = GAMESTAT.selCard;
        undraw(GAMESTAT.pos.r, GAMESTAT.pos.c);
        drawCard(pos.r, pos.c);
        GAMESTAT.isSel = 0;
      }
    }
  }
});
