import React,{useEffect,useState} from 'react';
import Sidenav from './Sidenav';
import {Button} from 'shineout';
import {useAuth0} from './AuthProvidor';
export default function Account(){
    document.title = "Kevin Online - Account";
    const [loggedin,setLoggedin] = useState<boolean>(false);
     //@ts-ignore
     const {loginWithRedirect, isAuthenticated, loading,user} = useAuth0();
    useEffect(()=>{
        if(isAuthenticated){
            setLoggedin(true);
        }else{
            setLoggedin(false);
        }
    },[loading]);
    return <div id="account">
        <section>
            <Button onClick={()=>loginWithRedirect()}>Login</Button>
        </section>
        <Sidenav activeTab={3}/>
    </div>

}