import Post from './Post.jsx'

const Posts = ({ AppList, Issuelist, onSubmit }) => {



  return (
    <div>
      {AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} Issues={Issuelist.find(obj => obj.appId === value.id)?.issues || []}/>)}
    </div>
  )
}

export default Posts