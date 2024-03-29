import React from 'react';

import DarkChessPiece from './DarkChessPiece';

const classList = [];
for (let i = 0; i < 32; i += 1) {
  classList[i] = 'dchess-piece';
}
const statusList = [];
for (let i = 0; i < 32; i += 1) {
  statusList[i] = '';
}
const names = ['俥', '傌', '炮', '帥', '仕', '相', '俥', '傌', '炮', '仕', '相', '兵', '兵', '兵', '兵', '兵',
  '車', '馬', '包', '將', '士', '象', '車', '馬', '包', '士', '象', '卒', '卒', '卒', '卒', '卒'];

const redNames = ['俥', '傌', '炮', '帥', '仕', '相', '兵'];
const blackNames = ['車', '馬', '包', '將', '士', '象', '卒'];
const food = {
  炮: ['車', '馬', '包', '將', '士', '象', '卒'],
  帥: ['車', '馬', '包', '將', '士', '象'],
  仕: ['車', '馬', '包', '士', '象', '卒'],
  相: ['車', '馬', '包', '象', '卒'],
  俥: ['車', '馬', '包', '卒'],
  傌: ['馬', '包', '卒'],
  兵: ['將', '卒'],
  包: ['俥', '傌', '炮', '帥', '仕', '相', '兵'],
  將: ['俥', '傌', '炮', '帥', '仕', '相'],
  士: ['俥', '傌', '炮', '仕', '相', '兵'],
  象: ['俥', '傌', '炮', '相', '兵'],
  車: ['俥', '傌', '炮', '兵'],
  馬: ['傌', '炮', '兵'],
  卒: ['帥', '兵'],
};

class DarkChessApp extends React.Component {
  constructor(props) {
    super(props);
    for (let i = names.length; i; i -= 1) {
      const r = Math.floor(Math.random() * i);
      const temp = names[i - 1];
      names[i - 1] = names[r];
      names[r] = temp;
    }
    const colorList = [];
    for (let i = 0; i < names.length; i += 1) {
      if (redNames.indexOf(names[i]) !== -1) {
        colorList[i] = 'red';
      }
      if (blackNames.indexOf(names[i]) !== -1) {
        colorList[i] = 'black';
      }
    }
    this.state = {
      classList,
      statusList,
      nameList: names,
      colorList,
      select: -1,
      player: 0, // 0, 1
      team: [],
      redEaten: [],
      blackEaten: [],
    };
    this.classOf = this.classOf.bind(this);
    this.statusOf = this.statusOf.bind(this);
    this.nameOf = this.nameOf.bind(this);
    this.colorOf = this.colorOf.bind(this);
    this.teamOf = this.teamOf.bind(this);
    this.selectWrongTeamPiece = this.selectWrongTeamPiece.bind(this);
    this.isGridEmpty = this.isGridEmpty.bind(this);
    this.isPieceFlipped = this.isPieceFlipped.bind(this);
    this.isPieceRed = this.isPieceRed.bind(this);
    this.flipPiece = this.flipPiece.bind(this);
    this.isTeamUnset = this.isTeamUnset.bind(this);
    this.setTeam = this.setTeam.bind(this);
    this.selectPiece = this.selectPiece.bind(this);
    this.selected = this.selected.bind(this);
    this.resetSelect = this.resetSelect.bind(this);
    this.noSelectPiece = this.noSelectPiece.bind(this);
    this.changePlayer = this.changePlayer.bind(this);
    this.canEat = this.canEat.bind(this);
    this.canMove = this.canMove.bind(this);
    this.move = this.move.bind(this);
    this.eat = this.eat.bind(this);
    this.tryToMoveOrEat = this.tryToMoveOrEat.bind(this);
    this.bombCanEat = this.bombCanEat.bind(this);
    this.countPiecesBetween = this.countPiecesBetween.bind(this);
  }

  classOf(key) {
    return this.state.classList[key];
  }

  statusOf(key) {
    return this.state.statusList[key];
  }

  nameOf(key) {
    return this.state.nameList[key];
  }

  colorOf(key) {
    return this.state.colorList[key];
  }

  teamOf(player) {
    return this.state.team[player];
  }

  selectWrongTeamPiece(key) {
    if (this.state.team.length !== 0) {
      if (this.statusOf(key) === 'open') {
        if (this.teamOf(this.state.player) !== this.colorOf(key)) {
          return true;
        }
      }
    }
    return false;
  }

  isGridEmpty(key) {
    return this.state.classList[key] === '';
  }

  isPieceFlipped(key) {
    return this.state.statusList[key] === 'open';
  }

  isPieceRed(key) {
    return this.state.colorList[key] === 'red';
  }

  flipPiece(key){
    let status = this.state.statusList;
    status[key] = 'open';
    this.setState({statusList: status});
  }

  isTeamUnset() {
    return this.state.team.length === 0;
  }

  setTeam(key) {
    let team = [];
    if (this.isPieceRed(key)) {
      team = ['red', 'black'];
    } else {
      team = ['black', 'red'];
    }
    return this.setState({team: team});
  }

  selectPiece(key) {
    return this.setState({ select: key });
  }

  selected() {
    return this.state.select;
  }

  resetSelect() {
    return this.setState({ select: -1 });
  }

  noSelectPiece() {
    return this.state.select === -1;
  }

  changePlayer() {
    this.resetSelect();
    if (this.state.player === 0) {
      return this.setState({ player: 1 });
    }
    return this.setState({ player: 0 });
  }

  onClick(key) {
    if (this.noSelectPiece()) {
      if (this.isGridEmpty(key)) {
        return;
      }
      if (this.selectWrongTeamPiece(key)) {
        console.log('Can\'t select other team\'s piece');
        return;
      }
      this.selectPiece(key);
      return;
    } else if (this.selected() === key) { // white: cancel select, dark: open
      if (!this.isPieceFlipped(key)) { // dark: flip and change player
        this.flipPiece(key);
        if (this.isTeamUnset()) {
          this.setTeam(key);
        }
        this.changePlayer();
        return;
      }
      // white: cancel
      this.resetSelect();
      return;
    } 
    // change select or eat others or move
    const moveOrEat = this.tryToMoveOrEat(key);
    if (moveOrEat === false) {
      console.log('Cannot move or eat');
      this.resetSelect();
      return;
    }
  }

  tryToMoveOrEat(key){
    if (this.isPieceFlipped(this.selected()) === false) {
      return false;
    }
    if (this.canMove(key)) {
      console.log('Can move');
      this.move(key);
      this.changePlayer();
      return true;
    }
    // target not empty
    if (this.canEat(key)) {
      console.log('Can eat');
      this.eat(key);
      this.changePlayer();
      return true;
    } 
    return false;
  }
  
  canMove(key) {
    if (this.isGridEmpty(key) === false) {
      return false;
    }
    const x1 = this.selected() % 8;
    const y1 = Math.floor(this.selected() / 8);
    const x2 = key % 8;
    const y2 = Math.floor(key / 8);
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

  countPiecesBetween(step, forward, key){
    let count = 0;
    let times;
    if (forward) {
      times = (key - this.selected()) / step;
    } else {
      times = (this.selected() - key) / step;
      step = -step;
    }
    for (let i = 1; i < times; i += 1) {
      if (this.isGridEmpty(this.selected() + i * step) === false) {
        console.log(this.selected() + i * step);
        count += 1;
      }
    }
    return count;
  }

  bombCanEat(key) {
    const x1 = this.selected() % 8;
    const y1 = Math.floor(this.selected() / 8);
    const x2 = key % 8;
    const y2 = Math.floor(key / 8);
    let count = 0;
    if (x1 === x2) {
      if (y1 < y2) {
        console.log(y1, y2);
        count = this.countPiecesBetween(8, true, key);
      } else if (y1 > y2) {
        console.log(y1, y2);
        count = this.countPiecesBetween(8, false, key);
      }
    } else if (y1 === y2) {
      if (x1 < x2) {
        console.log(x1, x2);
        count = this.countPiecesBetween(1, true, key);
      } else if (x1 > x2) {
        console.log(x1, x2);
        count = this.countPiecesBetween(1, false, key);
      }
    }
    if (count === 1) {
      return true;
    }
    console.log(count);
    return false;
  }

  canEat(key) {
    if (this.isPieceFlipped(key) === false) {
      return false;
    }
    if (food[this.nameOf(this.selected())].indexOf(this.nameOf(key)) === -1) {
      return false;
    }
    const nameOfSelected = this.nameOf(this.selected());
    if (nameOfSelected !== '包' && nameOfSelected !== '炮') {
      const sub = this.selected() - key;
      if (sub === 1 || sub === -1 || sub === 8 || sub === -8) {
        return true;
      }
      return false;
    } else if (this.bombCanEat(key)) {
      return true;
    }
    return false;
  }

  eat(key) {
    const r = this.state.redEaten;
    const b = this.state.blackEaten;
    if (this.colorOf(key) === 'red') {
      r[r.length] = this.nameOf(key);
    } else {
      b[b.length] = this.nameOf(key);
    }
    this.move(key);
    return this.setState({ redEaten: r, blackEaten: b });
  }

  move(key) {
    const classL = this.state.classList;
    const statusL = this.state.statusList;
    const nameL = this.state.nameList;
    const colorL = this.state.colorList;
    classL[key] = classL[this.selected()];
    classL[this.selected()] = '';
    statusL[key] = statusL[this.selected()];
    statusL[this.selected()] = '';
    nameL[key] = nameL[this.selected()];
    nameL[this.selected()] = '';
    colorL[key] = colorL[this.selected()];
    colorL[this.selected()] = '';
    this.setState({ classList: classL,
      statusList: statusL,
      nameList: nameL,
      colorList: colorL,
    });
    return this.changePlayer();
  }

  showNotImplemented() {
    console.warn('This function is not implemented yet.');
  }

  render() {
    const board = this.state.classList.map((name, index) => (
      <DarkChessPiece
        className={name}
        status={this.statusOf(index)}
        team={this.colorOf(index)}
        key={index}
        index={index}
        selected={this.state.select === index}
        onClick={this.onClick.bind(this)}
      >{this.nameOf(index)}</DarkChessPiece>
    ));
    return (
      <div>
        <div className="text-row">
          <li className="head-grid">暗棋</li>
          <div className="text-grid">
            <li className="small">
              player: {(this.state.team.length === 0) || this.teamOf(this.state.player)}
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
            {board.slice(0, 8)}
          </div>
          <div className="dchess-row">
            {board.slice(8, 16)}
          </div>
          <div className="dchess-row">
            {board.slice(16, 24)}
          </div>
          <div className="dchess-row">
            {board.slice(24, 32)}
          </div>
        </div>
      </div>
    );
  }
}

export default DarkChessApp;
