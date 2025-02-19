import React from "react";
type New={
    name:string,
    age:number
}

const PropsTask :React.FC<New>=({name,age})=>{
    return(
        <h1>Hello {name}, your age is {age}</h1>
    )
}

export default PropsTask;