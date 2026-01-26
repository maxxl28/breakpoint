// User Verification Component

const Verify = ( {onSubmit} ) => {
  return (
    <div>
      <h2>Verify</h2>
      <form onSubmit={(event) => {
        event.preventDefault()
        onSubmit(event,)
      }}>
        <p>Type in your verification code:</p>
        <input name="token" required/>
        <button type="submit">submit</button>
      </form>
    </div>
  )
}

export default Verify