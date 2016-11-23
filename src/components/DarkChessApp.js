import React from 'react';

import DarkChessPiece from './DarkChessPiece';

let classList = [];
for (let i = 0; i < 32; ++i) {
	//if (i % 2) {
	classList[i] = 'dchess-piece';
	//} else {
		//classList[i] = '';
	//}
}
let statusList = [];
for (let i = 0; i < 32; ++i) {
	statusList[i] = '';
}
let names = ['俥','傌','炮','帥','仕','相','俥','傌','炮','仕','相','兵','兵','兵','兵','兵',
			'車','馬','包','將','士','象','車','馬','包','士','象','卒','卒','卒','卒','卒'];

const red_names = ['俥','傌','炮','帥','仕','相','兵'];
const black_names = ['車','馬','包','將','士','象','卒'];
const food = {
	'炮':['車','馬','包','將','士','象','卒'],
	'帥':['車','馬','包','將','士','象'],
	'仕':['車','馬','包','士','象','卒'],
	'相':['車','馬','包','象','卒'],
	'俥':['車','馬','包','卒'],
	'傌':['馬','包','卒'],
	'兵':['將','卒'],
	'包':['俥','傌','炮','帥','仕','相','兵'],
	'將':['俥','傌','炮','帥','仕','相'],
	'士':['俥','傌','炮','仕','相','兵'],
	'象':['俥','傌','炮','相','兵'],
	'車':['俥','傌','炮','兵'],
	'馬':['傌','炮','兵'],
	'卒':['帥','兵'],
}

class DarkChessApp extends React.Component {
	constructor(props) {
		super(props);
		for (let i = names.length; i; --i) {
			let r = Math.floor(Math.random() * i);
			let temp = names[i-1];
			names[i-1] = names[r];
			names[r] = temp;
		}
		let colorList = [];
		for (let i = 0; i < names.length; ++i) {
			if (red_names.indexOf(names[i]) !== -1) {
			  colorList[i] = 'red';
			}
			if (black_names.indexOf(names[i]) !== -1) {
			  colorList[i] = 'black';
			}
		}
		this.state = {
			classList : classList,
			statusList : statusList,
			nameList : names,
			colorList : colorList,
			select : -1,
			player : 0,	// 0, 1
			team : [],
			redEaten: [],
			blackEaten: [],
		}
		this.canMove = this.canMove.bind(this);
		this.canEat = this.canEat.bind(this);
		this.move = this.move.bind(this);
	}

	onClick(key) {
		if (this.state.select === -1) {
			if (this.state.classList[key] === '') {
				return;
			}
			if (this.state.team.length !== 0) {
				if (this.state.statusList[key] === 'open') {
					if (this.state.team[this.state.player] !== this.state.colorList[key]) {
						console.log('Can\'t select other team\'s piece');
						return;
					}
				}
			}
			this.setState({select: key});
			return;
		} else if (this.state.select === key) {			// white: cancel select, dark: open
			if (this.state.statusList[key] === '') {	// dark: open and change player
				let status = this.state.statusList;
				let team = this.state.team;
				status[key] = 'open';
				if (team.length === 0) {
					if (this.state.colorList[key] === 'red') {
						team = ['red', 'black'];
					} else {
						team = ['black', 'red'];
					}
				}
				if (this.state.player === 0) {
					this.setState({statusList: status,
									team: team,
									select: -1,
									player: 1,
					})
				} else {
					this.setState({statusList: status,
									team: team,
									select: -1,
									player: 0,
					})
				}
				return;
			} else {
				this.setState({select: -1});
				return;
			}
		} else {	// change select or eat others or move
			if (this.state.classList[key] === '') {
				if (this.canMove(this.state.select, key)) {
					console.log('canMove');
					this.move(this.state.select, key);
					if (this.state.player === 0) {
						this.setState({select: -1, player: 1});
					} else {
						this.setState({select: -1, player: 0});
					}
					return;
				} else {
					console.log('cannotMove');
					this.setState({select: -1});
					return;
				}
			} else { // target not empty
				if(this.canEat(this.state.select, key)) {
					console.log('canEat');
					let r = this.state.redEaten;
					let b = this.state.blackEaten;
					if (this.state.colorList[key] === 'red') {
						r[r.length] = this.state.nameList[key];
					} else {
						b[b.length] = this.state.nameList[key];
					}
					this.move(this.state.select, key);
					if (this.state.player === 0) {
						this.setState({select: -1, player: 1, redEaten: r, blackEaten: b});
					} else {
						this.setState({select: -1, player: 0, redEaten: r, blackEaten: b});
					}
					return;
				} else { // can't eat
					console.log('cannotEat');
					this.setState({select: -1});
					return;
				}
			}
		}
	}

	move(key1, key2) {
		let classL = this.state.classList;
		let statusL = this.state.statusList;
		let nameL = this.state.nameList;
		let colorL = this.state.colorList;
		classL[key2] = classL[key1];
		classL[key1] = '';
		statusL[key2] = statusL[key1];
		statusL[key1] = '';
		nameL[key2] = nameL[key1];
		nameL[key1] = '';
		colorL[key2] = colorL[key1];
		colorL[key1] = '';
		if (this.state.player === 0) {
			this.setState({classList: classL,
							statusList: statusL,
							nameList: nameL,
							colorList: colorL,
							select: -1,
							player: 1,
			});
			return;
		} else {
			this.setState({classList: classL,
							statusList: statusL,
							nameList: nameL,
							colorList: colorL,
							select: -1,
							player: 0,
			});
			return;
		}
	}

	canMove(key1, key2) {
		let x1 = key1%8, y1 = Math.floor(key1/8), x2 = key2%8, y2 = Math.floor(key2/8);
		if (x1 === x2) {
			if (y1 - y2 === 1 || y1 - y2 === -1) {
				return true;
			}
		}
		if (y1 === y2) {
			if (x1 - x2 === 1 || x1 - x2 === -1) {
				return true;
			}
		}
		return false;
	}

	canEat(key1, key2) {
		let x1 = key1%8, y1 = Math.floor(key1/8), x2 = key2%8, y2 = Math.floor(key2/8);
		if (this.state.statusList[key2] === '') {
			return false;
		}
		if (x1 === x2) {
			if (this.state.nameList[key1] !== '包' && this.state.nameList[key1] !== '炮') {
				if (y1 - y2 === 1 || y1 - y2 === -1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
			} else if (y1 < y2) {
				console.log(y1, y2);
				let count = 0;
				for (let i = 1; i < y2 - y1; i++) {
					if (this.state.classList[key1 + i*8] !== '') {
						console.log(key1 + i*8);
						count += 1;
					}
				}
				if (count === 1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
				console.log(count);
				return false;
			} else if (y1 > y2) {
				console.log(y1, y2);
				let count = 0;
				for (let i = 1; i < y1 - y2; i++) {
					if (this.state.classList[key1 - i*8] !== '') {
						console.log(key1 - i*8);
						count += 1;
					}
				}
				if (count === 1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
				console.log(count);
				return false;
			}
		}
		if (y1 === y2) {
			if (this.state.nameList[key1] !== '包' && this.state.nameList[key1] !== '炮') {
				if (x1 - x2 === 1 || x1 - x2 === -1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
			} else if (x1 < x2) {
				console.log(x1, x2);
				let count = 0;
				for (let i = 1; i < x2 - x1; i++) {
					if (this.state.classList[key1 + i] !== '') {
						console.log(key1 + i);
						count += 1;
					}
				}
				if (count === 1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
				console.log(count);
				return false;
			} else if (x1 > x2) {
				console.log(x1, x2);
				let count = 0;
				for (let i = 1; i < x1 - x2; i++) {
					if (this.state.classList[key1 - i] !== '') {
						console.log(key1 - i);
						count += 1;
					}
				}
				if (count === 1) {
					if (food[this.state.nameList[key1]].indexOf(this.state.nameList[key2]) !== -1) {
						return true;
					}
				}
				console.log(count);
				return false;
			}
		}
		return false;
	}

	showNotImplemented() {
		console.warn('This function is not implemented yet.');
	}
	
	render() {
		const board = this.state.classList.map((name, index) => {
			return (
				<DarkChessPiece className={name}
					status={this.state.statusList[index]}
					team={this.state.colorList[index]}
					key={index}
					index={index}
					selected={this.state.select===index}
					onClick={this.onClick.bind(this)}
				>{this.state.nameList[index]}</DarkChessPiece>
			);
		});
		return (
			<div>
				<div className="text-row">
					<li className="head-grid">暗棋  </li>
					<div className="text-grid">
						<li className="small">
							player: {(this.state.team.length===0) || this.state.team[this.state.player]}
						</li>
					</div>
					<div className="text-long">
						<li className="super-small">
							red: {this.state.redEaten}
						</li>
						<li className="super-small">
							black: {this.state.blackEaten}
						</li>
					</div>
				</div>
				<div className="dchess-container">
					<div className="dchess-row">
						{board.slice(0,8)}
					</div>
					<div className="dchess-row">
						{board.slice(8,16)}
					</div>
					<div className="dchess-row">
						{board.slice(16,24)}
					</div>
					<div className="dchess-row">
						{board.slice(24,32)}
					</div>
				</div>
			</div>
		);
	}
}

export default DarkChessApp;
