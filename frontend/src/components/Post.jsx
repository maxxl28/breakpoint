// Singular Post Component

const Post = ({ App, Issues, onSubmit, onResolve, user }) => {
  
  return (
    <div>
      <h2>{App.name}</h2>
      <h3>App Description:</h3>

      <p>{App.description}</p>
      <h3>Deployment:</h3>

      <p>{App.deployment}</p>
      <h3>Github:</h3>

      <p>{App.github}</p>
      <h3>Issues:</h3>      
      {Issues.length === 0 ? (
        <p>No errors thus far!</p>
      ) : (
        <ul>
          {Issues.map(value => (
            <div key={value.id}>
              <li>{value.comment}</li>
              {!user && (
                <button 
                  onClick={(event) => {
                    event.preventDefault()
                    onResolve(event, value.id)
                  }}>Resolve</button>
              )}
            </div>
          ))}   
        </ul>
      )}
      <div>
        {user && (
          <>
            <h3>Submit an Issue:</h3>
            <form onSubmit={(event) => {
              event.preventDefault()
              onSubmit(event, App.id)
            }}>
              <input name="issue"/>
              <button type="submit">Submit</button>
            </form>
          </>
      )}
      </div>
    </div>

  )
}

export default Post