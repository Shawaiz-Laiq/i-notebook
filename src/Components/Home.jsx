import Addnote from "./Addnote";
import Notes from "./Notes";

function Home() {

    return (<div>
        <style>{`
        @media (max-width: 900px) {
          .login-welcome-panel {
            display:block !important;
          }        
        }
      `}</style>
        <div className="d-flex gap-3" style={{ height: "47rem" }}>
            <div
                style={{
                    position: "sticky",
                    top: "10px",
                    alignSelf: "flex-start",
                    flex: "0 0 40%"
                }}>
                <Addnote />
            </div>

            <div
                style={{
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
                        {`
      .notes-scroll::-webkit-scrollbar {
        display: none;
      }
    `}
                    </style>
                </div>
            </div>
        </div></div>
    )
}
export default Home;
