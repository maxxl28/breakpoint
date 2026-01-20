import Posts from './components/Posts'
import SubmissionPortal from './components/SubmissionPortal'
import { useState, useEffect } from 'react'
import postService from './services/posts'


const App = () => {
  const [apps, setApps] = useState([])
  const [TotalIssues, setTotalIssues] = useState([])  
  
  useEffect(() => {
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

  return (
    <div>
      <h1>breakpoint</h1>
      <Posts AppList={apps} Issuelist={TotalIssues} onSubmit={addIssue}/>
      <SubmissionPortal onSubmit={addApp}/>
    </div>
  )
}

export default App