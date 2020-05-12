import React from 'react';
import { Router, Route} from "react-router-dom";
import Sidenav from './Sidenav';
import {history} from '../utils/history';
import DeckEditor from './editor/DeckEditor';
import Game from '../game/Game';
import Play from './Play';
import Account from './Account';
import Settings from './Settings';
function MainMenu(){
  return <div id="main-menu">
            <Sidenav activeTab={0}/>
         </div>
}

function App() {
  return (
    <Router history={history}>
        <Route exact path="/">
            <MainMenu/>
        </Route>
        <Route path="/editor">
          <DeckEditor/> 
        </Route>
        <Route path='/game'>
            <Game/>
        </Route>
        <Route path="/play">
            <Play/>
        </Route>
        <Route path="/account">
            <Account/>
        </Route>
        <Route path="/settings">
            <Settings/>
        </Route>
    </Router>
  );
}

export default App;
