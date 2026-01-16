import Posts from './components/Posts'
import SubmissionPortal from './components/SubmissionPortal'
import { useState, useEffect } from 'react'


const App = () => {
  const [apps, setApps] = useState([])
  const [TotalIssues, setTotalIssues] = useState([])  

  const addApp = (event) => {
    console.log("app has been attempted to be added")
    event.preventDefault()
    const id = Math.floor(Math.random() * 1000) + 1
    const name = event.target.elements.name.value
    const description = event.target.elements.description.value
    const github = event.target.elements.github.value
    const deployment = event.target.elements.deployment.value
    const email = event.target.elements.email.value
    const newApp = {
      id: id,
      name: name,
      description: description,
      deployment: deployment,
      github: github,
      email: email
    }
    const newApps = apps.concat(newApp)
    setApps(newApps)
    event.target.reset()
  }

  const addIssue = (event, appId) => {
    event.preventDefault()
    console.log("issue has attempted to be logged")
    console.log(event.target.elements.issue.value)
    const newComment = event.target.elements.issue.value
    // check if the app already has issues
    if (TotalIssues.some(issue => issue.appId === appId)) {
      const newTotalIssues = TotalIssues.map(issue => 
        issue.appId===appId
          ? { ...issue, issues: issue.issues.concat(newComment) }
          : issue)
        setTotalIssues(newTotalIssues)
    } 
    // app has no issues yet, this would be the first issue
    else {
      const newAppIssue = {
        appId: appId,
        issues: [
          newComment
        ]
      }
      const newTotalIssues = TotalIssues.concat(newAppIssue)
      setTotalIssues(newTotalIssues)
    }

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