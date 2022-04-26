import LinkedList from "/Utils/LinkedList.js";

let canvas = document.getElementById("playing-field");
let context = canvas.getContext("2d");

export default class GridSystem {

    _Settings;
    static Grid;
    static EmptySpaces;

    static Init(){

        //Grid setup
        $.ajaxSetup ({ async: false })
        $.getJSON ("/Data/GameData.json", function(data){
            canvas.width = data.Grid.Width;
            canvas.height = data.Grid.Height;
            GridSystem._Settings = {
                Rows: data.Grid.Rows,
                Columns: data.Grid.Columns
            }
        })

        //Data setup
        this.Grid = [this._Settings.Rows][this._Settings.Columns];
        this.EmptySpaces = [];

    }

    static GetRandomSpace(){
        success = false;
        while(!success) {
            const randomIndex = Math.random() * this.EmptySpaces.length;
            const randomSpace = this.EmptySpaces[randomIndex];
            randomSpace.slice(randomIndex);
            if(this.Grid[randomSpace.row][randomSpace.column] === undefined){
                success = true;
                return randomSpace;
            }
        }
    }

    static Append(row, column, element){
        //problem here, we can't search through EmptySpaces for this (row,column) because it's inefficient, I will on runtime determine if an empty space is still empty for now...
        this.Grid[row][column] = element;
    }

    static Move(fromRow, fromColumn, toRow, toColumn){
        this.Grid[toRow][toColumn] = this.Grid[fromRow][fromColumn];
        this.Grid[fromRow][fromColumn] = undefined;
        //move graphical position of the element
    }

    static Swap(row1, column1, row2, column2){
        const storage1 = this.Grid[row1][column1];
        const storage2 = this.Grid[row2][column2];
        this.Grid[row1][column1] = storage2;
        this.Grid[row2][column2] = storage1;
        //swap graphical positions of the elements
    }

    static Clear(){
        this.EmptySpaces = [];
        for(let row = 0; row < this._Settings.Rows; row++){
            for(let column = 0; column < this._Settings.Columns; column++){
                if(this.Grid[row][column] !== undefined){
                    document.removeChild(this.Grid[row][column]);
                    this.Grid[row][column] = undefined;
                }
                this.EmptySpaces.push({
                    Row: row,
                    Column: column
                });
            }
        }
    }

}