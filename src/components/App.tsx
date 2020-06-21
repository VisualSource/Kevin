import React from 'react';
import { Router, Route} from "react-router-dom";
import Sidenav from './Sidenav';
import {history} from '../utils/history';
import DeckEditor from './editor/DeckEditor';
import Game from '../game/Game';
import Play from './play/Play';
import Account from './Account';
import Settings from './Settings';
function MainMenu(){
  document.title = "Kevin Online - Home";
  return <div id="main-menu">
           <section className="animated-grid">
              <div className="card">a</div>
              <div className="card">b</div>
              <div className="card">c</div>
              <div className="card">d</div>
              <div className="card">e</div>
              <div className="card">f</div>
              <div className="card">g</div>
              <div className="card">h</div>
              <div className="card">i</div>
              <div className="card">j</div>
              <div className="card">k</div>
              <div className="card">l</div>
              <div className="card">main</div>
          </section>
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
