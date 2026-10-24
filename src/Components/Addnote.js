// import { useContext, useState } from "react";
// import noteContext from "../Context/noteContext";

// function Addnote() {
//     const [note, setnote] = useState({ title: "", description: "" })
//     const [title, settitle] = useState('')
//     const [description, setdescription] = useState('')
//     const context = useContext(noteContext);
//     const { addNote, showAlert } = context
//     const handleclick = (e) => {
//         e.preventDefault();
//         if (title.length >= 10 && description.length >= 10) {
//             addNote(note.title, note.description)
//             showAlert("Success", "Note added successfully");
//             const token = localStorage.getItem("token");
//             console.log(token)
//         } else {
//             if (title.length < 10 && description.length < 10) {
//                  showAlert("Warning", "Title and Description is too short");
//             } else {
//                 if (title.length < 10) {
//                     showAlert("Warning", "Title is too short");
//                 } else if (description.length  < 10) {
//                     showAlert("Warning", "Description is too short");
//                 }
//             }
//         }

//     }

//     const titleclick = (e) => {
//         settitle(e.target.value)
//     }
//     const desclick = (e) => {
//         setdescription(e.target.value)
//     }

//     const onchange = (e) => {
//         setnote({ ...note, [e.target.name]: e.target.value })

//     }
//     return (
//         <div>
//             <h2>Add A Note</h2>
//             <form style={{ width: "300px" }}>
//                 <div className="mb-3">
//                     <label htmlFor="title" className="form-label">title</label>
//                     <input onChange={(e) => { onchange(e); titleclick(e) }} name="title" type="text" className="form-control" id="title" aria-describedby="emailHelp" required />
//                 </div>
//                 <div className="mb-3">
//                     <label htmlFor="description" className="form-label">Description</label>
//                     <input onChange={(e) => { onchange(e); desclick(e) }} name="description" type="description" className="form-control" id="description" required />
//                 </div>
//                 <button type="submit" className="btn-solid theme-primary" onClick={handleclick}>Add Note</button>
//             </form>
//         </div>
//     )
// }

// export default Addnote;






import { useState, useContext } from "react";
import NoteContext from "../Context/noteContext";

function Addnote() {
  const [note, setNote] = useState({
    title: "",
    description: "",
    tag: "General"
  });

  const [loading, setLoading] = useState(false);

  const { addNote, showAlert } = useContext(NoteContext);

  const onChange = (e) => {
    setNote({
      ...note,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (note.title.trim().length < 3) {
      showAlert("Warning", "Title Minimum 10 Character Long");
      return;
    }

    if (note.description.trim().length < 10) {
      showAlert("Warning", "Description Minimum 10 Character Long");
      return;
    }

    setLoading(true);

    try {
      await addNote(note.title, note.description, note.tag);

      setNote({
        title: "",
        description: "",
        tag: "General"
      });
        //addNote(note.title, note.description)

      showAlert("Success", "Note added successfully!");
    } catch (error) {
      showAlert("Warning", "Error");
    } finally {
      setLoading(false);
    }
  };

  const fieldStyle = {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px 15px",
    border: "1px solid #dbe1ef",
    borderRadius: "10px",
    outlineColor: "#596bfa",
    fontSize: "15px",
    background: "#fff",
    color: "#263453"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "9px",
    fontWeight: "600",
    color: "#263453",
    fontSize : "15px"
  };

  return (<>
  <style>{`
        @media (max-width: 900px) {
          .login-welcome-panel {
            width: 100vw !important;
          }

         
        }
      `}</style>
    <div className="login-welcome-panel"
      style={{
        minHeight: "85vh",
        padding: "35px 15px",
        background: "#f4f6fc",
        fontFamily: "Arial, sans-serif",
        width: "50vw"
      }}
    >
      <div
        style={{
          maxWidth: "850px",
          margin: "0 auto"
        }}
      >
        {/* Page heading */}
        <div style={{ marginBottom: "25px" }}>
          {/* <div
            style={{
              display: "inline-block",
              background: "#e7eaff",
              color: "#5368ed",
              padding: "8px 13px",
              borderRadius: "20px",
              fontSize: "13px",
              fontWeight: "bold",
              marginBottom: "12px"
            }}
          >
            📝 MY NOTEBOOK
          </div> */}

          <h1
            style={{
              fontSize: "clamp(20px, 2vw, 30px)",
              color: "#172344",
              margin: "0 0 10px"
            }}
          >
            Create a New Note
          </h1>

          <p style={{ color: "#687795", lineHeight: 1.2, margin: 0 , fontSize: ".8rem"}}>
            Capture your ideas, save your thoughts, and keep everything organized.
          </p>
        </div>

        {/* Add note form */}
        <div
          style={{
            background: "#fff",
            padding: "clamp(20px, 5vw, 38px)",
            borderRadius: "18px",
            boxShadow: "0 12px 40px rgba(35,52,110,0.09)",
            border: "1px solid #edf0f8"
          }}
        >
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "23px" }}>
              <label htmlFor="title" style={labelStyle}>
                Note Title
              </label>

              <input
                type="text"
                id="title"
                name="title"
                placeholder="e.g. My React learning plan"
                value={note.title}
                onChange={onChange}
                required
                minLength={3}
                maxLength={100}
                style={fieldStyle}
              />

              <p
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#8993aa",
                  margin: "7px 0 0"
                }}
              >
                {note.title.length}/100
              </p>
            </div>

            <div style={{ marginBottom: "23px" }}>
              <label htmlFor="description" style={labelStyle}>
                Description
              </label>

              <textarea
                id="description"
                name="description"
                placeholder="Write your note here..."
                value={note.description}
                onChange={onChange}
                required
                minLength={10}
                //rows={2}
                style={{
                  ...fieldStyle,
                  resize: "vertical",
                 // lineHeight: 1.7,
                  //minHeight: "150px"
                }}
              />

              <p
                style={{
                  textAlign: "right",
                  fontSize: "12px",
                  color: "#8993aa",
                  margin: "7px 0 0"
                }}
              >
                {note.description.length} characters
              </p>
            </div>

            <div style={{ marginBottom: "28px" }}>
              <label htmlFor="tag" style={labelStyle}>
                Category
              </label>

              <select
                id="tag"
                name="tag"
                value={note.tag}
                onChange={onChange}
                style={{ ...fieldStyle, cursor: "pointer" }}
              >
                <option value="General">General</option>
                <option value="Work">Work</option>
                <option value="Study">Study</option>
                <option value="Personal">Personal</option>
                <option value="Ideas">Ideas</option>
              </select>
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "12px"
              }}
            >
              <button
                type="submit"
                disabled={loading}
                style={{
                  flex: "1 1 180px",
                  padding: "15px",
                  border: "none",
                  borderRadius: "10px",
                  background: "linear-gradient(100deg,#5267f5,#6574ff)",
                  color: "#fff",
                  fontWeight: "bold",
                  fontSize: "16px",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? "Saving..." : "＋ Save Note"}
              </button>

              <button
                type="button"
                onClick={() =>
                  setNote({
                    title: "",
                    description: "",
                    tag: "General"
                  })
                }
                style={{
                  flex: "1 1 120px",
                  padding: "15px",
                  border: "1px solid #dbe1ef",
                  borderRadius: "10px",
                  background: "#fff",
                  color: "#53617c",
                  fontWeight: "600",
                  cursor: "pointer"
                }}
              >
                Clear Form
              </button>
            </div>
          </form>
        </div>

        <p
          style={{
            textAlign: "center",
            color: "#8993aa",
            fontSize: "13px",
            marginTop: "20px"
          }}
        >
          💡 Tip: Give your note a clear title so you can find it easily later.
        </p>
      </div>
    </div></>
  );
}

export default Addnote;
