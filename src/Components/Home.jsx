import Addnote from "./Addnote";
import Notes from "./Notes";
import { useContext , useEffect, useState } from "react";
import noteContext from '../Context/noteContext'
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

function Home() {
    const context = useContext(noteContext);
    const navigate = useNavigate();
    const { chechError, chechresult, getNote } = context
    const [check, setcheck] = useState(false)
    useEffect(() => {
            getNote()
    }, [])

useEffect(() => {
  const timer = setTimeout(() => {
    if(chechError === "Please provide a valid token"  ) {
        navigate("/", { replace: true })
    } if(chechresult >= 0) {
        setcheck(true)
    } 
    console.log(chechresult)
  }, 1000);



  return () => clearTimeout(timer);
}, [chechError, chechresult]);
console.log(chechError)
console.log(chechresult)


    return (<div>
        <style>{`
        @media (max-width: 900px) {
          .login-welcome-panel {
            display:block !important;
          }        
        }
      `}</style>
       { check === false ? <Loading/> :  <div className="d-flex gap-3" style={{ height: "47rem" }}>
            <div style={{
                position: "sticky",
                top: "10px",
                alignSelf: "flex-start",
                flex: "0 0 40%"
            }}>
                <Addnote />
            </div>
            <div style={{
                flex: 1,
                height: "100%",
                overflowY: "auto"
            }}>
                <div
                    className="notes-scroll"
                    style={{
                        flex: 1,
                        height: "100%",
                        overflowY: "auto",
                        scrollbarWidth: "none"
                    }}>
                    <Notes />
                    <style>
                        {`.notes-scroll::-webkit-scrollbar { display: none;}`}
                    </style>
                </div>
            </div>
        </div>}
    </div>
    )
}
export default Home;
