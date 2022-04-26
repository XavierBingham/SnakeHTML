import LinkedList from "../Utils/LinkedList.js";
import MoveInfo from "../Input/MoveInfo.js";
import Body from "./Body.js";
import MathUtil from "../Utils/MathUtil.js";

let _Settings;

$.ajaxSetup ({ async: false })
$.getJSON ("/Data/GameData.json", function(data){
    _Settings = {
        StartLength: parseFloat(data.Player.StartLength),
        StartUpdateInterval: parseFloat(data.Player.StartUpdateInterval),
        MaxUpdateInterval: parseFloat(data.Player.MaxUpdateInterval),
        UpdateIntervalDecrement: parseFloat(data.Player.UpdateIntervalDecrement),
    }
})

export default class SnakeCharacter {

    BodyLinkedList;
    LastMoveDirection;
    UpdateInterval;

    LastUpdate;
    TimePassed;

    constructor(){

        this.BodyLinkedList = new LinkedList();
        
        this.UpdateInterval = _Settings.StartUpdateInterval;
        this.TimePassed = 0;

        this.LastMoveDirection = {
            x: 0,
            y: -1,
        }

    }

    IncreaseSpeed(){
        this.UpdateInterval = MathUtil.clamp(this.UpdateInterval - _Settings.UpdateIntervalDecrement);
    }

    Respawn(spawnRow, spawnColumn){

        //update move direction
        MoveInfo.axis = "y";
        MoveInfo.direction = -1;
        this.LastMoveDirection = {
            x: 0,
            y: -1,
        }

        //reset snake data
        this.UpdateInterval = _Settings.StartUpdateInterval;
        this.TimePassed = 0;

        this.BodyLinkedList.Clear();

        for(let index = 0; index < _Settings.StartLength; index++){
            let newPiece;
            let position;
            if(index === 0){
                newPiece = Body.CreateHead();
                position = {
                    x: spawnRow,
                    y: spawnColumn,
                }
            }else{ // TO DO: update to wrap around the board to find an empty space for longer snakes
                newPiece = Body.CreateBody();
                position = {
                    x: spawnRow,
                    y: spawnColumn - index,
                }
            }
            this.BodyLinkedList.Push(position);
            //send newHead to grid with position
        }

    }

    Grow(){
        newPiece = Body.CreateBody();
        position = {
            x: this.BodyLinkedList.head.storage.x + (MoveInfo.axis == "x")?MoveInfo.direction:0,
            y: this.BodyLinkedList.head.storage.y + (MoveInfo.axis == "y")?MoveInfo.direction:0,
        }
        this.BodyLinkedList.Push(position);
        this.LastMoveDirection.x = position.x;
        this.LastMoveDirection.y = position.y;
        // TO DO: swap head cell with position, and set the cell position of the new body piece to old head position
    }

    Move(){
        
    }

    Update(DeltaTime){
        this.TimePassed += DeltaTime;
        if(this.TimePassed >= this.UpdateInterval){
            this.TimePassed = 0;
            this.Move();
        }
    }

}