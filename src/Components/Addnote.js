import { useContext, useState } from "react";
import noteContext from "../Context/noteContext";

function Addnote () {
    const [note, setnote] = useState({title: "" , description : ""})
    const context = useContext(noteContext);
    const {addNote} = context
    const handleclick = (e) => {
        e.preventDefault();
        addNote(note.title , note.description)
    }
    const onchange = (e) => {
        setnote({...note, [e.target.name] : e.target.value})
        console.log({[e.target.name] : e.target.value})
    }
    return(
        <div>
            <h2>Add A Note</h2>
            <form style={{width: "300px" }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">title</label>
                    <input onChange={onchange} name="title" type="text" className="form-control" id="title" aria-describedby="emailHelp" />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input  onChange={onchange} name="description" type="description" className="form-control" id="description" />
                </div>
                <div className="mb-3 form-field">
                    <input type="checkbox" id="exampleCheck1" className="check" />
                        <label htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn-solid theme-primary" onClick={handleclick}>Add Note</button>
            </form>
        </div>
    )
}

export default Addnote;