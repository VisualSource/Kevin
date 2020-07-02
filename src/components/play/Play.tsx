import React from 'react';
import Sidenav from '../Sidenav';
import { Route} from "react-router-dom";
import PlayHome from './PlayHome';
import GameSetup from './GameSetup';
export default function Play(){
    document.title = "Kevin Online - Play";
    return <div id="play">
        <main>
            <Route path="/play/:type">
                        <GameSetup/>
            </Route>
            <Route exact path="/play">
                <PlayHome/>
            </Route>
        </main>
        <Sidenav activeTab={1}/>
    </div>

}