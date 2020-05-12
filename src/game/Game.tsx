import React,{Component, createRef, useState, useEffect} from 'react';
import {init} from './main';
import {Button} from 'shineout';
import GameState from './state/GameState';
import OpponentHander from './state/OpponentHander';
const gameState = GameState.getInstance();
export default class Game extends Component<{},{overlay: boolean}>{
    public gameElement = createRef<HTMLCanvasElement>()
    constructor(){
        super({});
        this.state = {
            overlay: false
        }
    }
    componentDidMount(){
        init(this.gameElement.current as HTMLCanvasElement);
    }
    componentWillUnmount(){
        OpponentHander.getInstance().terminate();
    }
    render(){
        if(this.state.overlay){
            return <div>
                        <div id="game-overlay">
                            <Button type="secondary">Menu</Button>
                        </div>
                        <div id="turn_time">
                                <p>{"0.00"}</p>
                                <Button type="secondary" onClick={()=>gameState.nextTurn()}>wating</Button>
                        </div>
                        <SelfStats/>
                        <OpponentStats/>
                        <canvas id="game" ref={this.gameElement}></canvas>
                </div>
        }else{
            return null;
        }
    }
}


function SelfStats(){
    const [mana, setMana] = useState(gameState.selfProxy.mana);
    const [health, setHealth] = useState(gameState.selfProxy.health);
    const [turns, setTurns] = useState(gameState.selfProxy.turns);
    useEffect(()=>{
        gameState.selfObserve.health.subscribe((data: number)=>setHealth(data));
        gameState.selfObserve.mana.subscribe((data: number)=>setMana(data));
        gameState.selfObserve.turns.subscribe((data: number)=>setTurns(data));
    },[])
    return <div id="self">
            <p>Mana: {mana}</p>
            <p>Health: {health}</p>
            <p>Turns: {turns}</p>
            <img src="" alt="player_self"/>
          </div>
}

function OpponentStats(){
    const [mana, setMana] = useState(gameState.oppoentProxy.mana);
    const [health, setHealth] = useState(gameState.oppoentProxy.health);
    const [turns, setTurns] = useState(gameState.oppoentProxy.turns);
    useEffect(()=>{
        gameState.opponentObserve.health.subscribe((data: number)=>setHealth(data));
        gameState.opponentObserve.mana.subscribe((data: number)=>setMana(data));
        gameState.opponentObserve.turns.subscribe((data: number)=>setTurns(data));
    },[])
    return <div id="opponent">
            <p>Mana: {mana}</p>
            <p>Health: {health}</p>
            <p>Turns: {turns}</p>
            <img src="" alt="player_opponent"/>
          </div>
}