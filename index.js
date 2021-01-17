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
  var num = gameManager.getSelectCard();
  var pos = gameManager.getPos();
  var nnum = board[r][c].card;
  var sel = num % 5 ? num % 5 : 5;
  switch (sel) {
    case 1:
      for (var i = 0; i < 8; i++) {
        var nr = pos.r + dr[i];
        var nc = pos.c + dc[i];
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
        var nr = pos.r + dr[i];
        var nc = pos.c + dc[i];
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
        var nr = pos.r + dr[i];
        var nc = pos.c + dc[i];
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
      if (num == 4) {
        nr = pos.r + dr[0];
        nc = pos.c + dc[0];
      } else if (num == 9) {
        nr = pos.r + dr[4];
        nc = pos.c + dc[4];
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
      if (num == 5) {
        r1 = 3;
        r2 = 5;
      } else if (num == 10) {
        r1 = 1;
        r2 = 7;
      }
      for (var i = 0; i < 8; i++) {
        if (i == r1 || i == r2) continue;
        var nr = pos.r + dr[i];
        var nc = pos.c + dc[i];
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
var gameManager = {
  turn: 0, //0: green, 1: red
  stat: false, //false: not select, true: select
  selectCard: 0,
  pos: { r, c },
  toggleTurn: function () {
    if (this.turn) this.turn = 0;
    else this.turn = 1;
  },
  toggleStat: function () {
    if (this.stat) this.stat = 0;
    else this.stat = 1;
  },
  getPos: function () {
    return this.pos;
  },
  setPos: function (pos) {
    this.pos = pos;
  },
  initPos: function () {
    this.pos.r = -1;
    this.pos.c = -1;
  },
  getSelectCard: function () {
    return this.selectCard;
  },
  setSelectCard: function (num) {
    this.selectCard = num;
  },
  setSelect: function (pos) {
    if (this.pos.r == pos.r && this.pos.c == pos.c) {
      undraw(pos.r, pos.c);
      drawCard(pos.r, pos.c);
      this.toggleStat();
      this.initPos();
      return;
    }
    if (this.stat) return;
    var selCard = board[pos.r][pos.c].card;
    if (
      selCard == 0 ||
      (this.turn && selCard <= 5) ||
      (!this.turn && selCard > 5)
    )
      return;
    drawSelected(pos.r, pos.c);
    this.toggleStat();
    this.setPos(pos);
    this.setSelectCard(selCard);
  },
  setCardMove: function (pos) {
    if (enableCardMove(pos.r, pos.c)) {
      board[this.pos.r][this.pos.c].card = 0;
      board[pos.r][pos.c].card = gameManager.selectCard;
      undraw(this.pos.r, this.pos.c);
      drawCard(pos.r, pos.c);
      this.toggleStat();
      this.toggleTurn();
      this.initPos();
    }
  },
};

canvas_card.addEventListener("click", function (e) {
  var pos = getPos(e);
  if (pos.r == undefined || pos.c == undefined) return;
  gameManager.setSelect(pos);
  gameManager.setCardMove(pos);
});
