const Post = ({ App, Issues, onSubmit, onResolve, user }) => {
  
  return (
    <div>
      <h2>{App.name}</h2>
      <p>App Description:</p>

      <p>{App.description}</p>
      <p>Deployment:</p>

      <p>{App.deployment}</p>
      <p>Github</p>

      <p>{App.github}</p>
      <p>Issues</p>      
      <ul>
        {Issues.map(value => 
          <div>
            <li key={value.id}>{value.comment}</li>
            <button onClick={(event) => {
              event.preventDefault()
              onResolve(event, value.id)
            }}>resolve</button>
          </div>
        )}
      </ul>
      <div>
        {user && (
          <>
            <p>Submit an Issue:</p>
            <form onSubmit={(event) => {
              event.preventDefault()
              onSubmit(event, App.id)
            }}>
              <input name="issue"/>
              <button type="submit">submit</button>
            </form>
          </>
      )}
      </div>
    </div>

  )
}

export default Post