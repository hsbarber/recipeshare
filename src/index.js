import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

import registerServiceWorker from './registerServiceWorker';


const Root = () => {
	return (
		<App />
	)
}
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
