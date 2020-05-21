import React,{useEffect, useState} from 'react';
import Sidenav from '../Sidenav';
import {Button, Select, Image, Input, Message, Spin, Modal} from 'shineout';
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
let worker: QueryableWorker;
function PlayGame(props: any){
    const [loadState, setLoadState] = useState(true);
    const [mode, setMode] = useState();
    const [host,setHost] = useState<boolean>(false);
    const [decks, setDecks] = useState<string[]>([]);
    const [oppontName, setOpponentName] = useState("Wating for User");
    const [opponetStatus, setOpponetStatus] = useState("Wating");
    const [userStatus,setUserStatus] = useState({status: "Wating", button: "success", text: "Ready"});
    const [userLogo, setUserLogo] = useState("");
    const [userName, setUserName] = useState("USERNAME");
    const [opponentLogo, setOpponentLogo] = useState<string>("user_logo");
    const [canStart, setCanStart] = useState(true);
    const [joinCode, setJoinCode] = useState("Wating for Code");
    const {type} = useParams();
    //@ts-ignore
    const {user, loading, isAuthenticated } = useAuth0();
    const checkCanStart = () => {
        if(userStatus.status === "Ready" && opponetStatus === "Ready"){
            setCanStart(false);
        }else{
            setCanStart(true);
        } 
    }
    useEffect(()=>{
        const init = (icon: string)=>{
            setMode(type);
            setUserLogo(icon);
            setDecks(cdMannager.getDecks());
            worker = QueryableWorker.create(type);
            worker.send("join_code",{ join: queryFromURI()});
            worker.send("init",{ name: user?.name ?? "USERNAME", status: userStatus, logo: icon});
            worker.addListeners("init",(event: any)=>{
                setOpponentName(event.name);
                setOpponetStatus(event.status);
                setOpponentLogo(event.logo);
            });
            worker.addListeners("status_opponent",(event: any)=>{
                setOpponetStatus(event);
                checkCanStart();
            });
            worker.addListeners("join_code",(event: any)=>{
                setJoinCode(event.uuid);
            });
            worker.addListeners("game_start",(event: any)=>{
                routeTo("/game",{query:{uuid: joinCode, online: true}, replace: true});
            });
            worker.addListeners("kick",(event: any)=>{
                //@ts-ignore
                Message.info('You Where kicked',5,{
                    position: "bottom-right",
                    title: "Kicked"
                });
                routeTo("/play",{replace: true});
            });
        }
        const check = () =>{
            if(loading){
                setTimeout(()=>{
                    check();
                },500);
            }else{
               if(worker){
                   QueryableWorker.kill();
                   (worker as any) = null;
               }
               if(isAuthenticated && type === "multiplayer"){
                    setLoadState(false);
                    setHost(props.host);
                    setUserName(user.name);
                    init(user.picture);
               }else if(type === "singleplayer"){
                    setLoadState(false);
                    setHost(true);
                    setUserName(user?.name ?? "USERNAME");
                    init(user?.picture ?? "default.webp");
               }else{
                    //@ts-ignore
                    Message.error('Failed to Authenticate',5,{
                        position: "bottom-right",
                        title: "Error"
                    });
                   routeTo("/play",{replace: true});
               }
               checkCanStart();
            }
        }
        check();
    },[isAuthenticated,loading,type,user,userStatus]);
    if(loadState){
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
                        <Image shape="circle" width={150} height={150} title="user_logo" src={opponentLogo}/>
                        <h4>{oppontName}</h4>
                        <p>Status: {opponetStatus}</p>
                        {mode === "singleplayer" ?  <Select onChange={(value)=>{
                            worker.send("ai_difficlty",{value});
                        }} keygen={(value: any)=>value} data={["Easy","Normal","Hard"]} defaultValue={[1]} style={{width: 120}} placeholder="Set Difficlty"/> :<Button type="danger" onClick={()=>{
                            setOpponetStatus("Wating");
                            setOpponentName("Wating for User");
                            setOpponentLogo("no_user");
                            worker.send("kick",{}) }
                            }>Kick</Button>}
                    </div>
                    <div id="left-profile">
                        <Image shape="circle" width={150} height={150} title="user_logo" src={userLogo}/>
                        <h4>{userName}</h4>
                        <p>Status: {userStatus.status}</p>
                        <Button type={userStatus.button as ButtonTypes} onClick={()=>{
                            if(cdMannager.deckSet){
                                   setUserStatus(userStatus.status === "Ready" ?  {status: "Wating", button: "success", text: "Ready"} : {status: "Ready", button: "danger", text: "Unready"} );
                                   worker.send("status_opponent",{status:userStatus.status});
                                   checkCanStart();
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
                        <Input style={{width: 240}}  placeholder="d853c4929da544aea121" disabled defaultValue={joinCode} value={joinCode}/>
                       {host ?  <Button loading={canStart} type="primary" onClick={()=>{
                            worker.send("game_start",{});
                            routeTo("/game",{query:{uuid: joinCode, online: false}, replace: true});
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
                <div className="select-play">
                    <div className="select-art"></div>
                   <div className="select-button">
                     <Button type="link" onClick={()=>routeTo("/play/singleplayer",{})}>Singleplayer</Button>
                   </div>
                </div>
                <div className="select-play">
                    <div className="select-art"></div>
                   <div className="select-button">
                     <Button type="link" onClick={()=>setShowModal(true)}>Multiplayer</Button>
                   </div>
                </div>
                <Modal visible={showModal} onClose={()=>setShowModal(false)} title="Start Multiplayer" footer={Footer()}>
                    <Input onChange={(value: any)=>{setCode(value)}} placeholder="enter a join code"></Input>
                </Modal>
           </div>;
}
