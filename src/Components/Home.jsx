import Addnote from "./Addnote";
import Notes from "./Notes";
import { useContext, useEffect, useState } from "react";
import noteContext from '../Context/noteContext'
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import Footer from "./footer";

function Home() {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { chechError, chechresult, getNote } = context
  const [check, setcheck] = useState(false)
  getNote();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (chechError === "Please provide a valid token") {
        navigate("/", { replace: true })
      } if (chechresult >= 0) {
        setcheck(true)
      }
    }, 1000);
    return () => clearTimeout(timer);
  }, [chechError, chechresult, navigate,]);

  return (<div>
    <style>{`
  @media (min-width: 900px) {
    .hide {
      display: none !important;
    }

    .hei {
      height: 47rem !important;
    }

    .notes-scroll {
      height: 47rem;
      overflow-y: auto;
      overflow-x: hidden;
      min-height: 0;
    }

    .notes-scroll::-webkit-scrollbar {
      width: 6px;
    }

    .notes-scroll::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 10px;
    }
  }
`}</style>
    {check === false ? <Loading /> : <div className="d-flex gap-3 " >
      <div>
        <Addnote />
        <div className="hide"> <Notes /></div>
      </div>
      <div>
        <div
          className="notes-scroll">
          <Notes />
          <style>
            {`.notes-scroll::-webkit-scrollbar { display: none;}`}
          </style>
        </div>
      </div>
    </div>}
    <Footer />
  </div>
  )
}
export default Home;
