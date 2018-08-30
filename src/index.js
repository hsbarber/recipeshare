import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {render} from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
import ScrollTop from './components/ScrollTop';
import registerServiceWorker from './registerServiceWorker';


const Root = () => {
	return (
		<BrowserRouter>
			<ScrollTop>
				<App />
			</ScrollTop>
		</BrowserRouter>
	)
}
ReactDOM.render(<Root />, document.getElementById('root'));
registerServiceWorker();
