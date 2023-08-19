import { useCallback, useRef, useState } from 'react';
import './App.css';
import produce from "immer";

const numRows = 60;
const numCols = 60;


const operations = [
  [0,1],
  [1,0],
  [-1,0],
  [0,-1],
  [1,1],
  [-1,-1],
  [-1,1],
  [1,-1]
];

const Gliderops = [
  [[-1,-1],
  [0,-1],
  [1,-1],
  [1,0],
  [0,1]],
  [[-1, -1],
  [-1, 0],
  [-1,1],
  [0,1],
  [1,0]],
  [[-1,1],
  [0,1],
  [1,1],
  [1,0],
  [0,-1]],
  [[1,1],
  [1,0],
  [1,-1],
  [0,-1],
  [-1,0]]
  
];

const generateEmptyGrid = ()=>{
  const rows = [];
    for(let i = 0; i<numRows; i++)
    {
      rows.push(Array.from(Array(numCols), ()=> 0));
    }

    return rows;
}


function App() {
  const [grid, SetGrid] = useState(() => {
    return generateEmptyGrid();
  } );

  const [running, setRunning] = useState(false);
  const [state, setState] = useState(0);
  const [orientation, setOrientation] = useState(0);
  console.log(`state: ${state}`);
  

  const runningRef = useRef(running);
  runningRef.current = running;

  const runSim = useCallback(() => {
    if (!runningRef.current) {
      return;
    }

    SetGrid(g => {
      return produce(g, gridCopy => {
        for (let i = 0; i < numRows; i++) {
          for (let k = 0; k < numCols; k++) {
            let neighbors = 0;
            operations.forEach(([x, y]) => {
              const newI = i + x;
              const newK = k + y;
              if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                neighbors += g[newI][newK];
              }
            });

            if (neighbors < 2 || neighbors > 3) {
              gridCopy[i][k] = 0;
            } else if (g[i][k] === 0 && neighbors === 3) {
              gridCopy[i][k] = 1;
            }
          }
        }
      });
    });

    setTimeout(runSim, 100);
  }, []);

  document.addEventListener('keydown', (event) => {
		if(event.key === 'r')
    {
      if(orientation < 3)
      {
        setOrientation(orientation + 1);
      }
      else
      {
        setOrientation(0);
      }

    }
  });



  return (
    <>
      <button onClick={ () => {
        
        if(!running)
        {
          runningRef.current = true;

          runSim();
        }
        setRunning(!running);

        
      }} > {running ? "stop" : "start"} </button>
      <button 
        onClick={()=>
        {
          SetGrid(g => {
            return generateEmptyGrid();
          })
        }}>
        Clear
      </button>
      <button
        onClick={() => 
        {   
              const rows = [];
              for(let i = 0; i<numRows; i++)
              {
                rows.push(Array.from(Array(numCols), () => (Math.random() > 0.5 ? 1 : 0)));
              }
        
              SetGrid(rows);
        }}>
        Random Config
      </button>
      <button onClick={()=>{
        if(state === 1)
        {
          setState(0);
        }
        else
        {
          setState(1);
          setOrientation(0);
        }
      }}> Glider </button>
      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${numCols}, 20px)`,
        
        
      }}>
        {grid.map((rows, i) =>
        { return (rows.map((cols, j) =>
        {
          return (<div id={`${i} - ${j}`}  

            style={{
              width: 20, 
              height: 20, 
              border: "solid 1px gray", 
              backgroundColor: grid[i][j] ? "black" : "white"}}
            
            onClick={() => {
              if(state === 0){
              const newGrid = produce(grid, gridCopy => {
                gridCopy[i][j] = gridCopy[i][j] ? 0 : 1;
                
              });
              SetGrid(newGrid);
              }
              else if(state === 1)
              {
                const newGrid = produce(grid, gridCopy => {
                  Gliderops[orientation].forEach(([x,y]) => {
                    const I = i + x;
                    const J = j + y;
                    if(I >= 0 && J >= 0 && I < numRows && J < numCols)
                    {
                      gridCopy[I][J] = 1;
                    }
                    
                    
                  });
                });
                SetGrid(newGrid);
              }  
            }}

            onMouseOver={()=>{

              if(state == 0)
              {
                const divs = []
                divs.push(document.getElementById(`${i} - ${j}`))

                divs.forEach(element => {
                  if(element.style.backgroundColor != "black")
                  {
                  element.style.backgroundColor = "gray";

                  }
                  
                });

              }

              if(state === 1)
              {
                const divs = [];
                

                Gliderops[orientation].forEach(([x,y]) => {
                  const Inew = i+x;
                  const Jnew = j+y;
                  if(!(Inew >= 0 && Jnew >= 0 && Inew < numRows && Jnew < numCols))
                  {
                    return;
                  }
                  divs.push(document.getElementById(`${Inew} - ${Jnew}`));
                });

                divs.forEach(element => {
                  element.style.backgroundColor = "gray";
                  
                });
                
              }
              
            }}

            onMouseLeave={()=>{

              if(state == 0)
              {
                const divs = []
                divs.push(document.getElementById(`${i} - ${j}`))

                divs.forEach(element => {
                  if(element.style.backgroundColor != "black")
                  {
                  element.style.backgroundColor = "white";

                  }
                  
                });

              }

              if(state === 1)
              {
                const divs = [];
                

                Gliderops[orientation].forEach(([x,y]) => {
                  const I = i+x;
                  const J = j+y;
                  if(!(I >= 0 && J >= 0 && I < numRows && J < numCols))
                  {
                    return;
                  }
                  divs.push([document.getElementById(`${I} - ${J}`), [I, J]]);
                });

                divs.forEach(element => {
                  if(grid[element[1][0]][element[1][1]] === 0)
                  {
                    element[0].style.backgroundColor = "white";
                  }
                  else
                  {
                    element[0].style.backgroundColor = "black";
                  }
                  
                });
                
              }
              
            }}
            />);
        }
        ))
        }
        )}
      </div>
    </>
  );
}

export default App;

}

export default App;
