import Post from './Post.jsx'

const Posts = ({ AppList, Issuelist, onSubmit, onResolve, user }) => {

  console.log("Issuelist at render:", Issuelist)

  return (
    <div>
      {AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} 
      Issues={Issuelist.filter(obj => obj.appId == value.id)} onResolve={onResolve} user={user}/>)}
    </div>
  )
}

export default Posts