import Food from "./Food.js";
import Grid from "../Grid/GridSystem.js";

export default class FoodSystem {

    static Food;

    static SpawnFood(){
        const randomSpace = Grid.GetRandomSpace();
        const newFood = Food.CreateFood();
        Food++;
        Grid.Append(randomSpace.Row, randomSpace.Column, newFood);
    }

    static FoodConsumed(){
        Food--;
    }

    static Reset(){
        Food = 0;
    }

}