import { useContext } from "react"
import noteContext from "../Context/noteContext"


function Notesitem(props) {

    const context = useContext(noteContext)
    const { delet } = context
    const { note, updateNote } = props
    return (
        <div className="d-flex justify-content-center"style={{paddingRight: "20px"}}>
            
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
                        <span  style={{fontSize: "12px", marginTop: "5px"}}>Date: 25-05-2025 at 22:09</span>
                        <div>
                        <span className=" mx-3 " style={{cursor: "pointer"}} >View</span>
                       <span type="button" className="mx-3 btn-solid theme-primary" onClick={()=>{updateNote(note)}}>Edit</span>
                        <span style={{ cursor: "pointer" }} onClick={() => { delet(note._id) }} >delete</span></div>
                    </div>
                    

                    
                </div>
            </section>
        </div>
    )
}

export default Notesitem