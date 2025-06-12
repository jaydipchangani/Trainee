import React, { useEffect, useState } from "react"

function Data(){

    const[post,setPost] = useState([]);
    const[loading, setLoading] = useState(true);
    const[error, setError] =useState(null);

    useEffect(()=>{
        fetch("https://jsonplaceholder.typicode.com/posts")
        .then((res) => res.json())
        .then((data) => {
        setPost(data);

        console.log(data)


    })
        .catch((err) => {
            setError(err.message);
          });
      }, []);

    


    return(
        <div>
                    <ol>
          {post.map((item) => (
            <li key={item.id}> {item.title}</li> 
          ))}
        </ol>
        </div>
    )
}

export default Data