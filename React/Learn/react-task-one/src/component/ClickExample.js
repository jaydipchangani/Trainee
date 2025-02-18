import React from "react";

function ClickExample() {
  function handleClick() {
    alert("Button Clicked!");
  }

  return <button onClick={handleClick}>Click Me</button>;
}

export default ClickExample;
