import React from "react";




interface ageIS{
    age :string
}

const FindAge:React.FC<ageIS>=({age})=>{
    return <h1>hello baby, your age is {age}</h1>
}

export default FindAge;
