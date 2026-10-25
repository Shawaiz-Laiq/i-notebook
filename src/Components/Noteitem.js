import { useContext, useState } from "react"
import noteContext from "../Context/noteContext"


function Notesitem(props) {

    const context = useContext(noteContext)
    const [viewNote, setViewNote] = useState(null);
    const { delet, showAlert } = context
    const { note, updateNote } = props
    const deleted =()=> {
        showAlert("Success", "Note added successfully")
        delet(note._id) ;
    }

function formatMyDate(isoString) {
  const dateObj = new Date(isoString);

  
  const date = dateObj.toLocaleDateString('en-CA'); 

  let hours = dateObj.getHours();
  const minutes = dateObj.getMinutes().toString().padStart(2, '0'); 

  hours = hours % 12;
  hours = hours ? hours : 12; 

  return `${date} At ${hours}:${minutes}`;
}
const incomingData = note.time
    return (<>


{/* View button */}


{/* View Note Modal */}
{viewNote && (
  <div
    onClick={() => setViewNote(null)}
    style={{
      position: "fixed",
      inset: 0,
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px",
      background: "rgba(15, 23, 42, 0.45)",
      backdropFilter: "blur(7px)",
      WebkitBackdropFilter: "blur(7px)"
    }}
  >
    <div
      onClick={(e) => e.stopPropagation()}
      style={{
        width: "100%",
        maxWidth: "500px",
        maxHeight: "80vh",
        overflowY: "auto",
        padding: "28px",
        borderRadius: "20px",
        background: "linear-gradient(145deg, #ffffff, #f5f3ff)",
        boxShadow: "0 25px 70px rgba(0,0,0,0.25)",
        border: "1px solid rgba(255,255,255,0.8)"
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
          marginBottom: "22px"
        }}
      >
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            color: "#7c3aed",
            background: "#ede9fe",
            padding: "7px 12px",
            borderRadius: "20px"
          }}
        >
          NOTE DETAILS
        </span>

        <button
          onClick={() => setViewNote(null)}
          aria-label="Close"
          style={{
            width: "36px",
            height: "36px",
            border: "none",
            borderRadius: "10px",
            background: "#ede9fe",
            color: "#6d28d9",
            fontSize: "24px",
            cursor: "pointer"
          }}
        >
          &times;
        </button>
      </div>

      {/* Title */}
      <h2
        style={{
          fontSize: "26px",
          fontWeight: 750,
          color: "#1e1b4b",
          overflowWrap: "anywhere",
          margin: "0 0 18px"
        }}
      >
        {viewNote.title}
      </h2>

      {/* Divider */}
      <div
        style={{
          width: "55px",
          height: "4px",
          borderRadius: "5px",
          background: "linear-gradient(90deg, #7c3aed, #a78bfa)",
          marginBottom: "22px"
        }}
      />

      {/* Description */}
      <div
        style={{
          padding: "18px",
          borderRadius: "12px",
          background: "#ffffff",
          border: "1px solid #e9e5f5"
        }}
      >
        <h4
          style={{
            margin: "0 0 10px",
            fontSize: "14px",
            color: "#7c3aed"
          }}
        >
          Description
        </h4>

        <p
          style={{
            margin: 0,
            fontSize: "16px",
            lineHeight: 1.8,
            color: "#4b5563",
            whiteSpace: "pre-wrap",
            overflowWrap: "anywhere"
          }}
        >
          {viewNote.description}
        </p>
      </div>

      {/* Footer */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "24px" }}>
        <button
          onClick={() => setViewNote(null)}
          style={{
            padding: "11px 22px",
            border: "none",
            borderRadius: "10px",
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff",
            fontWeight: 600,
            cursor: "pointer"
          }}
        >
          Done
        </button>
      </div>
    </div>
  </div>
)}






        <div className="d-flex justify-content-center"style={{paddingRight: "2px"}}>
            
            <section className="card my-3"   style={{
            maxWidth: "750px",       
            whiteSpace: "nowrap",   
            overflow: "hidden",      
            textOverflow: "ellipsis",
            minWidth: "300px",
            width: "750px",
            }}>
                <div style={{padding: "20px"}}>
                    {/* <h4 className="card-title">{note.title}</h4> */}
                     <h4 className="card-title">{note.title}</h4>
                    {/* <p className="card-text">{note.description}</p> */}
                    <p className="card-text">{note.description}</p>
                    <div className="d-flex  justify-content-between">
                        <span  style={{fontSize: "12px", marginTop: "5px"}}>{formatMyDate(incomingData)}</span>
                        <div>
                        <span className=" mx-3 " style={{cursor: "pointer" , fontSize: "1vw" }} >
                            <button onClick={() => setViewNote(note)} style={{ padding: "8px 14px", border: "none", borderRadius: "8px", background: "#7c3aed", color: "white", cursor: "pointer"}}>
                                Read Note
                            </button>
                        </span>
                       <span type="button" className="mx-3 btn-solid theme-primary" style={{cursor: "pointer" , fontSize: "1vw" }} onClick={()=>{updateNote(note)}}>
                            <button style={{ padding: "8px 14px", border: "none", borderRadius: "8px", background: "#7c3aed", color: "white", cursor: "pointer"}} >
                                Edit
                            </button>
                        </span>
                        <span style={{ cursor: "pointer", fontSize: "1vw" }} onClick={deleted}>
                            <button style={{ padding: "8px 14px", border: "none", borderRadius: "8px", background: "#7c3aed", color: "white", cursor: "pointer"}}>
                                Delete
                            </button>
                        </span></div>
                    </div>
                 </div>
            </section>
        </div>
        </>
    )
}

export default Notesitem