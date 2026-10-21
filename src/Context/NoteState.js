
import { useState } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
    const notesInitial = [
  {
    "_id": "6ad6285e548466a6278b3439",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:25:34.149Z",
    "__v": 0
  },
  {
    "_id": "6ad628d5548466a6278b343a",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:33.196Z",
    "__v": 0
  },
  {
    "_id": "6ad628d5548466a6278b343b",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:33.380Z",
    "__v": 0
  },
  {
    "_id": "6ad628d5548466a6278b343c",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:33.601Z",
    "__v": 0
  },
  {
    "_id": "6ad628d5548466a6278b343d",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:33.734Z",
    "__v": 0
  },
  {
    "_id": "6ad628d5548466a6278b343e",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:33.900Z",
    "__v": 0
  },
  {
    "_id": "6ad628d6548466a6278b343f",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:34.059Z",
    "__v": 0
  },
  {
    "_id": "6ad628d6548466a6278b3440",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:34.203Z",
    "__v": 0
  },
  {
    "_id": "6ad628d6548466a6278b3441",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:34.354Z",
    "__v": 0
  },
  {
    "_id": "6ad628d6548466a6278b3442",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T14:27:34.492Z",
    "__v": 0
  },
  {
    "_id": "6ad6353c28327618342ee99a",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:28.226Z",
    "__v": 0
  },
  {
    "_id": "6ad6353c28327618342ee99b",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:28.745Z",
    "__v": 0
  },
  {
    "_id": "6ad6353e28327618342ee99c",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:30.995Z",
    "__v": 0
  },
  {
    "_id": "6ad6353f28327618342ee99d",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:31.657Z",
    "__v": 0
  },
  {
    "_id": "6ad6353f28327618342ee99e",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:31.976Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee99f",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.165Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee9a0",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.324Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee9a1",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.474Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee9a2",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.641Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee9a3",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.784Z",
    "__v": 0
  },
  {
    "_id": "6ad6354028327618342ee9a4",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:32.973Z",
    "__v": 0
  },
  {
    "_id": "6ad6354128327618342ee9a5",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:33.105Z",
    "__v": 0
  },
  {
    "_id": "6ad6354128327618342ee9a6",
    "user": "6ad6281f548466a6278b3438",
    "title": "shawaizbhai",
    "description": "shawaiz bhai",
    "time": "2026-10-19T15:20:33.256Z",
    "__v": 0
  }
]

const [notes, setnotes] = useState(notesInitial)

    return (
        <NoteContext.Provider value={{notes , setnotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;