export class GameManager {
	constructor(socket, color) {
		this.socket = socket;
		this.color = color;
		this.status = {
			selectFlag: false,
			poroPos: -1,
			turn: 'g',
			curPos: [-1, -1],
			nextPos: [-1, -1],
			catch: null,
		};
		this.tile = Array.from(new Array(4), (v) => new Array(3).fill(null));
		this.poro_tile_red = new Array(6).fill(null);
		this.poro_tile_green = new Array(6).fill(null);
		for (let i = 0; i < 4; i++) {
			for (let j = 0; j < 3; j++) {
				this.tile[i][j] = document.querySelector(`.tile${i}${j}`);
				this.tile[i][j].addEventListener('click', () => {
					this.mainLogic(i, j);
				});
			}
		}
		for (let i = 0; i < 6; i++) {
			this.poro_tile_red[i] = document.querySelector(`.poro-tile-red0${i}`);
			this.poro_tile_green[i] = document.querySelector(`.poro-tile-green0${i}`);
			this.poro_tile_red[i].addEventListener('click', () => {
				this.poroRedLogic(i);
			});
			this.poro_tile_green[i].addEventListener('click', () => {
				this.poroGreenLogic(i);
			});
		}
	}

	poroRedLogic(i) {
		//red만 선택 가능
		if (this.color !== 'r') return;
		if (this.status.turn === this.color && !this.status.selectFlag) {
			//처음 빈칸 클릭시 무반응
			if (this.poro_tile_red[i].firstChild === null) {
				return;
			}
			this.status.poroPos = i;
			this.poro_tile_red[i].classList.add('tile-selected');
			this.status.selectFlag = true;
			return;
		}
		if (this.status.turn === this.color && this.status.selectFlag) {
			let [cx, cy] = this.status.curPos;
			if (this.poro_tile_red[i].firstChild === null) {
				//포로 빈칸 클릭시 무반응
				return;
			}
			if (cx !== -1 && cx !== -1) {
				//보드 위에 클릭했다가 포로 클릭하는 경우
				this.tile[cx][cy].classList.remove('tile-selected');
				this.poro_tile_red[i].classList.add('tile-selected');
				this.status.curPos = [-1, -1];
				this.status.poroPos = i;
			} else {
				//포로 클릭했다가 다른 포로 클릭하는 경우
				let curPoroPos = this.status.poroPos;
				this.poro_tile_red[curPoroPos].classList.remove('tile-selected');
				this.poro_tile_red[i].classList.add('tile-selected');
				this.status.poroPos = i;
			}
		}
	}

	poroGreenLogic(i) {
		//green만 선택 가능
		if (this.color !== 'g') return;
		if (this.status.turn === this.color && !this.status.selectFlag) {
			//처음 빈칸 클릭시 무반응
			if (this.poro_tile_green[i].firstChild === null) {
				return;
			}
			this.status.poroPos = i;
			this.poro_tile_green[i].classList.add('tile-selected');
			this.status.selectFlag = true;
			return;
		}
		if (this.status.turn === this.color && this.status.selectFlag) {
			let [cx, cy] = this.status.curPos;
			if (this.poro_tile_green[i].firstChild === null) {
				//포로 빈칸 클릭시 무반응
				return;
			}
			if (cx !== -1 && cx !== -1) {
				//보드 위에 클릭했다가 포로 클릭하는 경우
				this.tile[cx][cy].classList.remove('tile-selected');
				this.poro_tile_green[i].classList.add('tile-selected');
				this.status.curPos = [-1, -1];
				this.status.poroPos = i;
			} else {
				//포로 클릭했다가 다른 포로 클릭하는 경우
				let curPoroPos = this.status.poroPos;
				this.poro_tile_green[curPoroPos].classList.remove('tile-selected');
				this.poro_tile_green[i].classList.add('tile-selected');
				this.status.poroPos = i;
			}
		}
	}

	mainLogic(i, j) {
		//처음클릭
		if (this.status.turn === this.color && !this.status.selectFlag) {
			//처음 빈칸 클릭시 무반응
			if (this.tile[i][j].firstChild === null) {
				return;
			}
			//상대방 장기말 클릭시 무반응
			if (this.tile[i][j].firstChild.alt[0] !== this.color) {
				return;
			}
			this.status.curPos = [i, j];
			this.tile[i][j].classList.add('tile-selected');
			this.status.selectFlag = true;
			return;
		}
		//두번째 클릭
		if (this.status.turn === this.color && this.status.selectFlag) {
			let [x, y] = this.status.curPos;
			let curPoroPos = this.status.poroPos;
			if (curPoroPos !== -1) {
				//포로를 클릭한 경우

				//상대방 진영에 포로 못놓음
				if (this.status.turn === 'g' && i === 0) return;
				if (this.status.turn === 'r' && i === 3) return;

				if (this.tile[i][j].firstChild !== null) {
					//포로 클릭했다가 보드 위 장기말 클릭하는 경우
					this.tile[i][j].classList.add('tile-selected');
					if (this.color === 'r') this.poro_tile_red[curPoroPos].classList.remove('tile-selected');
					else this.poro_tile_green[curPoroPos].classList.remove('tile-selected');
					this.status.curPos = [i, j];
					this.status.poroPos = -1;
					return;
				} else {
					//포로를 보드로 옮기는 로직
					this.status.nextPos = [i, j];
					if (this.color === 'r') this.poro_tile_red[this.status.poroPos].classList.remove('tile-selected');
					else this.poro_tile_green[this.status.poroPos].classList.remove('tile-selected');
					this.status.turn = this.color === 'g' ? 'r' : 'g';
					this.socket.emit('game-play', this.status);
					return;
				}
			}
			if (this.tile[i][j].firstChild !== null && this.tile[i][j].firstChild.alt[0] === this.color) {
				//다른 내말 클릭시 cur값 바꿈
				this.tile[x][y].classList.remove('tile-selected');
				this.tile[i][j].classList.add('tile-selected');
				this.status.curPos = [i, j];
				return;
			}
			if (!enableCardMove(x, y, i, j, this.tile[x][y].firstChild.alt)) {
				//장기말 이동 가능할 때만 탈출
				return;
			}
			if (this.tile[i][j].firstChild === null) {
				//장기말 빈칸으로 이동
				this.status.nextPos = [i, j];
				this.tile[x][y].classList.remove('tile-selected');
				this.status.turn = this.color === 'g' ? 'r' : 'g';
				this.socket.emit('game-play', this.status);
			} else {
				//상대말 먹었음
				this.status.nextPos = [i, j];
				this.status.catch = this.tile[i][j].firstChild.alt;
				this.tile[x][y].classList.remove('tile-selected');
				this.status.turn = this.color === 'g' ? 'r' : 'g';
				this.socket.emit('game-play', this.status);
			}
		}
	}

	initGame() {
		this.tile[0][0].appendChild(makeTile('r1'));
		this.tile[0][1].appendChild(makeTile('r0'));
		this.tile[0][2].appendChild(makeTile('r2'));
		this.tile[1][1].appendChild(makeTile('r3'));
		this.tile[3][0].appendChild(makeTile('g2'));
		this.tile[3][1].appendChild(makeTile('g0'));
		this.tile[3][2].appendChild(makeTile('g1'));
		this.tile[2][1].appendChild(makeTile('g3'));
	}

	setStatus(status) {
		this.status = status;
		this.status.poroPos = -1;
		this.status.curPos = [-1, -1];
		this.status.nextPos = [-1, -1];
		this.status.selectFlag = false;
		this.status.catch = null;
	}

	getPoro(tileName) {
		let color = tileName[0];
		if (color === 'r') {
			let poroTile = tileName[1] !== '4' ? 'g' + tileName[1] : 'g3';
			for (let i = 0; i < 6; i++) {
				if (this.poro_tile_green[i].firstChild === null) {
					this.poro_tile_green[i].appendChild(makePoroTile(poroTile));
					break;
				}
			}
		} else {
			let poroTile = tileName[1] !== '4' ? 'r' + tileName[1] : 'r3';
			for (let i = 0; i < 6; i++) {
				if (this.poro_tile_red[i].firstChild === null) {
					this.poro_tile_red[i].appendChild(makePoroTile(poroTile));
					break;
				}
			}
		}
	}

	render(status) {
		let [cx, cy] = status.curPos;
		let [nx, ny] = status.nextPos;
		if (status.catch !== null) {
			//잡은 말 포로로 옮기기
			this.tile[nx][ny].removeChild(this.tile[nx][ny].firstChild);
			this.getPoro(status.catch);
		}
		if (status.poroPos !== -1) {
			//포로 옮기기
			if (status.turn === 'g') {
				let poro = this.poro_tile_red[status.poroPos].firstChild.alt;
				this.poro_tile_red[status.poroPos].removeChild(this.poro_tile_red[status.poroPos].firstChild);
				this.tile[nx][ny].appendChild(makeTile(poro));
			} else {
				let poro = this.poro_tile_green[status.poroPos].firstChild.alt;
				this.poro_tile_green[status.poroPos].removeChild(this.poro_tile_green[status.poroPos].firstChild);
				this.tile[nx][ny].appendChild(makeTile(poro));
			}
		} else {
			//장기 말 옮기기
			let card = this.tile[cx][cy].firstChild.alt;
			//장기말 3번 끝으로 간 경우
			if (card === 'r3' && nx === 3) {
				this.tile[cx][cy].removeChild(this.tile[cx][cy].firstChild);
				this.tile[nx][ny].appendChild(makeTile('r4'));
			} else if (card === 'g3' && nx === 0) {
				this.tile[cx][cy].removeChild(this.tile[cx][cy].firstChild);
				this.tile[nx][ny].appendChild(makeTile('g4'));
			} else {
				this.tile[nx][ny].appendChild(this.tile[cx][cy].firstChild);
			}
		}
	}
}

function makeTile(h) {
	let img = document.createElement('img');
	img.src = `./assets/${h}.png`;
	img.alt = h;
	img.width = img.heigth = 80;
	return img;
}

function makePoroTile(h) {
	let img = document.createElement('img');
	img.src = `./assets/${h}.png`;
	img.alt = h;
	img.width = img.heigth = 40;
	return img;
}

function enableCardMove(cx, cy, nx, ny, sel) {
	let dx = [-1, -1, 0, 1, 1, 1, 0, -1];
	let dy = [0, -1, -1, -1, 0, 1, 1, 1];
	let color = sel[0];
	let card = Number(sel[1]);
	switch (card) {
		case 0:
			for (let i = 0; i < 8; i++) {
				if (cx + dx[i] === nx && cy + dy[i] === ny) return true;
			}
			break;
		case 1:
			for (var i = 0; i < 8; i++) {
				if (i & 1) continue;
				if (cx + dx[i] === nx && cy + dy[i] === ny) return true;
			}
			break;
		case 2:
			for (var i = 0; i < 8; i++) {
				if (!(i & 1)) continue;
				if (cx + dx[i] === nx && cy + dy[i] === ny) return true;
			}
			break;
		case 3:
			if (color === 'r' && cx + 1 === nx && cy === ny) return true;
			else if (color === 'g' && cx - 1 === nx && cy === ny) return true;
			break;
		case 4:
			if (color === 'r') {
				for (let i = 0; i < 8; i++) {
					if (i == 1 || i == 7) continue;
					if (cx + dx[i] === nx && cy + dy[i] === ny) return true;
				}
			} else {
				for (let i = 0; i < 8; i++) {
					if (i == 3 || i == 5) continue;
					if (cx + dx[i] === nx && cy + dy[i] === ny) return true;
				}
			}
			break;
		default:
			break;
	}
	return false;
}
