let boards = 0;
let clicks = 0;

const size = document.getElementById("size");
size.addEventListener("input", ChangeInSize);
const sizeValue = document.getElementById("sizeValue");
size.style.width = "120px";
const mineCount = document.getElementById("minecount");
mineCount.addEventListener("input", ChangeInMines);
const mineValue = document.getElementById("mineValue");
const easy = document.getElementById("easyDif");
easy.addEventListener("click", Easy);
const med = document.getElementById("medDif");
med.addEventListener("click", Medium);
const hard = document.getElementById("hardDif");
hard.addEventListener("click", Hard);
const extra = document.getElementById("extremeDif");
extra.addEventListener("click", Extreme);

function Easy(){
    size.value = 9;
    ChangeInSize();
    mineCount.value = 10;
    ChangeInMines();
}
function Medium(){
    size.value = 16;
    ChangeInSize();
    mineCount.value = 40;
    ChangeInMines();
}
function Hard(){
    size.value = 30;
    ChangeInSize();
    mineCount.value = 180;
    ChangeInMines();
}
function Extreme(){
    mineCount.max = 500;
    size.max = 50;
    size.value = 50;
    sizeValue.innerText = size.value.toString() + "×" + size.value.toString();
    mineCount.value = 500;
    size.style.width = "215px";
    ChangeInMines();
    mineCount.style.width = "750px";
}

function ChangeInSize(){
    size.style.width = "150px";
    size.max = 30;
    sizeValue.innerText = size.value.toString() + "×" + size.value.toString();
    mineCount.value = 0;
    mineCount.max = size.value*size.value;
    mineCount.style.width = (size.value*size.value*4).toString()+"px";
    if (parseInt(mineCount.style.width) > 750){
        mineCount.style.width = "750px";
    }
    ChangeInMines();
    gameTime.value = "Let's Play!";
}

function ChangeInMines(){
    mineValue.innerText = mineCount.value;
}

const gameTime = document.getElementById("submit");

class Board{
    constructor(rows, mines){
        this.rows = parseInt(rows);
        this.mines = parseInt(mines);
    }
    GenerateBoard() {
        clicks = 0;
        const gameBoard = document.createElement("div");
        gameBoard.id = "mine_board";
        const game = document.getElementById("game");
        game.appendChild(gameBoard);
        gameBoard.style.gridTemplateColumns = "repeat(" + this.rows.toString() + ", 30px)";
        gameBoard.style.gridTemplateRows = "repeat(" + this.rows.toString() + ", 30px)";
        const flagcount = document.getElementById("flags");
        flagcount.innerText = this.mines.toString() + "🚩";

        let board = [];
        let cells = [];
        let amount = 0;
        /*generating board*/
        for(let i = 0; i < this.rows; i++){
            const row = document.createElement("div");
            for(let j = 0; j < this.rows; j++){
                cells.push(0);
                const cell = document.createElement("div");
                cell.id = i.toString() + ";" + j.toString();
                cell.className = "cell";
                row.appendChild(cell);
                cell.addEventListener("click", CheckEmpty);
                cell.addEventListener("contextmenu", Flag);
            }
            gameBoard.appendChild(row);
            board.push(cells);
            cells = [];
        }
        /*generating mines*/
        for(let j = 0; j< this.mines; j++){
            let randomX = Math.floor(Math.random()*this.rows);
            let randomY = Math.floor(Math.random()*this.rows);
            if (board[randomX][randomY] != -1){
                board[randomX][randomY] = -1;
            }
            else{
                j--;
            }
        }
        for(let i = 0; i<this.rows;i++){
            for(let j = 0; j<this.rows; j++){
                if(board[i][j] == -1){
                    const mine = document.getElementById(i.toString() + ";" + j.toString());
                    mine.removeEventListener("click", CheckEmpty);
                    mine.addEventListener("click", ClickMine);
                }
            }
        }
        /*generate numbered cells*/
        for(let l=0; l<this.rows; l++){
            for(let k =0; k<this.rows; k++){
                for(let i = -1; i <2; i++){
                    for(let j = -1; j < 2; j++){
                        if(((l+i)>-1)&&((k+j)>-1)){
                            if(((l+i)<this.rows)&&((k+j)<this.rows)){
                                if(board[k][l]!=-1){
                                    if(board[k+j][l+i] == -1){
                                        board[k][l]++;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        let funcrows = this.rows;
        let funcmines = this.mines;
        function ClickMine(){
            timeStop();
            for(let i =0; i<funcrows;i++){
                for(let j =0; j<funcrows;j++){
                    if(board[j][i]==-1){
                        const boom = document.getElementById(j.toString()+ ";" + i.toString());
                        boom.innerText = "💥";
                    }
                }
            }
            flagcount.innerText += " Skill issue.";
            for(let l=0; l<funcrows; l++){
                for(let k =0; k<funcrows; k++){
                    if(board[k][l]!=-1){
                        const kaput = document.getElementById(k.toString()+";"+l.toString());
                        kaput.removeEventListener("click", CheckEmpty);
                        kaput.removeEventListener("contextmenu", Flag);
                    }
                    else{
                        const end = document.getElementById(k.toString()+";"+l.toString());
                        end.removeEventListener("click", ClickMine);
                        end.removeEventListener("contextmenu", Flag);
                    }
                }
            }
        }
        function CheckEmpty(event){
            if (clicks == 0){
                timeStart();
            }
            clicks++;
            let x = parseInt(event.target.id.split(";")[0]);
            let y = parseInt(event.target.id.split(";")[1]);
            event.target.removeEventListener("contextmenu", Flag);   
            if(board[x][y] > 0){
                event.target.innerText = board[x][y];
                event.target.style.backgroundColor = "lightgray";
                event.target.style.border = "1px solid #140D4F"
                event.target.style.color = "#140D4F";
            }
            else{
                Reveal(x, y);
            }
            let count = 0;
            for(let i = 0; i<funcrows; i++){
                for(let j = 0; j<funcrows; j++){
                    const check = document.getElementById(j.toString() + ";" + i.toString());
                    if(board[j][i] == -2 || check.style.backgroundColor == "lightgray"){
                        count++;
                    }
                }
            }
            if(count + funcmines == funcrows*funcrows){
                if (funcmines == 0){
                    flagcount.innerText += " Oof, SO difficult."
                }
                else{
                    flagcount.innerText += " Well played!";
                }
                for(let l=0; l<funcrows; l++){
                    for(let k =0; k<funcrows; k++){
                        if(board[k][l]!=-1){
                            const kaput = document.getElementById(k.toString()+";"+l.toString());
                            kaput.removeEventListener("click", CheckEmpty);
                            kaput.removeEventListener("contextmenu", Flag);
                        }
                        else{
                            const end = document.getElementById(k.toString()+";"+l.toString());
                            end.removeEventListener("click", ClickMine);
                            end.removeEventListener("contextmenu", Flag);
                        }
                    }
                }
                timeStop();
            }
        }
        function Reveal(x, y){
            const cell = document.getElementById(x.toString()+";" +y.toString());
            cell.removeEventListener("contextmenu", Flag);   
            cell.style.backgroundColor = "lightgray";
            cell.style.color = "orange";
            for(let i =-1; i<2; i++){
                for(let j = -1; j<2; j++){
                    if(y+i<funcrows&&y+i>-1){
                        if(x+j<funcrows&&x+j>-1){
                            if(board[x+j][y+i]>0){
                                const revealed = document.getElementById((x+j).toString()+";" +(y+i).toString());
                                revealed.removeEventListener("contextmenu", Flag);
                                revealed.innerText = board[x+j][y+i];
                                revealed.style.backgroundColor = "lightgray";
                                revealed.style.border = "1px solid #140D4F";
                                revealed.style.color = "#140D4F";
                            }
                            else if(board[x+j][y+i]==0){
                                const revealed = document.getElementById((x+j).toString()+";"+(y+i).toString());
                                revealed.removeEventListener("contextmenu", Flag);
                                revealed.style.backgroundColor = "lightgray";
                                revealed.style.border = "1px solid #1C0B19";
                                revealed.style.color = "#1C0B19";
                                board[x+j][y+i] = -2;
                                revealed.innerText = "";
                                Reveal(x+j, y+i);
                            }
                        }
                    }
                }
            }
        }
        function Flag(event){
            event.preventDefault();
            if(amount<funcmines){
                if(event.target.innerText == "🚩"){
                    event.target.innerText = "";
                    amount--;
                    if(board[event.target.id.split(";")[0]][event.target.id.split(";")[1]]==-1){
                        event.target.addEventListener("click", ClickMine);
                    }
                    else{
                        event.target.addEventListener("click", CheckEmpty);
                    }
                }
                else{
                    event.target.innerText = "🚩";
                    amount++;
                    if(board[event.target.id.split(";")[0]][event.target.id.split(";")[1]]==-1){
                        event.target.removeEventListener("click", ClickMine);
                    }
                    else{
                        event.target.removeEventListener("click", CheckEmpty);
                    }
                }
            }
            else{
                if(event.target.innerText == "🚩"){
                    event.target.innerText = "";
                    amount--;
                    if(board[event.target.id.split(";")[0]][event.target.id.split(";")[1]]==-1){
                        event.target.addEventListener("click", ClickMine);
                    }
                    else{
                        event.target.addEventListener("click", CheckEmpty);
                    }
                }
            }
            flagcount.innerText = (parseInt(funcmines)-amount).toString()+"🚩";
        }
    }
    DeleteBoard(){
        const deleting = document.getElementById("mine_board");
        deleting.remove();
    }
}
gameTime.addEventListener("click", buttonPress);
function buttonPress(){
    timeReset();
    let newGame = new Board(size.value, mineCount.value);
    gameTime.value = "Play Again";
    if (boards == 0){
        newGame.GenerateBoard();
    }
    else{
        newGame.DeleteBoard();
        let newGame2 = new Board(size.value, mineCount.value);
        newGame2.GenerateBoard();
    }
    boards++;
}
ChangeInSize();
ChangeInMines();
let timeInterval;
let startTime;
function timeStart(){
    startTime = Date.now();
    timeInterval = setInterval(() => {
        const gone = Math.floor((Date.now()-startTime)/1000);
        document.getElementById("timer").innerText = "Timer: "+ gone.toString() +"s";
    }, 1000);
}
function timeStop(){
    clearInterval(timeInterval);
}
function timeReset(){
    timeStop();
    document.getElementById("timer").innerText = "Timer: 0s";
}


