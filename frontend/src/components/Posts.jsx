import Post from './Post.jsx'

const Posts = ({ AppList, Issuelist, onSubmit }) => {

  console.log("Issuelist at render:", Issuelist)

  return (
    <div>
      {/*{AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} 
      Issues={Issuelist.find(obj => obj.appId == value.id)?.issues || []}/>)}*/}
      {AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} 
      Issues={Issuelist.filter(obj => obj.appId == value.id)}/>)}
    </div>
  )
}

export default Posts