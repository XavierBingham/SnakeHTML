export default {

    CreateBody:function(){
        let newPiece = document.createElement("div");
        newPiece.className = "character-body-piece";
        return newPiece;
    },

    CreateHead:function(){
        let newPiece = document.createElement("div");
        newPiece.className = "character-head-piece";
        return newPiece;
    }

}