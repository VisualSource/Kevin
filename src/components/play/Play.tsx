import React,{useEffect, useState, useReducer, useCallback} from 'react';
import useForceUpdate from 'use-force-update';
import Sidenav from '../Sidenav';
import {Button, Select, Image, Input, Message, Spin, Modal, Card} from 'shineout';
import {routeTo,queryFromURI} from '../../utils/history';
import {Utils} from 'phaser';
import QueryableWorker from '../../game/state/OpponentHander';
import {CardDeckMannager} from "../../game/utils/Loader";
import {useAuth0} from '../AuthProvidor';
import { Route, useParams} from "react-router-dom";
const cdMannager = CardDeckMannager.getInstance();
export default function Play(){
    document.title = "Kevin Online - Play";
    return <div id="play">
        <main>
            <Route path="/play/:type">
                        <PlayGame host={true}/>
            </Route>
            <Route exact path="/play">
                <PlayHome/>
            </Route>
        </main>
        <Sidenav activeTab={1}/>
    </div>

}
type ButtonTypes = "link" | "success" | "default" | "primary" | "secondary" | "warning" | "danger" | undefined;
let worker: QueryableWorker | null = null;
function userReducer(state: any, action: any){
    switch(action.type){
        case "logo_name":{
            state.logo = action.value.logo;
            state.name = action.value.name;
            return state;
        }
        case "status":{
            state.status.status = action.value.status;
            state.status.button = action.value.button;
            state.status.text = action.value.text;
            return state;
        }
        default:
            return state;
    }
}
function opponentReducer(state:any,action:any){
    switch(action.type){
        case "user":{
            state.logo = action.value.logo;
            state.name = action.value.name;
            state.status = action.value.status;
            return state;
        }
        case "status":{
            state.status = action.value.status;
            return state;
        }
        default:
            return state;
    }
}
function PlayGame(props:any){
    const forceUpdate = useForceUpdate();
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [code, setCode] = useState("NO CODE");
    const [decks, setDecks] = useState<string[]>([]);
    const [host, setHost] = useState<boolean>(false);
    const [userData, dispatchUser] = useReducer(userReducer, {logo:"", name:"USERNAME", status: {status: "Wating", button: "success", text: "Ready"}});
    const [opponentData, dispatchOpponent] = useReducer(opponentReducer, {logo:"", name:"USERNAME", status: "Wating"});
    const [mode, setMode] = useState<string>();
    //@ts-ignore
    const {loading, isAuthenticated,user} = useAuth0();
    const {type} = useParams();
    const canStart = useCallback(()=>{
        if(userData.status.status === "Ready" && opponentData.status === "Ready") return false;
        return true;
    },[opponentData.status,userData.status.status])
    useEffect(()=>{
        const init = (online: string)=>{
            setMode(online);
            setDecks(cdMannager.getDecks());
            setIsLoading(false);
            worker = QueryableWorker.create(type);
            worker.send("join_code",{ join: queryFromURI()});
            worker.send("init",{ name: userData.name, status: userData.status.status, logo: userData.logo});
            worker.addListeners("init",(event: any)=>{
                dispatchOpponent({type:"user", value: {name: event.name, status: event.status, logo: event.logo}});
                forceUpdate();
            });
            worker.addListeners("status_opponent",(event: any)=>{
                dispatchOpponent({type:"status", value:{status: event}});
                forceUpdate();
                //checkCanStart();
            });
            worker.addListeners("join_code",(event: any)=>{
                setCode(event.uuid);
            });
            worker.addListeners("game_start",(event: any)=>{
                routeTo("/game",{query:{uuid: code, online: true}, replace: true});
            });
            worker.addListeners("kick",(event: any)=>{
                //@ts-ignore
                Message.info('You Where kicked',5,{
                    position: "bottom-right",
                    title: "Kicked"
                });
                routeTo("/play",{replace: true});
            });
            forceUpdate();
        }
        if(!loading){
            if(isAuthenticated && type === "multiplayer"){
                dispatchUser({type:"logo_name", value:{logo: user?.picture ?? "", name: user?.name ?? "USERNAME"}});
                setHost(props.host);
                init("multiplayer");
            }else if(type === "singleplayer"){
                dispatchUser({type:"logo_name", value:{logo: user?.picture ?? "", name: user?.name ?? "USERNAME"}});
                setHost(true);
                init("singleplayer");
            }else{
                //@ts-ignore
                Message.error('Failed to Authenticate',5,{
                    position: "bottom-right",
                    title: "Error"
                });
                routeTo("/play",{replace: true});
            }
        }
    },[loading]);

    if(isLoading){
        return <div id="playing">
            <Spin size={50} name="cube-grid"></Spin>
        </div>
    }

     return <div id="playing">
                <nav id="play-nav">
                    <Select onChange={(value)=>{
                        cdMannager.setDeck("deck_"+value);
                    }} renderItem={c => `${Utils.String.UppercaseFirst(c)} Deck`} renderResult={c => `${Utils.String.UppercaseFirst(c)} Deck`} style={{width: 240}} data={decks} keygen={(value: string)=>value} placeholder="Select your deck"/>
                </nav>
                <div>
                    <div id="left"></div>
                    <div id="right"></div>
                    <div id="right-profile">
                        <Image shape="circle" width={150} height={150} title="user_logo" src={opponentData.logo}/>
                        <h4>{opponentData.name}</h4>
                        <p>Status: {opponentData.status}</p>
                        {mode === "singleplayer" ?  <Select onChange={(value)=>{
                            worker?.send("ai_difficlty",{value});
                        }} keygen={(value: any)=>value} data={["Easy","Normal","Hard"]} defaultValue={[1]} style={{width: 120}} placeholder="Set Difficlty"/> :<Button type="danger" onClick={()=>{
                            dispatchOpponent({type:"user", value:{status:"Wating", name:"Wating for User", logo:"no_user"}});
                            worker?.send("kick",{}); }
                            }>Kick</Button>}
                    </div>
                    <div id="left-profile">
                        <Image shape="circle" width={150} height={150} title="user_logo" src={userData.logo}/>
                        <h4>{userData.name}</h4>
                        <p>Status: {userData.status.status}</p>
                        <Button type={userData.status.button as ButtonTypes} onClick={()=>{
                            if(cdMannager.deckSet){
                                    dispatchUser({type:"status", value: userData.status.status === "Ready" ?  {status: "Wating", button: "success", text: "Ready"} : {status: "Ready", button: "danger", text: "Unready"}});
                                    forceUpdate();
                                    worker?.send("status_opponent",{status:userData.status.status});
                                   //checkCanStart();
                            }else{
                                //@ts-ignore
                                Message.error('You need to select a deck!',5,{
                                    position: "bottom-right",
                                    title: "Error"
                                });
                            }
                        }}>{userData.status.text}</Button>
                    </div>
                    <div id="center">
                        <h1>Join Code</h1>
                        <Input style={{width: 240}}  placeholder="d853c4929da544aea121" disabled defaultValue={code} value={code}/>
                       {host ?  <Button loading={canStart()} type="primary" onClick={()=>{
                            worker?.send("game_start",{});
                            routeTo("/game",{query:{uuid: code, online: false}, replace: true});
                       }}>Start</Button>: null}
                    </div>
                </div>
           </div>;
}

function PlayHome(){
    const [showModal, setShowModal] = useState(false);
    const [code, setCode] = useState();
    const Footer = ()=>{
        return <div>
            <Button onClick={()=>routeTo("/play/multiplayer",{})}>Start a Game</Button>
            <Button onClick={()=>{
                if(code){
                    routeTo("/play/multiplayer",{query:{uuid:code}})
                }else{
                    //@ts-ignore
                    Message.error('You need a code to join a game!',5,{
                        position: "bottom-right",
                        title: "Join Error"
                    });
                }
            }}>Join Game</Button>
        </div>
    }
    return <div id="play-home">
            <Card className="select-play">
                <Card.Body className="select-art">

                </Card.Body>
                <Card.Footer className="select-button">
                    <Button type="link" onClick={()=>routeTo("/play/singleplayer",{})}>Singleplayer</Button>
                </Card.Footer>
            </Card>
            <Card className="select-play">
                <Card.Body className="select-art">

                </Card.Body>
                <Card.Footer className="select-button">
                    <Button type="link" onClick={()=>setShowModal(true)}>Multiplayer</Button>
                </Card.Footer>
            </Card>
                <Modal visible={showModal} onClose={()=>setShowModal(false)} title="Start Multiplayer" footer={Footer()}>
                    <Input onChange={(value: any)=>{setCode(value)}} placeholder="enter a join code"></Input>
                </Modal>
           </div>;
}
