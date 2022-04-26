import LinkedList from "../Utils/LinkedList.js";
import MoveInfo from "../Input/MoveInfo.js";
import Body from "./Body.js";
import MathUtil from "../Utils/MathUtil.js";
import Grid from "../Grid/GridSystem.js";

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
            Grid.Append(position.x, position.y, newPiece);
        }

    }

    Grow(){

        //updating head position
        currHeadPosition = this.BodyLinkedList.head.storage;
        position = {
            x: currHeadPosition.x + (MoveInfo.axis == "x")?MoveInfo.direction:0,
            y: currHeadPosition.y + (MoveInfo.axis == "y")?MoveInfo.direction:0,
        }
        this.BodyLinkedList.Push(position);
        this.LastMoveDirection.x = position.x;
        this.LastMoveDirection.y = position.y;
        Grid.Move(
            currHeadPosition.x,
            currHeadPosition.y,
            position.x,
            position.y
        );
        this.BodyLinkedList.head.SetStorage(position);

        //creating new body piece after head
        newPiece = Body.CreateBody();
        this.BodyLinkedList.InsertAfter(position, this.BodyLinkedList.head)
        Grid.Append(position.x, position.y, newPiece);

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