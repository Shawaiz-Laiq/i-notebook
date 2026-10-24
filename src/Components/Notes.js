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
   console.log(notes.length)

    return (<>
    <style>{`
        .custom-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
        }
        .custom-scroll::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 10px;
        }
        @media (max-width: 900px) {
          .login-welcome-panel {
            width: 100vw !important;
          } 
        }
      `}</style>
    <div className="login-welcome-panel"
        style={{width: "50vw"}}>
        <span ref={ref} type="button" className="mx-3 btn-solid theme-primary d-none" data-bs-toggle="dialog" data-bs-target="#exampleDialog">
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

            <div className="custom-scroll, height"  style={{backgroundColor: "rgb(244, 246, 252)", overflow:"scroll", padding: "20px" }}>
                <center><div
  className="d-flex align-items-center gap-2"
  style={{ maxWidth: "500px", width: "100%" }}
>
  <div
    className="d-flex align-items-center flex-grow-1"
    style={{
      border: "1px solid #ddd",
      borderRadius: "12px",
      padding: "4px 12px",
      backgroundColor: "#fff",
      boxShadow: "0 2px 8px rgba(0,0,0,0.05)"
    }}
  >
    <i className="fa-solid fa-magnifying-glass text-secondary me-2"></i>

    <input
      type="search"
      placeholder="Search your notes..."
      className="form-control border-0 shadow-none"
      style={{ outline: "none" }}
    />
  </div>

  <button
    className="btn text-white"
    style={{
      background: "linear-gradient(135deg, #6d5dfc, #8b5cf6)",
      borderRadius: "10px",
      padding: "10px 20px",
      fontWeight: "600"
    }}
  >
    Search
  </button>
</div> </center>
                <h1
            style={{
              fontSize: "clamp(20px, 2vw, 30px)",
              color: "#172344",
              margin: "0px, 10px, 0",
              
            }}
          >
            Your Notes  
          </h1> 
                {notes.length === 0 &&  <div className=" container"> There is no Notes to display </div>}
                { notes.length >= 0 &&   notes.map((note, ind) => {
                    return (
                        <Noteitem note={note} updateNote={updateNote} />

                    )
                })}
            </div></div></>
    )
}
export default Notes

