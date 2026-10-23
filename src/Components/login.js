import { useState } from "react";
//import { useNavigate} from 'react-router'

function Login() {
    const [cerden, setcerden] = useState({email: "" , password: ""})
    //let history =  useNavigate()
    const handleSumbit = async (e) => {
       
        e.preventDefault();
        const response = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
               // 'auth-token': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiNmFkNjI4MWY1NDg0NjZhNjI3OGIzNDM4In0sImlhdCI6MTc5MjQxOTg3MX0.tzZlft0jgbQWjvHspgMdJdKzBmVuLLUMSgDUjHTKgyQ'
            },
             body: JSON.stringify({email :cerden.email, password: cerden.password})
        });
        const json = await response.json();
        //console.log(json. jwtdata)
        if (json.success){
         localStorage.setItem('token' , json.jwtdata)
            //history.push('/');
        } else {
            alert("Worng information may be email or passowrd")
        }
       
    }

    const onChange =(e) => {
        setcerden({...cerden ,[e.target.name] : e.target.value})

    }



    return (
 
            <form  onSubmit={handleSumbit}>
            <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input type="email" className="form-control" name="email" id="email" aria-describedby="emailHelp" required value={cerden.email} onChange={onChange} />
                <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
            </div>
            <div className="form-group">
                <label htmlFor="Password">Password</label>
                <input type="password" className="form-control" id="Password" name="password" required  value={cerden.password}onChange={onChange}/>
            </div>
            <div className="form-group form-check">
                <input type="checkbox" className="form-check-input"  id="exampleCheck1" />
                <label className="form-check-label" htmlFor="exampleCheck1">Check me out</label>
            </div>
            <button type="submit" className="btn btn-primary">Submit</button>
        </form>

    )
}

export default Login;