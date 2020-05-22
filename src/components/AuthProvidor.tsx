import React, { useState, useEffect, useContext, createContext } from "react";
import createAuth0Client from "@auth0/auth0-spa-js";

const DEFAULT_REDIRECT_CALLBACK = (event:any) => window.history.replaceState({}, document.title, window.location.pathname);
//@ts-ignore
export const Auth0Context = createContext();
export const useAuth0 = () => useContext(Auth0Context);
export const Auth0Provider = ({
    //@ts-ignore
    children,
    onRedirectCallback = DEFAULT_REDIRECT_CALLBACK,
    ...initOptions
  }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState({});
    const [auth0Client, setAuth0] = useState();
    const [loading, setLoading] = useState(true);
    const [popupOpen, setPopupOpen] = useState(false);
  
    useEffect(() => {
      const initAuth0 = async () => {        
        try {
            //@ts-ignore
          const auth0FromHook = await createAuth0Client(initOptions);
          setAuth0(auth0FromHook);
    
          if (window.location.search.includes("code=") &&
              window.location.search.includes("state=")) {
            const { appState } = await auth0FromHook.handleRedirectCallback();
            //@ts-ignore
            onRedirectCallback(appState);
          }
    
          const isAuthenticated = await auth0FromHook.isAuthenticated();
          setIsAuthenticated(isAuthenticated);
    
          if (isAuthenticated) {
            const user = await auth0FromHook.getUser();
            setUser(user);
          }
    
          setLoading(false);
        } catch (error) {
          setLoading(false);
          console.log(error);
        }
      };
      initAuth0();
      // eslint-disable-next-line
    }, []);

    const loginWithPopup = async (params = {}) => {
      setPopupOpen(true);
      try {
          //@ts-ignore
        await auth0Client.loginWithPopup(params);
      } catch (error) {
        console.error(error);
      } finally {
        setPopupOpen(false);
      }
      //@ts-ignore
      const user = await auth0Client.getUser();
      setUser(user);
      //@ts-ignore
      setIsAuthenticated(true);
    };
  
    const handleRedirectCallback = async () => {
      setLoading(true);
      //@ts-ignore
      await auth0Client.handleRedirectCallback();
      //@ts-ignore
      const user = await auth0Client.getUser();
      setLoading(false);
      //@ts-ignore
      setIsAuthenticated(true);
      setUser(user);
    };
    return (
      <Auth0Context.Provider
        value={{
          isAuthenticated,
          user,
          loading,
          popupOpen,
          loginWithPopup,
          handleRedirectCallback,
          //@ts-ignore
          getIdTokenClaims: (...p: any[]) => auth0Client.getIdTokenClaims(...p),
          //@ts-ignore
          loginWithRedirect: (...p: any[]) => auth0Client.loginWithRedirect(...p),
          //@ts-ignore
          getTokenSilently: (...p: any[]) => auth0Client.getTokenSilently(...p),
          //@ts-ignore
          getTokenWithPopup: (...p: any[]) => auth0Client.getTokenWithPopup(...p),
          //@ts-ignore
          logout: (...p: any[]) => auth0Client.logout(...p)
        }}
      >
        {children}
      </Auth0Context.Provider>
    );
  };