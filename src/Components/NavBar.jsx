import {Link, useLocation} from "react-router-dom"
import { useEffect } from "react";


function NavBar() {
    let location = useLocation();
    useEffect(() => {
      console.log(location.pathname)
    
    }, [location])
    
    return (
    <>
        <ul className="nav nav-tabs">
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/" ? "active" : "" } `} aria-current="page" to="/">Home</Link>
            </li>
            <li className="nav-item">
                <Link className={`nav-link ${location.pathname === "/about" ? "active" : "" } `} to="/about">About</Link>
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