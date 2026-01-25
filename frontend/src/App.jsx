import Posts from './components/Posts'
import SubmissionPortal from './components/SubmissionPortal'
import { useState, useEffect } from 'react'
import postService from './services/posts'
import authService from './services/auth'
import Register from './components/Register'
import Login from './components/Login'
import Verify from './components/Verify'

const App = () => {
  // useStates
  const [apps, setApps] = useState([])
  const [TotalIssues, setTotalIssues] = useState([])  
  const [user, setUser] = useState(null) // ignore this for now
  const [view, setView] = useState('register')
  const [search, setSearch] = useState('')

  useEffect(() => {
    postService
      .getAllApps()
      .then(response => {
        setApps(response)
      })
    postService
      .getAllIssues()
      .then(response => {
        setTotalIssues(response)
      })
  }, [view])

  // handle searching of apps
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  // handle adding an app 
  const addApp = (event) => {
    event.preventDefault()
    const name = event.target.elements.name.value
    const description = event.target.elements.description.value
    const github = event.target.elements.github.value
    const deployment = event.target.elements.deployment.value
    const email = user.email
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

  // handle adding an issue
  const addIssue = (event, appId) => {
    event.preventDefault()
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

  // handle resolving an issue
  const resolveIssue = (event, issueId) => {
    event.preventDefault()
    postService
      .deleteIssue(issueId)
      .then(() => {
        const newIssues = TotalIssues.filter(issue => issue.id !== issueId)
        setTotalIssues(newIssues)
      }).catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  // handle registration
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
        alert('registration successful! check your email for verification code.')
        setView('verify')
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
    event.target.reset()
  }

  // handle user verification
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

  // handle user login
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
        window.localStorage.setItem('breakpointToken', response.token)
        window.localStorage.setItem('breakpointUser', JSON.stringify(response))
        setUser(response)
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  // handle user logout
  const logoutUser = () => {
    window.localStorage.clear()  
    setUser(null)                
    setView('register')             
  }

  // handle user auth display
  if (view == 'register') {
    return (
      <div>
        <h1>dartmouth breakpoint</h1>
        <Register onSubmit={registerUser} setView={setView}/>
      </div>
    )
  }

  if (view == 'verify') {
    return (
      <div>
        <h1>dartmouth breakpoint</h1>
        <Verify onSubmit={verifyUser} />
      </div>
    )
  }

  if (view == 'login') {
    return (
      <div>
        <h1>dartmouth breakpoint</h1>
        <Login onSubmit={loginUser} />
      </div>
    )
  }

  return (
    <div>
      <h1>dartmouth breakpoint</h1>
      <div>
        <p>search:</p>
        <input onChange={handleSearchChange} value={search}/>
      </div>
      <h1>buggy apps:</h1>
      <Posts AppList={apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()) && app.email != user.email)} 
        Issuelist={TotalIssues} onSubmit={addIssue} onResolve={resolveIssue} user={true}/>
      <h1>your apps:</h1>
      <Posts AppList={apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()) && app.email == user.email)} 
        Issuelist={TotalIssues} onSubmit={addIssue} onResolve={resolveIssue} user={false}/>
      <SubmissionPortal onSubmit={addApp}/>
      <button onClick={logoutUser}>logout</button>
    </div>
  )
}

export default App