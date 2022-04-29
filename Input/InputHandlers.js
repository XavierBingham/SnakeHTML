import MoveInfo from "./MoveInfo.js";

export default {

    Move:function(InputManager, InputObject, BindId, PressedDown){

        const key = InputObject.key;

        if(PressedDown){
            switch(BindId){
                case("moveLeft"):
                    if(MoveInfo.prevAxis === "x" && MoveInfo.prevDirection === 1){return;}
                    MoveInfo.axis = "x";
                    MoveInfo.direction = -1;
                    break;
                case("moveRight"):
                    if(MoveInfo.prevAxis === "x" && MoveInfo.prevDirection === -1){return;}
                    MoveInfo.axis = "x";
                    MoveInfo.direction = 1;
                    break;
                case("moveUp"):
                    if(MoveInfo.prevAxis === "y" && MoveInfo.prevDirection === 1){return;}
                    MoveInfo.axis = "y";
                    MoveInfo.direction = -1;
                    break;
                case("moveDown"):
                    if(MoveInfo.prevAxis === "y" && MoveInfo.prevDirection === -1){return;}
                    MoveInfo.axis = "y";
                    MoveInfo.direction = 1;
                    break;
            }
        }
        
    },

}