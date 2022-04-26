import MoveInfo from "./MoveInfo.js";

export default {

    Move:function(InputManager, InputObject, BindId, PressedDown){

        const key = InputObject.key;

        if(PressedDown){
            switch(BindId){
                case("moveLeft"):
                    MoveInfo.axis = "x";
                    MoveInfo.direction = -1;
                    break;
                case("moveRight"):
                    MoveInfo.axis = "x";
                    MoveInfo.direction = 1;
                    break;
                case("moveUp"):
                    MoveInfo.axis = "y";
                    MoveInfo.direction = -1;
                    break;
                case("moveDown"):
                    MoveInfo.axis = "y";
                    MoveInfo.direction = 1;
                    break;
            }
        }
        
    },

}