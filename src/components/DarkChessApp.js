import React from 'react';

import DarkChessPiece from './DarkChessPiece';

let classList = [];
for (let i = 0; i < 32; ++i) {
	classList[i] = 'dchess-piece';
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
		}
	}

	onPress(key) {
		console.log(this.state.select);
		console.log(this.state.nameList[key]);
		if (this.state.select === -1) {
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
		} else {	// change select or eat others
		}
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
					onClick={this.onPress.bind(this)}
				>{this.state.nameList[index]}</DarkChessPiece>
			);
		});
		return (
			<div>
				<div className="text-row">
					<li className="text-grid">暗棋  </li>
					<li className="text-grid small">
						player {(this.state.team.length===0) || this.state.team[this.state.player]}{'\'s'} turn
					</li>
					<li className="text-grid small">
						select: {(this.state.select===-1) || this.state.select}
					</li>
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
