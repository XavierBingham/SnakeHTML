import inputBinds from "./InputBinds.js";

export default class InputManager {

    KeysDown;
    InputEvents;
    KeyMapLookup;
    BindIdLookup;

    constructor(){

        //variable init
        this.KeysDown = [];
        this.InputEvents = [];
        this.KeyMapLookup = new Map();
        this.BindIdLookup = new Map();

        //mapping all binds
        for(let [bindId, bindInfo] of inputBinds){

            const newInputBind = {
                InputHandler:bindInfo.InputHandler,
                Keybinds:bindInfo.Keybinds,
                Enabled:false
            }

            this.BindIdLookup[bindId] = newInputBind;
            for(let keybind of bindInfo.Keybinds){
                if(this.KeyMapLookup[keybind] === undefined){
                    this.KeyMapLookup[keybind] = [];
                }
                this.KeyMapLookup[keybind].push(newInputBind);
            }

        }
        
        //connecting input events
        const self = this;

        this.InputEvents.push(document.onkeydown = function(InputObject){
            self.ProcessInput(InputObject, true);
        });

        this.InputEvents.push(document.onkeyup = function(InputObject){
            self.ProcessInput(InputObject, false);
        });

    }

    /**
     * Checks is a bind has any of its assigned keybinds currently being pressed.
     * @param {*} BindId The bind to check.
     * @returns A boolean of whether a bind currently has keys binded to it pressed or not.
     */
    BindHasKeysDown(BindId){
        const inputBind = this.BindIdLookup[BindId];
        for(let keybind of inputBind.Keybinds){
            if(this.KeysDown[keybind]){
                return true;
            }
        }
        return false;
    }

    /**
     * Enables a bind to have input piped to.
     * @param {*} BindId The bind to enable.
     */
    EnableBind(BindId){
        const inputBind = this.BindIdLookup[BindId];
        if(inputBind !== undefined){
            inputBind.Enabled = true;
        }
    }

    /**
     * Disables a bind to have input piped to.
     * @param {*} BindId The bind to disable.
     */
    DisableBind(BindId){
        const inputBind = this.BindIdLookup[BindId];
        if(inputBind !== undefined){
            inputBind.Enabled = false;
        }
    }

    /**
     * Fired from input events, used to route the input to activate an InputHandler method.
     * @param {*} InputObject The input object from the input event.
     * @param {*} PressedDown Whether the key is being pressed down or up.
     */
    ProcessInput(InputObject, PressedDown){

        const pressedKey = InputObject.key;
        const keyLookup = this.KeyMapLookup[pressedKey];

        this.KeysDown[pressedKey] = PressedDown;

        if(keyLookup !== undefined){
            for(let [bindId, inputBind] of this.KeyMapLookup[pressedKey]){
                if(inputBind.Enabled){
                    if(inputBind.InputHandler !== undefined){
                        inputBind.InputHandler(this, InputObject, bindId, PressedDown);
                    }
                    break;
                }
            }
        }

    }

}