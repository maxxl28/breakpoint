// App Submission Portal Component

const SubmissionPortal = ({ onSubmit }) => {
  return (
    <div>
      <h2>Submit your app</h2>
      <form onSubmit={onSubmit}>
        <p>Name:</p>
        <input name="name" type="text" placeholder="enter app name" required/>

        <p>Description:</p>
        <input name="description" type="text" placeholder="enter app description" required/>

        <p>Deployment:</p>
        <input name="deployment" type="text" placeholder="enter deployment url"/>

        <p>Github:</p>
        <input name="github" type="text" placeholder="enter GitHub gist or repo url" required/>
        <div>
          <button type="submit">Submit</button>
        </div>
      </form>
    </div>
  )
}

export default SubmissionPortal
