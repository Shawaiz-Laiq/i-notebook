import { useContext, useState } from "react";
import noteContext from "../Context/noteContext";

function Addnote() {
    const [note, setnote] = useState({ title: "", description: "" })
    const [title, settitle] = useState('')
    const [description, setdescription] = useState('')
    const context = useContext(noteContext);
    const { addNote, showAlert } = context
    const handleclick = (e) => {
        e.preventDefault();
        if (title.length >= 10 && description.length >= 10) {
            addNote(note.title, note.description)
            showAlert("Success", "Note added successfully");
            const token = localStorage.getItem("token");
            console.log(token)
        } else {
            if (title.length < 10 && description.length < 10) {
                 showAlert("Warning", "Title and Description is too short");
            } else {
                if (title.length < 10) {
                    showAlert("Warning", "Title is too short");
                } else if (description.length  < 10) {
                    showAlert("Warning", "Description is too short");
                }
            }
        }

    }

    const titleclick = (e) => {
        settitle(e.target.value)
    }
    const desclick = (e) => {
        setdescription(e.target.value)
    }

    const onchange = (e) => {
        setnote({ ...note, [e.target.name]: e.target.value })

    }
    return (
        <div>
            <h2>Add A Note</h2>
            <form style={{ width: "300px" }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">title</label>
                    <input onChange={(e) => { onchange(e); titleclick(e) }} name="title" type="text" className="form-control" id="title" aria-describedby="emailHelp" required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input onChange={(e) => { onchange(e); desclick(e) }} name="description" type="description" className="form-control" id="description" required />
                </div>
                <button type="submit" className="btn-solid theme-primary" onClick={handleclick}>Add Note</button>
            </form>
        </div>
    )
}

export default Addnote;