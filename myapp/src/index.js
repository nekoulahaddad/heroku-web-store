import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import JavascriptTimeAgo from 'javascript-time-ago'
 
import en from 'javascript-time-ago/locale/en'
import ru from 'javascript-time-ago/locale/ru'
 
JavascriptTimeAgo.addLocale(en)
JavascriptTimeAgo.addLocale(ru)


//store.dispatch(loadUser())


ReactDOM.render(<App />, document.getElementById('root'));


