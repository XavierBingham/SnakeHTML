import SnakeCharacter from "./Character/SnakeCharacter.js";
import GridSystem from "./Grid/GridSystem.js";
import InputManager from "./Input/InputManager.js";
import FoodSystem from "./Food/FoodSystem.js";

let _Settings = {
    UpdateInterval: 10
}

let InputManagerComponent;

let GameManager; GameManager = {

    GameState: "Playing",
    Character: undefined,
    Score: 0,
    SoundEffects:{
        "GameOver": new Audio("/Sounds/game-over.wav")
    },

    Init(){

        console.log("Initializing Game...");
        InputManagerComponent = new InputManager();
        GridSystem.Init();
        GameManager.Character = new SnakeCharacter();
        GameManager.RestartGame();

    },

    RestartGame(){

        console.log("Restarting Game...");
        GridSystem.ResetGrid();

        GameManager.Score = 0;
        GameManager.Character.Respawn(
            parseInt(GridSystem._Settings.Rows/2),
            parseInt(GridSystem._Settings.Columns/2)
        );

        //enable movement input
        InputManagerComponent.EnableBind("moveLeft");
        InputManagerComponent.EnableBind("moveRight");
        InputManagerComponent.EnableBind("moveUp");
        InputManagerComponent.EnableBind("moveDown");

        FoodSystem.SpawnFood();

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

        this.SoundEffects["GameOver"].play();
        FoodSystem.Reset();

        //disable movement input
        InputManagerComponent.DisableBind("moveLeft");
        InputManagerComponent.DisableBind("moveRight");
        InputManagerComponent.DisableBind("moveUp");
        InputManagerComponent.DisableBind("moveDown");

        console.log("Game Ended.");
        GameManager.GameState = "Results";
        const endScore = GameManager.Score;
        //display results + add click events/etc.

    },

}

window.onload = GameManager.Init;
export default GameManager;