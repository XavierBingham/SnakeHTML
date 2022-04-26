class LLObject{

    storage;
    nextPtr;
    previousPtr;

    constructor(storage, nextPtr = undefined, previousPtr = undefined){
        this.storage = storage;
        this.nextPtr = nextPtr;
        this.previousPtr = previousPtr;
    }

    SetNext(nextPtr){
        this.nextPtr = nextPtr;
    }

    SetPrevious(previous){
        this.previousPtr = previous;
    }

    SetStorage(storage){
        this.storage = storage;
    }

}

export default class LinkedList{

    head;
    tail;

    constructor(){}

    Remove(obj){

        //update next and previous objects' pointers
        obj.previousPtr?.SetNext(obj.nextPtr);
        obj.nextPtr?.SetPrevious(obj.previousPtr);

        //check if this is the tail and accomodate for that
        if(obj === this.tail){
            this.tail = obj.previousPtr;
        }

        //check if this is the head and accomodate for that
        if(obj === this.head){
            this.head = obj.nextPtr;
        }

        //return what was stored in this object
        return obj.storage;

    }

    Push(storage){
        let newLLObject = new LLObject(storage, this.head, undefined);
        this.head?.SetPrevious(newLLObject);
        this.head = newLLObject;
        if(newLLObject.nextPtr === undefined){
            this.tail = newLLObject;
        }
    }

    InsertAtEnd(storage){
        let newLLObject = new LLObject(storage, undefined, this.tail);
        this.tail?.SetNext(newLLObject);
        this.tail = newLLObject;
        if(newLLObject.previousPtr === undefined){
            this.head = newLLObject;
        }
    }

    InsertBefore(storage, obj){
        let newLLObject = new LLObject(storage, obj, obj.previousPtr);
        obj.previousPtr?.SetNext(newLLObject);
        obj.SetPrevious(newLLObject);
        if(this.head === obj){
            this.head = newLLObject;
        }
    }
    
    InsertAfter(storage, obj){
        let newLLObject = new LLObject(storage, obj.nextPtr, obj);
        obj.SetNext(newLLObject);
        obj.nextPtr.SetPrevious(newLLObject);
        if(this.tail === obj){
            this.tail = newLLObject;
        }
    }

    MoveToEnd(obj){

        //link previous + next objects together
        obj.previousPtr?.SetNext(obj.nextPtr);
        obj.nextPtr?.SetPrevious(obj.previousPtr);

        //move obj to the end
        this.tail?.SetNext(obj);
        obj.SetPrevious(this.tail);
        this.tail = obj;

        //check if obj should also be the head
        if(obj.previousPtr === undefined){
            this.head = obj;
        }

    }

    MoveToStart(obj){

        //link previous + next objects together
        obj.previousPtr?.SetNext(obj.nextPtr);
        obj.nextPtr?.SetPrevious(obj.previousPtr);

        //move obj to start
        if(this.head !== obj){
            this.head?.SetPrevious(obj);
            obj.SetNext(this.head);
            this.head = obj;
        }
         
        //check if obj should also be the tail
        if(obj.nextPtr === undefined){
            this.tail = obj;
        }

    }

    Pop(){
        if(this.head !== undefined){
            return this.Remove(this.head);
        }
        return undefined;
    }

    FindAndRemove(storage){
        let currSearch = this.head;
        while(currSearch !== undefined){
            if(currSearch.storage === storage){
                this.Remove(currSearch);
            }
        }
    }

    Find(storage){
        let currSearch = this.head;
        while(currSearch !== undefined){
            if(currSearch.storage === storage){
                return currSearch;
            }
            currSearch = currSearch.nextPtr;
        }
    }

    Clear(){
        this.head = undefined;
        this.tail = undefined;
    }

}