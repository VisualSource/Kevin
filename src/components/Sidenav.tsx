import React from 'react';
import {routeTo} from '../utils/history';


function Tabs(props: {active: boolean,children: any, text: string, route: string}){
    return <div className={props.active ? "active" : ""} onClick={()=>routeTo(props.route,{})}>
            {props.children}
        <span>{props.text}</span>
    </div>
}
const tabIcons = [
{
    text: "Home",
    route: "/",
    html: (<i className="material-icons">home</i>)
},
{
    text:"Play",
    route: "/play",
    html: (<i className="material-icons">play_circle_filled</i>)
},
{
    text:"Deck Editor",
    route:"/editor",
    html: (<i className="material-icons">edit</i>)
},
{
    text:"Account",
    route:"/account",
    html:(<i className="material-icons">account_circle</i>)
},
{
    text:"Settings",
    route:"/settings",
    html:(<i className="material-icons">settings</i>)
},
];
export default function Sidenav(props: {activeTab: number}){
    return <nav id="side-nav">
                <header>
                    <h5>Kevin Online</h5>
                </header>
                {
                    tabIcons.map((tabs, i)=>{
                        if(i === props.activeTab){
                            return <Tabs key={i} active={true} text={tabs.text} route={tabs.route}>
                                {tabs.html}
                            </Tabs>
                        }
                        return <Tabs key={i} active={false} text={tabs.text} route={tabs.route}>
                        {tabs.html}
                    </Tabs>
                    })
                }
           </nav>
}