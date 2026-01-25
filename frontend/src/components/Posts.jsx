import Post from './Post.jsx'

const Posts = ({ AppList, Issuelist, onSubmit, onResolve }) => {

  console.log("Issuelist at render:", Issuelist)

  return (
    <div>
      {AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} 
      Issues={Issuelist.filter(obj => obj.appId == value.id)} onResolve={onResolve}/>)}
    </div>
  )
}

export default Posts