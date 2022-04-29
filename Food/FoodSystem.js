import Grid from "../Grid/GridSystem.js";

export default class FoodSystem {

    static Food;

    static SpawnFood(){
        const randomSpace = Grid.GetRandomSpace();
        Food++;
        Grid.Append(randomSpace.Row, randomSpace.Column, "Food");
    }

    static FoodConsumed(){
        Food--;
    }

    static Reset(){
        Food = 0;
    }

}