import React from 'react';
import Sidenav from './Sidenav';
import {Button} from 'shineout';
import {useAuth0} from './AuthProvidor';
export default function Account(){
    document.title = "Kevin Online - Account";
     //@ts-ignore
     const {loginWithRedirect} = useAuth0();
    return <div>
        <Button onClick={()=>loginWithRedirect()}>Login</Button>
        <Sidenav activeTab={3}/>
    </div>

}