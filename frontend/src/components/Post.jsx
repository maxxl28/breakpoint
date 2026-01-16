const Post = ({ App, Issues, onSubmit }) => {
  
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
        {Issues.map(value => <li key={value}>{value}</li>)}
      </ul>

      <p>Submit an Issue:</p>
      <form onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event, App.id)
      }}>
        <input name="issue"/>
        <button type="submit">submit</button>
      </form>
    </div>

  )
}

export default Post