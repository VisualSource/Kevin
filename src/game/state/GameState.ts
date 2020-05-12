import EventDispatcher from '../utils/EventDispatcher';
import OpponentHandler from './OpponentHander';
import { observe } from "rxjs-observe";

let instance: any = null;
export default class GameState{
    private emmiter: EventDispatcher = EventDispatcher.getInstance();
    public opponentHandler: OpponentHandler = OpponentHandler.getInstance();
    self: any;
    opponent: any;
    private turnOwner: "self" | "oppoent" = "self";
    static getInstance(): GameState{
        if(instance == null){
          instance = new GameState();
        }
        return instance;
    }
    constructor(){
        this.self = observe({health: 30, mana: 2000, turns: 0}); 
        this.opponent = observe({health: 30, mana: 1, turns: 0});
    }
    get selfProxy(){
        return this.self.proxy;
    }
    get oppoentProxy(){
        return this.opponent.proxy;
    }
    get selfObserve(){
        return this.self.observables;
    }
    get opponentObserve(){
        return this.opponent.observables
    }
   
    nextTurn(){
        // make sure to update the oppoent 
        if(this.turnOwner === "self"){
            this.emmiter.emit("end_of_turn",{owner:"self"});
            this.emmiter.emit("start_of_turn",{owner:"opponent"});
            this.selfProxy.turns++;
            this.turnOwner ="oppoent";
           
        }else{
            this.emmiter.emit("end_of_turn",{owner:"opponent"});
            this.emmiter.emit("start_of_turn",{owner:"self"});
            this.oppoentProxy.turns++;
            this.turnOwner = "self";
         
        }
    }

    
   
   
}