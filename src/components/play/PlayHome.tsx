
import React,{ useState } from 'react';
import {Button,Input, Message, Modal, Card} from 'shineout';
import {routeTo} from '../../utils/history';
export default function PlayHome(){
    const [showModal, setShowModal] = useState(false);
    const [code, setCode] = useState();
    const Footer = ()=>{
        return <div>
            <Button onClick={()=>routeTo("/play/multiplayer",{ query: {create: "TRUE"}})}>Start a Game</Button>
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