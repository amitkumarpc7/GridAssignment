import React, { useEffect, useState } from "react";
import { FaCirclePlay } from "react-icons/fa6";
import { FaPauseCircle } from "react-icons/fa";
import { BiReset } from "react-icons/bi";
// import './App.css';

const numRows = 15;
const numCols = 20;

const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

// Function to calculate the color with opacity based on the drop's row
const getColorWithOpacity = (color, currentRow, dropRow, totalRows) => {
  const opacity = Math.max(
    0.2,
    1 - (currentRow - dropRow) / (totalRows - dropRow)
  );
  return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(
    color.slice(3, 5),
    16
  )}, ${parseInt(color.slice(5, 7), 16)}, ${opacity})`;
};

const App = () => {
  const [drops, setDrops] = useState([]);
  const [isRaining, setIsRaining] = useState(false);

  useEffect(() => {
    let interval;
    if (isRaining) {
      interval = setInterval(() => {
        setDrops((prevDrops) => {
          // Move existing drops down
          const newDrops = prevDrops
            .map((drop) => {
              if (drop.row + drop.height >= numRows) {
                return null; // Remove the drop if it has fallen out of view
              }
              return {
                ...drop,
                row: drop.row + 1, // Move drop down by 1
              };
            })
            .filter(Boolean); // Remove null drops

          // Randomly generate new drops at the top
          const randomHeight = Math.floor(Math.random() * 3) + 1; // Height between 1 and 3
          const randomCol = Math.floor(Math.random() * numCols);
          newDrops.push({
            col: randomCol,
            row: 0,
            height: randomHeight,
            color: getRandomColor(),
          });

          return newDrops;
        });
      }, 100);
    }

    return () => clearInterval(interval);
  }, [isRaining]);

  const toggleStart = () => {
    setIsRaining(!isRaining);
  };

  // const startRain = () => {
  //   setIsRaining(true);
  // };

  // const pauseRain = () => {
  //   setIsRaining(false);
  // };

  const resetRain = () => {
    setIsRaining(false);
    setDrops([]); // Clear all drops
  };

  return (
    <div>
      <div className="grid">
        {Array.from({ length: numRows }).map((_, rowIndex) => (
          <div key={rowIndex} className="row">
            {Array.from({ length: numCols }).map((_, colIndex) => {
              // Check if any drop occupies this cell
              const drop = drops.find(
                (drop) =>
                  drop.col === colIndex &&
                  rowIndex >= drop.row &&
                  rowIndex < drop.row + drop.height
              );

              let backgroundColor = "transparent";
              if (drop) {
                // Calculate the color with opacity using the getColorWithOpacity function
                backgroundColor = getColorWithOpacity(
                  drop.color,
                  rowIndex,
                  drop.row,
                  numRows
                );
              }

              return (
                <div
                  key={colIndex}
                  className="square"
                  style={{
                    backgroundColor: backgroundColor,
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="console">
        <span className="icon-container" onClick={toggleStart}>
          {isRaining ? <FaPauseCircle /> : <FaCirclePlay />}
          <span className="hover-text">{isRaining ? "Pause" : "Play"}</span>
        </span>
        <span className="icon-container" onClick={resetRain}>
          <BiReset />
          <span className="hover-text">Reset</span>
        </span>
        {/* {isRaining ? (
          <span onClick={toggleStart}>
            <FaPauseCircle />
          </span>
        ) : (
          <span onClick={toggleStart}>
            {" "}
            <FaCirclePlay />
          </span>
        )}

        <span onClick={resetRain}>
          <BiReset />{" "}
        </span> */}
      </div>
    </div>
  );
};

export default App;
