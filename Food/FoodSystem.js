import Grid from "../Grid/GridSystem.js";

export default class FoodSystem {

    static FoodLocation;

    static SpawnFood(){
        const randomSpace = Grid.GetRandomSpace();
        if(randomSpace !== undefined){
            this.FoodLocation = {
                x: randomSpace.row,
                y: randomSpace.column
            }
            Grid.Append(randomSpace.row, randomSpace.column, "Food");
        }
    }

    static FoodConsumed(){
        Grid.Remove(this.FoodLocation.x, this.FoodLocation.y);
        this.SpawnFood();
    }

    static Reset(){
        if(this.FoodLocation !== undefined){
            Grid.Remove(this.FoodLocation.x, this.FoodLocation.y);
            this.FoodLocation = undefined;
        }
    }

}