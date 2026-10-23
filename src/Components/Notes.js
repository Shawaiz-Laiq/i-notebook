import { useContext, useEffect, useRef, useState } from "react";
import noteContext from '../Context/noteContext'
import Noteitem from './Noteitem'

function Notes() {
    const context = useContext(noteContext);
    const { notes, getNote } = context
    useEffect(() => {
        getNote()

    }, [])
   const [title, settitle] = useState('')
    const [description, setdescription] = useState('')
    const [note, setnote] = useState({id: "" , etitle: "", edescription: "" })
    const ref = useRef(null)
    const refclose = useRef(null)
    const { edit, showAlert } = context
    const updateNote = (currentNote) => {
        ref.current.click()
        setnote({id: currentNote._id , etitle: currentNote.title, edescription : currentNote.description})
        if (title.length >= 10 && description.length >= 10) {
            edit(note.etitle, note.edescription)
            showAlert("Success", "Note added successfully");
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
    const handelclick = () => {
        console.log("update" , note)
        edit(note.id, note.etitle, note.edescription)
        refclose.current.click()
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
        < div>
        <span ref={ref} type="button" className="mx-3 btn-solid theme-primary d-hiden" data-bs-toggle="dialog" data-bs-target="#exampleDialog">
                        Edit
                    </span>
           

            <dialog className="dialog" id="exampleDialog">
                <div className="dialog-header">
                    <h1 className="dialog-title">Edit Note</h1>
                    <button type="button" className="btn-close" data-bs-dismiss="dialog" aria-label="Close"></button>
                </div>
                 <form style={{ width: "300px" }}>
                <div className="mb-3">
                    <label htmlFor="etitle" className="form-label">title</label>
                    <input onChange={(e) => { onchange(e); titleclick(e) }} value={note.etitle} name="etitle" type="text" className="form-control" id="etitle"  required />
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input onChange={(e) => { onchange(e); desclick(e) }} value={note.edescription} name="edescription" type="text" className="form-control" id="edescription" required />
                </div>
              
            </form>
                <div className="dialog-footer">
                    <button ref={refclose} type="button" className="btn-solid theme-secondary" data-bs-dismiss="dialog">Close</button>
                    <button type="button" className="btn-solid theme-primary" onClick={handelclick} >Update Note</button>
                </div>
            </dialog>

            <div className="row">
                <h2>Your Notes</h2>
                {notes.map((note, ind) => {
                    return (
                        <Noteitem key={ind} note={note} updateNote={updateNote} />
                    )
                })}
            </div></div>
    )
}
export default Notes