import { useContext } from "react";
import noteContext from '../Context/noteContext'
import Noteitem from './Noteitem'

function Notes() {
    const context = useContext(noteContext);
    const { notes, setnotes } = context
    return (
        <div className="row">
            <h2>Your Notes</h2>
            {notes.map((note, ind) => {
                return (
                    <Noteitem key={ind} note={note} />
                )
            })}
        </div>
    )
}
export default Notes