import React,{useEffect, useState} from 'react';
import Sidenav from '../Sidenav';
import {Button, Select, Image, Input, Message} from 'shineout';
import {routeTo} from '../../utils/history';
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
                <PlayGame/>
            </Route>
            <Route exact path="/play">
                <PlayHome/>
            </Route>
        </main>
        <Sidenav activeTab={1}/>
    </div>

}
type ButtonTypes = "link" | "success" | "default" | "primary" | "secondary" | "warning" | "danger" | undefined;
function PlayGame(props: any){
    const [mode, setMode] = useState();
    const [host,setHost] = useState<boolean>(false);
    const [decks, setDecks] = useState<string[]>([]);
    const [oppontName, setOpponentName] = useState();
    const [opponetStatus, setOpponetStatus] = useState();
    const [userStatus,setUserStatus] = useState({status: "Wating", button: "success", text: "Ready"});
    const [userLogo, setUserLogo] = useState("");
    const [opponentLogo, setOpponentLogo] = useState();
    const [canStart, setCanStart] = useState(true);
    const {type} = useParams();
    let worker: QueryableWorker;
    const send = (name: string, data: any) =>{
        worker.send(name, data);
    }
    useEffect(()=>{
        setCanStart(true);
        setUserLogo("");
        setMode(type);
        setHost(true);
        setDecks(cdMannager.getDecks());
        if(type === "singleplayer"){
            worker = QueryableWorker.getInstance("/workers/AIOpponentWorker.js");
        }else{
            worker = QueryableWorker.getInstance("/workers/OnlineOpponentWorker.js");
        }
        worker.send("init",{ name: "", status: userStatus, logo: ""});
        worker.addListeners("init",(event: any)=>{
            setOpponentName(event.name);
            setOpponetStatus(event.status);
            setOpponentLogo(event.logo);
        });
        return ()=>{}
    },[]);
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
                        <Image shape="circle" width={150} height={150} title="user_logo" src={opponentLogo}/>
                        <h4>{oppontName}</h4>
                        <p>Status: {opponetStatus}</p>
                        {mode === "singleplayer" ?  <Select keygen={(value: any)=>value} data={["hard","easy","medium"]} style={{width: 120}} placeholder="Set Difficlty"/> :<Button type="danger">Kick</Button>}
                    </div>
                    <div id="left-profile">
                        <Image shape="circle" width={150} height={150} title="user_logo" src={userLogo}/>
                        <h4>USERNAME</h4>
                        <p>Status: {userStatus.status}</p>
                        <Button type={userStatus.button as ButtonTypes} onClick={()=>{
                            if(cdMannager.deckSet){
                                   setUserStatus(userStatus.status === "Ready" ?  {status: "Wating", button: "success", text: "Ready"} : {status: "Ready", button: "danger", text: "Unready"} );
                                   send("status_opponent",{status:userStatus.status, button: userStatus.button, text: userStatus.text})
                            }else{
                                //@ts-ignore
                                Message.error('You need to select a deck!',5,{
                                    position: "bottom-right",
                                    title: "Error"
                                });
                            }
                        }}>{userStatus.text}</Button>
                    </div>
                    <div id="center">
                        <h1>Join Code</h1>
                        <Input style={{width: 240}}  placeholder="d853c4929da544aea121" disabled defaultValue={Utils.String.UUID()}/>
                       {host ?  <Button loading={canStart} type="primary">Start</Button>: null}
                    </div>
                </div>
           </div>;
}

function PlayHome(){
    return <div id="play-home">
                <div className="select-play">
                    <div className="select-art"></div>
                   <div className="select-button">
                     <Button type="link" onClick={()=>routeTo("/play/singleplayer",{})}>Singleplayer</Button>
                   </div>
                </div>
                <div className="select-play">
                    <div className="select-art"></div>
                   <div className="select-button">
                     <Button type="link" onClick={()=>routeTo("/play/multiplayer",{})}>Multiplayer</Button>
                   </div>
                </div>
           </div>;
}

/*
   <Button onClick={()=>{
                routeTo("/game",{query:{uuid: Utils.String.UUID(), online: false}});
                QueryableWorker.getInstance("/workers/AIOpponentWorker.js").send("uuid",{data:["query"]});
            }}>Play</Button>

*/