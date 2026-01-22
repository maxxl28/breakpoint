const Login = ( {onSubmit} ) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event,)
      }}>
        <p>Email</p>
        <input name="email" required/>
        <p>Password</p>
        <input name="password" required/>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default Login