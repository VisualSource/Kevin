import React from 'react';
import Sidenav from './Sidenav';

export default function Settings(){
    document.title = "Kevin Online - Settings";
    return <div>
        <Sidenav activeTab={4}/>
    </div>

}