import React from 'react';
import ReactDOM from 'react-dom';

type SquareProps = {
  id: number;
  value: string;
  is_hint: boolean;
  clickHandler: () => any;
}

type BoardProps = {
  squares: string[];
  hint_masses: string[];
  clickHandler: (i: number) => any
}

type WriteNumberProps = {
  value: string;
  is_usable: boolean;
  clickHandler: () => any;
}

type WriteNumbersProps = {
  writable_numbers: boolean[];
  clickHandler: (i: string) => any;
}

type GameProps = {}
type GameStates = {
    hint_masses: string[];
    squares: string[];
    writable_numbers: boolean[];
    focus_mass: number | null;
}

// squareのJSXを返す
function Square(props: SquareProps) {
  const background: string = props.is_hint? "hint-square": "";
  return (
      <button 
          className={"square "+background}
          id={"square-"+String(props.id)}
          onClick={() => props.clickHandler()}>
          {props.value}
      </button>
  );
}

// boardのJSXを返す
function Board(props: BoardProps) {
    function renderSquare(i: number, j: number, k: number) {
      const row = i * 3 + Math.floor(k / 3);
      const col = j * 3 + k % 3;
      const id = row * 9 + col;
      return <Square
        id={id}
        value={props.squares[id]}
        is_hint={(props.hint_masses[id] !== "")? true: false}
        clickHandler={() => props.clickHandler(id)}
      />;
    }

    function renderBlockSquares(i: number, j: number) {
      return (
        <>
        <div className="board-block-row">
          {renderSquare(i, j, 0)}
          {renderSquare(i, j, 1)}
          {renderSquare(i, j, 2)}           
        </div>
        <div className="board-block-row">
          {renderSquare(i, j, 3)}
          {renderSquare(i, j, 4)}
          {renderSquare(i, j, 5)}           
        </div>
        <div className="board-block-row">
          {renderSquare(i, j, 6)}
          {renderSquare(i, j, 7)}
          {renderSquare(i, j, 8)}           
        </div>
        </>
      );
    }

    function renderRowSquares(i: number) {
      return (
        <>
        <div className="board-block">{renderBlockSquares(i, 0)}</div>
        <div className="board-block">{renderBlockSquares(i, 1)}</div>
        <div className="board-block">{renderBlockSquares(i, 2)}</div>
        </>
      );
    }
    
    const status: string = 'マスをクリック → 数字をクリック の順番で操作';
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board">
          <div className="board-row">{renderRowSquares(0)}</div>
          <div className="board-row">{renderRowSquares(1)}</div>
          <div className="board-row">{renderRowSquares(2)}</div>
        </div>  
      </div>
    );
}

// 書き込む数字を選択できるボタンのJSXを返す
function WriteNumber(props: WriteNumberProps) {
    return (
        <button className="writeNumber" onClick={() => props.clickHandler()} disabled={!props.is_usable}>
            {props.value}
        </button>
    );
}

// 空白, 1~9のWriteNumberを返す
function WriteNumbers (props: WriteNumbersProps) {
    function renderWriteNumber(i: string) {
      return <WriteNumber
        value={i}
        is_usable={props.writable_numbers[Number(i)]}
        clickHandler={() => props.clickHandler(i)}
      />
    }
    
    const status: string = '書き込み可能な数字';
    return (
        <div>
          <div className="status">{status}</div>
          <div className="writeNumbers">
              {renderWriteNumber("")}
              {renderWriteNumber("1")}
              {renderWriteNumber("2")}
              {renderWriteNumber("3")}
              {renderWriteNumber("4")}
              {renderWriteNumber("5")}
              {renderWriteNumber("6")}
              {renderWriteNumber("7")}
              {renderWriteNumber("8")}
              {renderWriteNumber("9")}
          </div>
        </div>
    );
}

// Gameの情報を持つ
// hint_masses: ヒントの情報
// squares: 盤面の情報
// focus_mass: 選択中のマスを示す（Numberボタンを押すと書き込まれる）
// writable_numbers: focus_massに書き込み可能な数字の情報
class Game extends React.Component<GameProps, GameStates> {
    constructor(props: GameProps) {
        super(props);
        this.state = {
            hint_masses: this.setHintMasses(),
            squares: this.setHintMasses(),
            focus_mass: null,
            writable_numbers: Array(10).fill(true),
        }
    }

    // hint_massesにヒントを記憶させ戻り値とする
    setHintMasses() {
      const hints_text: string = document.getElementById("hints")!.textContent!;
      const hints_list: string[] = hints_text.split(/ |\n/).filter((e: string, i: number, a: string[]) => {return e.length > 0});
      const hint_masses: string[] = Array(81).fill("");
      for (let i: number = 0; i < Math.floor(hints_list.length / 5); i++) {
        const row: number = Number(hints_list[i * 5 + 1]);
        const col: number = Number(hints_list[i * 5 + 2]);
        const num: number = Number(hints_list[i * 5 + 3]) + 1;
        hint_masses[row * 9 + col] = String(num);
      }
      return hint_masses;
    }

    // focus_massと同（行・列・ブロック）で使用済みの数字をfalseで返す
    setWritableNumber(i: number) {
      let writable_numbers_: boolean[] = Array(10).fill(true);
      const row = Math.floor(i / 9);
      const col = i % 9;
      const blk = Math.floor(row / 3) * 3 * 9 + Math.floor(col / 3) * 3;
      
      // 列の探索
      for (let j: number = 0; j < 9; j++) {
        const mass = row * 9 + j;
        const num: string = this.state.squares[mass];
        if (num !== "")
          writable_numbers_[Number(num)] = false;
      }
      
      // 行の探索
      for (let j: number = 0; j < 9; j++) {
        const mass = j * 9 + col;
        const num: string = this.state.squares[mass];
        if (num !== "")
          writable_numbers_[Number(num)] = false;
      }
      
      // ブロックの探索
      for (let j: number = 0; j < 9; j++) {
        const mass = blk + Math.floor(j / 3) * 9 + (j % 3);
        const num: string = this.state.squares[mass];
        if (num !== "")
          writable_numbers_[Number(num)] = false;
      }
      
      this.setState({writable_numbers: writable_numbers_})
    }

    // focus_massをblueで表示する
    boardClickHandler(i: number) {
      // hintで与えられているマスなら無効にする
      if (this.state.hint_masses[i] !== "")
        return;
      if (this.state.focus_mass != null)
        document.getElementById("square-"+String(this.state.focus_mass))!.style.backgroundColor = "white";
      this.setState({focus_mass: i});
      document.getElementById("square-"+String(i))!.style.backgroundColor = "#0000ff5c";
      this.setWritableNumber(i);
    }

    // focus_massで示されているsquareの値を更新する
    writeNumberClickHandler(i: string) {
        const squares = this.state.squares.slice();

        if (this.state.focus_mass != null)
            squares[this.state.focus_mass] = i;
        
        this.setState({squares:squares})
    }

    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board 
                        squares={this.state.squares}
                        hint_masses={this.state.hint_masses}
                        clickHandler={(i:number) => this.boardClickHandler(i)}
                    />
                </div>
                <div className="writeNumbers_block">
                    <WriteNumbers 
                        writable_numbers={this.state.writable_numbers}
                        clickHandler={(i: string) => this.writeNumberClickHandler(i)}
                    />
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));