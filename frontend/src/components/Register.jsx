const Register = ( {onSubmit, setView} ) => {
  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}>
        <p>Name</p>
        <input name="name" required/>
        <p>Email</p>
        <input name="email" type="email" required/>
        <p>Password</p>
        <input name="password" required/>
        <button type="submit">submit</button>
      {/*button to change to login*/}
      <div>
        <button onClick={() => setView('login')}>Go to login</button>
      </div>
      </form>
    </div>
  )
}

export default Register