import React from  'react';
import { useState } from 'react';

function InputExample(){
    const [name,setname] = useState('');
    const [gender,setGender] = useState('');

    return(
        <>
        <p>Your Name : {name}</p>
        <input type='text' onChange={(e)=>setname(e.target.value)} placeholder='Enter First Name' />
        </>

    )
}

export default InputExample;