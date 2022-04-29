import LinkedList from "../Utils/LinkedList.js";
import MoveInfo from "../Input/MoveInfo.js";
import MathUtil from "../Utils/MathUtil.js";
import Grid from "../Grid/GridSystem.js";
import GameManager from "../GameManager.js";

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
            y: 1,
        }

    }

    IncreaseSpeed(){
        this.UpdateInterval = MathUtil.clamp(this.UpdateInterval - _Settings.UpdateIntervalDecrement);
    }

    Respawn(spawnRow, spawnColumn){

        //update move direction
        MoveInfo.axis = "y";
        MoveInfo.direction = 1;
        this.LastMoveDirection = {
            x: 0,
            y: 1,
        }

        //reset snake data
        this.UpdateInterval = _Settings.StartUpdateInterval;
        this.TimePassed = 0;

        this.BodyLinkedList.Clear();

        for(let index = 0; index < _Settings.StartLength; index++){
            let entityType;
            let position;
            if(index === 0){
                entityType = "PlayerHead";
                position = {
                    x: spawnRow,
                    y: spawnColumn,
                }
            }else{ // TO DO: update to wrap around the board to find an empty space for longer snakes
                entityType = "PlayerBody";
                position = {
                    x: spawnRow,
                    y: spawnColumn - index,
                }
            }
            this.BodyLinkedList.Push(position);
            Grid.Append(position.x, position.y, entityType);
        }

    }

    Grow(){

        //updating head position
        const currHeadPosition = this.BodyLinkedList.head.storage;
        const newPosition = {
            x: currHeadPosition.x + ((MoveInfo.axis == "x")?MoveInfo.direction:0),
            y: currHeadPosition.y + ((MoveInfo.axis == "y")?MoveInfo.direction:0),
        }
        this.BodyLinkedList.Push(newPosition);
        this.LastMoveDirection.x = newPosition.x;
        this.LastMoveDirection.y = newPosition.y;
        Grid.Move(
            currHeadPosition.x,
            currHeadPosition.y,
            newPosition.x,
            newPosition.y
        );
        this.BodyLinkedList.head.SetStorage(newPosition);

        //creating new body piece after head
        this.BodyLinkedList.InsertAfter(newPosition, this.BodyLinkedList.head)
        Grid.Append(currHeadPosition.x, currHeadPosition.y, "PlayerBody");

    }

    ShrinkTail(){

        const currTailPosition = this.BodyLinkedList.tail.storage;
        Grid.Remove(currTailPosition.x, currTailPosition.y);
        this.BodyLinkedList.Remove(this.BodyLinkedList.tail);

    }

    Move(){
        console.log(MoveInfo.axis, MoveInfo.direction)
        const currHeadPosition = this.BodyLinkedList.head.storage;
        const nextPosition = {
            x: currHeadPosition.x + ((MoveInfo.axis == "x")?MoveInfo.direction:0),
            y: currHeadPosition.y + ((MoveInfo.axis == "y")?MoveInfo.direction:0),
        }
        
        if(Grid.IsOccupied(nextPosition.x, nextPosition.y)){
            GameManager.EndGame();
            return;
        }

        this.Grow();
        this.ShrinkTail();

    }

    Update(DeltaTime){
        this.TimePassed += DeltaTime;
        if(this.TimePassed >= this.UpdateInterval){
            this.TimePassed = 0;
            this.Move();
        }
    }

}