import React from 'react';


function showNotImplemented() {
  console.warn('This function is not implemented yet.');
}

const red_names = ['俥','傌','炮','帥','仕','相','兵'];
const black_names = ['車','馬','包','將','士','象','卒'];

const DarkChessPiece = (props) => {
  const { className, status, team, children, onClick, index, selected } = props;
  let outClass;
  if (selected) {
    outClass = 'selected';
  } else {
    outClass = ''
  }
  if (className === "" || className === undefined) {
    return (
      <div className={`dchess-grid ${outClass}`}
        onClick={()=>onClick(index)}
	  ></div>
    );
  } else if (status === "" || status === undefined) {
    const extraClass = className || '';
    return (
      <div className={`dchess-grid ${outClass}`}
        onClick={()=>onClick(index)}
	  ><div className={extraClass}></div>
      </div>
    );
  } else {
    const extraClass = className || '';
    return (
      <div className={`dchess-grid ${outClass}`}
        onClick={()=>onClick(index)}
      ><div className={`${extraClass} ${status} ${team}`}>
          {children}
        </div>
      </div>
    );
  }
};


DarkChessPiece.propTypes = {
  className: React.PropTypes.string,
  children: React.PropTypes.string.isRequired,
  onClick: React.PropTypes.func,
};

DarkChessPiece.defaultProps = {
  onClick: showNotImplemented,
};

export default DarkChessPiece;
