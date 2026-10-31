
import { useContext } from "react";
import NoteContext from "../Context/noteContext";

function Alert() {
  const { alerts } = useContext(NoteContext);

  return (
    <div style={{ height: "60px" }}>
      {alerts && (
        <div
          className={`alert alert-${alerts.msg === "Warning" ? "danger" : "success"
            } alert-dismissible fade show`}
          role="alert"
        >
          <strong>{alerts.msg}</strong> {alerts.type}
        </div>
      )}
    </div>
  );
}

export default Alert;
