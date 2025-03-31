const gameBoard = document.getElementById("game_board");
let rows = 8;
let pocetMin = 10;
let board = [];
let cells = [];
let amount = 0;



for(let i = 0; i < rows; i++){
    const row = document.createElement("div");
    for(let j = 0; j < rows; j++){
        cells.push(0);
        const cell = document.createElement("div");
        cell.id = i.toString() + ";" + j.toString();
        row.appendChild(cell);
        cell.addEventListener("click", CheckEmpty);
        cell.addEventListener("contextmenu", Flag);
    }
    gameBoard.appendChild(row);
    board.push(cells);
    cells = [];
}

const flagcount = document.getElementById("flags");
flagcount.innerText = pocetMin.toString() + "🚩";
for(let j = 0; j< pocetMin; j++){
    let randomX = Math.floor(Math.random()*rows);
    let randomY = Math.floor(Math.random()*rows);
    if (board[randomX][randomY] != -1){
        board[randomX][randomY] = -1;
    }
    else{
        j--;
    }
}

for(let i = 0; i<rows;i++){
    for(let j = 0; j<rows; j++){
        if(board[i][j] == -1){
            const mine = document.getElementById(i.toString() + ";" + j.toString());
            mine.removeEventListener("click", CheckEmpty);
            mine.addEventListener("click", ClickMine);
        }
    }
}

for(let l=0; l<rows; l++){
    for(let k =0; k<rows; k++){
        for(let i = -1; i <2; i++){
            for(let j = -1; j < 2; j++){
                if(((l+i)>-1)&&((k+j)>-1)){
                    if(((l+i)<rows)&&((k+j)<rows)){
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
function ClickMine(){
    for(let i =0; i<rows;i++){
        for(let j =0; j<rows;j++){
            if(board[j][i]==-1){
                const boom = document.getElementById(j.toString()+ ";" + i.toString());
                boom.innerText = "×";
            }
        }
    }
    flagcount.innerText += " Skill issue!";
    for(let l=0; l<rows; l++){
        for(let k =0; k<rows; k++){
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
    let x = parseInt(event.target.id.split(";")[0]);
    let y = parseInt(event.target.id.split(";")[1]);
    event.target.removeEventListener("contextmenu", Flag);   
    if(board[x][y] > 0){
        event.target.innerText = board[x][y];
        event.target.style.backgroundColor = "lightgray";
        event.target.style.color = "red";
    }
    else{
        Reveal(x, y);
    }
    let count = 0;
    for(let i = 0; i<rows; i++){
        for(let j = 0; j<rows; j++){
            const check = document.getElementById(j.toString() + ";" + i.toString());
            if(board[j][i] == -2 || check.style.backgroundColor == "lightgray"){
                count++;
            }
        }
    }
    if(count + pocetMin == rows*rows){
        flagcount.innerText += " Well played!";
        for(let l=0; l<rows; l++){
            for(let k =0; k<rows; k++){
                if(board[k][l]!=-1){
                    kaput = document.getElementById(k.toString()+";"+l.toString());
                    kaput.removeEventListener("click", CheckEmpty);
                    kaput.removeEventListener("contextmenu", Flag);
                }
                else{
                    end = document.getElementById(k.toString()+";"+l.toString());
                    end.removeEventListener("click", ClickMine);
                    end.removeEventListener("contextmenu", Flag);
                }
            }
        }
    }
}
function Reveal(x, y){
    const cell = document.getElementById(x.toString()+";" +y.toString());
    cell.removeEventListener("contextmenu", Flag);   
    cell.style.backgroundColor = "lightgray";
    cell.style.color = "orange";
    for(let i =-1; i<2; i++){
        for(let j = -1; j<2; j++){
            if(y+i<rows&&y+i>-1){
                if(x+j<rows&&x+j>-1){
                    if(board[x+j][y+i]>0){
                        const revealed = document.getElementById((x+j).toString()+";" +(y+i).toString());
                        revealed.removeEventListener("contextmenu", Flag);
                        revealed.innerText = board[x+j][y+i];
                        revealed.style.backgroundColor = "lightgray";
                        revealed.style.color = "red";
                    }
                    else if(board[x+j][y+i]==0){
                        const revealed = document.getElementById((x+j).toString()+";"+(y+i).toString());
                        revealed.removeEventListener("contextmenu", Flag);
                        revealed.style.backgroundColor = "lightgray";
                        revealed.style.color = "orange";
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
    if(amount<pocetMin){
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
    flagcount.innerText = (pocetMin-amount).toString()+"🚩";
    
}
