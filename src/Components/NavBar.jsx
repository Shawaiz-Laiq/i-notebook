import {
    Link
} from "react-router-dom"


function NavBar() {
    return (
    <>
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className="nav-link" to="/about">About</Link>
            </li>
            {/* <li className="nav-item">
                <a className="nav-link" href="#">Link</a>
            </li>
            <li className="nav-item">
                <a className="nav-link disabled" aria-disabled="true">Disabled</a>
            </li> */}
        </ul>
    </>
    )
}
export default NavBar;