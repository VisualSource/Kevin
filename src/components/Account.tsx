import React,{useEffect,useState} from 'react';
import Sidenav from './Sidenav';
import {Button, Image, Spin} from 'shineout';
import {useAuth0} from './AuthProvidor';
export default function Account(){
    document.title = "Kevin Online - Account";
    const [loggedin,setLoggedin] = useState<boolean>(false);
     //@ts-ignore
     const {loginWithRedirect, isAuthenticated, loading,user, logout} = useAuth0();
    useEffect(()=>{
        console.log(isAuthenticated);
        
        if(isAuthenticated){
            setLoggedin(true);
            console.log(user);
        }else{
            setLoggedin(false);
        }
    },[loading]);
    return <div id="account">
        {
            loading ? <section className="load-account">
                <Spin name="cube-grid"></Spin>
            </section> : 
                loggedin ?  
                <section className="view-account">
                    <Image shape="circle" width={200} height={200} src={user.picture}/>
                    <div id="details">
                        <h1>{user.name}</h1>
                        <p>{user.sub}</p>
                        <hr/>
                        <Button type="link" href={`https://visualsource.000webhostapp.com/profile/${encodeURIComponent(user.sub)}`}>View Account</Button>
                        <Button type="link" onClick={()=>logout()}>Logout</Button>
                    </div>
                </section> : 
                 <section id="account-login">
                    <Button type="primary" onClick={()=>loginWithRedirect()}>Login</Button>
                </section>
                
        }
       
        <Sidenav activeTab={3}/>
    </div>

}