import React,{useEffect, useState,useRef} from 'react';
//import logo from './logo.svg';
import { useLocation,  } from 'react-router-dom';
import './gamePage.css';
import edgePropTypes from '../Types/edgePropTypes';
import scorePropTypes from '../Types/scorePropTypes';
//import gamePropTypes from '../Types/gamePropTypes';
//import initialStatePropTypes from '../Types/initialStatePropTypes';
//import ts from 'typescript';

const Edge : React.FC<edgePropTypes> = ((prop:edgePropTypes)=>{
  const {index,onclick,hori} = prop;
  if(hori){
    return (
      <button className='hori-edge' id={index.toString()} onClick={()=>{onclick();changeColor(index)}} >
      </button>
    )
  }
  return (
    <button className='vert-edge' id ={index.toString()}  onClick={()=>{onclick();changeColor(index)}}>
    </button>
  )
})

function changeColor(s:number){
  var x = document.getElementById(s.toString());
  if(x==null){
    return;
  }
  x.style.backgroundColor = "black";
}

// const Score : React.FC<scorePropTypes> = ((prop:scorePropTypes)=>{
//   const {scores} = prop;
//   var toShow : any[] = [];
//   const firstRender = useRef(true);
//   if(firstRender.current){
//     firstRender.current=false;
//     for(let i=0;i<scores.length;i++){
//       scores[i]=0;
//     }
//   }
//   for(let i=0;i<scores.length;i++){
//     //let x = scores[i];
//     toShow.push(<div className='score' id={"score"+i.toString()}>Player {i+1}: {scores[i]}</div>);
//   }
//   return(
//     <div className='scoreBoard'>
//       {toShow}
//     </div>
//   )
// })

const Game : React.FC = ()=>{
  //var [n,setN] = useState(3);
  const {state} = useLocation();
  //const nav = useNavigate();
  //const {n,pl} = prop;
  const n:number= (state!=null)?(JSON.parse(JSON.stringify(state))['nVal']):0;
  const pl:number = (state!=null)?(JSON.parse(JSON.stringify(state))['plVal']):0;
  //var [pl,setPl] = useState(2);
  var [sfraction,setSFarray] = useState(Array<number>(n*n));
  var [elist,setElist] = useState(Array<boolean>(2*n+2*n*n));
  var [turn,setTurn] = useState(0);
  //var [bonus,setBonus] = useState(false);
  var [scores,setScores] = useState(Array<number>(pl));
  //var [score1,setScore1] = useState(0);
  //var [score2,setScore2] = useState(0);
  
  const firstRender = useRef(true);
  var results:any[]=[];
  useEffect(()=>{
    //setSFarray(Array<number>(n*n));
    //setElist(Array<boolean>(2*n+2*n*n));
    if(firstRender.current){
      for(let i=0;i<n*n;i++){
        sfraction[i]=0;
      }
      for(let i=0;i<2*n+2*n*n;i++){
        elist[i]=false;
      }
      for(let i=0;i<pl;i++){
        scores[i]=0;
      }
      firstRender.current=false;
      console.log("itttttt ran",state,elist,sfraction,scores);

      return;
    }
    console.log("it ran");
  });
  useEffect(()=>{
    console.log("results changed")
    return;
  },[results])
  if(state==null){
    //nav('/');
    return(
      <><div>Go back to home page and select size and number of players</div></>
    )
  }
  
  results.push(<div className='result'>Game in progress...</div>)
  const handleClick = (n:number,i:number,p:number,j:number,hori:boolean)=>{
    setSFarray(updateSF(n*i+p+j,n,hori,sfraction,elist));
    
    setElist(updateArr(elist,n*i+p+j,true));
    
    score_manager(n*i+p+j,n,hori,sfraction,turn);

    let result = winTeller(elist,scores);
    
    if(result.length>0){
      
      if(result.length===pl){
        //results.pop();
        results.push(<div className='result'>Draw!</div>);
      }
      else{
        //results.pop();
        for(let j=0;j<result.length;j++){
          results.push(<div className='result'>Player-{j+1} </div>);
        }
        results.push(<div className='result'>Wins!</div>);
      }
      console.log("game over",results,result);
    }
  }
  
  const score_manager = (index:number,n:number,hori:boolean,sfraction:number[],turn:number)=>{
    let [x,y] = connections(index,n,hori);

    if(x==null&&y!=null){
      if(sfraction[y]===4){
        //setBonus(true);
        sfraction[y]=0;
        setScores(current=>{return [...current.slice(0,turn),current[turn]+1,...current.slice(turn+1)]});
        console.log("bonus given",scores);
      }
      else{
        setTurn(current=>(current+1)%pl);
        console.log("turn swapped");
      }
    }
    else if(x!=null&&y==null){
      if(sfraction[x]===4){
        //setBonus(true);
        sfraction[x]=0;
        setScores(current=>{return [...current.slice(0,turn),current[turn]+1,...current.slice(turn+1)]});
        console.log("bonus given",scores);
      }
      else{
        setTurn(current=>(current+1)%pl);
        console.log("turn swapped");
      }
    }
    else if(x!=null&&y!=null){
      if((sfraction[y]===4)&&(sfraction[x]!==4)){
        //setBonus(true);
        //sfraction[x]=0;
        sfraction[y]=0;
        setScores(current=>{return [...current.slice(0,turn),current[turn]+1,...current.slice(turn+1)]});
        console.log("bonus given",scores);
      }
      else if((sfraction[x]===4)&&(sfraction[y]!==4)){
        //setBonus(true);
        sfraction[x]=0;
        setScores(current=>{return [...current.slice(0,turn),current[turn]+1,...current.slice(turn+1)]});
        console.log("bonus given",scores);
      }
      else if((sfraction[x]===4)&&(sfraction[y]===4)){
        //setBonus(true);
        sfraction[x]=0;
        sfraction[y]=0;
        setScores(current=>{return [...current.slice(0,turn),current[turn]+2,...current.slice(turn+1)]});
        console.log("2x bonus given",scores);
      }
      else{
        setTurn(current=>(current+1)%pl);
        console.log("turn swapped");
      }
    }
    console.log("score managed",scores);
  }
  const winTeller  = (elist:boolean[],scores:number[])=>{
    let over=true;
    let maxInds:number[]=[];
    let maxInd=0;
    for(let i=0;i<elist.length;i++){
      if(!elist[i]){
        over = false;
      }
    }
    if(!over){
      return [];
    }
    else{
      for(let i=0;i<scores.length;i++){
        if(scores[i]>scores[maxInd]){
          maxInd=i;
        }
      }
      for(let i=0;i<scores.length;i++){
        if(scores[i]===scores[maxInd]){
          maxInds.push(i);
        }
      }
      return maxInds;
    }
  }

  var toShow: any[] = [];
  //var y=true;
  var f = true;
  for(let h=0;h<2*n+2*n*n;h++){
    //let f = true;
    let a = Math.floor((h%(2*n+1))/n);
    let i = (a>0)?1:0;
    i+= 2*(Math.floor(h/(2*n+1)));
    let p = Math.floor(h/(2*n+1));
    let j = h-(n*i)-p;
    if(i%2===0){
        if(!f){
            f=true;
            toShow.push(<br></br>);
            //console.log("this is broke:",h)
        }
        toShow.push(<Edge index={(h)} onclick={()=>{if(elist[h]){return};handleClick(n,i,p,j,true);console.log(scores)}} hori={true} />);
        //console.log(h,i,p,j);
    }
    else if(i%2===1){
        if(f){
            f=false;
            toShow.push(<br></br>);
            //console.log("this is broke:",h)
        }
        toShow.push(<Edge index={(h)} onclick={()=>{if(elist[h]){return};handleClick(n,i,p,j,false);console.log(scores)}} hori={false} />)
        //console.log(h,i,p,j);
    }
    //toShow.push(<br></br>);
  }
  toShow.push(<div>Player-2:{scores}</div>);
  toShow.push(<div>Turn of : Player {turn+1}</div>);
  toShow.push(<div className='scoreBoard'>
  {scores.map((obj:number,i:number)=>{return "Player"+(i+1)+":"+obj})}<br></br>
</div>);
  return(
    <>
    {/* <div className='scoreBoard'>
      {scores.map((obj:number,i:number)=>{return "Player"+(i+1)+":"+obj})}<br></br>
    </div> */}
    {results}
    {/* <Score scores={scores}></Score> */}
    <div className='board'>
      {toShow}
    </div>
    </>
  )
}

const updateArr = (arr : any[],index : number,b: any)=>{
  arr[index] = b;
  //console.log("updated elist")
  return arr;
}

const addToArr = (arr:number[],index:number,x:number)=>{
  arr[index]+=x;
  return arr;
}

const updateSF = (i:number,n:number,h:boolean,sfArr:number[],list:boolean[])=>{
  if(list[i]){
    return sfArr;
  }
  let [x,y] = connections(i,n,h);
  if(x==null&&y!=null){
    sfArr[y]++;
    //console.log("x null","y =",y);
  }
  else if(x!=null&&y==null){
    sfArr[x]++;
    //console.log("y null","x =",x);
  }
  else if(x!=null&&y!=null){
    sfArr[x]++;
    sfArr[y]++;
    //console.log("y =",y,"x =",x);
  }
  else{
   //console.log("both null")
  }
  //console.log("updated sf")
  return sfArr;
}

const connections = (i:number,n:number,h:boolean)=>{
  let c,r,x,y;
  if(h){
    c = i%(2*n+1);
    r = (i-c)/(2*n+1);
    x = n*r+c-n;
    y = n*r+c;
    if(x<0){
      return [null,y];
    }
    else if(y>=n*n){
      return [x,null];
    }
    //console.log("y =",y,"x =",x,"r =",r,"c =",c)
    return [x,y];
  }
  else{
    c = i%(2*n+1);
    r = (i-c)/(2*n+1);
    c = c-n;
    x = n*r+c-1;
    y = n*r+c;
    if(c===0){
      return [null,y];
    }
    else if(c===n){
      return [x,null];
    }
    //console.log("y =",y,"x =",x,"r =",r,"c =",c)
    return [x,y];
  }
}

export default Game;