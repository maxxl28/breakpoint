// Component to render all posts

import Post from './Post.jsx'

const Posts = ({ AppList, IssueList, onSubmit, onResolve, user }) => {


  return (
    <div>
      {AppList.map(value => <Post key={value.id} App={value} onSubmit={onSubmit} 
      Issues={IssueList.filter(obj => obj.appId == value.id)} onResolve={onResolve} user={user}/>)}
    </div>
  )
}

export default Posts