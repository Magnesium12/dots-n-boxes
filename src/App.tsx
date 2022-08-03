import React from "react";
import './App.css';
import NavBar from "./Components/NavBar";
import {BrowserRouter as Router,Routes,Route, Link} from 'react-router-dom';
import Home from './Pages/homePage';
import Game from './Pages/gamePage';

function App() {
  return (
    <Router>
      <NavBar/>
      <Routes>
        <Route path = '/' element={<Home></Home>}></Route>
        <Route path = '/play' element={<Game></Game >}></Route>
      </Routes>
    </Router>
  );
}

export default App;
