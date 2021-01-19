const canvas_board = document.getElementById('board');
const canvas_card = document.getElementById('card');
const ctx_board = canvas_board.getContext('2d');
const ctx_card = canvas_card.getContext('2d');

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

const poroCount = 6;
const poroSize = (boardSize * 3) / 6;
const poroOffsetTop = 0;
const poroOffsetBottom = canvas_board.height - poroSize;
const poroOffsetLeft = (canvas_board.width - boardSize * 3) / 2;

var redPoro = [];
var greenPoro = [];

for (var i = 0; i < poroCount; i++) {
	var poroX = i * poroSize + poroOffsetLeft;
	var poroRedY = poroOffsetTop;
	var poroGreenY = poroOffsetBottom;
	redPoro[i] = { x: poroX, y: poroRedY, card: 0 };
	greenPoro[i] = { x: poroX, y: poroGreenY, card: 0 };
}

//////////////////////////////////////////////////////////
/////////////////////  draw func  ///////////////////////
//////////////////////////////////////////////////////////

function drawTile(r, c) {
	ctx_board.beginPath();
	ctx_board.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
	if (r == 0) ctx_board.fillStyle = 'rgba(240,60,60,0.5)';
	else if (r == 3) ctx_board.fillStyle = 'rgba(90,230,20,0.5)';
	else ctx_board.fillStyle = 'rgba(240,240,80,0.5)';
	ctx_board.fill();
	ctx_board.strokeStyle = '#000000';
	ctx_board.strokeRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
	ctx_board.closePath();
}

function drawPoroTile(poro) {
	ctx_board.beginPath();
	ctx_board.rect(poro.x, poro.y, poroSize, poroSize);
	ctx_board.strokeStyle = '#000000';
	//나중에 테두리를 지워버리자
	ctx_board.strokeRect(poro.x, poro.y, poroSize, poroSize);
	ctx_board.closePath();
}

function drawSelected(r, c) {
	ctx_card.beginPath();
	ctx_card.rect(board[r][c].x, board[r][c].y, boardSize, boardSize);
	ctx_card.fillStyle = 'rgba(240,120,220,0.5)';
	ctx_card.fill();
	ctx_card.closePath();
}

function drawPoroSelected(team, i) {
	ctx_card.beginPath();
	if (team == 0) ctx_card.rect(greenPoro[i].x, greenPoro[i].y, poroSize, poroSize);
	else ctx_card.rect(redPoro[i].x, redPoro[i].y, poroSize, poroSize);
	ctx_card.fillStyle = 'rgba(240,120,220,0.5)';
	ctx_card.fill();
	ctx_card.closePath();
}

function undraw(r, c) {
	ctx_card.clearRect(board[r][c].x, board[r][c].y, boardSize, boardSize);
}

function poroUndraw(team, i) {
	if (team == 0) ctx_card.clearRect(greenPoro[i].x, greenPoro[i].y, poroSize, poroSize);
	else ctx_card.clearRect(redPoro[i].x, redPoro[i].y, poroSize, poroSize);
}

function drawCard(r, c) {
	if (board[r][c].card == 0) return;
	var img = new Image();
	var cardX = board[r][c].x + (boardSize - cardSize) / 2;
	var cardY = board[r][c].y + (boardSize - cardSize) / 2;
	img.onload = function () {
		ctx_card.drawImage(img, cardX, cardY, cardSize, cardSize);
	};
	img.src = './assets/' + (board[r][c].card + '') + '.png';
}

function drawPoro(poro) {
	for (var i = 0; i < poroCount; i++) {
		if (poro[i].card == 0) continue;
		(function (i) {
			var img = new Image();
			var x = poro[i].x;
			var y = poro[i].y;
			var card = poro[i].card;
			img.onload = function () {
				ctx_card.drawImage(img, x, y, poroSize, poroSize);
			};
			img.src = './assets/' + (card + '') + '.png';
			console.log();
		})(i);
	}
}

//////////////////////////////////////////////////////////
//////////////////////  utility  /////////////////////////
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
	for (var i = 0; i < poroCount; i++) {
		drawPoroTile(redPoro[i]);
		drawPoroTile(greenPoro[i]);
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
			if (sx < e.layerX && e.layerX < ex && sy < e.layerY && e.layerY < ey) (pos.r = r), (pos.c = c);
		}
	}
	return pos;
}

function getPoroPos(e, poro) {
	var num;
	for (var i = 0; i < poroCount; i++) {
		var sx = poro[i].x;
		var ex = poro[i].x + poroSize;
		var sy = poro[i].y;
		var ey = poro[i].y + poroSize;
		if (sx < e.layerX && e.layerX < ex && sy < e.layerY && e.layerY < ey) num = i;
	}
	return num;
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
				if (((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) && nr == r && nc == c) return true;
			}
			break;
		case 2:
			for (var i = 0; i < 8; i++) {
				if (i & 1) continue;
				var nr = pos.r + dr[i];
				var nc = pos.c + dc[i];
				if (((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) && nr == r && nc == c) return true;
			}
			break;
		case 3:
			for (var i = 0; i < 8; i++) {
				if ((i & 1) == 0) continue;
				var nr = pos.r + dr[i];
				var nc = pos.c + dc[i];
				if (((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) && nr == r && nc == c) return true;
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
			if (((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) && nr == r && nc == c) return true;
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
				if (((num <= 5 && nnum > 5) || (nnum <= 5 && num > 5) || nnum == 0) && nr == r && nc == c) return true;
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
	stat: 0, //0: not select, 1: select card, 2: select poro, 3: red Win, 4: green Win
	selectCard: 0,
	pos: { r, c },
	poroPos: -1,
	toggleTurn: function () {
		if (this.turn) this.turn = 0;
		else this.turn = 1;
	},
	setStat: function (num) {
		this.stat = num;
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
			this.setStat(0);
			this.initPos();
			return;
		}
		if (this.stat) return;
		var selCard = board[pos.r][pos.c].card;
		if (selCard == 0 || (this.turn && selCard <= 5) || (!this.turn && selCard > 5)) return;
		drawSelected(pos.r, pos.c);
		this.setStat(1);
		this.setPos(pos);
		this.setSelectCard(selCard);
	},
	setCardMove: function (pos) {
		if (this.stat == 0) return;
		else if (this.stat == 1) {
			if (enableCardMove(pos.r, pos.c)) {
				board[this.pos.r][this.pos.c].card = 0;
				//catch other card
				if (board[pos.r][pos.c].card != 0) {
					if (board[pos.r][pos.c].card == 1) {
						this.setStat(3);
					}
					if (board[pos.r][pos.c].card == 6) {
						this.setStat(4);
					}
					if (this.turn == 0) {
						for (var i = 0; i < poroCount; i++) {
							if (greenPoro[i].card == 0) {
								greenPoro[i].card = board[pos.r][pos.c].card - 5;
								if (greenPoro[i].card == 5) greenPoro[i].card--;
								break;
							}
						}
						drawPoro(greenPoro);
					} else {
						for (var i = 0; i < poroCount; i++) {
							if (redPoro[i].card == 0) {
								redPoro[i].card = board[pos.r][pos.c].card + 5;
								if (redPoro[i].card == 10) redPoro[i].card--;
								break;
							}
						}
						drawPoro(redPoro);
					}
				}
				board[pos.r][pos.c].card = this.selectCard;
				if ((!this.turn && pos.r == 0 && this.selectCard == 4) || (this.turn && pos.r == 3 && this.selectCard == 9))
					board[pos.r][pos.c].card++;
				undraw(this.pos.r, this.pos.c);
				drawCard(pos.r, pos.c);
				if (this.stat == 3) {
					alert('Red Win!');
					location.reload();
				}
				if (this.stat == 4) {
					alert('Green Win!');
					location.reload();
				}
				this.setStat(0);
				this.toggleTurn();
				this.initPos();
			}
		} else {
			//move poro
			if (board[pos.r][pos.c].card != 0) return;
			if (this.turn && pos.r == 3) {
				alert('You must select other tile');
				return;
			}
			if (!this.turn && pos.r == 0) {
				alert('You must select other tile');
				return;
			}
			board[pos.r][pos.c].card = this.selectCard;
			drawCard(pos.r, pos.c);
			if (this.turn) redPoro[this.poroPos].card = 0;
			else greenPoro[this.poroPos].card = 0;
			poroUndraw(this.turn, this.poroPos);
			this.turn ? drawPoro(redPoro) : drawPoro(greenPoro);
			this.setStat(0);
			this.initPos();
			this.poroPos = 0;
			this.toggleTurn();
		}
	},
	setPoroSelect: function (i) {
		var card = this.turn ? redPoro[i].card : greenPoro[i].card;
		if (card == 0) return;
		if (this.selectCard == card) {
			poroUndraw(this.turn, i);
			this.turn ? drawPoro(redPoro) : drawPoro(greenPoro);
			this.setStat(0);
			this.initPos();
			this.selectCard = -1;
			this.poroPos = -1;
			return;
		}
		if (this.stat) return;
		if (this.turn) {
			this.selectCard = redPoro[i].card;
			drawPoroSelected(this.turn, i);
		} else {
			this.selectCard = greenPoro[i].card;
			drawPoroSelected(this.turn, i);
		}
		console.log(this.selectCard);
		this.poroPos = i;
		this.setStat(2);
	},
};

canvas_card.addEventListener('click', function (e) {
	var pos = getPos(e);

	if (pos.r == undefined || pos.c == undefined) {
		var poroPos;
		poroPos = gameManager.turn ? getPoroPos(e, redPoro) : getPoroPos(e, greenPoro);
		if (poroPos == undefined) return;
		gameManager.setPoroSelect(poroPos);
	} else {
		gameManager.setSelect(pos);
		gameManager.setCardMove(pos);
	}
});
