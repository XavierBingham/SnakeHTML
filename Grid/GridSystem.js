import LinkedList from "/Utils/LinkedList.js";

let canvas = document.getElementById("playing-field");
let context = canvas.getContext("2d");

export default class GridSystem {

    _Settings;
    static Grid;
    static EmptySpaces;
    static EntityData;

    static Init(){

        //Grid setup
        $.ajaxSetup ({ async: false })
        $.getJSON ("/Data/GameData.json", function(data){

            canvas.width = data.Grid.Width;
            canvas.height = data.Grid.Height;
            GridSystem._Settings = {
                Rows: data.Grid.Rows,
                Columns: data.Grid.Columns,
                CellSizeX: data.Grid.Width / data.Grid.Rows,
                CellSizeY: data.Grid.Height / data.Grid.Columns,
            }
            
            GridSystem.EntityData = data.CanvasEntityModel;

        })

        //Data setup
        this.Grid = [];
        for(let row = 0; row < this._Settings.Rows; row++){
            this.Grid[row] = [];
        }
        this.EmptySpaces = [];

    }

    static GetRandomSpace(){
        let success = false;
        if(this.EmptySpaces.length > 0){
            while(!success) {
                const randomIndex = Math.floor(Math.random() * this.EmptySpaces.length);
                const randomSpace = this.EmptySpaces[randomIndex];
                this.EmptySpaces.slice(randomIndex);
                if(this.Grid[randomSpace.row][randomSpace.column] === undefined){
                    success = true;
                    return randomSpace;
                }
            }
        }
    }

    static FillCell(row, column, entityType){
        context.fillStyle = this.EntityData[entityType].color;
        context.fillRect(
            row * this._Settings.CellSizeX,
            column * this._Settings.CellSizeY,
            this._Settings.CellSizeX,
            this._Settings.CellSizeY
        );
    }

    static ClearCell(row, column){
        context.clearRect(
            row * this._Settings.CellSizeX,
            column * this._Settings.CellSizeY,
            this._Settings.CellSizeX,
            this._Settings.CellSizeY
        )
    }

    static Append(row, column, entityType){
        //problem here, we can't search through EmptySpaces for this (row,column) because it's inefficient, I will on runtime determine if an empty space is still empty for now...
        this.Grid[row][column] = entityType;
        //move graphical position of the element
        this.FillCell(row, column, entityType);
    }

    static Remove(row, column){
        this.Grid[row][column] = undefined;
        this.ClearCell(row, column);
    }

    static Move(fromRow, fromColumn, toRow, toColumn){
        const storage = this.Grid[fromRow][fromColumn]
        this.Grid[toRow][toColumn] = storage;
        this.Grid[fromRow][fromColumn] = undefined;
        //move graphical position of the element
        this.FillCell(toRow, toColumn, storage);
        this.ClearCell(fromRow, fromColumn);
    }

    static Swap(row1, column1, row2, column2){
        const storage1 = this.Grid[row1][column1];
        const storage2 = this.Grid[row2][column2];
        this.Grid[row1][column1] = storage2;
        this.Grid[row2][column2] = storage1;
        //swap graphical positions of the elements
        this.FillCell(row1, column1, storage1);
        this.FillCell(row2, column2, storage2);
    }

    static IsOccupied(row, column){
        if(row < 0 || row >= this._Settings.Rows || column < 0 || column >= this._Settings.Columns){
            return {
                collision: true,
                entity: "Wall"
            };
        }
        return {
            collision: this.Grid[row][column] !== undefined,
            entity: this.Grid[row][column]
        };
    }

    static ResetGrid(){
        this.EmptySpaces = [];
        for(let row = 0; row < this._Settings.Rows; row++){
            for(let column = 0; column < this._Settings.Columns; column++){
                if(this.Grid[row][column] !== undefined){
                    this.Grid[row][column] = undefined;
                }
                this.EmptySpaces.push({
                    row: row,
                    column: column
                });
            }
        }
    }

}