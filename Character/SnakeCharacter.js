import LinkedList from "../Utils/LinkedList.js";
import MoveInfo from "../Input/MoveInfo.js";
import MathUtil from "../Utils/MathUtil.js";
import Grid from "../Grid/GridSystem.js";
import GameManager from "../GameManager.js";
import FoodSystem from "../Food/FoodSystem.js";

let _Settings;

$.ajaxSetup ({ async: false })
$.getJSON ("/Data/GameData.json", function(data){
    _Settings = {
        StartLength: parseFloat(data.Player.StartLength),
        StartUpdateInterval: parseFloat(data.Player.StartUpdateInterval)
    }
})

export default class SnakeCharacter {

    BodyLinkedList;
    UpdateInterval;

    LastUpdate;
    TimePassed;

    constructor(){

        this.BodyLinkedList = new LinkedList();
        
        this.UpdateInterval = _Settings.StartUpdateInterval;
        this.TimePassed = 0;

    }

    IncreaseSpeed(){
        this.UpdateInterval = MathUtil.clamp(this.UpdateInterval - _Settings.UpdateIntervalDecrement);
    }

    Respawn(spawnRow, spawnColumn){

        //update move direction
        MoveInfo.axis = "y";
        MoveInfo.direction = 1;
        MoveInfo.prevAxis = "y";
        MoveInfo.prevDirection = 1;

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
            this.BodyLinkedList.InsertAtEnd(position);
            Grid.Append(position.x, position.y, entityType);
        }

    }

    GrowHead(currMoveDirection){

        //updating head position
        const currHeadPosition = this.BodyLinkedList.head.storage;
        const newPosition = {
            x: currHeadPosition.x + ((currMoveDirection.axis == "x")?currMoveDirection.direction:0),
            y: currHeadPosition.y + ((currMoveDirection.axis == "y")?currMoveDirection.direction:0),
        }
        this.BodyLinkedList.Push(newPosition);
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
        
        const currMoveDirection = {
            axis: MoveInfo.axis,
            direction: MoveInfo.direction
        }
        const currHeadPosition = this.BodyLinkedList.head.storage;
        const nextPosition = {
            x: currHeadPosition.x + ((currMoveDirection.axis == "x")?currMoveDirection.direction:0),
            y: currHeadPosition.y + ((currMoveDirection.axis == "y")?currMoveDirection.direction:0),
        }

        MoveInfo.prevAxis = currMoveDirection.axis;
        MoveInfo.prevDirection = currMoveDirection.direction;
        
        const collisionInfo = Grid.IsOccupied(nextPosition.x, nextPosition.y);
        let foodCollision = false;
        if(collisionInfo.collision){
            console.log(collisionInfo.entity)
            if(collisionInfo.entity === "Food"){
                FoodSystem.FoodConsumed();
                Grid.Remove(nextPosition.x, nextPosition.y);
                foodCollision = true;
            }else{
                GameManager.EndGame();
                return;
            }
        }

        this.GrowHead(currMoveDirection);
        if(!foodCollision){
            this.ShrinkTail();
        }

    }

    Update(DeltaTime){
        this.TimePassed += DeltaTime;
        if(this.TimePassed >= this.UpdateInterval){
            this.TimePassed = 0;
            this.Move();
        }
    }

}