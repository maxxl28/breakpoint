const SubmissionPortal = ({ onSubmit }) => {
  return (
    <div>
      <h2>Submit your app</h2>
      <form onSubmit={onSubmit}>
        <p>Name</p>
        <input name="name" type="text" placeholder="Enter app name" required/>

        <p>Description</p>
        <input name="description" type="text" placeholder="Enter app description" required/>

        <p>Deployment</p>
        <input name="deployment" type="text" placeholder="Enter deployment URL" required/>

        <p>Github</p>
        <input name="github" type="text" placeholder="Enter GitHub repo URL" required/>
        {/*
        <p>Email for contact</p>
        <input name="email" type="email" placeholder="Enter email" required/>
        */}
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SubmissionPortal
