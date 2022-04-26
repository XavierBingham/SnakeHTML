import LinkedList from "/Utils/LinkedList.js";

let canvas = document.getElementById("playing-field");
let context = canvas.getContext("2d");

export default class GridSystem {

    static _Settings;
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
                Columnds: data.Grid.Columns
            }
        })

        //Data setup
        this.Grid = [this._Settings.Rows][this._Settings.Columns];
        this.EmptySpaces = new LinkedList();

    }

    static Append(row, column, element){
        //problem here, we can't search through EmptySpaces for this (row,column) because it's inefficient, I will on runtime determine if an empty space is still empty for now...
        this.Grid[row][column] = element;
    }

    static Swap(row1, column1, row2, column2){
        const tempStorage = this.Grid[row1][column1];
        this.Grid[row1][column1] = this.Grid[row2][column2];
        this.Grid[row2][column2] = tempStorage;
    }

}