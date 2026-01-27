// Main React Component
// Maintains a list of all apps, all issues, the user, the view, and a search query

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
  const [totalIssues, setTotalIssues] = useState([])  
  const [user, setUser] = useState(null) 
  const [view, setView] = useState('register')
  const [search, setSearch] = useState('')

  // to fetch data on mount and on view change
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

  // Handle searching of apps
  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  // Handle adding an app 
  const addApp = (event) => {
    event.preventDefault()
    const name = event.target.elements.name.value
    const description = event.target.elements.description.value
    const github = event.target.elements.github.value
    const deployment = event.target.elements.deployment.value || "n/a" 
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

  // Handle adding an issue
  const addIssue = (event, appId) => {
    event.preventDefault()
    const newIssue = {
      appId: appId,
      comment: event.target.elements.issue.value
    }  
    postService
      .postIssue(newIssue)
      .then(response => {
        const newIssues = totalIssues.concat(response)
        setTotalIssues(newIssues)
      })
    event.target.reset()
  }

  // Handle resolving an issue
  const resolveIssue = (event, issueId) => {
    event.preventDefault()
    postService
      .deleteIssue(issueId)
      .then(() => {
        const newIssues = totalIssues.filter(issue => issue.id !== issueId)
        setTotalIssues(newIssues)
      }).catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  // Handle authentication


  // Handle registration
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

  // Handle user verification
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

  // Handle user login
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
        localStorage.setItem('breakpointToken', response.token)
        localStorage.setItem('breakpointUser', JSON.stringify(response))
        setUser(response)
      })
      .catch(error => {
        const errorMessage = error.response.data.error
        alert(errorMessage)
      })
  }

  // Handle user logout
  const logoutUser = () => {
    window.localStorage.clear()  
    setUser(null)                
    setView('register')             
  }

  // Handle user auth display
  if (view == 'register') {
    return (
      <div>
        <h1>Dartmouth Breakpoint</h1>
        <Register onSubmit={registerUser} setView={setView}/>
      </div>
    )
  }

  if (view == 'verify') {
    return (
      <div>
        <h1>Dartmouth Breakpoint</h1>
        <Verify onSubmit={verifyUser} />
      </div>
    )
  }

  if (view == 'login') {
    return (
      <div>
        <h1>Dartmouth Breakpoint</h1>
        <Login onSubmit={loginUser} />
      </div>
    )
  }

  return (
    <div>
      <h1>Dartmouth Breakpoint</h1>
      {/*Search bar*/}
      <div>
        <p>Search for apps:</p>
        <input onChange={handleSearchChange} value={search}/>
      </div>
      {/*Other apps*/}
      <h1>Buggy apps:</h1>
      <Posts AppList={apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()) && app.email != user.email)} 
        IssueList={totalIssues} onSubmit={addIssue} onResolve={resolveIssue} user={true}/>
      {/*Your apps*/}
      <h1>Your apps:</h1>
      <Posts AppList={apps.filter(app => app.name.toLowerCase().includes(search.toLowerCase()) && app.email == user.email)} 
        IssueList={totalIssues} onSubmit={addIssue} onResolve={resolveIssue} user={false}/>
      {/*Add another app*/}
      <SubmissionPortal onSubmit={addApp}/>
      <button onClick={logoutUser}>logout</button>
    </div>
  )
}

export default App