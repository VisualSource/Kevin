import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import * as serviceWorker from './serviceWorker';
import CardJson from './game/utils/Loader';
import {Auth0Provider} from './components/AuthProvidor';
import {history} from './utils/history';
import 'shineout/dist/theme.default.css';
import './style/index.sass';
const onRedirectCallback = (appState: any) => {
  history.push(
    appState && appState.targetUrl
      ? appState.targetUrl
      : window.location.pathname
  );
};
CardJson.getInstance().hotreloadData();
ReactDOM.render(
  <Auth0Provider 
    domain={"visualsource.auth0.com"}
    client_id={"gRqZG9p2sUKSntmbI9pj5YNZqeEJohWP"}
    redirect_uri={window.location.origin}
    onRedirectCallback={onRedirectCallback}
    >
    <App />
  </Auth0Provider>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
