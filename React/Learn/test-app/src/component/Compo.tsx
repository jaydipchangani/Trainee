import React from "react";
import PropsTask from "./PropsTask";
import FormData from "./FormData";

const Compo:React.FC=()=>{
    return(
<>      <h1>Hello World</h1>
        <PropsTask name="Jaydip" age={23}/>
        <FormData/>
  
        </>
  
    );
}

export default Compo;