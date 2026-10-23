import { useContext } from "react"
import noteContext from "../Context/noteContext"


function Notesitem(props) {

    const context = useContext(noteContext)
    const { delet } = context
    const { note, updateNote } = props
    return (
        <div className="col-md-3">
            <section className="card my-3" style={{ maxWidth: "320px" }}>
                <div className="card-body">
                    <h4 className="card-title">{note.title}</h4>
                    <p className="card-text">{note.description}</p>
                    <span style={{ cursor: "pointer" }} onClick={() => { delet(note._id) }} >delete</span> <span type="button" className="mx-3 btn-solid theme-primary" onClick={()=>{updateNote(note)}}>
                        Edit
                    </span>
                </div>
            </section>
        </div>
    )
}

export default Notesitem