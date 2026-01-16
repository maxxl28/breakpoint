import Posts from './components/Posts'
import SubmissionPortal from './components/SubmissionPortal'
import { useState, useEffect } from 'react'


const App = () => {
  const [apps, setApps] = useState([])
  const addApp = (event) => {
    console.log("app has been attempted to be added")
    event.preventDefault()
    const id = Math.floor(Math.random() * 1000) + 1
    const name = event.target.elements.name.value
    const description = event.target.elements.description.value
    const github = event.target.elements.github.value
    const deployment = event.target.elements.deployment.value
    const newApp = {
      "id": id,
      "name": name,
      "description": description,
      "deployment": deployment,
      "github": github,
      "issues": []
    }
    const newApps = apps.concat(newApp)
    setApps(newApps)
    event.target.reset()
  }
  /*
  const Break = [
    {
      "id": 1,
      "name" : "App 1",
      "description": "testing vibecoded apps",
      "deployment": "google.com",
      "github": "github.com",
      "issues" : [
        {
          "id": 1,
          "comment": "hahahaha you suck"
        },
        {
          "id": 2,
          "comment": "asfsafas"
        }
      ] 
    }
  ]*/


  return (
    <div>
      <h1>breakpoint</h1>
      <Posts AppList={apps} />

      <SubmissionPortal onSubmit={addApp}/>
    </div>
  )
}

export default App