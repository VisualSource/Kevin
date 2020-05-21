import React,{Component, createRef, useState, useEffect} from 'react';
import {init} from './main';
import {Button} from 'shineout';
import GameState from './state/GameState';
import OpponentHander from './state/OpponentHander';

export default class Game extends Component<{},{overlay: boolean,buttonDisable:boolean}>{
    public gameElement = createRef<HTMLCanvasElement>();
    gameState = GameState.getInstance();
    constructor(props: any){
        super(props);
        this.state = {
            overlay: false,
            buttonDisable: false
        }
    }
    componentDidMount(){
        this.gameState.OverlayObserve.show.subscribe((value: any)=>this.setState({overlay: value}));
        this.gameState.OverlayObserve.turnOwner.subscribe((value: any)=>{
             this.setState({buttonDisable: (value === "self" ? false : true)});
        });
        init(this.gameElement.current as HTMLCanvasElement);
    }
    componentWillUnmount(){
        OpponentHander.getInstance().terminate();
    }
    render(){
            return <div>
                        {this.Overlay()}
                        <canvas id="game" ref={this.gameElement}></canvas>
                </div>
    }
    Overlay(){
        if(this.state.overlay){
            return <>
                 <div id="game-overlay">
                    <Button type="secondary">Menu</Button>
                </div>
                <div id="turn_time">
                    <p>{"0.00"}</p>
                    <Button type="primary" disabled={this.state.buttonDisable} onClick={()=>this.gameState.nextTurn()}>wating</Button>
                </div>
                <PlayerStats owner={this.gameState.selfProxy} observe={this.gameState.selfObserve} css="player-self"/>
                <PlayerStats owner={this.gameState.oppoentProxy} observe={this.gameState.opponentObserve} css="player-opponent "/>
            </>
        }else{
            return null;
        }
    }
}



function PlayerStats({owner, observe, css}:{owner: any, observe: any, css: string}){
    const [mana, setMana] = useState(owner.mana);
    const [health, setHealth] = useState(owner.health);
    const [turns, setTurns] = useState(owner.turns);
    useEffect(()=>{
        observe.health.subscribe((data: number)=>setHealth(data));
        observe.mana.subscribe((data: number)=>setMana(data));
        observe.turns.subscribe((data: number)=>setTurns(data));
    },[])
    return <div id="player-info" className={css}>
            <p>Mana: {mana}</p>
            <p>Health: {health}</p>
            <p>Turns: {turns}</p>
            <img src="" alt="user_logo"/>
          </div>
}
