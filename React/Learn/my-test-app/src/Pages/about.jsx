
import { useParams } from "react-router-dom"

function About(){

    const{name}= useParams();

  

    return(
        <div>
            About Us !!
           <h1>I am {name}</h1>
        </div>
    )
}

export default About