const Post = ({ App }) => {
  
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
        {App.issues.map(value => <li key={value.id}>{value.comment}</li>)}
      </ul>
      
      <p>Submit an Issue</p>
      <form>
        <input />
        <button type="submit">submit</button>
      </form>
    </div>

  )
}

export default Post