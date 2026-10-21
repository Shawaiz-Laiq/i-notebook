import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const s ={
        "name" : "shawaiz",
        "class" : "3a"
    }
    const [State, setState] = useState(s)

      
    const update =()=> {
        if (State.class === "3a") { 
            setState(
                { "name" : "laraib", "class" : "5a"})
                console.log(State.class)
        } else { 
            setState(
                { "name" : "shawaiz", "class" : "3a"})
                console.log(State.class)
        }
}

    return (
        <NoteContext.Provider value={{State, update}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;