import inputHandlers from "./InputHandlers.js";

export default new Map([

    ["moveLeft", {
        InputHandler:inputHandlers.Move,
        Keybinds:[
            "a",
            "ArrowLeft"
        ]
    }],

    ["moveRight", {
        InputHandler:inputHandlers.Move,
        Keybinds:[
            "d",
            "ArrowRight"
        ]
    }],

    ["moveUp", {
        InputHandler:inputHandlers.Move,
        Keybinds:[
            "w",
            "ArrowUp"
        ]
    }],

    ["moveDown", {
        InputHandler:inputHandlers.Move,
        Keybinds:[
            "s",
            "ArrowDown"
        ]
    }],

])