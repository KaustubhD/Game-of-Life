import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class Box extends Component{
  selectBox = () => {
    this.props.selectBox(this.props.row, this.props.col);
  }
  render(){
    return(
      <div className={this.props.boxClass} id={this.props.boxId} onClick={this.selectBox}></div>
    );
  };
}

class Buttons extends Component{
  render(){
    let butArray = [];
    this.props.buttons.map((obj, i) => {
      butArray.push(<button className={obj.cl} onClick={obj.ev} key={i}>{obj.name}</button>);
    });
    return(
      <div className="buts-container">
        {butArray}
      </div>
    );
  }
}

class Grid extends Component{
  render(){
    let rowArr = [], boxId, boxClass;
    for(let i = 0; i < this.props.rowNum; i++){
      console.log(this.props.gridArr[i]);
      for(let j = 0; j < this.props.colNum; j++){
        boxId = i + '_' + j;
        boxClass = this.props.gridArr[i][j] ? 'box on' : 'box off';
        rowArr.push(<Box boxClass={boxClass} key={boxId} boxId={boxId} row={i} col={j} selectBox={this.props.selectBox}/>);
      }
    }
    return(
      <div className="grid">
        {rowArr}
      </div>
    );
  }
}

class App extends Component {
  constructor(){
    super();
    this.speed = 100;
    this.rows = 30;
    this.cols = 65;
    this.buttons = [{cl: 'playBut', ev: this.playEv, name: 'Begin'},
    {cl: 'pauseBut', ev: this.pauseEv, name: 'Pause'},
    {cl: 'populateBut', ev: this.populateEv, name: 'Populate'},
    {cl: 'clearBut', ev: this.clearEv, name: 'Clear'}];
    this.state = {
      gens: 0,
      gridArray: Array(this.rows).fill().map(() => Array(this.cols).fill(false)),
    };
  }

  selectBox = (row, col) => {
    let gridCopy = cloneArray(this.state.gridArray);
    gridCopy[row][col] = !gridCopy[row][col];
    this.setState({
      gridArray: gridCopy
    });
  }

  pauseEv = () => {
    clearInterval(this.interval);
  }

  playEv = () => {
    clearInterval(this.interval);
    this.interval = setInterval(this.playFn, this.speed);
  }

  populateEv = () => {
    this.populate();
  }
  
  clearEv = () => {
    this.pauseEv();
    let copy1 = Array(this.rows).fill().map(() => Array(this.cols).fill(false));
    this.setState({
      gens: 0,
      gridArray: copy1,
    });
  }

  playFn = () => {
    let copy1 = this.state.gridArray, count;
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        count = 0;
        if(i > 0)
          count += this.state.gridArray[i - 1].slice(j - 1, j + 2).filter(Boolean).length;
        if(i < this.rows - 1)
          count += this.state.gridArray[i + 1].slice(j - 1, j + 2).filter(Boolean).length;
        
        if(this.state.gridArray[i][j + 1])
          count++;
        if(this.state.gridArray[i][j - 1])
          count++;
        if(this.state.gridArray[i][j] && (count < 2 || count > 3)) copy1[i][j] = false;
        if(!this.state.gridArray[i][j] && count === 3) copy1[i][j] = true;
      }
    }
    this.setState({
      gens: this.state.gens + 1,
      gridArray: copy1
    });
  }

  populate = () => {
    let gridCopy = cloneArray(this.state.gridArray);
    for(let i = 0; i < this.rows; i++){
      for(let j = 0; j < this.cols; j++){
        if(Math.floor(Math.random() * 6) === 1){
          gridCopy[i][j] = true;
        }
      }
    }
    this.setState({
      gridArray : gridCopy
    })
  }

  componentDidMount(){
    this.clearEv();
    this.populate();
  }

  render() {
    return (
      <div className="App">
        <h1>Game Of Life</h1>
        <Buttons buttons={this.buttons}/>
        <Grid gridArr={this.state.gridArray} rowNum={this.rows} colNum={this.cols} selectBox={this.selectBox}/>
        <h3>Genrations {this.state.gens} </h3>
      </div>
    );
  }
}


function cloneArray(array){
  return JSON.parse(JSON.stringify(array));
}

export default App;
