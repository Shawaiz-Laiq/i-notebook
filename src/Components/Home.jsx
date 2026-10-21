import Notes from "./Notes";

function Home() {

    return (
        <div className="my-3">
            <h2>Add A Note</h2>
            <form style={{width: "300px" }}>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" />
                        <div id="emailHelp" className="form-text">We’ll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">Password</label>
                    <input type="password" className="form-control" id="exampleInputPassword1" />
                </div>
                <div className="mb-3 form-field">
                    <input type="checkbox" id="exampleCheck1" className="check" />
                        <label htmlFor="exampleCheck1">Check me out</label>
                </div>
                <button type="submit" className="btn-solid theme-primary">Submit</button>
            </form>
            <Notes/>
            
        </div>
    )
}
export default Home;