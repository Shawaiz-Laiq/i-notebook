
function Alert(props) {
    return (
        <div className="alert alert-primary" role="alert">
           {props.msg}
        </div>
    )
}

export default Alert