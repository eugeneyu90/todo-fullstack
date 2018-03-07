import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'bootstrap/dist/css/bootstrap.css';
// import 'font-awesome/css/font-awesome.min.css'




// const d = new Date()
// const today = `${d.getMonth()}-${d.getDay}-${d.getFullYear()}`
// const tutorial = [
//   { task: 'Install Todo App', completeBy: today, isComplete: false }
// ]

ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
