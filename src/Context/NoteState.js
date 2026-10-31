
import { useState } from "react";
import NoteContext from "./noteContext";
import { useRef } from "react";

const NoteState = (props) => {
  const token = localStorage.getItem("auth-token");
  const host = "https://firest-backend.vercel.app";
  const notesInitial = []
  const [chechError, setchechError] = useState()
  const [chechresult, setchechresult] = useState()

  //fetch 
  const getNote = async () => {
    const response = await fetch(`${host}/api/notes/fetchnotes`, {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "auth-token": token
      },

    });
    const json = await response.json()

    setchechError(json.error)
    setchechresult(json.length)
    setnotes(json)

  }
  //Add Note
  const [notes, setnotes] = useState(notesInitial)

  const addNote = async (title, description) => {
    const response = await fetch(`${host}/api/notes/addnotes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        title: title,
        description: description
      })
    });
    const json = await response.json();
    setnotes(prevNotes => [json, ...prevNotes]);

  }

  // Delete
  const delet = async (id) => {

    const newNotes = notes.filter((note) => { return (note._id !== id) })
    setnotes(newNotes)

    await fetch(`${host}/api/notes/deletenote/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
    });


  }

  // Edit mote
  const edit = async (id, title, description) => {

    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({ title, description })
    });
    // body: JSON.stringify({title: title,
    //         description: description})
    const newNotes = notes.map((note) =>
      note._id === id
        ? { ...note, title: title, description: description }
        : note
    );
    setnotes(newNotes);

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
    <NoteContext.Provider value={{ notes, addNote, edit, delet, getNote, showAlert, alerts, chechError, chechresult }}>
      {props.children}
    </NoteContext.Provider>
  )
}

export default NoteState;