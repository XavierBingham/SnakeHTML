import SnakeCharacter from "./Character/SnakeCharacter.js";
import GridSystem from "./Grid/GridSystem.js";
import InputManager from "./Input/InputManager.js";

let _Settings = {
    UpdateInterval: 10
}

let InputManagerComponent;

let GameManager; GameManager = {

    GameState: "Playing",
    Character: undefined,
    Score: 0,

    Init(){

        console.log("Initializing Game...");
        InputManagerComponent = new InputManager();
        GridSystem.Init();
        GameManager.Character = new SnakeCharacter();
        GameManager.RestartGame();

    },

    RestartGame(){

        console.log("Restarting Game...");
        GameManager.Score = 0;
        GameManager.Character.Respawn(5,5);

        InputManagerComponent.EnableBind("moveLeft");
        InputManagerComponent.EnableBind("moveRight");
        InputManagerComponent.EnableBind("moveUp");
        InputManagerComponent.EnableBind("moveDown");

        let lastUpdate = Date.now();
        let gameRender; gameRender = setInterval(function(){

            if(GameManager.GameState !== "Playing"){ clearInterval(gameRender); }

            const currDate = Date.now();
            const deltaTime = (currDate - lastUpdate)/1000;
            lastUpdate = currDate;
            GameManager.Character.Update(deltaTime);

        }, _Settings.UpdateInterval);

    },

    EndGame(){

        console.log("Game Ended.");
        GameManager.GameState = "Results";
        const endScore = GameManager.Score;
        //display results + add click events/etc.

    },

}

window.onload = GameManager.Init;
export default GameManager;