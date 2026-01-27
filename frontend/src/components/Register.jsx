// Register Component

import { useState } from 'react'

const Register = ( {onSubmit, setView} ) => {
  const [show, setShow] = useState(false)
  
    const toggleVisibility = () => {
      setShow(!show)
    }

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
        <input name="password" type={show ? 'text' : 'password'} required/>
        <button type="button" onClick={toggleVisibility}>{show ? 'hide password' : 'show password'}</button>
        <button type="submit">submit</button>
      <div>
        <button onClick={() => setView('login')}>go to login</button>
      </div>
      </form>
    </div>
  )
}

export default Register