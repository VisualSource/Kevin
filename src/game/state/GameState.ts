import EventDispatcher from '../utils/EventDispatcher';
import QueryableWorker from './OpponentHander';
import { observe } from "rxjs-observe";

let instance: any = null;
export default class GameState{
    static getInstance(): GameState{
        if(instance === null){
          instance = new GameState();
        }
        return instance;
    }
    private emmiter: EventDispatcher = EventDispatcher.getInstance();
    public worker: QueryableWorker = QueryableWorker.getInstance();
    self = observe({health: 30, mana: 2000, turns: 0});
    opponent = observe({health: 30, mana: 1, turns: 0});
    showOverlay = observe({show: false, turnOwner: "self", wating: true});
    constructor(){
        this.worker.addListeners("turn_change",()=>{
            if(this.OverlayProxy.turnOwner !== "self"){
                this.nextTurn();
            }
        });
        this.worker.addListeners("opponent_ready",()=>{
            this.showOverlay.proxy.wating  = false;
        });
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
    get OverlayProxy(){
        return this.showOverlay.proxy;
    }
    get OverlayObserve(){
        return this.showOverlay.observables;
    }
   
    nextTurn(){
        // make sure to update the oppoent 
        if( this.OverlayProxy.turnOwner === "self"){
            this.emmiter.emit("end_of_turn",{owner:"self"});
            this.emmiter.emit("start_of_turn",{owner:"opponent"});
            this.selfProxy.turns++;
            this.OverlayProxy.turnOwner = "opponent";
            this.worker.send("turn_change",{ test: "self"});
        }else{
            this.emmiter.emit("end_of_turn",{owner:"opponent"});
            this.emmiter.emit("start_of_turn",{owner:"self"});
            this.oppoentProxy.turns++;
            this.OverlayProxy.turnOwner = "self";
            this.worker.send("turn_change",{ test: "opponent"});
        }
    }
}