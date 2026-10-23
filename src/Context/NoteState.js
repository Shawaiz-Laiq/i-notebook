
import { useState } from "react";
import NoteContext from "./noteContext";
import { useRef } from "react";

const NoteState = (props) => {
  const host = "http://localhost:5000"
  const notesInitial = []

//fetch 
const getNote = async () => {
     const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "auth-token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ"
      },
    
    });
    const json = await response.json()

   console.log(json)
   setnotes(json)

  }


  //Add Note
  const [notes, setnotes] = useState(notesInitial)
 
  const addNote = async (title, description) => {
     const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ'
      },
      body: JSON.stringify({title: title,
            description: description})
    });
    const json = await response.json();
     setnotes(prevNotes => [...prevNotes, json]);

console.log( response.status);




  }

  // Delete
  const delet = async(id) => {

    const newNotes = notes.filter((note) => { return (note._id !== id) })
    setnotes(newNotes)


    const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ'
      },
    });
    const json = await response.json()
    console.groupCollapsed(json)

  }

  // Edit mote
  const edit = async (id, title, description) => {

    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ'
      },
      body: JSON.stringify({title, description})
    });
    // body: JSON.stringify({title: title,
    //         description: description})
    let newNotes = JSON.parse(JSON.stringify((notes)))
    for (let index = 0; index < newNotes.length; index++) {
      const element = newNotes[index];
      if (element._id === id) {

        newNotes[index].title = title
        newNotes[index].description = description
      }
      break;
    }
    setnotes(newNotes)
    const json = await response.json();
    console.log(json)

  }

  const [alerts, setAlerts] = useState(null)
   const timerRef = useRef(null)

   const showAlert = (msg, type) => {
     if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setAlerts({
      msg: msg,
      type: type
    })

    timerRef.current = setTimeout(() => {
      setAlerts(null);
    }, 2500);
  }



  return (
    <NoteContext.Provider value={{ notes, addNote, edit, delet, getNote ,showAlert , alerts}}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;