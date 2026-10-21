function Notesitem(props) {
    const { note } = props
    return (
        <div className="col-md-3">       
            <section className="card my-3" style={{maxWidth: "320px"}}>
                    <div className="card-body">
                        <h4 className="card-title">{note.title}</h4>
                        <p className="card-text">{note.description}</p>
                        <span style={{cursor: "pointer"}}>delete</span> <span className="mx-3" style={{cursor: "pointer"}}>done</span>
                    </div>
            </section>
        </div>
    )
}

export default Notesitem