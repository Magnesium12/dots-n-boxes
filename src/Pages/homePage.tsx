import React, { useState } from "react";
import { useNavigate,Link } from "react-router-dom";
import './homePage.css';
import Game from "./gamePage";
import initialStatePropTypes from "../Types/initialStatePropTypes";

const Home : React.FC = (()=>{
    var [N,setN] = useState(3);
    var [pl,setPl] = useState(2);
    //const navigate = useNavigate();
    return(
        <>
        <div>
            <h2>
                hello world!
            </h2>
        </div>
        
        <div>
            <label htmlFor="N">Select square size</label>
            <select id="N" value={N} onChange={(event)=>{setN(parseInt(event.target.value))}}>
                <option value={1}>1*1</option>
                <option value={2}>2*2</option>
                <option value={3}>3*3</option>
                <option value={4}>4*4</option>
                <option value={5}>5*5</option>
                <option value={6}>6*6</option>
                <option value={7}>7*7</option>
            </select>
            <br></br>
            <label htmlFor="N">Select number of players</label>
            <select id="Pl" value={pl} onChange={(event)=>{setPl(parseInt(event.target.value))}}>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
                <option value={7}>7</option>
            </select>
            <br></br>
            {/* <label htmlFor="ok">Start Game!</label>
            <input type='submit' onClick={()=>{console.log("N=",N,"pl = ",pl)}}></input> */}
            <Link to={'/play'} state ={{nVal:N,plVal:pl}}>Play!</Link>
        </div>
        </>
    )
})

export default Home;