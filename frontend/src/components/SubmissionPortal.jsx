const SubmissionPortal = ({ onSubmit }) => {
  return (
    <div>
      <h2>Submit your app</h2>
      <form onSubmit={onSubmit}>
        <p>Name</p>
        <input name="name" type="text" placeholder="Enter app name" />

        <p>Description</p>
        <input name="description" type="text" placeholder="Enter app description" />

        <p>Deployment</p>
        <input name="deployment" type="text" placeholder="Enter deployment URL" />

        <p>Github</p>
        <input name="github" type="text" placeholder="Enter GitHub repo URL" />

        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SubmissionPortal
