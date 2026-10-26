import { useContext, useRef, useState } from "react";
import noteContext from '../Context/noteContext'
import Noteitem from './Noteitem'


function Notes() {
  const context = useContext(noteContext);
  const { notes, } = context
  // useEffect(() => {
  //   getNote()

  // }, [getNote])


  const [title, settitle] = useState('')
  const [description, setdescription] = useState('')
  const [note, setnote] = useState({ id: "", etitle: "", edescription: "" })
  const refclose = useRef(null);
  const dialogRef = useRef(null);
  const { edit, showAlert } = context
  const updateNote = (currentNote) => {
   // ref.current.click()
    setnote({ id: currentNote._id, etitle: currentNote.title, edescription: currentNote.description })
    dialogRef.current?.showModal();
    if (title.length >= 10 && description.length >= 10) {
      edit(note.etitle, note.edescription)
      // showAlert("Success", "Note added successfully");

    } else {
      if (title.length < 10 && description.length < 10) {
        //showAlert("Warning", "Title and Description is too short");
      } else {
        if (title.length < 10) {
          //showAlert("Warning", "Title is too short");
        } else if (description.length < 10) {
         // showAlert("Warning", "Description is too short");
        }
      }
    }

  }
  // const handelclick = () => {
  //   edit(note.id, note.etitle, note.edescription)
  //   refclose.current.click()
  //    showAlert("Success", "Note Edited successfully");
  // }
  const handelclick = async () => {
  await edit(note.id, note.etitle, note.edescription);
  dialogRef.current?.close();
  showAlert("Success", "Note Edited successfully");
};

  const titleclick = (e) => {
    settitle(e.target.value)
  }
  const desclick = (e) => {
    setdescription(e.target.value)
  }
  const onchange = (e) => {
    setnote({ ...note, [e.target.name]: e.target.value })

  }
  const [search, setSearch] = useState("");

  const filteredNotes = notes.filter((note) =>
  note.title.toLowerCase().includes(search.toLowerCase()) ||
  note.description.toLowerCase().includes(search.toLowerCase())
);


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
      style={{ width: "50vw" }}>
      {/* <span ref={ref} type="button" className="mx-3 btn-solid theme-primary" data-bs-toggle="dialog" data-bs-target="#exampleDialog">Edit</span> */}
      <dialog
       ref={dialogRef}
        id="exampleDialog"
        style={{
          width: "min(92%, 480px)",
          padding: 0,
          border: "none",
          borderRadius: "18px",
          background: "#fff",
          color: "#1f2937",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
        }}>
          
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: "15px",
            padding: "24px 24px 18px",
            borderBottom: "1px solid #eeeaf8"
          }}>
          <div>
            <h2
              style={{
                margin: 0,
                fontSize: "24px",
                fontWeight: 700,
                color: "#7c3aed"
              }}>
              Edit Note
            </h2>

            <p style={{ margin: "6px 0 0", color: "#777", fontSize: "14px" }}>
              Update your note details below.
            </p>
          </div>

          <button
            type="button" onClick={() => dialogRef.current?.close()} aria-label="Close"
            style={{
              border: "none",
              background: "#f3f0ff",
              color: "#7c3aed",
              borderRadius: "9px",
              width: "35px",
              height: "35px",
              fontSize: "25px",
              cursor: "pointer"
            }}>
            &times;
          </button>
        </div>

        <form
          style={{ padding: "22px 24px 24px" }} onSubmit={(e) => {
            e.preventDefault();
            handelclick();
          }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            <label htmlFor="etitle" style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
              Title
            </label>

            <input onChange={(e) => { onchange(e); titleclick(e) }} value={note.etitle} name="etitle" type="text" id="etitle" placeholder="Enter note title" minLength={3} required
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #ded9e9",
                borderRadius: "10px",
                outline: "none",
                background: "#faf9ff",
                color: "#1f2937",
                fontSize: "15px"
              }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "20px" }}>
            <label htmlFor="edescription" style={{ fontSize: "14px", fontWeight: 600, color: "#374151" }}>
              Description
            </label>

            <textarea
              onChange={(e) => {
                onchange(e);
                desclick(e);
              }}
              value={note.edescription}
              name="edescription"
              id="edescription"
              placeholder="Write your note..."
              rows={5}
              required
              minLength={10}
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "12px 14px",
                border: "1px solid #ded9e9",
                borderRadius: "10px",
                outline: "none",
                background: "#faf9ff",
                color: "#1f2937",
                fontSize: "15px",
                resize: "vertical",
                fontFamily: "inherit"
              }}
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              flexWrap: "wrap",
              gap: "12px",
              marginTop: "26px"
            }}
          >
            <button
              ref={refclose}
              type="button"
              onClick={() => dialogRef.current?.close()}
              style={{
                padding: "11px 17px",
                border: "1px solid #ded9e9",
                borderRadius: "10px",
                background: "#fff",
                color: "#4b5563",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer"
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              style={{
                padding: "11px 17px",
                border: "none",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
                color: "#fff",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(109,40,217,0.22)"
              }}
            >
              ✎ Update Note
            </button>
          </div>
        </form>

        <style>{`
    #exampleDialog::backdrop {
      background: rgba(15, 23, 42, 0.55);
      backdrop-filter: blur(5px);
    }
    #exampleDialog input:focus,
    #exampleDialog textarea:focus {
      border-color: #8b5cf6 !important;
      box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.14);
      background: #fff !important;
    }
  `}</style>
      </dialog>

      <div className="custom-scroll, height" style={{ backgroundColor: "rgb(244, 246, 252)", overflow: "scroll", padding: "20px" }}>
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
              type="text"
              placeholder="🔍 Search your notes..."
              className="form-control border-0 shadow-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)} />
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
        </div>
        </center>
        <h1
          style={{
            fontSize: "clamp(20px, 2vw, 30px)",
            color: "#172344",
            margin: "0px, 10px, 0",

          }}
        >
          Your Notes
        </h1> 
      
        <div> { notes.length === 0 && <div className=" container"> There is no Notes to display  </div>}
        {notes.length >= 0 && filteredNotes.map((note, ind) => {
          return (
            <Noteitem note={note} key={ind} updateNote={updateNote} /> 
          )
        })} </div> 
          
      </div>
      
    </div></>
  )
}
export default Notes

