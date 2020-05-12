import React from 'react';
import {routeTo} from '../utils/history';
import {Utils} from 'phaser';

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
    html: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <defs>
        <clipPath id="clip-path">
            <rect className="cls-1" width="16" height="16"/>
        </clipPath>
    </defs>
    <g id="icon_home" className="cls-2">
        <path id="Path_357" data-name="Path 357" className="cls-3" d="M15.581,5.186l-7-5a1,1,0,0,0-1.162,0l-7,5A1,1,0,0,0,1.581,6.814L2,6.515V15a1,1,0,0,0,1,1H13a1,1,0,0,0,1-1V6.515A1.7,1.7,0,0,0,15,7a1,1,0,0,0,.582-1.814ZM12,14H10V11a2,2,0,0,0-4,0v3H4V5.086L8,2.229l4,2.857Z" transform="translate(0)"/>
    </g>
</svg>)
},
{
    text:"Play",
    route: "/play",
    html: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="18" viewBox="0 0 14 16">
                <path className="cls-3" fillRule="evenodd" d="M14 8A7 7 0 1 1 0 8a7 7 0 0 1 14 0zm-8.223 3.482l4.599-3.066a.5.5 0 0 0 0-.832L5.777 4.518A.5.5 0 0 0 5 4.934v6.132a.5.5 0 0 0 .777.416z"/>
            </svg>)
},
{
    text:"Deck Editor",
    route:"/editor",
    html: (<svg xmlns="http://www.w3.org/2000/svg" width="12" height="16" viewBox="0 0 12 16">
                <path className="cls-3" fillRule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"/>
            </svg>)
},
{
    text:"Account",
    route:"/account",
    html:(<svg xmlns="http://www.w3.org/2000/svg"  width="20" height="20" viewBox="0 0 24 24">
    <defs>
        <clipPath id="clip-path">
            <rect className="cls-1" width="20" height="20"/>
        </clipPath>
    </defs>
    <g id="Icon_Circle_Sharp" data-name="Icon" className="cls-2">
        <path id="shape" className="cls-3" d="M60-38A10,10,0,0,0,50-28,10,10,0,0,0,60-18,10,10,0,0,0,70-28,10,10,0,0,0,60-38Zm0,3a3,3,0,0,1,3,3,3,3,0,0,1-3,3,3,3,0,0,1-3-3A3,3,0,0,1,60-35Zm0,14.2a7.2,7.2,0,0,1-6-3.22c.03-1.99,4-3.08,6-3.08s5.97,1.09,6,3.08A7.2,7.2,0,0,1,60-20.8Z" transform="translate(-48 40)"/>
    </g>
   </svg>)
},
{
    text:"Settings",
    route:"/settings",
    html:(<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
    <defs>
    <clipPath>
        <rect className="cls-1" width="16" height="16"/>
    </clipPath>
    </defs>
    <g id="icon_setting" className="cls-2">
        <path id="Path_108" data-name="Path 108" className="cls-3" d="M13.3,5.2l1.1-2.1L13,1.7,10.9,2.8a3.582,3.582,0,0,0-1.1-.4L9,0H7L6.2,2.3a4.179,4.179,0,0,0-1,.4L3.1,1.6,1.6,3.1,2.7,5.2a4.179,4.179,0,0,0-.4,1L0,7V9l2.3.8c.1.4.3.7.4,1.1L1.6,13,3,14.4l2.1-1.1a3.582,3.582,0,0,0,1.1.4L7,16H9l.8-2.3c.4-.1.7-.3,1.1-.4L13,14.4,14.4,13l-1.1-2.1a3.582,3.582,0,0,0,.4-1.1L16,9V7l-2.3-.8A4.179,4.179,0,0,0,13.3,5.2ZM8,11A2.946,2.946,0,0,1,5,8,2.946,2.946,0,0,1,8,5a2.946,2.946,0,0,1,3,3A2.946,2.946,0,0,1,8,11Z"/>
    </g>
   </svg>)
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