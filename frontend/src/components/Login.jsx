// Login Component

import { useState } from 'react'

const Login = ( {onSubmit} ) => {
  const [show, setShow] = useState(false)

  const toggleVisibility = () => {
    setShow(!show)
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event)
      }}>
        <p>Email</p>
        <input name="email" required/>
        <p>Password</p>
        <input name="password" type={show ? 'text' : 'password'} required/>
        <button type="button" onClick={toggleVisibility}>{show ? 'Hide Password' : 'Show Password'}</button>
        <button type="submit">Submit</button>
      </form>
    </div>
  )
}

export default Login