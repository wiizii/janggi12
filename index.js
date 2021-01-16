const canvas_board = document.getElementById("board");
const canvas_card = document.getElementById("card");
const ctx_board = canvas_board.getContext("2d");
const ctx_card = canvas_card.getContext("2d");

//////////////////////////////////////////////////////////
/////////////////////  board func  ///////////////////////
//////////////////////////////////////////////////////////
const boardRowCount = 4;
const boardColumnCount = 3;
const boardSize = 130;
const boardOffsetTop = (canvas_board.height - boardSize * 4) / 2;
const boardOffsetLeft = (canvas_board.width - boardSize * 3) / 2;

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

//////////////////////////////////////////////////////////
/////////////////////  card  func  ///////////////////////
//////////////////////////////////////////////////////////
const cardSize = 110;

function Card(num, r, c, stat, team) {
  this.num = num;
  this.r = r;
  this.c = c;
  this.stat = stat;
  this.team = team; //0: green, 1: red
}

var cards = [];
//init card
{
  cards[1] = new Card(1, 3, 1, 1, 0);
  cards[2] = new Card(2, 3, 0, 1, 0);
  cards[3] = new Card(3, 3, 2, 1, 0);
  cards[4] = new Card(4, 2, 1, 1, 0);
  cards[5] = new Card(5, 0, 0, 0, 0);
  cards[6] = new Card(6, 0, 1, 1, 1);
  cards[7] = new Card(7, 0, 0, 1, 1);
  cards[8] = new Card(8, 0, 2, 1, 1);
  cards[9] = new Card(9, 1, 1, 1, 1);
  cards[10] = new Card(10, 0, 0, 0, 1);
}

function drawCard(card) {
  if (card.stat == 0) return;
  var img = new Image();
  var p = { r: card.r, c: card.c };
  var cardX = board[p.r][p.c].x + (boardSize - cardSize) / 2;
  var cardY = board[p.r][p.c].y + (boardSize - cardSize) / 2;
  img.onload = function () {
    ctx_card.drawImage(img, cardX, cardY, cardSize, cardSize);
  };
  img.src = "./assets/" + (card.num + "") + ".png";
}

//////////////////////////////////////////////////////////
///////////////////////   init   /////////////////////////
//////////////////////////////////////////////////////////

function init() {
  for (var r = 0; r < boardRowCount; r++)
    for (var c = 0; c < boardColumnCount; c++) drawTile(r, c);
  for (var i = 1; i <= 10; i++) drawCard(cards[i]);
}

//////////////////////////////////////////////////////////
/////////////////////  game logic  ///////////////////////
//////////////////////////////////////////////////////////

init();
