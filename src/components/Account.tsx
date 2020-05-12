import React from 'react';
import Sidenav from './Sidenav';

export default function Account(){
    document.title = "Kevin Online - Account";
    return <div>
        <Sidenav activeTab={3}/>
    </div>

}