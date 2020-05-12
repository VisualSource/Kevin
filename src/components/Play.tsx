import React from 'react';
import Sidenav from './Sidenav';
import {Button} from 'shineout';
import {routeTo} from '../utils/history';
import {Utils} from 'phaser';
import QueryableWorker from '../game/state/OpponentHander';
export default function Play(){
    return <div id="play">
        <main>
            <Button onClick={()=>{
                routeTo("/game",{query:{uuid: Utils.String.UUID(), online: false}});
                QueryableWorker.getInstance("/workers/AIOpponentWorker.js").send("uuid",{data:["query"]});
            }}>Play</Button>
        </main>
        <Sidenav activeTab={1}/>
    </div>

}