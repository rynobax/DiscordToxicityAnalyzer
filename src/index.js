import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import './background.css';

ReactDOM.render(
  <MuiThemeProvider>
    <App />
  </MuiThemeProvider>
, document.getElementById('root'));
registerServiceWorker();
