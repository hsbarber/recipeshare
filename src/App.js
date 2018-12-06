import React from 'react'
import { BrowserRouter as Router } from 'react-router-dom';
import ScrollTop from './components/ScrollTop';
import Main from './containers/Main'



const App = () => (
  <Router>
    <ScrollTop>
        <Main />
    </ScrollTop>
  </Router>

)

export default App;
