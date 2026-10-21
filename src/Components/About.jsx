import React, {useContext} from "react";
import noteContext from "../Context/noteContext";


function About() {
    const a = useContext(noteContext)

    
    return(
        <div >
            about {a.State.name} {a.State.class}
            <button onClick={a.update}>click</button>
        </div>
    )
}
export default About;