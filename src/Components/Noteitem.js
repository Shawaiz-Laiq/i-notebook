function Notesitem(props) {
    const { note } = props
    return (
        <div className="col-md-3">
               
            <section class="card my-3" style={{maxWidth: "320px"}}>
                    <div class="card-body">
                        <h4 class="card-title">{note.title}</h4>
                        <p class="card-text">{note.description}</p>
                        <a href="#" class="btn-solid theme-primary">Go somewhere</a>
                    </div>
            </section>
        </div>
    )
}

export default Notesitem