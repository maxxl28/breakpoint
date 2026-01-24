import Posts from './components/Posts'
import SubmissionPortal from './components/SubmissionPortal'
import { useState, useEffect } from 'react'
import postService from './services/posts'
import authService from './services/auth'
import Register from './components/Register'
import Login from './components/Login'
import Verify from './components/Verify'

const App = () => {
  const [apps, setApps] = useState([])
  const [TotalIssues, setTotalIssues] = useState([])  
  const [user, setUser] = useState(null) // ignore this for now
  const [view, setView] = useState('register')
  

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('breakpointUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      setView('full_view')
    }
    postService
      .getAllApps()
      .then(response => {
        console.log("tried to get apps")
        setApps(response)
      })
    postService
      .getAllIssues()
      .then(response => {
        console.log("tried to get issues")
        console.log(JSON.stringify(response, null, 2))
        setTotalIssues(response)
      })
  }, [])

  const addApp = (event) => {
    console.log("app has been attempted to be added")
    event.preventDefault()
    
    const name = event.target.elements.name.value
    const description = event.target.elements.description.value
    const github = event.target.elements.github.value
    const deployment = event.target.elements.deployment.value
    const email = event.target.elements.email.value
    const newApp = {
      name: name,
      description: description,
      deployment: deployment,
      github: github,
      email: email
    }
    postService
      .postApp(newApp)
      .then(response => {
        const newApps = apps.concat(response)
        setApps(newApps)
      })
    
    event.target.reset()
  }

  const addIssue = (event, appId) => {
    event.preventDefault()
    console.log("issue has attempted to be logged")
    console.log(event.target.elements.issue.value)
    const newIssue = {
      appId: appId,
      comment: event.target.elements.issue.value
    }  
    postService
      .postIssue(newIssue)
      .then(response => {
        const newIssues = TotalIssues.concat(response)
        setTotalIssues(newIssues)
      })
    event.target.reset()
  }

  const registerUser = (event) => {
    event.preventDefault()
    const name = event.target.elements.name.value
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value
    const newUser = {
      name: name,
      email: email,
      password: password,
    }
    authService
      .postRegistration(newUser)
      .then(response => {
        alert('Registration successful! Check your email for verification code.')
        setView('verify')
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
    event.target.reset()
  }

  const verifyUser = (event) => {
    event.preventDefault()
    const token = event.target.elements.token.value
    const payload = {
      token: token
    }
    authService
      .postVerification(payload)
      .then(response => {
        setView('login')
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  const loginUser = (event) => {
    event.preventDefault()
    const email = event.target.elements.email.value
    const password = event.target.elements.password.value
    const user = {
      email: email,
      password: password
    }
    authService
      .postLogin(user)
      .then(response => {
        setView('full_view')
        const jwttoken = response.token
        window.localStorage.setItem('breakpointToken', response.token)
        window.localStorage.setItem('breakpointUser', JSON.stringify(response))
        setUser(response)
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  if (view == 'register') {
    return <Register onSubmit={registerUser} setView={setView}/>
  }

  if (view == 'verify') {
    return <Verify onSubmit={verifyUser} />
  }

  if (view == 'login') {
    return <Login onSubmit={loginUser} />
  }


  return (
    <div>
      <h1>breakpoint</h1>
      <Posts AppList={apps} Issuelist={TotalIssues} onSubmit={addIssue}/>
      <SubmissionPortal onSubmit={addApp}/>
    </div>
  )
}

export default App