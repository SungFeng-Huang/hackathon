import React from 'react';

import DarkChessPiece from './DarkChessPiece';

let classList = [];
for (let i = 0; i < 32; ++i) {
	classList[i] = "dchess-piece";
}
let statusList = [];
for (let i = 0; i < 32; ++i) {
	statusList[i] = "open";
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
		this.state = {
			classList : classList,
			statusList : statusList,
			nameList : names,
			select : -1,
			player : 0,	// 0, 1
			team : [],
		}
	}

	onPress(key, teamcolor) {
		if (this.state.select === -1) {
			this.setState({select: key});
			return;
		} else if (this.state.select === key) {			// white: cancel select, dark: open
			if (this.state.statusList[key] === '') {	// dark: open and change player
				let status = this.state.statusList;
				let team = this.state.team;
				status[key] = 'open';
				if (team.length === 0) {
					if (teamcolor === 'red') {
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
			}
			return;
		}
	}

	showNotImplemented() {
		console.warn('This function is not implemented yet.');
	}
	
	render() {
		const board = this.state.classList.map((name, key) => {
			return (
				<DarkChessPiece className={name}
					status={this.state.statusList[key]}
					key={key}
					onClick={this.showNotImplemented.bind(this)}
				>{this.state.nameList[key]}</DarkChessPiece>
			);
		});
		return (
			<div>
				<div className="dchess-row">暗棋</div>
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
